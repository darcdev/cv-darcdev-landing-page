---

description: "Task list for feature 006-project-blog-images"
---

# Tasks: Project & Blog Images

**Input**: Design documents from `/specs/006-project-blog-images/`

**Prerequisites**: plan.md (loaded), spec.md (loaded), research.md, data-model.md, contracts/image-api.md, quickstart.md

**Tests**: NOT requested in the spec (Constitution gates and `*:check` scripts cover the validation surface). No test tasks generated. Manual verification follows `quickstart.md`.

**Organization**: Tasks are grouped by user story — each user story below remains independently testable per the spec.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task → can run in parallel
- **[Story]**: User story tag (US1, US2, US3) for the user-story phases only
- File paths are absolute relative to repo root

## Path Conventions

Single-project Astro layout per the constitution (§Technical Standards). All paths are relative to repo root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Reserve the asset directories so authors can drop images into a known place from day one.

- [X] T001 Create asset directory structure: `mkdir -p src/assets/images/projects src/assets/images/posts` and add a `.gitkeep` in each so empty directories are tracked.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Land the shared types, data-shape extensions, content-schema extensions, image resolver, and the `Cover` atom modification. Both user stories US1 and US2 depend on every task in this phase. After this phase, the site builds **byte-identical** to today (empty `images: []` everywhere → SVG cover path renders unchanged → SC-007 holds).

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Create `src/lib/imageTypes.ts` exporting the `ResolvedImage` interface exactly as defined in `specs/006-project-blog-images/contracts/image-api.md` §1. Types-only module (no runtime imports) so Preact islands can import safely.
- [X] T003 [P] Modify `src/data/projects.ts`: add `ProjectImageSource` (discriminated union local | external) and `ProjectImageTranslated` types; add `images: ProjectImageSource[]` field to `ProjectShared`; add `images: ProjectImageTranslated[]` field to `ProjectTranslated`; add `images: []` to every existing entry in `PROJECTS_SHARED` and to every entry in every locale of `PROJECTS_BY_LOCALE` (default empty arrays — keeps the build green and preserves byte-identical render).
- [X] T004 [P] Modify `src/content/config.ts`: extend the `posts` collection schema to use the `({ image })` form and add optional `heroImage` (via `image()`), `heroImageUrl` (`z.string().url().regex(/^https:\/\//)`), and `heroImageAlt` (`z.record(z.string())`); add the two `.refine()` rules from `data-model.md` §4 (XOR between local/external; default-locale alt required when any hero is set).
- [X] T005 [P] Modify `src/components/atoms/Cover.astro`: add an optional `image?: ResolvedImage | null` prop; when truthy, render `<img>` with `src`, `srcset` (when non-empty), `sizes`, `width`, `height`, `loading="lazy"`, `decoding="async"`, and `alt`; otherwise render the existing SVG cover pattern unchanged. Import `ResolvedImage` as a type-only import.
- [X] T006 Create `src/lib/images.ts` exporting `resolveProjectImages(project, locale, ctx)` and `resolvePostHero(post, locale, ctx)` per the contract in `contracts/image-api.md` §1. Local images go through Astro's `getImage()` (multi-format, responsive widths per `ctx`: card ~ [320, 480, 640], modal ~ [640, 960, 1280, 1600], thumb ~ [128, 192, 256]). External URLs return `{ src: url, srcset: '', ... }`. Apply default-locale alt fallback before returning. Refuse to return descriptors with zero width/height (FR-023).

**Checkpoint**: `npm run build` succeeds; site renders byte-identical to `main` (no images authored yet).

---

## Phase 3: User Story 1 — Showcase project work with a gallery (Priority: P1) 🎯 MVP

**Goal**: Project modal shows a primary image + thumbnail strip + keyboard nav when ≥ 2 images authored; single-image case shows just the primary; zero-image case shows the SVG cover unchanged. Project grid cards use the first image as their thumbnail (or SVG fallback).

**Independent Test**: Drop 3 images under `src/assets/images/projects/rag-agent/` and add matching entries to `PROJECTS_SHARED.rag-agent.images` and to `PROJECTS_BY_LOCALE.{es,en}.rag-agent.images`. Run `npm run dev`. The grid card for `rag-agent` shows the first image; opening the modal shows primary + 3 thumbs; ←/→ keys cycle; other projects (with `images: []`) still show their SVG covers. (Acceptance Scenarios 1–4 of US1.)

### Implementation for User Story 1

