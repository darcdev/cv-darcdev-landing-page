#!/usr/bin/env tsx
/**
 * i18n parity & integrity checker.
 *
 * Run as part of `npm run build`. Exit 0 on pass, 1 on any error.
 * Errors fail the build. Warnings print to stderr but do not fail.
 *
 * Errors:
 *   E_MISSING_CATALOG       — config has a locale code with no JSON file
 *   E_MULTIPLE_DEFAULTS     — more than one locale has default: true
 *   E_NO_DEFAULT            — no locale has default: true
 *   E_INVALID_KEY           — a key does not match the naming regex
 *   E_KEY_MISMATCH          — a non-default locale is missing keys present in default
 *   E_PLACEHOLDER_MISMATCH  — same key has different {token} sets across locales
 *   E_REFERENCED_NOT_DEFINED — t('…') / data-i18n="…" references a key not in default catalog
 *
 * Warnings:
 *   W_ORPHAN_KEY            — catalog has a key never referenced in source code
 *   W_EMPTY_VALUE           — a key has an empty string value
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { locales, defaultLocale, supportedCodes } from '../src/i18n/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SRC_DIR = join(REPO_ROOT, 'src');
const LOCALES_DIR = join(SRC_DIR, 'i18n', 'locales');

const KEY_REGEX = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/;

const errors: string[] = [];
const warnings: string[] = [];

function err(code: string, msg: string) {
  errors.push(`  [${code}] ${msg}`);
}
function warn(code: string, msg: string) {
  warnings.push(`  [${code}] ${msg}`);
}

// ── 1. Validate config: exactly one default ─────────────────────────────────
const defaults = locales.filter((l) => l.default);
if (defaults.length === 0) {
  err('E_NO_DEFAULT', 'No locale in src/i18n/config.ts has default: true');
}
if (defaults.length > 1) {
  err(
    'E_MULTIPLE_DEFAULTS',
    `More than one locale has default: true (${defaults.map((d) => d.code).join(', ')})`,
  );
}

// ── 2. Load catalogs ─────────────────────────────────────────────────────────
const catalogs: Record<string, Record<string, string>> = {};
for (const code of supportedCodes) {
  const filePath = join(LOCALES_DIR, `${code}.json`);
  if (!existsSync(filePath)) {
    err('E_MISSING_CATALOG', `Locale "${code}" has no file at ${filePath}`);
    continue;
  }
  try {
    const raw = readFileSync(filePath, 'utf8');
    catalogs[code] = JSON.parse(raw);
  } catch (e) {
    err(
      'E_MISSING_CATALOG',
      `Locale "${code}" file is not valid JSON: ${(e as Error).message}`,
    );
  }
}

// ── 3. Validate key naming + collect default catalog set ─────────────────────
const defaultCatalog = catalogs[defaultLocale] ?? {};
const defaultKeys = new Set(Object.keys(defaultCatalog));

for (const [code, catalog] of Object.entries(catalogs)) {
  for (const key of Object.keys(catalog)) {
    if (!KEY_REGEX.test(key)) {
      err(
        'E_INVALID_KEY',
        `Locale "${code}" has invalid key "${key}" (must match ${KEY_REGEX})`,
      );
    }
    if (catalog[key] === '') {
      warn('W_EMPTY_VALUE', `Locale "${code}" has empty value for key "${key}"`);
    }
  }
}

// ── 4. Key parity across locales ─────────────────────────────────────────────
for (const [code, catalog] of Object.entries(catalogs)) {
  if (code === defaultLocale) continue;
  const localeKeys = new Set(Object.keys(catalog));
  for (const key of defaultKeys) {
    if (!localeKeys.has(key)) {
      err(
        'E_KEY_MISMATCH',
        `Locale "${code}" is missing key "${key}" (present in default "${defaultLocale}")`,
      );
    }
  }
  for (const key of localeKeys) {
    if (!defaultKeys.has(key)) {
      err(
        'E_KEY_MISMATCH',
        `Locale "${code}" has extra key "${key}" not present in default "${defaultLocale}"`,
      );
    }
  }
}

// ── 5. Placeholder parity ────────────────────────────────────────────────────
function placeholdersOf(value: string): Set<string> {
  const out = new Set<string>();
  const re = /\{(\w+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value)) !== null) out.add(m[1]);
  return out;
}

for (const key of defaultKeys) {
  const defaultPh = placeholdersOf(defaultCatalog[key] ?? '');
  for (const [code, catalog] of Object.entries(catalogs)) {
    if (code === defaultLocale) continue;
    const value = catalog[key];
    if (value === undefined) continue;
    const ph = placeholdersOf(value);
    if (ph.size !== defaultPh.size || [...ph].some((p) => !defaultPh.has(p))) {
      err(
        'E_PLACEHOLDER_MISMATCH',
        `Key "${key}" placeholders differ: ${defaultLocale}=[${[...defaultPh].join(',')}] vs ${code}=[${[...ph].join(',')}]`,
      );
    }
  }
}

// ── 6. Scan source for referenced keys ───────────────────────────────────────
const referencedKeys = new Set<string>();
const referencedPrefixes = new Set<string>();
const T_CALL_REGEX = /\bt(?:Client)?\(\s*['"]([a-z][a-z0-9_.]*)['"]/g;
// Backtick-template t() / tClient() calls — capture the literal prefix before ${...}
const T_TEMPLATE_REGEX = /\bt(?:Client)?\(\s*`([a-z][a-z0-9_.]*)\$\{/g;
const DATA_I18N_REGEX = /data-i18n(?:-html)?=['"]([a-z][a-z0-9_.]*)['"]/g;
const DATA_I18N_ATTR_REGEX = /data-i18n-attr=(['"])(\{.*?\})\1/g;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'i18n') continue; // skip the i18n module itself
      out.push(...walk(full));
    } else if (/\.(astro|ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const sourceFiles = walk(SRC_DIR);
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  let m: RegExpExecArray | null;
  T_CALL_REGEX.lastIndex = 0;
  while ((m = T_CALL_REGEX.exec(content)) !== null) referencedKeys.add(m[1]);
  T_TEMPLATE_REGEX.lastIndex = 0;
  while ((m = T_TEMPLATE_REGEX.exec(content)) !== null) referencedPrefixes.add(m[1]);
  DATA_I18N_REGEX.lastIndex = 0;
  while ((m = DATA_I18N_REGEX.exec(content)) !== null) referencedKeys.add(m[1]);
  DATA_I18N_ATTR_REGEX.lastIndex = 0;
  while ((m = DATA_I18N_ATTR_REGEX.exec(content)) !== null) {
    try {
      const map = JSON.parse(m[2]) as Record<string, string>;
      for (const v of Object.values(map)) {
        if (typeof v === 'string' && KEY_REGEX.test(v)) referencedKeys.add(v);
      }
    } catch {
      /* ignore malformed JSON in data-i18n-attr — author's problem at runtime */
    }
  }
}

