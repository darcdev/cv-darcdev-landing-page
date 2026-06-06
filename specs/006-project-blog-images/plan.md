# Implementation Plan: Project & Blog Images

**Branch**: `006-project-blog-images` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-project-blog-images/spec.md`

## Summary

Add real images to the portfolio: each **project** gets an ordered list of zero-or-more images (rendered as a navigable gallery in the project modal and as a card thumbnail in the grid), and each **blog post** gets an optional single hero image (used as the index card thumbnail and the article hero). The existing SVG cover-pattern (`rag` | `spec` | `mcp` | `arch` | `oss` | `pr`) is **kept as a fallback** whenever no images are declared, so the change is purely additive — zero migration of existing content.

Technical approach: model images as **shared (locale-agnostic) source + per-locale alt/caption** to mirror the project's existing `ProjectShared` / `ProjectTranslated` split and the post collection schema. Local images live under `src/assets/images/{projects,posts}/` and are optimized at build time via Astro's `getImage()` (SSG, multi-format, responsive srcset). External URLs are passed through unmodified. Pre-rendered image descriptors (URL, width, height, srcset, alt by locale) are computed once at build time in the parent `.astro` page and passed as serializable props into the existing Preact islands (`ProjectsSection`, `BlogSection`) — islands never call image-optimization APIs themselves. A new `scripts/check-images.ts` parity checker is wired into `npm run build` to fail fast on missing alt text or missing local files, mirroring the pattern of `scripts/check-i18n.ts`.

## Technical Context

**Language/Version**: TypeScript 5.6 (strict), Astro 4.16, Preact 10. No new runtime dependencies.

**Primary Dependencies**: Astro's built-in `astro:assets` (`<Image>`, `getImage()`), existing i18n catalogs under `src/i18n/locales/`, existing content collection (`src/content/config.ts`).

**Storage**: Local image files under `src/assets/images/projects/<project-id>/*.{jpg,png,webp}` and `src/assets/images/posts/<slug>.{jpg,png,webp}`. External images referenced by absolute URL (string). No DB.

**Testing**: TypeScript `astro check` for type/schema enforcement. `scripts/check-images.ts` for build-time validation (alt-text presence, file existence, parity with i18n locales). Manual visual + Lighthouse audit per the constitution's quality gates.

**Target Platform**: Static site (SSG output) deployed as plain HTML/CSS/JS. Must run with JavaScript disabled for the static fallback views (cards, hero on post page).

**Project Type**: Single project (Astro static site). No backend / no API.

**Performance Goals**: Lighthouse Performance ≥ 90, Accessibility ≥ 95 (per spec SC-005 and constitution §IV). Project detail interactive in < 2.5 s on 4G mid-range mobile (SC-003). Card thumbnails MUST not regress LCP — optimized formats (AVIF/WebP) and responsive srcsets are mandatory for local images.

**Constraints**: Zero new runtime dependencies (constitution principle V — keep maintenance surface small). No CMS, no upload UI — authoring is by editing source files (FR-016). The SVG cover-pattern path MUST remain pixel-identical when no images are declared (SC-007). Galleries operate entirely client-side inside the existing Preact island; no extra round-trips.

**Scale/Scope**: ~10 projects today, expected to stay under 30 in the foreseeable future. ~10 blog posts. Typical project gallery: 1–6 images. Image originals: assume up to ~3 MB per file (authors drop screenshots / diagrams).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| **I. Component-First Architecture** | PASS | Gallery viewer becomes a self-contained sub-component inside the existing `ProjectsSection` island (same atomic-design layer). Image authoring lives in `src/data/projects.ts` and the post collection schema — no new global state. |
| **II. Static-First, Islands for Interactivity** | PASS | Image URLs, sizes, and srcsets are resolved at SSG time in the parent `.astro` page using `getImage()`. The Preact island only renders `<img>` tags from pre-computed descriptors and handles next/prev/keyboard interactions — exactly the "islands for genuinely interactive features" carve-out. Card thumbnails rendered in `.astro` files use `<Image>` directly with `loading="lazy"` and don't ship JS. |
| **III. Design Fidelity (NON-NEGOTIABLE)** | PASS | When no images are declared, the SVG cover-pattern path is rendered byte-identical to today (SC-007 enforces pixel parity). The new gallery affordance is additive and styled with existing tokens (no new color/typography tokens introduced). |
| **IV. Accessibility & Performance** | PASS | `<Image>` / `getImage()` give us WebP/AVIF + responsive srcsets + lazy loading by default (constitution §IV explicitly mandates `<Image>` for images). Gallery is keyboard-operable (FR-022), 44×44 px touch targets (FR-024), and the build fails on missing alt text in the default locale (FR-017). |
| **V. Maintainability & Extensibility** | PASS | New image data lives next to existing data (`PROJECTS_SHARED` for sources, `PROJECTS_BY_LOCALE` for alt/caption) — same pattern as everything else in the project. Adding a new locale: drop alt strings into the existing per-locale map. Adding a new project image: append to the array. No schema fork, no parallel system. |

**Result**: All gates PASS. No Complexity Tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/006-project-blog-images/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions w/ rationale + alternatives
├── data-model.md        # Phase 1 — Project Image, Post Hero Image entities
├── quickstart.md        # Phase 1 — verification + add-an-image guide
├── contracts/
│   └── image-api.md     # Phase 1 — module surface (image resolver, validators)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── assets/
│   └── images/
│       ├── projects/
│       │   └── <project-id>/        # NEW — one folder per project, ordered files
│       └── posts/
│           └── <slug>.<ext>         # NEW — one optional hero per post
├── components/
│   ├── atoms/
│   │   └── Cover.astro              # MODIFY — accept optional preferred-image prop, fallback to SVG
│   ├── islands/
│   │   ├── ProjectsSection.tsx      # MODIFY — render ProjectGallery sub-component when images present
│   │   ├── ProjectGallery.tsx       # NEW — keyboard-navigable gallery sub-component (Preact)
│   │   └── BlogSection.tsx          # MODIFY — render hero image when present, else SVG cover
│   └── molecules/                   # (unchanged)
├── content/
│   ├── config.ts                    # MODIFY — add optional `heroImage` (image() helper) + `heroImageAlt` map
│   └── posts/                       # (existing markdown files; add `heroImage:` frontmatter when desired)
├── data/
│   └── projects.ts                  # MODIFY — add `images: ProjectImageSource[]` to ProjectShared,
│                                    #          add `images: ProjectImageTranslated[]` to ProjectTranslated
├── i18n/
│   └── (unchanged — alt/caption are stored next to the project, not in i18n catalogs)
├── lib/
│   └── images.ts                    # NEW — resolveProjectImages(), resolvePostHero(),
│                                    #         build-time srcset/format optimization via getImage()
├── pages/
│   └── [lang]/
│       ├── index.astro              # MODIFY — pass resolved image descriptors into ProjectsSection island
│       └── blog/
│           ├── index.astro          # MODIFY — render post hero in card list
│           └── [slug].astro         # MODIFY — render post hero above article
└── styles/
    └── global.css                   # MODIFY — gallery + hero image styles (scoped via existing class
                                    #          conventions; no new tokens)

scripts/
├── check-i18n.ts                    # (existing)
└── check-images.ts                  # NEW — wired into `npm run build` (build:images:check)

package.json                         # MODIFY — add `images:check` script + extend `build`
```

**Structure Decision**: Single-project Astro layout (Option 1 of the template). Strictly follows the directory contract from the constitution's *Technical Standards → Project Structure*: components under atomic-design folders, data under `src/data/`, build-time helpers under a new `src/lib/` (parallels how `src/i18n/` is treated — a topic-scoped helper module). The new `scripts/check-images.ts` mirrors the existing `scripts/check-i18n.ts` pattern. No new top-level directories beyond `src/lib/` (which is already implied by the constitution's "and utility modules" intent and is the smallest possible deviation).

## Complexity Tracking

> Not applicable — all Constitution Check gates PASS without justification.
