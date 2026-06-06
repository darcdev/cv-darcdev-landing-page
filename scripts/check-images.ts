#!/usr/bin/env tsx
/**
 * Project + blog image parity & integrity checker.
 *
 * Run as part of `npm run build`. Exit 0 on pass (warnings allowed), 1 on any
 * error. Mirrors the contract laid out in
 * specs/006-project-blog-images/contracts/image-api.md §7.
 *
 * Errors:
 *   E_MISSING_LOCAL_PROJECT_IMAGE  — project image path doesn't exist on disk
 *   E_MISSING_PROJECT_ALT          — default-locale alt is empty / missing
 *   E_PROJECT_IMAGES_PARITY        — translated images.length != shared.length
 *   E_INVALID_EXTERNAL_URL         — external project URL not https://
 *   E_POST_HERO_XOR                — post sets both heroImage and heroImageUrl
 *   E_POST_HERO_ALT_REQUIRED       — post hero set but missing default-locale alt
 *   E_POST_HERO_INVALID_URL        — heroImageUrl not https://
 *   E_POST_HERO_LOCAL_MISSING      — heroImage local path doesn't exist
 *
 * Warnings:
 *   W_PROJECT_ALT_FALLBACK         — non-default locale alt empty (will fall back)
 *   W_POST_HERO_ALT_FALLBACK       — non-default locale post alt empty
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import yaml from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SRC_DIR = join(REPO_ROOT, 'src');
const PROJECT_IMAGES_DIR = join(SRC_DIR, 'assets', 'images', 'projects');
const POSTS_DIR = join(SRC_DIR, 'content', 'posts');

const errors: string[] = [];
const warnings: string[] = [];

function err(code: string, msg: string): void {
  errors.push(`  [${code}] ${msg}`);
}
function warn(code: string, msg: string): void {
  warnings.push(`  [${code}] ${msg}`);
}

// ── Load i18n + projects via dynamic import (pure TS modules, no Astro APIs) ──
const projectsModUrl = pathToFileURL(join(SRC_DIR, 'data', 'projects.ts')).href;
const i18nModUrl = pathToFileURL(join(SRC_DIR, 'i18n', 'config.ts')).href;

const [projectsMod, i18nMod] = await Promise.all([
  import(projectsModUrl),
  import(i18nModUrl),
]);

const PROJECTS_SHARED = projectsMod.PROJECTS_SHARED as Array<{
  id: string;
  images: Array<{ kind: 'local'; path: string } | { kind: 'external'; url: string }>;
}>;
const PROJECTS_BY_LOCALE = projectsMod.PROJECTS_BY_LOCALE as Record<
  string,
  Record<string, { images: Array<{ alt: string; caption?: string }> }>
>;
const defaultLocale = i18nMod.defaultLocale as string;
const supportedCodes = i18nMod.supportedCodes as string[];

let projectImageCount = 0;
let postHeroCount = 0;

// ── 1. Project images ────────────────────────────────────────────────────────
for (const shared of PROJECTS_SHARED) {
  const sharedLen = shared.images.length;
  projectImageCount += sharedLen;

  // Per-image: filesystem + URL validation.
  shared.images.forEach((img, i) => {
    if (img.kind === 'local') {
      const absPath = join(PROJECT_IMAGES_DIR, img.path);
      if (!existsSync(absPath)) {
        err(
          'E_MISSING_LOCAL_PROJECT_IMAGE',
          `Project "${shared.id}" image #${i} → src/assets/images/projects/${img.path} not found`,
        );
      }
    } else if (img.kind === 'external') {
      if (!/^https:\/\//.test(img.url)) {
        err(
          'E_INVALID_EXTERNAL_URL',
          `Project "${shared.id}" image #${i} external URL must start with https:// (got "${img.url}")`,
        );
      }
    }
  });

  // Parity: every locale must have images.length === shared.images.length.
  for (const code of supportedCodes) {
    const translated = PROJECTS_BY_LOCALE[code]?.[shared.id];
    if (!translated) {
      // Missing translation — i18n catalog issue, not images. Skip.
      continue;
    }
    if (translated.images.length !== sharedLen) {
      err(
        'E_PROJECT_IMAGES_PARITY',
        `Project "${shared.id}" locale "${code}" has ${translated.images.length} image entries; expected ${sharedLen}`,
      );
    }
  }

  // Default-locale alt must be non-empty for every image.
  const defaultTranslated = PROJECTS_BY_LOCALE[defaultLocale]?.[shared.id];
  if (defaultTranslated) {
    defaultTranslated.images.forEach((entry, i) => {
      if (!entry.alt || entry.alt.trim().length === 0) {
        err(
          'E_MISSING_PROJECT_ALT',
          `Project "${shared.id}" image #${i} missing default-locale alt (locale="${defaultLocale}")`,
        );
      }
    });
  }

  // Non-default locales: empty alt is a warning (fallback applied at runtime).
  for (const code of supportedCodes) {
    if (code === defaultLocale) continue;
    const translated = PROJECTS_BY_LOCALE[code]?.[shared.id];
    if (!translated) continue;
    translated.images.forEach((entry, i) => {
      if (!entry.alt || entry.alt.trim().length === 0) {
        warn(
          'W_PROJECT_ALT_FALLBACK',
          `Project "${shared.id}" image #${i} alt empty in locale "${code}" (will fall back to "${defaultLocale}")`,
        );
      }
    });
  }
}

// ── 2. Post hero images ──────────────────────────────────────────────────────
function walkPosts(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walkPosts(full));
    } else if (/\.(md|mdx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function extractFrontmatter(raw: string): Record<string, unknown> | null {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  try {
    return yaml.parse(m[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

for (const file of walkPosts(POSTS_DIR)) {
  const relFile = file.slice(REPO_ROOT.length + 1);
  const raw = readFileSync(file, 'utf8');
  const fm = extractFrontmatter(raw);
  if (!fm) continue;

  const heroImage = fm.heroImage as string | undefined;
  const heroImageUrl = fm.heroImageUrl as string | undefined;
  const heroImageAlt = fm.heroImageAlt as Record<string, string> | undefined;

  if (!heroImage && !heroImageUrl) continue; // No hero — fine.
  postHeroCount += 1;

  if (heroImage && heroImageUrl) {
    err(
      'E_POST_HERO_XOR',
      `${relFile}: sets both heroImage and heroImageUrl (must be exactly one)`,
    );
  }

  if (heroImageUrl && !/^https:\/\//.test(heroImageUrl)) {
    err(
      'E_POST_HERO_INVALID_URL',
      `${relFile}: heroImageUrl must start with https:// (got "${heroImageUrl}")`,
    );
  }

  if (heroImage) {
    // Path is relative to the markdown file's directory (Astro `image()` semantics).
    const localAbs = resolve(dirname(file), heroImage);
    if (!existsSync(localAbs)) {
      err(
        'E_POST_HERO_LOCAL_MISSING',
        `${relFile}: heroImage path "${heroImage}" does not resolve to an existing file`,
      );
    }
  }

  // Default-locale alt required.
  const defaultAlt = heroImageAlt?.[defaultLocale];
  if (!defaultAlt || defaultAlt.trim().length === 0) {
    err(
      'E_POST_HERO_ALT_REQUIRED',
      `${relFile}: missing or empty heroImageAlt.${defaultLocale}`,
    );
  }

  // Non-default locales: warn on empty.
  for (const code of supportedCodes) {
    if (code === defaultLocale) continue;
    const v = heroImageAlt?.[code];
    if (!v || v.trim().length === 0) {
      warn(
        'W_POST_HERO_ALT_FALLBACK',
        `${relFile}: heroImageAlt.${code} empty (will fall back to "${defaultLocale}")`,
      );
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(
  `[images:check] ${PROJECTS_SHARED.length} project(s); ${projectImageCount} project image(s); ${postHeroCount} post hero(es).`,
);

if (warnings.length > 0) {
  console.warn(`[images:check] ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(w);
}

if (errors.length > 0) {
  console.error(`[images:check] ${errors.length} error(s):`);
  for (const e of errors) console.error(e);
  process.exit(1);
}

console.log('[images:check] OK');
process.exit(0);