for (const key of referencedKeys) {
  if (!defaultKeys.has(key)) {
    err(
      'E_REFERENCED_NOT_DEFINED',
      `Key "${key}" is referenced in source but missing from default locale "${defaultLocale}"`,
    );
  }
}

// ── 7. Orphan keys (warnings only) ───────────────────────────────────────────
for (const key of defaultKeys) {
  if (referencedKeys.has(key)) continue;
  // Check if any dynamic-template prefix matches the key
  let matched = false;
  for (const prefix of referencedPrefixes) {
    if (key.startsWith(prefix)) {
      matched = true;
      break;
    }
  }
  if (matched) continue;
  // Data-derived keys (experience.N.*, skills.N.*) are programmatically generated
  // by translate.ts buildDataKeys() — they have no source-code reference.
  if (/^(experience|skills)\.\d+(\.|$)/.test(key)) continue;
  warn(
    'W_ORPHAN_KEY',
    `Key "${key}" exists in catalogs but is never referenced in source`,
  );
}

// ── Report ───────────────────────────────────────────────────────────────────
const localeSummary = supportedCodes
  .map((c) => `${c}=${Object.keys(catalogs[c] ?? {}).length}`)
  .join(', ');
console.log(
  `[i18n:check] ${supportedCodes.length} locales (${localeSummary}); ${referencedKeys.size} key(s) referenced in source.`,
);

if (warnings.length > 0) {
  console.warn(`[i18n:check] ${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(w);
}

if (errors.length > 0) {
  console.error(`[i18n:check] ${errors.length} error(s):`);
  for (const e of errors) console.error(e);
  process.exit(1);
}

console.log('[i18n:check] OK');
process.exit(0);