- [X] T007 [US1] Create `src/components/islands/ProjectGallery.tsx` (Preact). Props: `{ images: ResolvedImage[]; counterLabel: string; prevLabel: string; nextLabel: string }`. State: `activeIndex` via `useState`. Renders primary `<img>` (uses width/height to reserve aspect ratio), and when `images.length >= 2` a thumbnail strip below with one `<button>` per thumb (each ≥ 44×44 px on ≤ 768 px). Keyboard: ←/→ updates `activeIndex` (wraps); active thumb gets `aria-current="true"`. Component does NOT handle Esc (parent modal owns it). Type-only import of `ResolvedImage`.
- [X] T008 [US1] Modify `src/components/islands/ProjectsSection.tsx`: extend the per-project type the island consumes to optionally carry `resolvedImages: { card, modal, thumb }`; in the modal, replace `<div class="modal-cover"><Cover kind={project.cover} /></div>` with conditional render: if `resolvedImages.modal.length > 0` → `<ProjectGallery images={resolvedImages.modal} ... />` (use thumbs from `resolvedImages.thumb`), else fall through to the existing `<Cover />` path. In the project grid (`feat-cover` and similar slots) render the first `resolvedImages.card[0]` as `<img>` when present, else the existing SVG cover. Keep all existing class names.
- [X] T009 [US1] Modify `src/pages/[lang]/index.astro`: import `resolveProjectImages` from `src/lib/images.ts`; for each project from `getProjects(locale)`, await three calls (`'card'`, `'modal'`, `'thumb'`) and attach the results as `resolvedImages` on the data passed into the `<ProjectsSection client:visible projects={...} locale={...} />` island. Use `Promise.all` per project to keep build time bounded.
- [X] T010 [P] [US1] Modify `src/styles/global.css`: add scoped styles for `.project-gallery`, `.project-gallery-primary`, `.project-gallery-thumbs`, and `.project-gallery-thumb`; reserve aspect ratio via `aspect-ratio` (no fixed height) so layout doesn't shift; ensure thumb buttons are `min-width: 44px; min-height: 44px` on viewports ≤ 768 px (FR-024). Also add `.feat-cover img` and `.modal-cover img` rules for card/modal `<img>` rendering. No new color/spacing tokens.
- [X] T011 [P] [US1] Add gallery i18n strings to `src/i18n/locales/es.json` and `src/i18n/locales/en.json`: `projects.gallery.counter` (`"{{n}} / {{total}}"`), `projects.gallery.prev` (`"Imagen anterior"` / `"Previous image"`), `projects.gallery.next` (`"Siguiente imagen"` / `"Next image"`). Pass them through `ProjectsSection` → `ProjectGallery` props.
- [X] T012 [US1] **Manual proof-of-concept seeding**: drop ≥ 3 placeholder images under `src/assets/images/projects/rag-agent/` and populate `PROJECTS_SHARED['rag-agent'].images` plus matching entries in both `PROJECTS_BY_LOCALE.es['rag-agent'].images` and `.en['rag-agent'].images` (with non-empty alt in both locales). Verify with `npm run dev` that all four US1 acceptance scenarios pass (3-image gallery, zero-image fallback, single-image case, runtime fallback by temporarily breaking an external URL).

**Checkpoint**: User Story 1 works end-to-end and is independently demonstrable.

---

## Phase 4: User Story 2 — Add a hero image to a blog post (Priority: P1)

**Goal**: A blog post with a `heroImage` (or `heroImageUrl`) shows the image as its card thumbnail in the index AND as a hero block above the article body on the detail page. Posts without a hero render byte-identical to today.

**Independent Test**: Pick one existing post. Drop a hero image under `src/assets/images/posts/<slug>.png`. Add `heroImage:` and `heroImageAlt:` frontmatter. Run `npm run dev` and confirm both the blog index card and the detail page show the image with correct alt text in both `es` and `en`. Other posts unchanged. (Acceptance Scenarios 1–3 of US2.)

### Implementation for User Story 2

- [X] T013 [US2] Modify `src/content/loadPosts.ts` (or wherever post records are projected for islands/pages) to surface `heroImage`, `heroImageUrl`, and `heroImageAlt` on the post record returned to consumers. Do NOT call `getImage()` here — the page does that.
- [X] T014 [US2] Modify `src/pages/[lang]/blog/[slug].astro`: import `resolvePostHero`; call it with `ctx: 'hero'` for the active post. When the result is non-null, render the resolved image as a hero block (`<img>` with `width`, `height`, `srcset`, `sizes`, eager loading) above the article body, replacing or supplementing the existing `<div class="post-cover"><Cover kind={post.cover} ... /></div>`. When null, render the existing SVG cover path unchanged. Apply the same logic to the related-posts strip (`mag-cover`) using `ctx: 'card'`.
- [X] T015 [US2] Modify `src/pages/[lang]/blog/index.astro` (and `src/components/islands/BlogSection.tsx` if it owns the card render) so each post card uses `resolvePostHero(post, locale, 'card')`; render `<img>` when present, else the existing SVG cover. Preserve all existing class names so styles don't break.
- [X] T016 [P] [US2] Modify `src/styles/global.css`: add `.post-cover img` and `.mag-cover img` rules (object-fit: cover; reserved aspect ratio matching the SVG slot). No new tokens.
- [X] T017 [US2] **Manual proof-of-concept seeding**: choose one existing post; drop `src/assets/images/posts/<slug>.png`; add `heroImage` + `heroImageAlt` (es+en) frontmatter. Verify both blog index and detail page in `es` and `en`. Verify other posts (no hero) render unchanged.

