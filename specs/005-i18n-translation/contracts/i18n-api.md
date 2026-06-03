# i18n API Contract

**Date**: 2026-06-02
**Feature**: [spec.md](../spec.md)

This document defines the public surface of the `src/i18n/` module: the symbols other parts of the codebase import. These signatures are the **contract**; their internal implementation can change as long as these signatures and behaviors are preserved.

---

## Module: `src/i18n/config.ts`

```ts
export type Locale = {
  /** ISO 639-1 lowercase code, e.g. "es", "en", "pt". Must match /^[a-z]{2}$/. */
  code: string;
  /** Human-readable label shown in the switcher (in its own language). */
  label: string;
  /** Exactly one locale in the registry MUST have default: true. */
  default?: boolean;
};

/** Authoritative list of supported locales. Adding a language = adding an entry here. */
export const locales: ReadonlyArray<Locale>;

/** The fallback locale code used when a translation is missing or no preference resolves. */
export const defaultLocale: string;

/** Convenience: locales.map(l => l.code). */
export const supportedCodes: ReadonlyArray<string>;
```

**Contract guarantees**:

- `locales` is immutable at runtime.
- `defaultLocale` is always present in `supportedCodes`.
- Exactly one entry has `default: true`.

---

## Module: `src/i18n/translate.ts` (server / build-time helper)

```ts
/**
 * Resolve a translation key for a specific locale.
 * Used at SSG time inside .astro components to render the default-locale text into HTML.
 *
 * @param key   Dotted translation key (e.g. "nav.home").
 * @param params Optional map of placeholder values for {token} substitution.
 * @param locale Locale code. Defaults to defaultLocale.
 * @returns The translated string. If the key is missing in the requested locale, falls back to defaultLocale. If still missing, returns the key itself and emits a console warning.
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  locale?: string
): string;

/**
 * Returns the parsed catalog for a given locale code.
 * Used by BaseLayout.astro to embed all catalogs as JSON.
 */
export function getCatalog(locale: string): Record<string, string>;

/**
 * Returns all catalogs keyed by locale code. Convenience for embedding the full set.
 */
export function getAllCatalogs(): Record<string, Record<string, string>>;
```

**Contract guarantees**:

- `t()` is synchronous and side-effect free.
- Placeholder substitution: `t('hero.greeting', { name: 'Ada' })` replaces `{name}` with `'Ada'`. Unknown placeholders are left unsubstituted (and a dev-time warning is logged).
- HTML escaping is **not** performed by `t()` — Astro's templating handles it for `{t(...)}` expressions. For HTML-bearing entries, callers use `set:html`.

---

## Module: `src/i18n/client.ts` (browser runtime)

```ts
/**
 * Initialize the i18n client runtime. Called once from BaseLayout.astro via an inline
 * <script type="module"> tag at the end of <body>.
 *
 * - Reads embedded catalogs from <script id="i18n-catalogs" type="application/json">.
 * - Resolves the active locale (stored preference > browser language > default).
 * - Applies the active locale to the DOM if it differs from the SSG-rendered default.
 * - Updates document.documentElement.lang.
 */
export function init(): void;

/**
 * Switch the active locale. Called by the LanguageSwitcher island.
 *
 * - Validates code is in supportedCodes; no-op otherwise.
 * - Persists the choice in localStorage.cv.lang.
 * - Updates document.documentElement.lang.
 * - Walks [data-i18n], [data-i18n-attr], [data-i18n-html] and updates content.
 * - Updates <title> and meta[name="description"] from meta.title / meta.description.
 * - Dispatches a "locale:change" CustomEvent on document with detail { code }.
 */
export function setLocale(code: string): void;

/** Returns the currently active locale code. */
export function getLocale(): string;

/** Subscribe to locale changes. Returns an unsubscribe function. */
export function onLocaleChange(handler: (code: string) => void): () => void;
```

**DOM contract** (the markers the runtime expects):

| Marker | Effect |
|--------|--------|
| `<element data-i18n="key">…</element>` | `textContent` replaced with catalog\[active\]\[key\] (or fallback). |
| `<element data-i18n-attr='{"placeholder":"k1","aria-label":"k2"}'>` | Each listed attribute set to catalog\[active\]\[k\]. JSON value MUST be valid. |
| `<element data-i18n-html="key">…</element>` | `innerHTML` replaced with catalog\[active\]\[key\]. Use only for trusted catalog HTML. |

**CustomEvent**:

- Name: `locale:change`
- Target: `document`
- Detail: `{ code: string }`
- Fired after DOM updates complete, so subscribers can read final state.

---

## Component: `src/components/islands/LanguageSwitcher.tsx`

```ts
type Props = {
  /** Optional className to merge with the root element's classes. */
  className?: string;
};

export default function LanguageSwitcher(props: Props): JSX.Element;
```

**Behavior contract**:

- Renders a `<div role="group" aria-label="Language">` containing one `<button>` per supported locale.
- Each button shows the locale code in uppercase (e.g. `ES`, `EN`).
- The active locale's button has `aria-pressed="true"`; others `false`.
- On click, calls `setLocale(code)` from `src/i18n/client.ts`.
- Subscribes to `onLocaleChange` to keep `aria-pressed` in sync if the locale changes by other means.
- Hydrated with `client:idle`.
- Touch target ≥ 44×44 px enforced by the component's CSS.

---

## Build script: `scripts/check-i18n.ts`

```ts
/**
 * Validates the i18n configuration and catalogs. Run as part of `npm run build`.
 * Exit code:
 *   0 — pass (warnings allowed, printed to stderr)
 *   1 — fail (one or more errors below)
 */

// Errors (build-fail):
//   E_MISSING_CATALOG     — supportedCodes contains a code without a JSON file
//   E_MULTIPLE_DEFAULTS   — config has more than one locale with default: true
//   E_NO_DEFAULT          — config has no locale with default: true
//   E_KEY_MISMATCH        — one or more locales are missing keys present in the default
//   E_PLACEHOLDER_MISMATCH — same key has a different placeholder set across locales
//   E_INVALID_KEY         — a key does not match the naming regex
//   E_REFERENCED_NOT_DEFINED — a key referenced by t('…') or data-i18n="…" is not in the default catalog

// Warnings (do not fail):
//   W_ORPHAN_KEY          — a key exists in catalogs but is never referenced in code
//   W_EMPTY_VALUE         — a key has an empty string value
```

**CLI**:

```bash
npx tsx scripts/check-i18n.ts
# or, when wired into npm script:
npm run i18n:check
```

---

## Stability & versioning

- This contract is **internal** (consumed only by other files in this repo). Breaking changes require updating all callers in the same PR.
- The locale JSON schema (`locale-catalog.schema.json`) is **external** in spirit — translators or external tooling may rely on its shape; non-additive changes to it would constitute a breaking change to the i18n feature.
