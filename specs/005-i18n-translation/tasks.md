---
description: "Task list for the Multi-Language Translation (i18n) feature"
---

# Tasks: Multi-Language Translation (i18n)

**Input**: Design documents from `/specs/005-i18n-translation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/i18n-api.md, contracts/locale-catalog.schema.json, quickstart.md

**Tests**: The feature spec does **not** request unit tests. Verification is performed by (a) the build-time `scripts/check-i18n.ts` validator (per FR-009 / SC-006) and (b) the manual content-audit checklist in `quickstart.md`. No `tests/` directory is created.

**Organization**: Tasks are grouped by user story (US1 = P1 ES/EN swap MVP, US2 = P2 extensibility, US3 = P2 switcher discoverability) so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps the task to a user story phase (US1 / US2 / US3)
- File paths are absolute-from-repo-root and exact

## Path Conventions (per plan.md)

- Astro single-project layout: `src/`, `scripts/` at repo root.
- New module: `src/i18n/`. New island: `src/components/islands/LanguageSwitcher.tsx`. New script: `scripts/check-i18n.ts`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the directory layout and tooling hooks needed by every later phase.

- [X] T001 Create directory `src/i18n/locales/` (parent `src/i18n/` is created implicitly).
- [X] T002 Create directory `scripts/` at repo root.
- [X] T003 [P] Add devDependency `tsx` to `package.json` for running the TypeScript validator script (no other runtime dependencies are added). Run `npm install` to lock the version.
- [X] T004 Update `package.json` scripts:
  - Add `"i18n:check": "tsx scripts/check-i18n.ts"`.
  - Change `"build"` from `"astro check && astro build"` to `"astro check && npm run i18n:check && astro build"`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the i18n module surface every user story depends on. **No user-story task may begin until this phase is complete.**

- [X] T005 Create `src/i18n/config.ts` exporting `Locale` type, `locales` (with `es` default + `en`), `defaultLocale`, and `supportedCodes`, exactly matching the contract in `specs/005-i18n-translation/contracts/i18n-api.md` §"Module: src/i18n/config.ts".
- [X] T006 [P] Create `src/i18n/locales/es.json` as an empty `{}` JSON file (keys are populated incrementally by US1 component-migration tasks; this seed satisfies the parity checker bootstrapping).
- [X] T007 [P] Create `src/i18n/locales/en.json` as an empty `{}` JSON file.
- [X] T008 Create `src/i18n/translate.ts` implementing `t(key, params?, locale?)`, `getCatalog(locale)`, and `getAllCatalogs()` per `contracts/i18n-api.md`. Imports catalogs via `import esCatalog from './locales/es.json'` etc. Implements: missing-key fallback to `defaultLocale`, then key-as-string with `console.warn` if also missing; `{token}` interpolation via simple regex replace.
- [X] T009 Create `scripts/check-i18n.ts` that:
  1. Imports `locales`, `defaultLocale`, `supportedCodes` from `src/i18n/config.ts`.
  2. Verifies a JSON file exists for every supported code (error `E_MISSING_CATALOG`).
  3. Verifies exactly one `default: true` (errors `E_MULTIPLE_DEFAULTS` / `E_NO_DEFAULT`).
  4. Compares key sets across all catalogs against the default-locale set (error `E_KEY_MISMATCH`).
  5. Validates every key matches `/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/` (error `E_INVALID_KEY`).
  6. Validates that for each shared key, the set of `{token}` placeholders is identical across locales (error `E_PLACEHOLDER_MISMATCH`).
  7. Greps `src/**/*.{astro,ts,tsx}` for `t('…')` and `data-i18n="…"` references and ensures every referenced key is in the default catalog (error `E_REFERENCED_NOT_DEFINED`).
  8. Emits warnings (non-failing) `W_ORPHAN_KEY` and `W_EMPTY_VALUE`.
  9. Exits 0 on pass, 1 on any error.
- [X] T010 Smoke-run `npm run i18n:check` against the empty-catalog state. With no `t()` calls in the codebase yet and identical empty catalogs across both locales, the script MUST exit 0. Fix any false positives before continuing.

**Checkpoint**: `src/i18n/{config,translate}.ts`, both empty locale files, and the parity checker exist and pass. User-story phases may now begin.

---

## Phase 3: User Story 1 — Switch entire page between Spanish and English (Priority: P1) 🎯 MVP

**Goal**: Pressing a language toggle replaces 100% of visible text on the page (nav, hero, about, experience, projects, skills, ask, contact, footer, badges, placeholders, ARIA labels, `<title>`, meta description) instantly, with persistence across reloads, defaulting to browser language for first-time visitors.

**Independent Test**: Quickstart Part 1, sections 1.1 → 1.4 (default render with JS off, browser-language detection, manual switch + persistence, stored-but-unsupported preference) plus Part 2 content audit completed end-to-end in both locales with zero remaining untranslated text.

### Implementation for User Story 1

- [X] T011 [US1] Create `src/i18n/client.ts` implementing `init()`, `setLocale(code)`, `getLocale()`, `onLocaleChange(handler)` per `contracts/i18n-api.md` §"Module: src/i18n/client.ts". Reads catalogs from `<script id="i18n-catalogs" type="application/json">`. Resolves active locale: `localStorage.cv.lang` → `navigator.languages` ∩ `supportedCodes` → `defaultLocale`. Walks `[data-i18n]`, `[data-i18n-attr]`, `[data-i18n-html]`. Updates `<html lang>`, `<title>`, `meta[name="description"]`. Dispatches `locale:change` CustomEvent. Wraps all `localStorage` access in `try/catch` for private-mode safety.
- [X] T012 [US1] Modify `src/layouts/BaseLayout.astro`:
  1. Compute `defaultLocale` from `src/i18n/config.ts` and set `<html lang={defaultLocale}>`.
  2. Render `<title>{t('meta.title')}</title>` and `<meta name="description" content={t('meta.description')}>`.
  3. Embed all catalogs once: `<script id="i18n-catalogs" type="application/json" set:html={JSON.stringify(getAllCatalogs())} />`.
  4. Append a module script that imports and calls `init()` from `src/i18n/client.ts` at the end of `<body>`.
- [X] T013 [P] [US1] Migrate `src/components/atoms/Button.astro`: replace any hardcoded label text with `<slot>` plus `data-i18n` on the slot wrapper when the label comes from a translation key. Add `data-i18n-attr` for `aria-label` when present. No other markup changes.
- [X] T014 [P] [US1] Migrate `src/components/atoms/Chip.astro` and `src/components/atoms/StatusPill.astro` (every literal user-facing string → `t(key)` + matching `data-i18n` marker on the rendered element).
- [X] T015 [P] [US1] Migrate molecules `src/components/molecules/{HeroSocial,TimelineItem,StatCell,SkillCard,StripMarquee}.astro` (replace literals; add `data-i18n` markers; add `data-i18n-attr` for any `aria-label`/`alt`/`title`).
- [X] T016 [P] [US1] Migrate `src/components/organisms/HeroSection.astro` (greeting, headline, subheadline, status pill, CTAs, ARIA labels).
- [X] T017 [P] [US1] Migrate `src/components/organisms/AboutSection.astro` (heading and all paragraphs).
- [X] T018 [P] [US1] Migrate `src/components/organisms/AskSection.astro` (heading, hint, surrounding labels) and the embedded island `src/components/islands/AskAI.tsx` (placeholder, ARIA label, button label, empty/loading state strings — Preact reads its strings from a small `useTranslations()` hook to be created in this same file or imported from `src/i18n/client.ts`).
- [X] T019 [P] [US1] Migrate `src/components/organisms/ContactSection.astro` and `src/components/islands/ContactLinks.tsx` (link labels and ARIA labels).
- [X] T020 [P] [US1] Migrate `src/components/organisms/Footer.astro` (rights notice, location, social ARIA labels).
- [X] T021 [P] [US1] Migrate `src/components/islands/Nav.tsx` (nav link labels, mobile menu toggle ARIA label, theme toggle ARIA label).
- [X] T022 [P] [US1] Migrate `src/components/islands/ProjectsSection.tsx` (section heading, per-project link labels like "Live demo" / "Code" — project titles/descriptions stay sourced from `src/data/projects.ts` per T026).
- [X] T023 [P] [US1] Migrate `src/components/islands/BlogSection.tsx` (section heading, "read more" labels, empty state).
- [X] T024 [P] [US1] Migrate `src/components/islands/Terminal.tsx` (typed strings catalog moved into `terminal.lines.*` keys).
- [X] T025 [US1] Refactor `src/data/profile.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/posts.ts` to use translation keys for every user-facing string field (e.g. `nameKey`, `roleKey`, `summaryKey`). Non-translated identifiers (URLs, slugs, technology names like "TypeScript") stay literal. Update `src/data/index.ts` accordingly.
- [X] T026 [US1] Modify `src/pages/index.astro` to use `t()` for any literals not already pushed into components, and ensure `meta.title`/`meta.description` keys are referenced.
- [X] T027 [US1] Populate `src/i18n/locales/es.json` with **every** key now referenced by the codebase. Source of strings = the original Spanish copy already present in the repo before migration. Run `git diff` per file to recover the literals if they were overwritten.
- [X] T028 [US1] Populate `src/i18n/locales/en.json` with the English translation of every key in `es.json`. Preserve every `{token}` placeholder identically. Respect length budgets documented in `quickstart.md` (badges, nav items, CTAs).
- [X] T029 [US1] Run `npm run i18n:check`. Fix every reported error. Repeat until exit code 0 with no `E_*` errors. Resolve any `W_ORPHAN_KEY` warnings by either deleting the orphan or referencing it.
- [X] T030 [US1] Run `npm run build`. Build MUST succeed. Run `npm run preview` and execute Quickstart Part 1 §1.1 (no-JS render in Spanish), §1.2 (browser-language detection), §1.3 (manual switch + persistence), §1.4 (unsupported stored locale fallback). All four MUST pass.

**Checkpoint**: User Story 1 complete. The page is fully bilingual ES/EN with persistence and graceful fallbacks. This is a shippable MVP.

---

## Phase 4: User Story 2 — Add a new language without code rewrite (Priority: P2)

**Goal**: A maintainer can ship a third language by adding one JSON file plus one line in `src/i18n/config.ts`, with zero edits to component source files. Architecture is verified, not just claimed.

**Independent Test**: Following Quickstart Part 3 ("Add a new language") end-to-end with a real third locale (Portuguese `pt`) completes in under 30 minutes per SC-003, with no edits to any `.astro` / `.tsx` / non-i18n `.ts` file.

### Implementation for User Story 2

- [X] T031 [US2] Code audit of US1 outputs: confirm that `src/components/islands/Nav.tsx`, `src/components/islands/AskAI.tsx`, and any place that needs to enumerate locales reads from `src/i18n/config.ts` (`locales`, `supportedCodes`) — never a hardcoded `['es','en']` list. Refactor any offender. Document the audit result inline in the PR description.
- [X] T032 [US2] Verify `scripts/check-i18n.ts` handles N locales, not just 2: confirm the parity loop iterates `locales` and that error messages identify the offending locale code. No code change expected if T009 was done correctly; this task is a verification step plus a regression-guard comment in the script.
- [X] T033 [US2] Dry-run extensibility test:
  1. Create temporary `src/i18n/locales/pt.json` by copying `es.json` (placeholder values acceptable).
  2. Add `{ code: 'pt', label: 'Português' }` to `locales` in `src/i18n/config.ts`.
  3. Run `npm run build` — it MUST succeed.
  4. Run `npm run preview` and confirm the language switcher (created by US3) shows three buttons and the page renders in `pt` when selected.
  5. **Revert both files** (`git checkout src/i18n/config.ts src/i18n/locales/`) and remove `pt.json`. Document the elapsed wall-clock time in the PR; it MUST be under 30 minutes.

**Checkpoint**: User Story 2 complete. Architecture is verified extensible with the actual procedure documented in `quickstart.md`.

---

## Phase 5: User Story 3 — Discover and switch language easily on any device (Priority: P2)

**Goal**: A first-time visitor finds and operates the language switcher in under 10 seconds on both desktop and mobile, with full keyboard, mouse, and touch support, meeting WCAG 2.1 AA and constitution principle IV (44×44 px touch target).

**Independent Test**: Quickstart Part 1 §1.5 (keyboard operability) and §1.6 (mobile touch target) pass. Visual focus ring is visible. `<html lang>` updates on every switch.

### Implementation for User Story 3

- [X] T034 [US3] Create `src/components/islands/LanguageSwitcher.tsx` (Preact) per `contracts/i18n-api.md` §"Component: src/components/islands/LanguageSwitcher.tsx". Renders `<div role="group" aria-label="Language">` with one `<button>` per `locales` entry, label = `code.toUpperCase()`. Uses `useState`/`useEffect` to subscribe to `onLocaleChange` and reflect `aria-pressed`. On click calls `setLocale(code)`. No internal hardcoded locale list — reads from `src/i18n/config.ts`.
- [X] T035 [US3] Create `src/styles/i18n-switcher.css` with: button min-width / min-height ≥ 44 px, visible `:focus-visible` ring matching the existing design tokens, active-state `aria-pressed="true"` styling. Import once globally in `src/layouts/BaseLayout.astro` or scope inside the component — pick whichever matches existing theme-toggle pattern.
- [X] T036 [US3] Mount `LanguageSwitcher` inside `src/components/islands/Nav.tsx` next to the existing theme toggle (desktop nav and mobile menu surfaces). Hydration directive: `client:idle` (set on the `<LanguageSwitcher client:idle />` usage in any `.astro` consumer; if mounted from inside another Preact island, no directive is needed). Ensure it appears within the same flex/grid row as the theme toggle without breaking responsive layout at the breakpoints documented in feature 003.
- [X] T037 [US3] Add ARIA labels to the switcher buttons (`aria-label="{label}"` so screen readers announce "Español" / "English" instead of just "ES" / "EN"). Use translation keys `switcher.label.<code>` for these — add them to both locale catalogs and re-run `npm run i18n:check`.
- [X] T038 [US3] Run Quickstart Part 1 §1.5 (keyboard tab → Enter/Space switches locale, focus stays on switcher) and §1.6 (mobile DevTools 44×44 px verification) on the production preview. Both MUST pass.

**Checkpoint**: User Story 3 complete. The switcher is discoverable, operable by every input method, and accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, content collections, and final regression checks across all user stories.

- [X] T039 [P] Update `src/pages/blog/[slug].astro` to honor the active locale: read it from `import.meta.env`-style context or the URL/storage during SSG, and resolve the post by filename suffix (`<slug>.<locale>.md`). For now `src/content/posts/` is empty, so this is scaffolding: implement the lookup + the "post unavailable in this language → 404" branch. Document the convention in `quickstart.md` if not already covered.
- [X] T040 [P] Add JSDoc / TSDoc comments to every exported symbol in `src/i18n/config.ts`, `src/i18n/translate.ts`, and `src/i18n/client.ts` matching the descriptions in `contracts/i18n-api.md`.
- [X] T041 Run the full Quickstart Part 2 content audit (every section, every ARIA label, every alt text, every placeholder, `<title>`, meta description) in both `es` and `en`. Any item still showing the source language → add the missing key + translation, re-run `npm run i18n:check`, repeat until clean.
- [X] T042 [P] Run Lighthouse on `npm run preview` for `/` in both locales (use Chrome incognito with `--lang=es` then `--lang=en`). Required scores: Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100. Capture results. If Performance regressed below 95, profile the embedded catalog size and consider on-demand fetch — but only as a fallback, since the static-first approach should already be well under budget.
- [X] T043 [P] Verify dark-mode contrast (feature 002) and responsive layout (features 003, 004) still pass in both locales. No visual regression is acceptable per constitution principle III.
- [X] T044 Final state of `AGENTS.md`: confirm the SPECKIT block still points at `005-i18n-translation/plan.md`. No changes expected unless follow-up TODOs surfaced.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies. Can start immediately.
- **Phase 2 Foundational**: Depends on Phase 1. Blocks every user-story phase.
- **Phase 3 (US1)**: Depends on Phase 2. Delivers the MVP.
- **Phase 4 (US2)**: Depends on **Phase 3 completing**, because the extensibility audit and dry-run require a working US1 to compare against. (This is a deliberate sequencing choice — US2 verifies US1's architecture rather than building new feature surface.)
- **Phase 5 (US3)**: Depends on Phase 2 only. Can run in **parallel with Phase 3** by a different developer, since the switcher consumes `src/i18n/client.ts` (Phase 2) but does not touch component migration. The switcher will not have a useful effect until Phase 3 is also complete.
- **Phase 6 Polish**: Depends on Phases 3, 4, 5 all being complete.

### Within Each Phase

- All tasks marked `[P]` within a phase can run in parallel; they touch different files.
- Sequential tasks share files or have data dependencies (e.g. T029 depends on T011–T028 being merged into the codebase).
- T025 (data-files refactor) and T013–T024 (component migrations) are listed in parallel because each touches a distinct file; however they all converge on T027/T028 (catalog population), which is sequential.

### Parallel Opportunities

- **Phase 1**: T003 is `[P]`; T001/T002/T004 are tiny sequential setup steps.
- **Phase 2**: T006 and T007 are `[P]` (different files). T005, T008, T009 are sequential.
- **Phase 3 (the bulk of the work)**: T013 → T024 are all `[P]` and can be split across multiple developers / sessions. They merge into the sequential tail T025 → T030.
- **Phase 6**: T039, T040, T042, T043 are `[P]` (independent files / tools).

---

## Parallel Example: User Story 1 component migrations

```bash
# After T011 + T012 are merged, these 12 component migrations are independent:

