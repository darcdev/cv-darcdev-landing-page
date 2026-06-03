/**
 * Profile data, split into shared (locale-agnostic) and translated fields.
 *
 * To add a new locale: extend the registry in src/i18n/config.ts and add an
 * entry to PROFILE_BY_LOCALE — TypeScript's exhaustive Record check will fail
 * the build if you forget.
 */

import { defaultLocale, resolveLocale, type LocaleCode } from '../i18n/config';

/** Locale-agnostic profile fields (contact info, identity, flags). */
export interface ProfileShared {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  years: number;
  available: boolean;
}

/** Per-locale, human-facing profile fields. */
export interface ProfileTranslated {
  role: string;
  focus: string;
  location: string;
  bio: string;
  shortBio: string;
}

/** Resolved profile for a specific locale. */
export interface Profile extends ProfileShared, ProfileTranslated {}

export const PROFILE_SHARED: ProfileShared = {
  name: 'Diego Andrés Cabrera Rojas',
  shortName: 'Diego Cabrera',
  email: 'diegoandresrojas2000@gmail.com',
  phone: '+57 320 418 0598',
  linkedin: 'linkedin.com/in/diego-andres-rojas',
  github: 'github.com/darcdev',
  years: 7,
  available: true,
};

export const PROFILE_BY_LOCALE: Record<LocaleCode, ProfileTranslated> = {
  es: {
    role: 'Tech Lead · Arquitecto de Software',
    focus: 'IA Aplicada al Desarrollo',
    location: 'Bogotá, Colombia',
    bio: 'Tech Lead con más de 7 años construyendo y liderando soluciones full-stack para gobierno y empresa privada. Combino arquitectura, código hands-on y liderazgo transversal — hoy aplicando IA al ciclo de desarrollo: agentes, RAG, MCP y Spec-Driven Development.',
    shortBio: 'Construyo agentes, sistemas RAG y arquitecturas que conectan equipos con IA.',
  },
  en: {
    role: 'Tech Lead · Software Architect',
    focus: 'Applied AI for Software Development',
    location: 'Bogotá, Colombia',
    bio: 'Tech Lead with 7+ years building and leading full-stack solutions for government and private companies. I combine architecture, hands-on coding and cross-team leadership — today applying AI to the development cycle: agents, RAG, MCP and Spec-Driven Development.',
    shortBio: 'I build agents, RAG systems and architectures that connect teams with AI.',
  },
};

/** Resolve the profile for a given locale; falls back to the default locale. */
export function getProfile(locale: string = defaultLocale): Profile {
  const code = resolveLocale(locale);
  return { ...PROFILE_SHARED, ...PROFILE_BY_LOCALE[code] };
}

/**
 * Default-locale profile, kept as a named export for backwards-compatibility
 * with existing imports. New code should prefer `getProfile(locale)`.
 */
export const PROFILE: Profile = getProfile(defaultLocale);
