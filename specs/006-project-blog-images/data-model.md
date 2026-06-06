# Phase 1 — Data Model: Project & Blog Images

**Feature**: `006-project-blog-images`
**Status**: Complete

This document defines the data shapes introduced or modified by this feature. Every entity is expressed as a TypeScript-style interface and the validation rules that the build-time checker (`scripts/check-images.ts`) and the content-collection schema enforce.

The guiding principle (from research D4) is: **shared / locale-agnostic fields live alongside other shared project fields; per-locale fields live in the existing per-locale maps**.

---

## 1. `ProjectImageSource` (NEW, locale-agnostic)

The source of a single project image — what to render, regardless of language.

```ts
type ProjectImageSource =
  | { kind: 'local';    path: string }   // path relative to src/assets/images/projects/
  | { kind: 'external'; url:  string };  // absolute https URL
```

**Validation rules**:
- `kind` is required and is one of `'local' | 'external'`.
- `local.path` MUST be non-empty, MUST NOT contain `..`, MUST resolve to an existing file under `src/assets/images/projects/<project-id>/` (FR-019).
- `external.url` MUST start with `https://`. `http://` is rejected at build time (security baseline).
- Allowed extensions for `local.path`: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`. Anything else fails the build.

**Where it lives**: a new `images: ProjectImageSource[]` array on `ProjectShared` (in `src/data/projects.ts`). Default value: `[]` (empty array — triggers SVG cover fallback per D3).

---

## 2. `ProjectImageTranslated` (NEW, per-locale)

The accessibility text and optional caption for one project image, **for one locale**.

```ts
interface ProjectImageTranslated {
  /** Accessibility-mandatory short description; MUST be non-empty in default locale. */
  alt: string;
  /** Optional human-facing caption rendered under the primary image. */
  caption?: string;
}
```

**Validation rules**:
- `alt` MUST be non-empty in the **default locale** (`es`). FAIL build if missing (FR-017).
- `alt` missing in a non-default locale: WARN at build, fall back to default-locale `alt` at runtime (FR-018, FR-021).
- `caption` is always optional. No fallback warning when missing.

**Where it lives**: an additional `images: ProjectImageTranslated[]` array on each entry of `PROJECTS_BY_LOCALE[<locale>][<project-id>]` (i.e., inside the existing `ProjectTranslated` interface).

**Cardinality / parity rule**:
- For every project, **`PROJECTS_SHARED[i].images.length` MUST equal `PROJECTS_BY_LOCALE[locale][project-id].images.length`** for the default locale. Mismatch → build fails (orphan entries are bugs, not features).
- Non-default locales MAY have a shorter `images` array; missing entries fall back position-by-position to the default-locale alt text. Same warn-not-fail policy as i18n catalogs.

---

## 3. `Project` (existing, modified)

The resolved-per-locale `Project` interface gains the image fields automatically because it already extends both `ProjectShared` and `ProjectTranslated`. No code change to the type itself; only the constituent interfaces grow.

```ts
interface ProjectShared {
  id: string;
  year: string;
  featured: boolean;
  liveUrl?: string;
  tags: string[];
  stack: string[];
  status: ProjectStatus;
  cover: CoverPattern;             // (existing) SVG-pattern fallback
  images: ProjectImageSource[];    // NEW — defaults to []
}

interface ProjectTranslated {
  title: string;
  tagline: string;
  role: string;
  client: string;
  type: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string[];
  images: ProjectImageTranslated[]; // NEW — must mirror length of shared.images in default locale
}

