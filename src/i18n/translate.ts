/**
 * Server-side / build-time translation helper used inside .astro files.
 *
 * Catalogs are bundled at build time via static JSON imports. Calling t(key)
 * inside an Astro template runs at SSG time and inlines the default-locale
 * string into the generated HTML, so the page is fully readable with JS off.
 *
 * The browser runtime in ./client.ts handles locale switching at runtime by
 * walking [data-i18n] markers and swapping textContent — t() is not called on
 * the client.
 */

import { defaultLocale, supportedCodes } from './config';
import esCatalog from './locales/es.json';
import enCatalog from './locales/en.json';
import { EXPERIENCE } from '../data/experience';
import { SKILLS } from '../data/skills';
import { localizedExperience, localizedSkills } from '../data/i18n';

type Catalog = Record<string, string>;

/**
 * Build a per-locale catalog by merging the static UI strings (from
 * locales/<code>.json) with derived data keys (experience.N.role, skills.N.group, etc.)
 * generated from the locale-aware data accessors. This keeps the data files
 * as the source of truth without duplicating their content into JSON.
 */
function buildDataKeys(locale: string): Catalog {
  const out: Catalog = {};

  const exp = locale === defaultLocale ? EXPERIENCE : localizedExperience(locale);
  exp.forEach((e, i) => {
    out[`experience.${i}.role`] = e.role;
    out[`experience.${i}.period`] = e.period;
    out[`experience.${i}.location`] = e.location;
    e.highlights.forEach((h, hi) => {
      out[`experience.${i}.h.${hi}`] = h;
    });
  });

  const skills = locale === defaultLocale ? SKILLS : localizedSkills(locale);
  skills.forEach((s, i) => {
    out[`skills.${i}.group`] = s.group;
  });

  return out;
}

const baseCatalogs: Record<string, Catalog> = {
  es: esCatalog as Catalog,
  en: enCatalog as Catalog,
};

const catalogs: Record<string, Catalog> = Object.fromEntries(
  supportedCodes.map((code) => [
    code,
    { ...(baseCatalogs[code] ?? {}), ...buildDataKeys(code) },
  ]),
);

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
  const code = supportedCodes.includes(locale) ? locale : defaultLocale;
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
  return catalogs[locale] ?? {};
}

/** Returns all catalogs keyed by locale code. Used by BaseLayout to embed them. */
export function getAllCatalogs(): Record<string, Catalog> {
  return { ...catalogs };
}
