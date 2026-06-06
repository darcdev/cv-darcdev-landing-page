<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

## Current Feature: Project & Blog Images

**Branch**: `006-project-blog-images`

**Plan**: [specs/006-project-blog-images/plan.md](specs/006-project-blog-images/plan.md)

### Quick Reference

- **Stack**: Astro 4.16, Preact 10, TypeScript 5.6 (strict). No new runtime deps.
- **Focus**: Multi-image gallery on projects + single hero image on blog posts. SVG cover patterns kept as fallback (additive, zero migration).
- **Approach**: `getImage()` at SSG produces optimized descriptors; Preact island renders `<img>` from props. Local + external sources supported. Build-time parity checker mirrors `check-i18n.ts`.

### Key Documents

- [Specification](specs/006-project-blog-images/spec.md) — User stories, FR-001…FR-024, success criteria
- [Plan](specs/006-project-blog-images/plan.md) — Technical context, constitution gates, project structure
- [Research](specs/006-project-blog-images/research.md) — 7 decisions (storage, optimization, fallback, alt placement, validation, gallery UX, hero rendering)
- [Data Model](specs/006-project-blog-images/data-model.md) — `ProjectImageSource`, `ProjectImageTranslated`, `ResolvedImage`, post hero schema
- [Contracts](specs/006-project-blog-images/contracts/) — `image-api.md` (module surface, schema, CLI)
- [Quickstart](specs/006-project-blog-images/quickstart.md) — Verification + author-an-image guide

### Constitution Principles

1. **Component-First Architecture** — `ProjectGallery` is a self-contained sub-island; `Cover` atom decides image vs. SVG
2. **Static-First, Islands for Interactivity** — Image descriptors resolved at SSG via `getImage()`; islands receive props only
3. **Design Fidelity (NON-NEGOTIABLE)** — Empty-images path is byte-identical to today (SC-007)
4. **Accessibility & Performance** — `<Image>` mandated; alt-text required in default locale; 44×44 px gallery controls; reserved aspect ratio (no CLS)
5. **Maintainability & Extensibility** — Add a project image: append to one shared array + one alt entry per locale. New language inherits parity automatically.

### Files to Add / Modify

- `src/lib/images.ts` + `src/lib/imageTypes.ts` — `resolveProjectImages`, `resolvePostHero`, `ResolvedImage` (NEW)
- `src/components/islands/ProjectGallery.tsx` — Keyboard-navigable Preact gallery (NEW)
- `src/assets/images/projects/<id>/`, `src/assets/images/posts/` — Image asset folders (NEW)
- `scripts/check-images.ts` — Build-time validator, wired into `npm run build` (NEW)
- `src/data/projects.ts` — Add `images: ProjectImageSource[]` to shared, `images: ProjectImageTranslated[]` to translated (MODIFY)
- `src/content/config.ts` — Add `heroImage` / `heroImageUrl` / `heroImageAlt` to post schema (MODIFY)
- `src/components/atoms/Cover.astro` — Accept optional pre-resolved image; fallback to SVG (MODIFY)
- `src/components/islands/ProjectsSection.tsx` — Mount `ProjectGallery` when images present (MODIFY)
- `src/components/islands/BlogSection.tsx` — Render hero image when present in card (MODIFY)
- `src/pages/[lang]/index.astro`, `src/pages/[lang]/blog/[slug].astro`, `src/pages/[lang]/blog/index.astro` — Resolve images at SSG, pass as props (MODIFY)
- `src/styles/global.css` — Gallery + hero styles, no new tokens (MODIFY)
- `package.json` — Add `images:check` script + extend `build` (MODIFY)
<!-- SPECKIT END -->
