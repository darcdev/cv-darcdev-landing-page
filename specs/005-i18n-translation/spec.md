# Feature Specification: Multi-Language Translation (i18n)

**Feature Branch**: `005-i18n-translation`

**Created**: 2026-06-02

**Status**: Draft

**Input**: User description: "please i need that feature translate spanish-english works, that if in some time i implement new language it works, i need to translate all text of page"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch entire page between Spanish and English (Priority: P1)

A visitor lands on the CV landing page in their default language (Spanish). They want to read the same content in English. They click a clearly visible language toggle/switcher and **every visible text element on the page** updates to English instantly — navigation, hero, about, experience, projects, skills, contact, footer, badges, search placeholders, button labels, ARIA labels and any other text. When they switch back to Spanish, the same happens in reverse.

**Why this priority**: This is the core value of the feature. Without it the feature does not exist. The user explicitly asked for "translate all text of page" between Spanish and English.

**Independent Test**: Open the page, verify it loads in Spanish, click the language switcher to English, walk through every section and confirm there is no Spanish text remaining (including ARIA labels, alt text, placeholders, and button labels). Switch back to Spanish, confirm full reversal.

**Acceptance Scenarios**:

1. **Given** the page is loaded in Spanish, **When** the user activates the language switcher and selects English, **Then** every text node visible on the page (including navigation, headings, paragraphs, buttons, badges, placeholders, ARIA labels, and metadata such as `<title>` and `lang` attribute) is rendered in English.
2. **Given** the page is loaded in English, **When** the user selects Spanish, **Then** every text node returns to its Spanish equivalent without any English remnants.
3. **Given** the user has selected a language, **When** they reload the page or navigate away and return, **Then** their previously selected language is preserved and applied automatically.
4. **Given** a first-time visitor whose browser preferred language is English, **When** they open the page, **Then** the page loads in English by default; if their browser preferred language is Spanish or any other unsupported language, **Then** the page loads in Spanish (the default).

---

### User Story 2 - Add a new language without code rewrite (Priority: P2)

A maintainer wants to add a third language (e.g. Portuguese) some time after launch. They should be able to add the new language by adding **a single new translation file/resource** and registering it in a central language list, without having to modify component logic, hardcoded strings, or duplicate templates.

**Why this priority**: The user explicitly requested "if in some time I implement new language it works". This is an extensibility requirement — not needed on day one, but the architecture must support it from day one.

**Independent Test**: After the feature ships, a developer follows a documented quickstart: creates `src/i18n/locales/pt.json` (or equivalent) with translated keys, registers `pt` in the supported-languages config, rebuilds, and verifies the new language appears in the switcher and renders correctly across all sections — with zero changes to component files.

**Acceptance Scenarios**:

1. **Given** the project ships with `es` and `en` locales, **When** a maintainer adds a new locale file with all required keys and registers the locale code, **Then** the new language appears in the language switcher and renders the page correctly without modifying any component.
2. **Given** a new locale file is missing one or more keys, **When** the page renders in that locale, **Then** the missing keys fall back to the default language (Spanish) and a clear warning is logged at build/dev time identifying the missing keys.

---

### User Story 3 - Discover and switch language easily on any device (Priority: P2)

A visitor on either desktop or mobile must be able to find the language switcher within seconds of arriving on the page, understand what it does, and operate it with keyboard, mouse, or touch.

**Why this priority**: A translation system that users cannot find provides zero value. This depends on P1 but is a separate UX concern that must be tested independently.

**Independent Test**: First-time users (no prior context) are asked to "switch the page to English" and complete the action in under 10 seconds on both mobile and desktop, using keyboard-only as well as pointer/touch.

**Acceptance Scenarios**:

1. **Given** the page loads on desktop, **When** the user looks at the navigation area, **Then** a language switcher with the current language clearly indicated is visible without scrolling.
2. **Given** the page loads on mobile, **When** the user looks at the header area or opens the mobile menu, **Then** the language switcher is reachable with a touch target of at least 44×44 px.
3. **Given** the user is keyboard-navigating, **When** they tab to the language switcher and press Enter/Space, **Then** they can change the language without using a mouse, and focus is preserved or restored to a sensible location after the change.

---

### Edge Cases

