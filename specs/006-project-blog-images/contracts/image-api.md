# Contract — Image Module Surface

**Feature**: `006-project-blog-images`

This is the public TypeScript surface introduced or modified by this feature. It is the contract that consumers (pages, components, islands) depend on; downstream tasks MUST NOT change these signatures without revising this document.

The site has no external HTTP / CLI surface — this feature is fully internal to the Astro project — so the "contracts" are TypeScript module APIs and a content-collection frontmatter schema.

---

## 1. `src/lib/images.ts` — image resolver (NEW)

```ts
import type { ImageMetadata } from 'astro';
import type { LocaleCode } from '../i18n/config';
import type { Project } from '../data/projects';
import type { ResolvedImage } from './imageTypes';

/**
 * Resolve every image declared on a project into render-ready descriptors,
 * for the requested locale. Performs alt-text fallback to the default locale
 * automatically. Pure function — safe to call repeatedly during SSG.
 *
 * - Returns `[]` when `project.images` is empty (caller renders SVG cover fallback).
 * - For local images: invokes Astro's `getImage()` to produce optimized variants
 *   and a responsive srcset.
 * - For external URLs: returns a descriptor with the original URL and an empty srcset.
 *
 * @param project   Resolved project for the active locale.
 * @param locale    Active locale code.
 * @param ctx       Rendering context — controls `sizes` hint and target widths.
 *                  Examples:
 *                    - 'card'    → small thumbnail (used in grid + featured tile)
 *                    - 'modal'   → primary image inside the project modal
 *                    - 'thumb'   → thumbnail strip below the modal primary
 */
export async function resolveProjectImages(
  project: Project,
  locale: LocaleCode,
  ctx: 'card' | 'modal' | 'thumb',
): Promise<ResolvedImage[]>;

/**
 * Resolve the (optional) hero image of a blog post into a render-ready descriptor.
 *
 * - Returns `null` when neither `heroImage` nor `heroImageUrl` is set on the post
 *   (caller renders SVG cover fallback).
 * - Applies alt-text fallback to the default locale.
 *
 * @param post      Post entry from the content collection.
 * @param locale    Active locale code.
 * @param ctx       'card' (blog index) or 'hero' (post detail).
 */
export async function resolvePostHero(
  post: PostEntry,
  locale: LocaleCode,
  ctx: 'card' | 'hero',
): Promise<ResolvedImage | null>;
```

### `ResolvedImage` shape

Defined in `src/lib/imageTypes.ts` (split into a types-only module so the Preact island can `import type` without pulling Astro server APIs).

```ts
export interface ResolvedImage {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  format?: 'avif' | 'webp' | 'png' | 'jpeg';
  alt: string;
  caption?: string;
}
```

### Behaviour guarantees

