/**
 * i18n configuration: registry of supported locales for the CV landing page.
 *
 * Adding a new language is one entry here + one JSON file under ./locales/ +
 * one entry in each per-locale map under src/data/{profile,experience,skills,projects}.ts.
 * TypeScript will fail the build if any data map is missing the new locale.
 *
 * Exactly one entry MUST have `default: true`; that locale is the SSG fallback
 * and the value used when a key/entry is missing in another locale.
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
export const locales = [
  { code: 'es', label: 'Español', default: true },
  { code: 'en', label: 'English' },
] as const satisfies ReadonlyArray<Locale>;

/** Literal-union of every supported locale code, derived from `locales`. */
export type LocaleCode = (typeof locales)[number]['code'];

/** Code of the default / fallback locale. Always present in supportedCodes. */
export const defaultLocale: LocaleCode =
  (locales.find((l) => 'default' in l && l.default)?.code ?? 'es') as LocaleCode;

/** Convenience: every supported locale code, derived from `locales`. */
export const supportedCodes: ReadonlyArray<LocaleCode> = locales.map(
  (l) => l.code,
);

/** Type guard: narrows an arbitrary string to a known LocaleCode. */
export function isLocaleCode(value: string): value is LocaleCode {
  return (supportedCodes as ReadonlyArray<string>).includes(value);
}

/** Returns the input if it is a known LocaleCode, otherwise the default. */
export function resolveLocale(value: string | undefined): LocaleCode {
  return value && isLocaleCode(value) ? value : defaultLocale;
}
