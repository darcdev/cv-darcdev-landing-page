# Phase 0 — Research: Project & Blog Images

**Feature**: `006-project-blog-images`
**Status**: Complete

This document records the decisions taken to resolve every "NEEDS CLARIFICATION" — there were none in the Technical Context, so this file captures the **load-bearing technical choices** that shape Phase 1 and Phase 2.

---

## D1 — Image storage: local assets + external URLs (both)

**Decision**: Support two image source kinds in the same data structure:
1. **Local asset reference** — a relative path under `src/assets/images/{projects,posts}/...`, processed by Astro at build time.
2. **External URL** — an absolute `https://` string, passed through unmodified at runtime.

**Rationale**:
- Authors have **screenshots they own** (drop into `src/assets/`) and **diagrams hosted on Notion / GitHub raw** (URL). Forcing one path means either bloated repo (downloading every external image) or no optimization for owned assets. Both is the lowest-friction option (FR-012, FR-013).
- Astro's image pipeline (`<Image>`, `getImage()`) only optimizes assets it can statically resolve — local files and explicitly-imported `import.meta.glob` patterns. External URLs are deliberately a pass-through (per Astro 4.x docs on `astro:assets`).

**Alternatives considered**:
- **Local only**: rejected — would force every diagram from a third-party doc to be re-hosted, increasing maintenance.
- **External only**: rejected — loses build-time optimization (responsive srcsets, AVIF/WebP) for the most common case (screenshots).
- **Cloudinary / Imgix CDN**: rejected — adds a runtime dependency, an account, a key, and a cost line item. Not warranted at < 30 projects.

---

## D2 — Image optimization: `getImage()` at SSG time, descriptors passed to islands

**Decision**: All local images are processed once **at build time** in the parent `.astro` page using Astro's `getImage()` API, producing a serializable descriptor `{ src, srcset, width, height, format }`. The descriptor is passed as a prop into the Preact island (`ProjectsSection`, `BlogSection`). Islands render plain `<img>` tags from those descriptors and never call image-optimization APIs themselves.

**Rationale**:
- Astro's image components (`<Image>` / `<Picture>`) are Astro-only; they do not work inside a Preact tree (they require Astro's render context). Calling `getImage()` from an island would require shipping Vite to the client — a non-starter.
- Build-time resolution is constitution-compliant (Principle II — Static-First). The island receives pre-computed URLs and srcsets, identical to how a hand-written CMS would deliver them.
- This is the documented Astro pattern for "framework component needs an optimized image" (Astro 4.x docs, "Using images in framework components").

**Alternatives considered**:
- **Render `<Image>` in Astro and slot the result into the island**: rejected — slotting an Astro fragment into a Preact island is brittle (string HTML re-hydration); descriptor props are simpler and serializable.
- **Use plain `<img>` with the original file**: rejected — violates constitution Principle IV (mandates `<Image>` / responsive srcset); fails performance budget (SC-005).
- **Wait until runtime to fetch a sized image**: rejected — adds a network round-trip and breaks the JS-disabled fallback.

---

## D3 — Cover-pattern fallback is preserved (additive feature)

**Decision**: The existing SVG cover-pattern (`rag` | `spec` | `mcp` | `arch` | `oss` | `pr`) is **kept** on every project and post and rendered whenever:
- the project's `images` array is empty, OR
- the post has no `heroImage`, OR
- an external image fails to load at runtime (graceful runtime fallback).

**Rationale**:
- Zero-migration deployment (FR-004, FR-010, FR-020, SC-007).
- Visually distinctive cards even before authors have time to add images.
- Removing the SVG path would force a same-PR migration of every existing project/post — high blast radius for a feature that's purely additive.

**Alternatives considered**:
- **Remove the SVG covers entirely**: rejected — large blast radius, conflicts with SC-007.
- **Default to a generic placeholder image**: rejected — visually worse than the existing branded SVG patterns and makes empty states ambiguous.

---

## D4 — Where alt text and captions live: with the project, NOT in i18n catalogs

**Decision**: Per-locale alt text and captions are stored **on the project / post entry itself**, in the existing `PROJECTS_BY_LOCALE` map (for projects) and as a `heroImageAlt` frontmatter map keyed by locale code (for posts). They are **not** added to the i18n key catalogs under `src/i18n/locales/*.json`.

**Rationale**:
- The i18n catalogs hold **UI chrome strings** (button labels, section titles) — content shared across the app. Per-image alt text is **content tightly coupled to a specific entity** and would pollute the catalog with hundreds of one-off keys.
- Mirrors the existing pattern: project `title`, `tagline`, `summary` already live in `PROJECTS_BY_LOCALE`, not in i18n catalogs. Image alt/caption are the same kind of data.
- Easier authoring: when an author adds a new project, all its localized strings (including alt text) are in one file (`src/data/projects.ts`).