**Checkpoint**: User Stories 1 AND 2 work independently and on the same site simultaneously.

---

## Phase 5: User Story 3 — Authoring is simple and locale-aware (Priority: P2)

**Goal**: Build-time validation prevents runtime image bugs (missing files, missing default-locale alt, length-parity mismatches, double-set hero, missing hero alt). Authors get clear errors that point at the offending project id / post slug. Non-default-locale gaps emit warnings without blocking the build.

**Independent Test**: After T020 lands, deliberately introduce each of these breakages one at a time and run `npm run build`:
1. Reference a missing local file in `PROJECTS_SHARED[].images` → exit 1, error names project id and path.
2. Remove `alt` from a default-locale image entry → exit 1, error names project id and index.
3. Set both `heroImage` and `heroImageUrl` on the same post → exit 1.
4. Set `heroImage` without `heroImageAlt.es` → exit 1.
5. Remove an English alt entry from a project that has it in Spanish → exit 0 with warning.

After verification, revert each breakage. (Acceptance Scenarios 1–3 of US3.)

### Implementation for User Story 3

- [X] T018 [US3] Create `scripts/check-images.ts` per `contracts/image-api.md` §7. Imports `PROJECTS_SHARED` and `PROJECTS_BY_LOCALE` via dynamic import of `../src/data/projects.ts` (mirror how `scripts/check-i18n.ts` loads data). Loads post collection entries via Astro's content APIs (or by scanning `src/content/posts/<locale>/*.md` frontmatter directly with `gray-matter` already available — confirm; otherwise read raw and parse YAML with the project's existing approach). Validates: (a) every local `images[].path` exists at `src/assets/images/projects/<path>`; (b) default-locale alt is non-empty for every project image; (c) `PROJECTS_SHARED[id].images.length === PROJECTS_BY_LOCALE[defaultLocale][id].images.length`; (d) for every post with a hero, exactly one of `heroImage`/`heroImageUrl` is set; (e) `heroImageAlt[defaultLocale]` is non-empty when a hero exists; (f) for local posts heroes, the resolved file exists. Errors → stderr + exit 1. Warnings → stderr + exit 0.
- [X] T019 [US3] Modify `package.json`: add `"images:check": "tsx scripts/check-images.ts"` to scripts; change `build` to `"astro check && npm run i18n:check && npm run images:check && astro build"` (mirrors the existing pattern).
- [ ] T020 [US3] Verify all five failure modes listed in the Independent Test above; capture (in commit message or PR description) one example error message per failure mode to confirm the messages are author-friendly (include project id, image index or path).

**Checkpoint**: All 24 functional requirements have at least one task that delivers them; the validation surface is closed.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Demonstrate the feature on real content, validate the byte-identical-fallback claim, and confirm performance/accessibility budgets.

- [X] T021 [P] Populate at least 2 real projects with real images: drop files under `src/assets/images/projects/<id>/` and add `images` entries (with proper alt text in both locales) to `PROJECTS_SHARED` and `PROJECTS_BY_LOCALE`.
- [X] T022 [P] Populate at least 1 real blog post with a real hero image: file under `src/assets/images/posts/`, frontmatter `heroImage` + `heroImageAlt` (es + en).
- [ ] T023 [P] Run the full **Verification** section of `specs/006-project-blog-images/quickstart.md` end-to-end (manual gallery checks, locale switch, failure-mode checks). Tick all checkboxes.
- [ ] T024 Run a Lighthouse audit on `/{defaultLocale}/` and on a project page with ≥ 3 images: confirm Performance ≥ 90 and Accessibility ≥ 95 (constitution gate + SC-005). Capture scores in the PR description.
- [ ] T025 SC-007 visual parity: pick one project with `images: []` and one post with no hero, take a before/after screenshot at 360 px and 1280 px viewport widths, confirm pixel parity (or note any deltas with rationale).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1. **BLOCKS** all user-story phases.
- **Phase 3 (US1)** and **Phase 4 (US2)**: Both depend on Phase 2. Independent of each other — can be worked on in parallel by different developers.
- **Phase 5 (US3)**: Depends on Phase 2; benefits from US1 and US2 having real data to validate, but can be implemented in parallel against the empty-images baseline.
- **Phase 6 (Polish)**: Depends on US1, US2, and US3 being complete.

