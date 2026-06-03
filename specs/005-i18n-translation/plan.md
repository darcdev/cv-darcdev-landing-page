# Implementation Plan: Multi-Language Translation (i18n)

**Branch**: `005-i18n-translation` | **Date**: 2026-06-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-i18n-translation/spec.md`

## Summary

Add Spanish/English translation to the entire CV landing page with a language switcher, persisted preference, and an architecture that lets a maintainer add a third language by dropping in a single locale file. Approach: ship per-locale JSON catalogs as static assets, render the default locale at build time via a small `t(key)` helper in `.astro` components, and use a single tiny Preact island (`LanguageSwitcher`) plus a small client script that swaps text content on language change using `data-i18n` attributes. No external i18n library, no URL-based routing in v1.

## Technical Context

**Language/Version**: TypeScript 5.6 (strict mode), Astro 4.16, Preact 10

**Primary Dependencies**: Astro 4.x (SSG), `@astrojs/preact` (islands). **No new runtime dependency** — i18n is implemented in ~150 LOC of project code.

**Storage**: `localStorage` key `cv.lang` for the user's last selected locale. No server, no database.

**Testing**: Manual content-audit checklist (see quickstart) + a TypeScript build-time script (`npm run i18n:check`) that fails the build if any locale is missing a key referenced by the codebase, or has extra/orphan keys.

**Target Platform**: Static site, modern evergreen browsers (last 2 versions), mobile + desktop. Output is plain HTML/CSS/JS deployed to a static host.

**Project Type**: Single-project static web app (Astro SSG with selective Preact islands).

**Performance Goals**:
- Language switch completes in under 300 ms on a mid-range mobile device (no network, all catalogs already in HTML).
- Zero added blocking JS for users who never toggle language: switcher island uses `client:idle`.
- Lighthouse Performance ≥ 95 maintained (constitution target).

**Constraints**:
- Constitution principle II (Static-First): page MUST render core content without JavaScript. → Default locale is rendered into HTML at build time. Switching requires JS.
- Constitution principle III (Design Fidelity NON-NEGOTIABLE): translated strings MUST NOT break layout, dark-mode, or responsive behavior at the documented breakpoints. → Designer/translator review for length-sensitive areas (badges, buttons, nav).
- Constitution principle V: adding a language = 1 new JSON file + 1 line in config; no component edits.
- No URL-based locale routing in v1 (spec assumption).

**Scale/Scope**:
- 2 locales on launch (`es`, `en`); architecture must scale to N locales.
- Single landing page (`/`) plus the `/blog/[slug]` route. Estimated 150–250 translation keys total across all sections (nav, hero, about, experience, projects, skills, ask/search, footer, badges, ARIA labels, page metadata).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| I. Component-First Architecture | PASS | Switcher is a Preact island under `src/components/islands/`. The `t()` helper is a `src/utils/` module. No new globals beyond a single locale config file. |
| II. Static-First, Islands for Interactivity | PASS | Default-locale text is rendered into HTML at build time. JS only ships for the language switcher (island, `client:idle`) and a tiny ~2KB swap script. Page is fully readable with JS disabled. |
| III. Design Fidelity (NON-NEGOTIABLE) | PASS (with constraint) | Translation only changes text content, never markup/styles. Constraint: translators must respect documented length budgets for badges, nav items, and buttons (captured in `quickstart.md`). |
| IV. Accessibility & Performance | PASS | `<html lang>` updated on toggle, switcher exposes ARIA attributes, keyboard-operable, 44×44 px touch target. No measurable performance regression: catalogs are <10 KB gzipped each, loaded once. |
| V. Maintainability & Extensibility | PASS | Adding a locale = create `src/i18n/locales/<code>.json` + add `{ code, label }` to `src/i18n/config.ts`. Build-time check enforces parity. |

**No violations. No entries required in Complexity Tracking.**

## Project Structure

### Documentation (this feature)

```text
specs/005-i18n-translation/
├── plan.md                    # This file
├── spec.md                    # Feature specification
├── research.md                # Phase 0 output (decisions + rationale)
├── data-model.md              # Phase 1 output (Locale, Catalog, Key, Preference)
├── quickstart.md              # Phase 1 output (verification + add-a-language guide)
├── contracts/
│   ├── locale-catalog.schema.json   # JSON Schema for locale files
│   └── i18n-api.md                  # Contract for t(), useLocale(), config shape
└── checklists/
    └── requirements.md        # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── atoms/                       # (existing — gain data-i18n attrs + t() calls)
│   ├── molecules/                   # (existing — same)
│   ├── organisms/                   # (existing — same)
│   └── islands/
│       └── LanguageSwitcher.tsx     # NEW — Preact island, client:idle
├── data/
│   ├── profile.ts                   # (existing — content split into locale catalogs)
│   ├── experience.ts                # (existing — same)
│   ├── projects.ts                  # (existing — same)
│   ├── skills.ts                    # (existing — same)
│   └── posts.ts                     # (existing — same; per-post titles/summary keyed)
├── i18n/                            # NEW
│   ├── config.ts                    # Supported locales registry + default
│   ├── translate.ts                 # t(key, params?) helper for .astro/.tsx
│   ├── client.ts                    # Client runtime: swap, persistence, browser detect
│   └── locales/
│       ├── es.json                  # Default Spanish catalog (source of truth)
│       └── en.json                  # English catalog
├── layouts/
│   └── BaseLayout.astro             # (existing — render <html lang>, inject catalogs as JSON, mount switcher)
├── pages/
│   ├── index.astro                  # (existing — replace literals with t() calls)
│   └── blog/[slug].astro            # (existing — same; per-post i18n via content collections)
├── styles/
│   └── i18n-switcher.css            # NEW — switcher styles (atomic, scoped allowed)
└── utils/
    └── (existing)

scripts/
└── check-i18n.ts                    # NEW — build-time parity & orphan-key checker
```

**Structure Decision**: Single-project Astro layout (constitution-mandated) extended with a new `src/i18n/` module and a new island under the existing `src/components/islands/` directory. No `tests/` directory exists in the project today; verification relies on (a) the build-time `scripts/check-i18n.ts` script wired into `npm run build` and (b) the manual content-audit checklist in `quickstart.md`.

## Complexity Tracking

> No constitution violations. This section is intentionally empty.