**Alternatives considered**:
- **i18n catalog keys per image** (e.g., `projects.rag-agent.image.0.alt`): rejected — couples catalog size to content size; nothing else works that way.
- **Alt text in the SVG-cover style as a single string per project** (no per-image alt): rejected — fails accessibility (a gallery of 5 different screenshots needs 5 different alt texts).

---

## D5 — Build-time validation: a parity checker mirroring `scripts/check-i18n.ts`

**Decision**: Add `scripts/check-images.ts`, run as part of `npm run build` via a new `images:check` npm script. The checker:
- Verifies every local image path referenced in `PROJECTS_SHARED[].images[]` and `posts/*.heroImage` actually exists on disk.
- Verifies every project image has alt text in **the default locale** (`es`). FAIL the build if missing.
- Warns when alt text is missing in a non-default locale (so authors see the gap without breaking deploys).
- Verifies every project's image array length matches across all locale-specific alt-text maps (no orphan entries).

**Rationale**:
- Failing early at `npm run build` is exactly the project's existing convention (`i18n:check` runs the same way, FR-017, FR-019).
- Cheap to implement (~80 lines of TypeScript), reuses the same `tsx` runner already in devDependencies.
- Shifts class-of-bug "broken image at runtime" to "build error with file path and project id".

**Alternatives considered**:
- **Runtime checks only**: rejected — visitor would see missing alt or broken paths; SC-006 says zero broken-image icons in production.
- **TypeScript schema only**: rejected — TS catches *shape* errors but cannot verify a file exists on disk.

---

## D6 — Gallery interaction: lightbox-style with thumbnails strip (project modal)

**Decision**: Inside the project modal, replace the current single `<div class="modal-cover">` with:
- A **primary image** (the first image, full-width within the modal).
- A **thumbnail strip** below, showing all images. Clicking a thumbnail swaps the primary.
- **Keyboard navigation**: ←/→ to move, Esc to close (Esc handler already exists for the modal).
- When `images.length === 1`: render only the primary image, no strip (FR-003 inverse).
- When `images.length === 0`: render the SVG cover pattern unchanged (D3).

**Rationale**:
- The project modal already has a clear "primary visual" slot; a thumbnail-strip pattern reuses it without restructuring.
- Lightbox / fullscreen overlay was rejected because the modal **is already** an overlay — opening a second overlay is poor UX and traps focus weirdly.
- Carousel with auto-advance was rejected because: (a) it implies the images tell a story in time, which is wrong for screenshots; (b) auto-advance hurts accessibility (WCAG 2.2.2).
- Thumbnail strip is the lowest-friction pattern for "scan & pick" — exactly the project-portfolio use case.

**Alternatives considered**:
- **Carousel with arrow controls only (no thumbnail strip)**: rejected — visitor cannot see how many images there are without clicking through.
- **Stacked vertical layout (all images visible at once)**: rejected — modal becomes a long scroll; the primary-image-with-thumbs pattern keeps the modal cohesive.
- **Open a fullscreen lightbox on click**: deferred — possible follow-up if users want to zoom into screenshots, not required for v1.

**Card thumbnail (project grid + featured tile)**: uses the **first** image only, sized for the card via `getImage()`. No interactivity at the card level — clicking the card opens the modal as today.

---

## D7 — Blog post hero: single image, rendered in `.astro` (no island)

**Decision**: For blog posts, the hero image is declared in markdown frontmatter (`heroImage:` + `heroImageAlt:` map), resolved by Astro's content-collection `image()` schema helper, and rendered directly in `src/pages/[lang]/blog/[slug].astro` via the `<Image>` component. The blog index card thumbnail likewise renders the optimized image in `.astro` (no island change required for index — `BlogSection` is currently rendered server-side for cards).

**Rationale**:
- Blog post pages are pure-Astro; using `<Image>` is the most direct, constitution-compliant path (Principle IV).
- No interactivity needed for a single hero (vs. project gallery), so no island JS.
- `image()` schema helper validates the path at build time and gives us a typed `ImageMetadata`.

**Alternatives considered**:
- **Add a hero gallery to posts too**: rejected — explicitly out of scope per spec ("blogs: single hero image").
- **Render hero through a Preact island**: rejected — gratuitous JS for a static image.

---

## Summary table

| ID | Decision | Touches |
|----|----------|---------|
| D1 | Local + external image sources | Data model, image resolver |
| D2 | `getImage()` at SSG, descriptors as island props | Page `.astro` files, islands |
| D3 | SVG cover stays as fallback | Cover atom, gallery component, hero render |
| D4 | Alt/caption in `PROJECTS_BY_LOCALE` and post frontmatter, not i18n catalogs | Data shape, content schema |
| D5 | `scripts/check-images.ts` wired into `build` | Tooling, package.json |
| D6 | Modal primary + thumbnail strip + keyboard nav | `ProjectGallery.tsx`, styles |
| D7 | Blog hero rendered in `.astro` via `<Image>`, no island | Blog pages, content schema |

All decisions are consistent with the Constitution and resolve every load-bearing unknown for Phase 1 and Phase 2.
