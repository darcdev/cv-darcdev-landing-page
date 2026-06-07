import { defaultLocale, resolveLocale, type LocaleCode } from '../i18n/config';

export interface ProfileShared {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  years: number;
  productionProjects: number;
  proceduresImplemented: number;
  aiSolutionsInProduction: number;
  available: boolean;
}

export interface ProfileTranslated {
  role: string;
  focus: string;
  location: string;
  bio: string;
  shortBio: string;
}

export interface Profile extends ProfileShared, ProfileTranslated {}

export const PROFILE_SHARED: ProfileShared = {
  name: 'Diego Andrés Cabrera Rojas',
  shortName: 'Diego Cabrera',
  email: 'diegoandresrojas2000@gmail.com',
  phone: '+57 320 418 0598',
  linkedin: 'linkedin.com/in/diego-andres-rojas',
  github: 'github.com/darcdev',
  years: 7,
  productionProjects: 20,
  proceduresImplemented: 27,
  aiSolutionsInProduction: 3,
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

export function getProfile(locale: string = defaultLocale): Profile {
  const code = resolveLocale(locale);
  return { ...PROFILE_SHARED, ...PROFILE_BY_LOCALE[code] };
}

export const PROFILE: Profile = getProfile(defaultLocale);
