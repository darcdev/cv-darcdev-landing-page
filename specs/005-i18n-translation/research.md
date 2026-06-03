# Phase 0 Research: Multi-Language Translation (i18n)

**Date**: 2026-06-02
**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

This document resolves every "NEEDS CLARIFICATION" implied by the Technical Context and records the rationale for each decision.

---

## Decision 1 — i18n approach: hand-rolled key→string catalogs (no library)

**Decision**: Implement i18n as a small project module (`src/i18n/`) consisting of:

- A `Record<string, string>` JSON catalog per locale.
- A server-side `t(key, params?)` helper used by `.astro` files at build time.
- A client runtime (~2 KB) that reads catalogs from a `<script type="application/json">` element embedded once in `BaseLayout.astro` and swaps text on toggle by walking `[data-i18n]`, `[data-i18n-attr]`, and `[data-i18n-html]` nodes.

**Rationale**:

- The site has ~200 keys, two locales on launch. A library like `i18next` adds 30–50 KB of runtime for features (pluralization, ICU MessageFormat, namespaces, async loaders) we do not need.
- Constitution principle II (Static-First): default locale must be in HTML at build time without JS. A hand-rolled approach lets `.astro` files call `t()` synchronously during SSG.
- Constitution principle V (Maintainability): adding a locale must be one JSON file + one config line. A library would still require this, plus a wrapper.
- Zero new runtime dependencies keeps audit surface, bundle size, and Lighthouse score intact.

**Alternatives considered**:

- `i18next` + `astro-i18next` — Rejected. Heavy for the use case, brings concepts (namespaces, plural rules) we do not currently need; can be migrated to later if needs grow.
- `@astrojs/i18n` (built-in routing) — Rejected for v1 because the spec explicitly excludes URL-based locale routing.
- `react-intl` / FormatJS — Rejected. Adds React dependency surface and ICU runtime we do not need; we use Preact and translations are mostly static strings.
- Per-page duplicated `.astro` files (`index.es.astro`, `index.en.astro`) — Rejected. Violates DRY, fights constitution principle V, makes adding a third language an exponential maintenance task.

---

## Decision 2 — Translation lookup mechanism: `data-i18n` attributes + JSON island

**Decision**: At build time, every translatable element receives:

- For text content: `data-i18n="key.path"` plus the default-locale text inside the element.
- For attributes: `data-i18n-attr='{"placeholder":"key.placeholder","aria-label":"key.aria"}'` (JSON-encoded map).
- For HTML-bearing strings (rare, e.g. a paragraph with an inline `<strong>`): `data-i18n-html="key.path"`.

`BaseLayout.astro` injects the full catalog set as:

```html
<script id="i18n-catalogs" type="application/json">{ "es": {...}, "en": {...} }</script>
```

The client runtime reads the active locale from `localStorage` (or browser preferred language fallback), walks the marked nodes once on first paint to apply the active locale (only if it differs from the default already in HTML), and again on every switcher click.

**Rationale**:

- Page is fully readable in the default locale with JS disabled (constitution principle II).
- Switching language does not require re-rendering Preact components or hydrating the entire page; it is a single DOM walk over a small marked subset.
- Works for `.astro` static markup, Preact island markup, and content-collection-rendered HTML uniformly.

**Alternatives considered**:

- Hydrate every component as a Preact island and use Preact context for locale — Rejected. Violates "Static-First" by shipping JS for static text.
- Re-fetch HTML per locale via fetch and replace innerHTML — Rejected. Double network traffic, breaks SPA-like behavior, harder for SEO.
- Server-side route per locale (`/`, `/en/`) — Rejected per spec assumption (no URL routing in v1).

---

## Decision 3 — Catalog file format: flat JSON with dotted keys

**Decision**: Locale files are JSON with **dotted keys** at a single level of nesting:

```json
{
  "nav.home": "Inicio",
  "nav.experience": "Experiencia",
  "hero.title": "Hola, soy {name}",
  "ask.placeholder": "Preguntá lo que quieras…"
}
```

**Rationale**:

- Trivially serializable, diff-friendly in PRs, no parser needed beyond `JSON.parse`.
- Dotted keys give logical grouping (`nav.*`, `hero.*`, `ask.*`) without nested object access cost or null-safety boilerplate.
- The build-time parity checker (`scripts/check-i18n.ts`) only needs simple key set comparisons.

**Alternatives considered**:

- Nested JSON (`{ "nav": { "home": "..." } }`) — Rejected. Adds path resolution code (`get(obj, 'nav.home')`) and complicates the parity check.
- YAML or TOML — Rejected. Requires a parser dependency; JSON is native.
- Per-section files (`nav.json`, `hero.json`) — Rejected for v1. Premature optimization; one file per locale is easier to translate end-to-end. Can split later if any single file passes ~1000 keys.

---

## Decision 4 — Default-locale resolution and persistence

