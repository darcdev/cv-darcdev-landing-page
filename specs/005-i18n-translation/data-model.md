# Phase 1 Data Model: Multi-Language Translation (i18n)

**Date**: 2026-06-02
**Feature**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

This feature has no database. "Data model" here describes the in-project data structures (TypeScript types, JSON shapes, and runtime state) that implement the catalogs, locales, and user preference described in the spec.

---

## 1. Locale (configuration entity)

A registered language supported by the site.

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `code` | `string` | yes | ISO 639-1 language code (e.g. `es`, `en`, `pt`). Lowercase. | Must match `/^[a-z]{2}$/`. Must be unique within the supported-locales list. |
| `label` | `string` | yes | Human-readable name shown in the switcher (in its own language). E.g. `"Español"`, `"English"`, `"Português"`. | Non-empty, ≤ 30 chars. |
| `default` | `boolean` | no (default `false`) | Whether this locale is the fallback / SSG-rendered default. | Exactly **one** locale in the registry MUST have `default: true`. |

**Source of truth**: `src/i18n/config.ts`.

```ts
// src/i18n/config.ts
export type Locale = { code: string; label: string; default?: boolean };

export const locales: ReadonlyArray<Locale> = [
  { code: 'es', label: 'Español', default: true },
  { code: 'en', label: 'English' },
] as const;

export const defaultLocale: string =
  locales.find(l => l.default)?.code ?? 'es';

export const supportedCodes: ReadonlyArray<string> =
  locales.map(l => l.code);
```

**Invariants**:

- The set of `code` values is the authoritative supported-locales list. The build-time checker enforces that every locale in this list has a corresponding `src/i18n/locales/<code>.json` file.
- Removing a locale from this list automatically hides it from the switcher and clears any stored user preference referencing it (handled at runtime).

---

## 2. Translation Catalog (per-locale resource)

A flat key→string map for one locale.

**File**: `src/i18n/locales/<code>.json`

**Shape** (validated by `contracts/locale-catalog.schema.json`):

```json
{
  "nav.home": "Inicio",
  "nav.experience": "Experiencia",
  "hero.greeting": "Hola, soy {name}",
  "ask.placeholder": "Preguntá lo que quieras…",
  "footer.rights": "Todos los derechos reservados"
}
```

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| key | `string` | yes | Stable identifier referenced by `t()` calls and `data-i18n` attributes. Dotted form `<section>.<element>` (e.g. `nav.home`). | Must match `/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/`. Unique per file (JSON enforces). |
| value | `string` | yes | The translated text. May contain `{name}`-style placeholders. | Non-empty. Placeholder set must match the same key in the default locale. |

**Invariants**:

- The set of keys MUST be identical across all locale files (build-time check fails the build otherwise).
- The default-locale file (`es.json`) is the source of truth for which keys exist; new keys are added there first.

**State transitions**: a catalog is immutable at runtime. Catalogs are loaded once when the page loads (embedded in HTML via `<script type="application/json">`) and never mutated thereafter.

---

## 3. Translation Key (referenced symbol)

A logical reference that connects a UI element to a catalog entry.

**Type**: `string` (validated against the regex above).

**Where used**:

- In `.astro` and `.tsx` files via `t('nav.home')` (server-side, build-time substitution).
- In rendered HTML via `data-i18n="nav.home"` (client-side swap on toggle).

**Naming convention**:

| Pattern | Use for |
|---------|---------|
| `<section>.<element>` | Visible text under a section (`hero.title`, `experience.heading`). |
| `<section>.<element>.aria` | ARIA label for that element. |
| `<section>.<element>.placeholder` | Input placeholder. |
| `<section>.<element>.alt` | Image alt text. |
| `meta.title` / `meta.description` | Document `<title>` and meta description. |

**Interpolation tokens**: `{tokenName}` — alphanumeric + underscore. Replaced at substitution time by the params object passed to `t()`.

---

## 4. User Language Preference (runtime state)

The currently-active locale on the visitor's device.

**Persistence**: `localStorage` key `cv.lang`. Value is a locale `code`.

**Lifecycle**:

| Event | State Change |
|-------|--------------|
| First visit (no stored preference) | Resolve from `navigator.languages` ∩ `supportedCodes`. If empty, use `defaultLocale`. **Do not write to storage.** |
| User clicks a language in the switcher | Apply locale to the DOM. **Write `cv.lang = <code>` to storage.** |
| Page revisit with valid stored preference | Apply stored locale. |
| Page revisit with stored preference whose code is no longer in `supportedCodes` | Remove `cv.lang` from storage. Resolve as if first visit. |
| `localStorage` access throws (private browsing, blocked) | Resolve current session as first visit. Switcher still works for the session; no persistence. |

**Schema** (TypeScript):

```ts
type LangPreference = string; // a member of supportedCodes

function readPreference(): LangPreference | null;
function writePreference(code: LangPreference): void;
function clearPreference(): void;
```

---

## 5. Active Locale (in-memory runtime state)

The locale currently applied to the DOM.

**Type**: `string` (a member of `supportedCodes`).

**Source**: derived once on page load by the resolution algorithm in §4, then mutated only by user action through the switcher.

**Side effects on change**:

1. Update `document.documentElement.lang` to the new code.
2. For every element matching `[data-i18n]`, replace `textContent` with the catalog value (or default-locale fallback if missing).
3. For every element matching `[data-i18n-attr]`, parse the JSON map and set each attribute to the catalog value.
4. For every element matching `[data-i18n-html]`, replace `innerHTML` with the catalog value (only used for catalog entries that are themselves trusted, controlled HTML — not user input).
5. Update `aria-pressed` on the switcher buttons.
6. Update `<title>` and the meta description from `meta.title` / `meta.description` keys.

---

## 6. Relationships

```text
Locale (config) ──1:1── Translation Catalog (file)
                          │
                          │ contains many
                          ▼
                    Translation Key ──referenced by── UI element (.astro / .tsx / HTML)

User Language Preference ──selects── Active Locale ──reads── Translation Catalog
```

**Cardinality summary**:

- 1 site → N Locales (≥ 2 on launch).
- 1 Locale → 1 Catalog file.
- 1 Catalog → N Translation Keys (~150–250 expected).
- 1 Visitor → 0 or 1 stored preference.

---

## 7. Validation Rules (consolidated)

| Rule | Where enforced |
|------|----------------|
| `code` matches `/^[a-z]{2}$/`. | TypeScript type + `scripts/check-i18n.ts`. |
| Exactly one locale has `default: true`. | `scripts/check-i18n.ts` (build fails otherwise). |
| Every locale file's key set equals every other locale's key set. | `scripts/check-i18n.ts`. |
| Every key referenced by `t('…')` or `data-i18n="…"` exists in every locale. | `scripts/check-i18n.ts`. |
| Placeholder tokens (`{name}`) match across locales for the same key. | `scripts/check-i18n.ts`. |
| Stored preference whose code is unknown is purged on next load. | `src/i18n/client.ts` runtime. |
| Missing key at runtime falls back to default locale and logs a warning (dev only). | `src/i18n/client.ts` and `src/i18n/translate.ts`. |