T013  src/components/atoms/Button.astro
T014  src/components/atoms/{Chip,StatusPill}.astro
T015  src/components/molecules/{HeroSocial,TimelineItem,StatCell,SkillCard,StripMarquee}.astro
T016  src/components/organisms/HeroSection.astro
T017  src/components/organisms/AboutSection.astro
T018  src/components/organisms/AskSection.astro + src/components/islands/AskAI.tsx
T019  src/components/organisms/ContactSection.astro + src/components/islands/ContactLinks.tsx
T020  src/components/organisms/Footer.astro
T021  src/components/islands/Nav.tsx
T022  src/components/islands/ProjectsSection.tsx
T023  src/components/islands/BlogSection.tsx
T024  src/components/islands/Terminal.tsx

# Then sequential tail:
T025 → T026 → T027 → T028 → T029 → T030
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup (≤ 15 min).
2. Phase 2: Foundational (~1 h: writing the i18n module + parity checker is the core engineering effort).
3. Phase 3: User Story 1 (the long phase: component migration + catalog population + translation. Time-dominated by writing translations, not coding).
4. **STOP & VALIDATE** at the T030 checkpoint. The site is fully bilingual. This is shippable.

### Incremental Delivery

1. Setup + Foundational → architecture in place.
2. + Phase 3 (US1) → MVP shipped, deploy, demo. **Real users can already use it.**
3. + Phase 5 (US3 switcher) — note: in practice T034–T038 should ship together with Phase 3 since the page is unusable as bilingual without a switcher. The dependency graph allows them in parallel but the demo gate at T030 implicitly requires the switcher. Treat US1 + US3 as one shipping increment.
4. + Phase 4 (US2 extensibility verification) → architecture quality check. No user-visible change.
5. + Phase 6 (Polish) → Lighthouse + content audit + blog scaffolding.

### Single-Developer Strategy (this project)

Recommended order if working solo:

1. Phase 1 → Phase 2.
2. Phase 5 (T034–T037) **before** the bulk of Phase 3 component migrations, so you can manually verify each migrated component live with the switcher.
3. Phase 3 component migrations one at a time, keeping `npm run dev` open and toggling languages after each.
4. Phase 3 catalog population (T027–T028).
5. Phase 3 verification (T029, T030).
6. Phase 4 dry-run (T031–T033).
7. Phase 6 polish.

---

## Notes

- `[P]` tasks = different files, no in-flight dependencies. A task migrating component X never blocks a task migrating component Y.
- Each user story is independently shippable in principle, but US1 + US3 together form the practical first deploy (a bilingual site without a visible switcher would force users to hand-edit `localStorage`).
- The build-time validator (`scripts/check-i18n.ts`) replaces a unit-test suite for this feature. SC-006 is satisfied by it.
- Commit per task or per logical group of `[P]` tasks. Keep the `005-i18n-translation` branch focused on this feature; do not bundle unrelated refactors.
- Constitution principle III (Design Fidelity) is the single most likely regression vector: long English strings can break badge / nav layouts. Eyeball every migrated component at the documented breakpoints before moving on.