**Decision**:

1. On first visit, read `localStorage.getItem('cv.lang')`.
2. If absent, read `navigator.language` and `navigator.languages`. If any matches a supported locale (case-insensitive, primary subtag), use it; otherwise use `es` (default).
3. Persist the locale in `localStorage` only when the user explicitly clicks the switcher (not when auto-detected, to allow the auto-detection to keep adapting if the user later changes browser locale).
4. If the stored locale is no longer in the supported list, treat as absent and clear it.

**Rationale**:

- Spec FR-003 requires persistence of explicit choice; FR-004 requires browser-language-aware default.
- Persisting only on explicit choice avoids "trapping" returning visitors in a locale they never picked.
- Honors edge case from spec: stored unsupported locale → clear and fall back.

**Alternatives considered**:

- Cookie-based persistence — Rejected. Static site, no need to send to a server.
- `sessionStorage` — Rejected. Spec FR-003 requires preference to survive across visits.
- IP-geolocation — Rejected. Privacy-invasive, inaccurate, and overkill.

---

## Decision 5 — Language switcher placement and form

**Decision**:

- Single Preact island `LanguageSwitcher.tsx` mounted in the navigation bar (`Nav` organism), placed next to the existing theme toggle.
- Form: a small button group rendering ISO 639-1 codes (`ES` / `EN`) — compact on both desktop and mobile, no language-name translation dance ("Spanish" vs "Español").
- Mounted with `client:idle` so it does not block first paint.
- Touch target ≥ 44×44 px (constitution principle IV).
- ARIA: `<div role="group" aria-label="Language">` containing two buttons with `aria-pressed`.

**Rationale**:

- Two-locale launch makes a button group clearer than a `<select>` dropdown.
- Co-located with the existing theme toggle = users already learn where personalization controls live.
- Code-based labels (`ES`/`EN`) avoid the recursive problem of translating language names.
- `client:idle` keeps the switcher off the critical render path.

**Alternatives considered**:

- `<select>` dropdown — Rejected for v1 (only 2 options); plan to migrate to a dropdown when ≥ 4 locales exist.
- Footer placement only — Rejected. Spec User Story 3 requires discoverability without scrolling on desktop.
- Floating action button — Rejected. Conflicts with existing visual design (constitution principle III).

---

## Decision 6 — Build-time validation strategy

**Decision**: A Node script `scripts/check-i18n.ts` runs as part of `npm run build` (extend the existing `astro check && astro build` to `astro check && tsx scripts/check-i18n.ts && astro build`). It:

1. Loads `src/i18n/config.ts` to discover the supported-locale list.
2. Loads each locale JSON.
3. Greps the codebase (`src/**/*.{astro,ts,tsx}`) for `t('...')` and `data-i18n="..."` references to build the set of *referenced* keys.
4. Fails the build if:
   - Any locale is missing a referenced key.
   - Any locale has keys not referenced in code (orphans) — emitted as warning, not failure, to allow staging-area work.
   - Any catalog has duplicate keys (caught by `JSON.parse` already).

**Rationale**:

- Spec SC-006 makes this a hard requirement.
- Catches translation-debt before deploy without writing a full test suite (project has no `tests/` directory today).

**Alternatives considered**:

- Runtime warning only — Rejected. Spec FR-009 already requires runtime fallback + warning, but that does not prevent deploying with missing keys. Build-time check is the safety net.
- Vitest unit test — Rejected for now since no test runner is currently installed; can be added in a future feature.

---

## Decision 7 — Handling content collections (`/blog/[slug]`)

**Decision**: For blog posts, each post in `src/content/posts/` (existing collection) gets locale variants via filename suffix: `rag-en-produccion.es.md`, `rag-en-produccion.en.md`. The route `/blog/[slug]` reads the active locale at build time and renders the matching file. If a translation for a given post is missing, the post is hidden from listings in that locale and the slug returns 404.

**Rationale**:

- Long-form content does not fit a key→string catalog.
- Filename-suffix convention is a well-known Astro/Markdown pattern and keeps each translation reviewable as a complete document.
- Hiding untranslated posts is cleaner than mixing locales on a listing.

**Alternatives considered**:

- Single file with locale fields in frontmatter — Rejected. Inflates files, complicates Markdown processing, and authors prefer reviewing one language at a time.
- Auto-translate via API at build — Rejected. Quality unacceptable for a public CV.

---

## Open Questions (none blocking)

All questions raised by Technical Context have been resolved by the decisions above. Items that remain are deferred and explicitly out of scope for v1:

- RTL language support (Arabic, Hebrew). Not in scope; revisit if a future locale requires it.
- URL-based locale routing (`/en/...`). Not in scope; the catalog model is forward-compatible if added later.
- Pluralization rules beyond simple `{count}` interpolation. Defer until a locale needs it; can swap to `Intl.PluralRules` without changing catalog format.