### Foundational task ordering (within Phase 2)

```text
T002 (imageTypes.ts) ──▶ T005 (Cover.astro)
                  └────▶ T006 (lib/images.ts)
T003 (data/projects.ts types)  ──┐
T004 (content/config.ts schema) ─┴─▶ T006 (lib/images.ts)
```

T002, T003, T004 can run in parallel (different files). T005 needs T002. T006 needs T002, T003, T004.

### User-story task ordering (within Phase 3, US1)

T007 (gallery component) and T010 (styles) and T011 (i18n strings) are parallel. T008 needs T007. T009 needs T006 (foundational) + T008. T012 (manual seeding) is the final verification — runs after T009.

### Within Phase 4 (US2)

T013 → T014 → T015 (each depends on the previous file's exports). T016 (styles) is parallel with T013–T015. T017 (manual seeding) runs last.

### Within Phase 5 (US3)

T018 → T019 → T020. No parallelism (single-developer scope).

### Parallel Opportunities

- Inside Phase 2: **T003 ‖ T004 ‖ T002**, then **T005 ‖** (continue to T006).
- Phase 3 vs. Phase 4: entire US1 can run in parallel with entire US2 (different files apart from `global.css`, where T010 and T016 only add new selectors — non-conflicting).
- US3 (Phase 5) only needs Phase 2 and can run in parallel with US1 and US2 if a third developer is available.
- Inside Phase 6: T021 ‖ T022 ‖ T023.

---

## Parallel Example: Phase 2 (Foundational)

```bash
# After T001 completes, launch foundational types in parallel:
Task: "T002 — Create src/lib/imageTypes.ts (ResolvedImage interface)"
Task: "T003 — Extend src/data/projects.ts with ProjectImageSource / Translated types"
Task: "T004 — Extend src/content/config.ts post schema with heroImage fields"

# Then T005 (Cover.astro) — depends on T002 only:
Task: "T005 — Cover.astro accepts optional ResolvedImage prop"

# Finally T006 — depends on T002, T003, T004:
Task: "T006 — Create src/lib/images.ts (resolveProjectImages, resolvePostHero)"
```

## Parallel Example: US1 + US2 in parallel (after Phase 2)

```bash
# Developer A on US1:
Task: "T007 — ProjectGallery.tsx Preact component"
Task: "T008 — ProjectsSection.tsx wires ProjectGallery into modal"
Task: "T009 — index.astro resolves images per project context"
Task: "T010 — Gallery styles in global.css"
Task: "T011 — Gallery i18n strings"

# Developer B on US2 (no file conflicts with A):
Task: "T013 — Surface heroImage on post records"
Task: "T014 — blog/[slug].astro renders hero"
Task: "T015 — blog/index.astro renders card hero"
Task: "T016 — Hero styles in global.css"
```

The only shared file across US1/US2 is `src/styles/global.css` (T010 and T016) — both add disjoint selectors, so a final pass merges trivially.

---

## Implementation Strategy

### MVP First (US1 only)

1. Phase 1: Setup → directories created.
2. Phase 2: Foundational → site still builds byte-identical.
3. Phase 3: US1 → project galleries live; this alone is shippable as the headline portfolio improvement (it's the explicit primary ask in the user input).
4. **STOP and VALIDATE** with quickstart manual checklist for US1.
5. Deploy / demo.

### Incremental Delivery

1. Setup + Foundational → still byte-identical → can merge to `main` safely.
2. US1 → project galleries → demo.
3. US2 → blog hero images → demo.
4. US3 → validation script protects all future image edits → green CI.
5. Polish → real content seeded + Lighthouse confirmed.

### Parallel Team Strategy (3 developers)

- All three pair on Phase 1 + Phase 2 (small surface — done in one sitting).
- Once T006 lands: Dev A → US1, Dev B → US2, Dev C → US3.
- Merge via three sequential PRs against the feature branch; final PR runs Phase 6 polish.

---

## Notes

- **No tests requested** — the feature relies on `astro check`, `images:check`, and the manual quickstart for verification. If the user later requests TDD, the obvious additions are: (a) unit tests for `resolveProjectImages` / `resolvePostHero` (alt fallback, empty-array short-circuit, zero-dimension refusal); (b) a Vitest spec for `scripts/check-images.ts` failure modes.
- **No new runtime dependencies**. `tsx` is already in devDependencies (used by `check-i18n.ts`).
- **No new design tokens** — only new selectors that consume existing CSS custom properties.
- **`src/styles/global.css` is the only file touched by both US1 and US2** (T010 + T016). They add disjoint selectors; merging is trivial.
- Each user-story phase ends with a manual seeding/verification task — that's what makes the story independently demonstrable.
- Commit at every checkpoint (after Phase 2, after each story phase) for clean review history.
