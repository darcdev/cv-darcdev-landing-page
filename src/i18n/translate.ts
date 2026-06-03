/**
 * Translation helper. Pure JSON-catalog merge — no data dependency.
 *
 * Catalogs live under ./locales/<code>.json and are imported statically so
 * tree-shaking + SSG inlining work as expected. Adding a new locale = adding
 * one file here and one entry in ./config.ts.
 *
 * t(key, params?, locale?) resolves a key for `locale`, falling back to the
 * default locale when missing, then to the key itself.
 */

import {
  defaultLocale,
  resolveLocale,
  supportedCodes,
  type LocaleCode,
} from './config';
import esCatalog from './locales/es.json';
import enCatalog from './locales/en.json';

type Catalog = Record<string, string>;

const baseCatalogs: Record<LocaleCode, Catalog> = {
  es: esCatalog as Catalog,
  en: enCatalog as Catalog,
};

const catalogs: Record<LocaleCode, Catalog> = Object.fromEntries(
  supportedCodes.map((code) => [code, baseCatalogs[code] ?? {}]),
) as Record<LocaleCode, Catalog>;

/**
 * Resolve a translation key for a specific locale.
 *
 * - If the key is missing in the requested locale, falls back to defaultLocale.
 * - If still missing, returns the key itself and emits a console warning.
 * - {token} placeholders inside the value are replaced from the params map.
 *   Unknown placeholders are left in place (with a dev warning).
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
  locale: string = defaultLocale,
): string {
  const code = resolveLocale(locale);
  const catalog = catalogs[code] ?? {};
  let value = catalog[key];

  if (value === undefined && code !== defaultLocale) {
    value = catalogs[defaultLocale]?.[key];
  }

  if (value === undefined) {
    if (typeof console !== 'undefined') {
      console.warn(`[i18n] Missing translation key: "${key}"`);
    }
    return key;
  }

  if (params) {
    value = value.replace(/\{(\w+)\}/g, (match, token: string) => {
      if (token in params) {
        return String(params[token]);
      }
      if (typeof console !== 'undefined') {
        console.warn(
          `[i18n] Unknown placeholder "${token}" in key "${key}"`,
        );
      }
      return match;
    });
  }

  return value;
}

/** Returns the parsed catalog for a given locale code. */
export function getCatalog(locale: string): Catalog {
  return catalogs[resolveLocale(locale)] ?? {};
}

/** Returns all catalogs keyed by locale code. */
export function getAllCatalogs(): Record<LocaleCode, Catalog> {
  return { ...catalogs };
}
