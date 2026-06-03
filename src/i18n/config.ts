/**
 * i18n configuration: registry of supported locales for the CV landing page.
 *
 * Adding a new language is one entry here + one JSON file under ./locales/.
 * Exactly one entry MUST have `default: true`; that locale is rendered by Astro
 * at build time and is the fallback when a key is missing in another locale.
 */

export type Locale = {
  /** ISO 639-1 lowercase code, e.g. "es", "en", "pt". Must match /^[a-z]{2}$/. */
  code: string;
  /** Human-readable label shown in the language switcher (in its own language). */
  label: string;
  /** Exactly one locale in the registry MUST have default: true. */
  default?: boolean;
};

/** Authoritative list of supported locales. */
export const locales: ReadonlyArray<Locale> = [
  { code: 'es', label: 'Español', default: true },
  { code: 'en', label: 'English' },
] as const;

/** Code of the default / fallback locale. Always present in supportedCodes. */
export const defaultLocale: string =
  locales.find((l) => l.default)?.code ?? 'es';

/** Convenience: every supported locale code, derived from `locales`. */
export const supportedCodes: ReadonlyArray<string> = locales.map((l) => l.code);