interface Project extends ProjectShared, ProjectTranslated {}
```

**Render rule** (consumed by `ProjectsSection` / `ProjectGallery`):
- `images.length === 0` → render `<Cover kind={cover} />` (existing path, byte-identical).
- `images.length === 1` → render single resolved image, no thumbnail strip.
- `images.length >= 2` → render primary + thumbnail strip + keyboard navigation.

---

## 4. `PostHeroImage` (NEW, encapsulated in content-collection schema)

Blog posts get **at most one** hero image. The schema is expressed via Astro's content-collection `image()` helper for local files plus a sibling URL string field for external sources, plus a per-locale alt-text map.

```ts
// In src/content/config.ts (illustrative)
const posts = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // ... existing fields (title, excerpt, category, ...)

    /** Local file or external URL — exactly one of these may be set. */
    heroImage: image().optional(),                                  // local
    heroImageUrl: z.string().url().regex(/^https:\/\//).optional(), // external

    /** Per-locale alt text. Default-locale key is REQUIRED when any heroImage* is set. */
    heroImageAlt: z.record(z.string()).optional(),
  }).refine(
    // ...build-time refinement: see Validation rules below
  ),
});
```

**Validation rules**:
- At most **one** of `heroImage` / `heroImageUrl` may be set (XOR). Both → build fails.
- If either is set, `heroImageAlt[<defaultLocale>]` MUST be a non-empty string (FR-011, FR-021). Missing → build fails.
- Missing alt text for a non-default locale → build warns; runtime falls back to default-locale alt.
- Neither set → SVG cover pattern is rendered unchanged in both index and detail (FR-010).

**Where it lives**: in the post markdown's frontmatter, e.g.:

```yaml
---
title: "RAG en producción"
# ...existing fields...
heroImage: ../../../assets/images/posts/rag-en-produccion.png
heroImageAlt:
  es: "Diagrama del pipeline RAG en producción mostrando ingesta, embedding y rerank."
  en: "RAG production pipeline diagram showing ingestion, embedding, and rerank stages."
---
```

---

## 5. `ResolvedImage` (NEW, intermediate / runtime descriptor)

Computed at SSG time by `src/lib/images.ts` and passed as serializable props into Preact islands and Astro components. Islands render plain `<img>` tags from this descriptor.

```ts
interface ResolvedImage {
  /** Final URL for the largest variant (used as <img src>). */
  src: string;
  /** Responsive srcset string ("url 480w, url 768w, ..."). Empty for external URLs. */
  srcset: string;
  /** Sizes attribute hint matching the rendering context. */
  sizes: string;
  /** Intrinsic dimensions — used to reserve aspect ratio and prevent CLS (FR-023). */
  width: number;
  height: number;
  /** Final format (only meaningful for local). */
  format?: 'avif' | 'webp' | 'png' | 'jpeg';
  /** Resolved alt text in the requested locale (with fallback already applied). */
  alt: string;
  /** Optional caption (only set for project images). */
  caption?: string;
}
```

**Validation rules**:
- `src` MUST be non-empty.
- `width` and `height` MUST be positive integers (used to reserve layout space).
- `alt` MUST be non-empty (the resolver applies the default-locale fallback before producing this descriptor).

**Lifecycle**: never persisted. Built per-page at SSG, embedded in HTML as `<img>` attributes (and as JSON props for islands). Discarded after build.

---

## 6. State transitions

There is no runtime mutable state for images. All transitions happen at **author/build time**:

1. **Author edits source** → adds `images: [...]` to a project, or `heroImage:` to a post.
2. **`npm run build`** runs `tsx scripts/check-images.ts` →
   - File-existence checks pass / fail.
   - Default-locale alt-text presence checks pass / fail.
   - Non-default-locale alt-text gaps emit warnings.
3. **`astro check`** validates the TypeScript types and the content-collection schema.
4. **`astro build`** generates optimized variants via `getImage()` and writes the static site.

Runtime state (visitor-side) is limited to: which thumbnail is currently selected in the project gallery (component-local Preact `useState`). Not persisted, not synced across visits.

---

## 7. Relationships diagram

```text
┌──────────────────┐         (1)         ┌─────────────────────┐
│  ProjectShared   │────────────────────▶│ ProjectImageSource[]│
│  (in projects.ts)│                     └─────────────────────┘
└────────┬─────────┘
         │ shares id
         ▼
┌─────────────────────────┐    (1)     ┌──────────────────────────┐
│ ProjectTranslated       │───────────▶│ ProjectImageTranslated[] │
│ (in PROJECTS_BY_LOCALE) │            │  alt + optional caption  │
└─────────────────────────┘            └──────────────────────────┘
         (parity: same length in default locale)

┌────────────────────┐
│ Post (markdown)    │ has at most one of:
│  - frontmatter     │     heroImage (local)
│                    │     heroImageUrl (external)
│                    │ + heroImageAlt: { [locale]: string }
└────────────────────┘
```

---

## 8. Migration

**None required.**

- Every existing project starts with `images: []` (default value); SVG cover renders exactly as before (SC-007).
- Every existing post starts with no `heroImage` / `heroImageUrl`; SVG cover renders exactly as before.
- The `cover: CoverPattern` field is **untouched** on every entity.
