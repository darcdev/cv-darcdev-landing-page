/**
 * Image resolver — Static-Site-Generation-only.
 *
 * MUST be called from `.astro` files (server context). MUST NOT be imported by
 * Preact island modules; islands receive the resolved descriptors as serializable
 * props (per Constitution §Static-First, Islands for Interactivity).
 *
 * Contract: specs/006-project-blog-images/contracts/image-api.md §1
 *
 * Behaviour:
 * - Local images go through Astro's `getImage()` for AVIF/WebP variants and a
 *   responsive srcset sized for the rendering context.
 * - External URLs (https://) are passed through unchanged (empty srcset);
 *   they're not transformed at build time per design decision D2.
 * - Alt-text fallback to the default locale is applied automatically.
 * - Refuses to return descriptors with zero width/height (FR-023, no CLS).
 */

import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

import type { LocaleCode } from '../i18n/config';
import type { Project } from '../data/projects';
import type { ResolvedImage } from './imageTypes';

/** Eagerly-loaded project image modules — keyed by absolute /src/... path. */
const PROJECT_IMAGE_MODULES = import.meta.glob<ImageMetadata>(
  '/src/assets/images/projects/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP,AVIF}',
  { eager: true, import: 'default' },
);

/** Responsive widths per rendering context. */
const WIDTHS = {
  card: [320, 480, 640],
  modal: [640, 960, 1280, 1600],
  thumb: [128, 192, 256],
  hero: [640, 960, 1280, 1920],
} as const;

/** `sizes` attribute hint per rendering context. */
const SIZES = {
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  modal: '(max-width: 768px) 100vw, 80vw',
  thumb: '128px',
  hero: '(max-width: 768px) 100vw, 80vw',
} as const;

type ProjectCtx = 'card' | 'modal' | 'thumb';
type PostCtx = 'card' | 'hero';

/**
 * Resolves a local project image path (e.g. `"rag-agent/screen-1.png"`) to an
 * ImageMetadata via Vite's eager glob. Throws an author-friendly error when the
 * file is missing — `scripts/check-images.ts` catches this earlier in CI.
 */
function lookupLocalProjectImage(path: string): ImageMetadata {
  const key = `/src/assets/images/projects/${path}`;
  const mod = PROJECT_IMAGE_MODULES[key];
  if (!mod) {
    throw new Error(
      `[images] Local project image not found: src/assets/images/projects/${path}. ` +
        `Run \`npm run images:check\` for a full author report.`,
    );
  }
  return mod;
}

function lookupLocalPostImage(metadata: ImageMetadata): ImageMetadata {
  // The schema's `image()` helper has already resolved this to ImageMetadata at
  // collection-load time; we just pass it through.
  return metadata;
}

/** Helper: turn an ImageMetadata into a ResolvedImage via getImage(). */
async function buildLocalResolved(
  src: ImageMetadata,
  widths: ReadonlyArray<number>,
  sizes: string,
  alt: string,
  caption: string | undefined,
): Promise<ResolvedImage> {
  const result = await getImage({
    src,
    widths: [...widths],
    formats: ['avif', 'webp'],
    sizes,
  });

  const width = Number(result.attributes.width ?? src.width);
  const height = Number(result.attributes.height ?? src.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(
      `[images] Refusing to emit descriptor with non-positive dimensions for ${result.src} (FR-023).`,
    );
  }

  return {
    src: result.src,
    srcset: result.srcSet?.attribute ?? '',
    sizes,
    width,
    height,
    format: src.format as ResolvedImage['format'],
    alt,
    ...(caption !== undefined && { caption }),
  };
}

/**
 * Build a passthrough descriptor for an external https:// URL.
 * Width/height are unknown at build time; we use a 16:9 placeholder so the
 * `<img>` reserves space and avoids CLS — the browser will adjust on load.
 */
function buildExternalResolved(
  url: string,
  sizes: string,
  alt: string,
  caption: string | undefined,
): ResolvedImage {
  // 16:9 placeholder dimensions (FR-023 — must be positive integers).
  return {
    src: url,
    srcset: '',
    sizes,
    width: 1600,
    height: 900,
    alt,
    ...(caption !== undefined && { caption }),
  };
}

/**
 * Resolve every image declared on a project for the requested locale.
 * Returns `[]` when the project has no images (caller renders SVG cover).
 */
export async function resolveProjectImages(
  project: Project,
  _locale: LocaleCode,
  ctx: ProjectCtx,
): Promise<ResolvedImage[]> {
  if (!project.images || project.images.length === 0) return [];
  if (!(ctx in WIDTHS)) {
    throw new Error(`[images] Unknown context "${ctx}" for resolveProjectImages`);
  }

  const widths = WIDTHS[ctx];
  const sizes = SIZES[ctx];

  return Promise.all(
    project.images.map(async (entry) => {
      // `entry.alt` is guaranteed non-empty by getProjects() — it applied the
      // default-locale fallback already. Defensive empty-string is fine.
      const alt = entry.alt;
      const caption = entry.caption;

      if (entry.kind === 'local') {
        const meta = lookupLocalProjectImage(entry.path);
        return buildLocalResolved(meta, widths, sizes, alt, caption);
      }
      // entry.kind === 'external'
      return buildExternalResolved(entry.url, sizes, alt, caption);
    }),
  );
}

/**
 * Resolve a blog post's optional hero image for the requested locale + ctx.
 * Returns `null` when neither `heroImage` nor `heroImageUrl` is set.
 */
export async function resolvePostHero(
  post: CollectionEntry<'posts'>,
  locale: LocaleCode,
  ctx: PostCtx,
): Promise<ResolvedImage | null> {
  const data = post.data as {
    heroImage?: ImageMetadata;
    heroImageUrl?: string;
    heroImageAlt?: Record<string, string>;
  };

  const heroLocal = data.heroImage;
  const heroUrl = data.heroImageUrl;
  if (!heroLocal && !heroUrl) return null;

  const altMap = data.heroImageAlt ?? {};
  // Default-locale alt is guaranteed by the schema refine — we still fall back
  // defensively for non-default locales.
  const alt =
    (altMap[locale] && altMap[locale].trim().length > 0 ? altMap[locale] : altMap.es) ?? '';
  if (!alt) {
    // Should never happen — schema enforces this — but guard anyway.
    throw new Error(
      `[images] Post "${post.id}" has a hero image without resolvable alt text (locale=${locale}).`,
    );
  }

  if (!(ctx in WIDTHS)) {
    throw new Error(`[images] Unknown context "${ctx}" for resolvePostHero`);
  }
  const widths = WIDTHS[ctx];
  const sizes = SIZES[ctx];

  if (heroLocal) {
    const meta = lookupLocalPostImage(heroLocal);
    return buildLocalResolved(meta, widths, sizes, alt, undefined);
  }
  // heroUrl
  return buildExternalResolved(heroUrl!, sizes, alt, undefined);
}
