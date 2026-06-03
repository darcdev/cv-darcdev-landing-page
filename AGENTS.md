<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

## Current Feature: Multi-Language Translation (i18n)

**Branch**: `005-i18n-translation`

**Plan**: [specs/005-i18n-translation/plan.md](specs/005-i18n-translation/plan.md)

### Quick Reference

- **Stack**: Astro 4.16, Preact 10, TypeScript 5.6 (strict). No new runtime deps.
- **Focus**: Spanish (default) + English on launch, extensible to N languages by adding one JSON file.
- **Approach**: Hand-rolled key→string catalogs, SSG renders default locale, client-side DOM swap on toggle via `[data-i18n]` markers.

### Key Documents

- [Specification](specs/005-i18n-translation/spec.md) — User stories, FR-001…FR-012, success criteria
- [Plan](specs/005-i18n-translation/plan.md) — Technical context, constitution gates, project structure
- [Research](specs/005-i18n-translation/research.md) — 7 decisions with rationale + alternatives
- [Data Model](specs/005-i18n-translation/data-model.md) — Locale, Catalog, Key, Preference, validation rules
- [Contracts](specs/005-i18n-translation/contracts/) — `i18n-api.md` (module surface) + `locale-catalog.schema.json`
- [Quickstart](specs/005-i18n-translation/quickstart.md) — Verification, content audit, add-a-language guide

### Constitution Principles

1. **Component-First Architecture** — i18n lives under `src/i18n/`, switcher under `src/components/islands/`
2. **Static-First, Islands for Interactivity** — Default locale rendered at SSG; switcher is `client:idle`
3. **Design Fidelity (NON-NEGOTIABLE)** — Translation only changes text; never markup or styles
4. **Accessibility & Performance** — `<html lang>` updates, 44×44 px targets, Lighthouse ≥ 95
5. **Maintainability & Extensibility** — New language = 1 JSON file + 1 line in `src/i18n/config.ts`

### Files to Add / Modify

- `src/i18n/config.ts` — Supported locales registry (NEW)
- `src/i18n/translate.ts` — `t(key, params?, locale?)` build-time helper (NEW)
- `src/i18n/client.ts` — Browser runtime: detect, persist, swap DOM (NEW)
- `src/i18n/locales/{es,en}.json` — Catalogs (NEW)
- `src/components/islands/LanguageSwitcher.tsx` — Preact island (NEW)
- `scripts/check-i18n.ts` — Build-time parity checker, wired into `npm run build` (NEW)
- `src/layouts/BaseLayout.astro` — Embed catalogs, mount switcher, `<html lang>` (MODIFY)
- All `.astro` components — Replace literal strings with `t('…')` + add `data-i18n` markers (MODIFY)
- `src/pages/index.astro`, `src/pages/blog/[slug].astro` — i18n integration (MODIFY)
- `package.json` — Add `i18n:check` script + extend `build` (MODIFY)
<!-- SPECKIT END -->
