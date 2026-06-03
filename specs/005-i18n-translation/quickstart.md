# Quickstart: Multi-Language Translation (i18n)

**Date**: 2026-06-02
**Feature**: [spec.md](./spec.md)

This document is the verification + maintenance guide for the i18n feature. It has three parts:

1. **Verify the feature works** (manual smoke test after implementation).
2. **Audit content coverage** (the 100%-translated checklist).
3. **Add a new language** (the extensibility procedure that satisfies SC-003).

---

## Part 1 — Verify the feature works

Run these checks after implementation, before merging.

### Prerequisites

```bash
npm install
npm run build       # Must succeed; this also runs the i18n parity check.
npm run dev
```

Open `http://localhost:4321` (or whatever port `astro dev` reports).

### 1.1 Default-locale render (no JS, no preference)

1. Disable JavaScript in DevTools (Settings → Debugger → Disable JavaScript).
2. Hard-reload the page.
3. **Expected**: Page renders fully in Spanish. All sections readable. `<html lang>` is `es`.

### 1.2 Browser-language detection on first visit

1. Re-enable JavaScript.
2. Open DevTools → Application → Storage → clear `localStorage` for the site.
3. In a Chromium-based browser, set the preferred language to English (Settings → Languages, move English to top, restart the browser tab).
4. Hard-reload.
5. **Expected**: Page renders in English. `<html lang>` is `en`. `localStorage.cv.lang` is **not** set (auto-detected, not persisted).

### 1.3 Manual switch + persistence

1. With browser language reset to Spanish, clear `localStorage`, reload.
2. Page loads in Spanish. Click `EN` in the language switcher.
3. **Expected**: Entire page text becomes English in under 300 ms. No layout shift, no scroll-position loss. `<html lang>` is `en`. `localStorage.cv.lang === 'en'`.
4. Reload the page.
5. **Expected**: Page loads in English (preference persisted).
6. Click `ES`. Reload.
7. **Expected**: Page loads in Spanish.

### 1.4 Stored-but-unsupported preference

1. Open DevTools console: `localStorage.setItem('cv.lang', 'fr')`. Reload.
2. **Expected**: Page falls back to default (Spanish). `cv.lang` has been removed from `localStorage`.

### 1.5 Keyboard operability

1. Tab through the navigation until focus reaches the language switcher.
2. **Expected**: Visible focus ring on the focused button. Press `Enter` or `Space` to switch.
3. **Expected**: Locale changes; focus remains on the switcher (does not jump to body).

### 1.6 Mobile touch target

1. Open DevTools device toolbar, select an iPhone preset.
2. **Expected**: The language switcher buttons are visible in the header area or mobile menu, each at least 44×44 px (verified by hovering: DevTools highlights show ≥ 44 px in both dimensions).

### 1.7 Edge case — placeholder interpolation

If any catalog entry contains `{name}`-style placeholders, manually verify in both locales that the value is rendered correctly with substitution (e.g. `Hello, Ada` / `Hola, Ada`).

### 1.8 Build-time validation

1. Open `src/i18n/locales/en.json` and **delete one key** that is referenced in the codebase. Save.
2. Run `npm run build`.
3. **Expected**: Build fails with error code `E_KEY_MISMATCH` (or `E_REFERENCED_NOT_DEFINED`) and lists the missing key.
4. Restore the key. Build succeeds.

### 1.9 Lighthouse regression

Run Lighthouse on the production preview (`npm run preview`) for both locales.

- **Expected**: Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100. No regression vs. pre-feature baseline.

---

## Part 2 — Content audit (100% coverage check)

Walk every section listed below in the **active locale**. Every text item below MUST be translated. If any item still shows the source language, the corresponding key is missing from the catalog or the element is missing a `data-i18n`/`t()` reference.

### Document-level

- `<title>` (browser tab)
- `<meta name="description">`
- `<html lang>`
- Open Graph / social meta titles and descriptions (if any)

### Navigation (organism `Nav`)

- All nav link labels
- Theme toggle ARIA label
- Language switcher ARIA group label
- Mobile menu toggle ARIA label
- Mobile menu open/closed state announcements (if any)

### Hero section

- Greeting / headline
- Subheadline
- Status pill text (e.g. "Available for work")
- Primary CTA button label + ARIA label
- Secondary CTA / link labels

### Ask / search section

- Section heading
- Input placeholder
- Input ARIA label
- Submit button label + ARIA label
- Help / hint text
- Empty / loading states

### About

- Section heading
- All paragraphs

### Experience

- Section heading
- Each role's title, company, dates label, description
- "Currently" / "Present" badges

### Projects

- Section heading
- Each project's title, description, tag chips, links labels (e.g. "Live demo", "Code")

### Skills

- Section heading
- Category headings
- Skill chip labels (only if skill names are translated; technology names typically stay)

### Posts / Blog (if visible on landing)

- Section heading
- Each post's title and summary

### Footer

- All copy (rights, location, social link ARIA labels)

### Images

- Every `<img alt>`
- Every `<svg aria-label>` or `<title>` element inside SVGs that conveys meaning

### Form errors / system messages (if any)

- All user-facing strings

If any item remains untranslated after a switch, **fail the audit** and add the missing key.

---

## Part 3 — Add a new language

This is the extensibility test. The whole flow must complete in under 30 minutes per success criterion SC-003.

### Step 1 — Create the locale catalog

Copy the default-locale file as a starting point:

```bash
cp src/i18n/locales/es.json src/i18n/locales/<code>.json
```

Replace `<code>` with the new ISO 639-1 code (e.g. `pt` for Portuguese).

Translate every value. **Do not change keys.** Preserve every `{token}` placeholder exactly as in the source.

### Step 2 — Register the locale

Edit `src/i18n/config.ts` and add the new entry to `locales`:

```ts
export const locales: ReadonlyArray<Locale> = [
  { code: 'es', label: 'Español', default: true },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },   // ← new
] as const;
```

### Step 3 — Build & verify

```bash
npm run build
```

If the build fails:

- `E_KEY_MISMATCH` → the new file is missing keys present in `es.json`. The error message lists which.
- `E_PLACEHOLDER_MISMATCH` → a translated value's `{tokens}` differ from the default. Restore them.

When the build passes:

```bash
npm run preview
```

Open the site. The language switcher now has a third button (`PT`). Click it.

### Step 4 — Audit

Run the Part 2 content audit in the new locale.

### Step 5 — Optional — Translate blog posts

For each post in `src/content/posts/`, create a `<slug>.<code>.md` translated copy. Posts without a translation are hidden from listings and return 404 when their slug is requested in the new locale.

### Done

You did not edit any `.astro`, `.tsx`, or `.ts` component file. That is the contract. If you found yourself editing one, the feature has regressed and an issue should be filed.