- **Pure**: same inputs → same outputs (modulo Astro's deterministic asset hashing).
- **Total**: never throws on missing alt in non-default locales — uses the fallback. Throws only on programmer errors (e.g. unknown `ctx`).
- **Build-only**: `resolveProjectImages` and `resolvePostHero` MUST be called from `.astro` files (server context). They MUST NOT be imported by Preact island modules; islands receive their output via props.
- **Width/height never zero**: the function refuses to return descriptors with zero dimensions; this enforces FR-023 (no CLS).

---

## 2. `src/data/projects.ts` — extended public API

Existing exports keep their signatures; the change is **additive**:

```ts
// Type additions
export interface ProjectShared {
  // ...existing fields...
  images: ProjectImageSource[];           // NEW
}

export interface ProjectTranslated {
  // ...existing fields...
  images: ProjectImageTranslated[];       // NEW
}

export type ProjectImageSource =
  | { kind: 'local';    path: string }
  | { kind: 'external'; url:  string };

export interface ProjectImageTranslated {
  alt: string;
  caption?: string;
}

// Existing public functions keep identical signatures:
export function getProjects(locale: LocaleCode): Project[];
export function getProjectTypes(locale: LocaleCode): string[];
export function getAllLabel(locale: LocaleCode): string;
export function getStatusLabel(status: ProjectStatus, locale: LocaleCode): string;
```

**Compatibility**: `getProjects(...)` returns `Project[]` where each project now includes the two new `images` arrays — empty arrays for legacy entries until images are authored. No breaking change for current call sites: code that ignores `project.images` continues to compile and behave identically.

---

## 3. `src/content/config.ts` — post collection schema (MODIFIED)

The existing `posts` collection schema gains three optional frontmatter fields. Type changes shown as a delta:

```ts
const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // ...existing fields preserved exactly...

    heroImage:    image().optional(),                                  // NEW (local)
    heroImageUrl: z.string().url().regex(/^https:\/\//).optional(),    // NEW (external)
    heroImageAlt: z.record(z.string()).optional(),                     // NEW (locale → alt)
  }).refine(
    (data) => !(data.heroImage && data.heroImageUrl),
    { message: 'heroImage and heroImageUrl are mutually exclusive', path: ['heroImage'] },
  ).refine(
    (data) => {
      const hasImage = !!data.heroImage || !!data.heroImageUrl;
      if (!hasImage) return true;
      return !!data.heroImageAlt && typeof data.heroImageAlt['es'] === 'string'
             && data.heroImageAlt['es'].trim().length > 0;
    },
    { message: 'heroImageAlt.es is required when a hero image is set', path: ['heroImageAlt'] },
  ),
});
```

**Compatibility**: every existing post has none of the new fields → schema validation passes unchanged. Authors opt in by adding frontmatter.

---

## 4. `src/components/islands/ProjectGallery.tsx` — Preact component (NEW)

```ts
import type { ResolvedImage } from '../../lib/imageTypes';

interface ProjectGalleryProps {
  /** Pre-resolved images for the modal context. Length 0 → caller MUST not render this component. */
  images: ResolvedImage[];
  /** Localized "Image N of M" label format string ("{{n}} / {{total}}"). */
  counterLabel: string;
  /** Localized labels for assistive controls. */
  prevLabel: string;
  nextLabel: string;
}

export function ProjectGallery(props: ProjectGalleryProps): JSX.Element;
```

**Behaviour contract**:
- Renders the first image as the primary, the rest as a thumbnail strip below.
- `images.length === 1` → renders only the primary, no strip, no controls.
- Keyboard: ←/→ moves the active image. Esc is **not** handled here — the parent modal handles Esc.
- Each control (prev / next / each thumbnail button) MUST be ≥ 44×44 px on viewports ≤ 768 px (FR-024).
- Active thumbnail has `aria-current="true"`.
- Reserves layout space using `width` / `height` from `ResolvedImage` (FR-023).

---

## 5. `src/components/atoms/Cover.astro` — fallback contract (MODIFIED)

The atom keeps its current signature plus an optional pre-resolved image. The atom decides whether to render the image or the SVG pattern, so callers don't have to.

```astro
---
// Existing props
type Props = {
  kind: CoverPattern;
  label?: string;
  className?: string;
  image?: ResolvedImage | null;   // NEW — when present, render <img>; else SVG
};
---
```

**Behaviour**:
- `image` truthy → renders an optimized `<img>` (with `loading="lazy"`, `decoding="async"`, `width` / `height`, srcset/sizes when present).
- `image` null/undefined → renders the existing SVG cover pattern, byte-identical to today (SC-007).

---

## 6. Preact island prop shape (modified)

`ProjectsSection.tsx` and `BlogSection.tsx` gain pre-resolved images on the data they receive:

```ts
// Conceptual: extra fields on the per-project / per-post data passed as props
type IslandProject = Project & {
  resolvedImages?: {
    card: ResolvedImage[];   // [first only] for the card thumbnail
    modal: ResolvedImage[];  // primary-size variants
    thumb: ResolvedImage[];  // thumbnail-size variants
  };
};
```

**Why three contexts**: a card thumbnail and a modal primary need very different srcsets; pre-resolving once and passing as props avoids islands ever calling `getImage`.

---

## 7. `scripts/check-images.ts` — CLI contract (NEW)

```text
Usage:  tsx scripts/check-images.ts

Exit codes:
  0   OK (warnings allowed)
  1   FAIL — missing local file, missing default-locale alt, schema violation,
              or images.length parity violation
```

Wired into `package.json`:

```json
{
  "scripts": {
    "images:check": "tsx scripts/check-images.ts",
    "build": "astro check && npm run i18n:check && npm run images:check && astro build"
  }
}
```

The script's contract:
- Loads `PROJECTS_SHARED` and `PROJECTS_BY_LOCALE` via dynamic import of `src/data/projects.ts`.
- Loads every post markdown frontmatter via Astro's content collection loader.
- For each project: validates every `images[i].path` against the filesystem (relative to repo root).
- For each project: validates default-locale `images[].alt` is non-empty.
- For each post with a hero: same validations.
- Reports:
  - Errors → printed to `stderr`, then exit 1.
  - Warnings (non-default-locale gaps) → printed to `stderr`, exit 0.
- No external network calls (external URLs are not pinged at build time — that's a deliberate non-goal).

---

## 8. Non-contracts (deliberately out of scope)

- No HTTP API. No GraphQL. No webhooks.
- No upload / admin UI. Authoring is via source edits (FR-016).
- No image processing on the visitor's machine. All variants pre-built.
- No external rights / DRM enforcement (per spec Assumptions).