- The page is loaded with a stored language preference for a locale that is no longer supported → fall back to the default language (Spanish) and clear/update the stored preference.
- A translation key is missing in the active locale → render the key in the default language (Spanish) instead of showing a raw key, broken UI, or empty content; log a warning during development/build.
- The user's browser blocks `localStorage` (private mode) → the language still switches for the current session; the preference simply is not persisted.
- The page is shared via a link that includes a language indicator (URL segment or query, if used) → the linked language is honored on first load, overriding browser preference but not overriding an existing explicit user choice from a previous visit on the same device (last explicit user choice wins).
- A text contains dynamic data (dates, numbers, names) → translations support placeholders/interpolation so dynamic values are inserted in the right grammatical position per language.
- SEO crawlers and screen readers receive language-correct content: the document `lang` attribute, `<title>`, and meta description must reflect the active language.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the entire CV landing page in either Spanish (default) or English, covering 100% of user-visible text including navigation, section headings, body copy, badges, buttons, links, placeholders, ARIA labels, alt text, `<title>`, and meta description.
- **FR-002**: System MUST provide a visible, accessible language switcher on every page/section, operable by mouse, touch, and keyboard, with the currently active language clearly indicated.
- **FR-003**: System MUST persist the user's last selected language across page reloads and revisits on the same device.
- **FR-004**: On a first visit with no stored preference, system MUST select the initial language using the user's browser preferred language when it matches a supported locale; otherwise it MUST fall back to Spanish.
- **FR-005**: System MUST update the document `lang` attribute to match the active language whenever the language changes, so assistive technologies and search engines receive correct language metadata.
- **FR-006**: System MUST allow adding new languages by adding a single locale resource file plus registering its language code in one central configuration, with no changes required to individual UI components.
- **FR-007**: System MUST treat translation strings as keyed entries; UI components MUST reference keys, never hardcoded human-readable strings, so all text is translatable by definition.
- **FR-008**: System MUST support placeholder interpolation inside translated strings (e.g. inserting a name, count, or date) so translations remain grammatically correct per language.
- **FR-009**: System MUST fall back to the default language (Spanish) for any key that is missing or empty in the active locale, and MUST emit a clear warning identifying the missing key during development or build.
- **FR-010**: System MUST switch languages without a full page reload from the user's perspective (no flash of untranslated content, no loss of scroll position, no broken interactive state).
- **FR-011**: System MUST preserve all existing visual design, layout, and accessibility behavior in every supported language; switching language MUST NOT break responsive layout, dark mode contrast, or component styling.
- **FR-012**: System MUST ship with two locales on day one: Spanish (`es`, default) and English (`en`), each containing translations for every translatable key used in the project.

### Key Entities *(include if feature involves data)*

- **Locale**: A registered language supported by the page. Attributes: language code (e.g. `es`, `en`), human-readable display label (e.g. "Español", "English"), default flag (only one locale is the fallback default).
- **Translation Catalog**: The set of key→string entries for a single locale. Each entry has a stable key (used by components), a translated string, and may include placeholder tokens for interpolation.
- **Translation Key**: A stable identifier referenced by a UI component to look up the right string in the active locale.
- **User Language Preference**: The locale code the visitor last explicitly selected, persisted on their device.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of user-visible text on the page (including navigation, all sections, badges, placeholders, ARIA labels, alt text, page title, and meta description) renders correctly in both Spanish and English on launch — verified by a manual content audit checklist that lists every translatable surface.
- **SC-002**: A user can switch the entire page from Spanish to English (or vice versa) in under 3 seconds from the moment they click the switcher, with no visible flash of untranslated content.
- **SC-003**: A maintainer can add a brand-new third language end-to-end (create locale file, register it, see it in the switcher rendering correctly) in under 30 minutes by following the documented quickstart, with zero edits to component source files.
- **SC-004**: After selecting a language, the choice is preserved on 100% of subsequent visits to the same page on the same device (until the user changes it again or clears their browser storage).
- **SC-005**: First-time users in usability testing locate and operate the language switcher in under 10 seconds on both desktop and mobile, including keyboard-only users.
- **SC-006**: No translation key referenced by the codebase is missing from any shipped locale; this is verified automatically (build-time check or test) and the build/test fails if a key is missing.

## Assumptions

- The project ships with two languages on day one: Spanish (default) and English. Additional languages are an extensibility requirement, not a launch requirement.
- Spanish is the default/fallback language because the existing site content is authored in Spanish.
- Language preference is persisted client-side per device (e.g. browser storage); no server-side user accounts are involved.
- All current text on the page is authored content (no large amounts of dynamic user-generated content), so a static key→string catalog model is sufficient.
- Visual design, layout, and dark-mode/responsive behavior already specified in prior features (`001-static-nav`, `002-dark-mode-contrast`, `003-standard-device-breakpoints`, `004-mobile-first-responsive`) must continue to work unchanged in every language.
- Translations are produced by the maintainer (or a translator hired by them); automatic machine translation is out of scope.
- URL-based locale routing (e.g. `/en/...` paths) is **not required** for v1; an in-page switcher with persisted preference satisfies the user's stated need. It can be added later as an extension without breaking the catalog model.
- Right-to-left languages (Arabic, Hebrew) are **not** in scope for v1; the architecture should not actively prevent them, but no RTL-specific styling is delivered now.
