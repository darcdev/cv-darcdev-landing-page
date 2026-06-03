/**
 * Work experience, split into shared (locale-agnostic) and translated fields.
 *
 * Each entry has a stable `id` so translations are matched by ID, NOT by array
 * position. Reordering EXPERIENCES_SHARED never breaks translations.
 *
 * To add a new locale: extend the registry in src/i18n/config.ts and add a
 * matching object to EXPERIENCES_BY_LOCALE — TypeScript's exhaustive Record
 * check will fail the build if you forget. Within each locale you must provide
 * an entry for every id in EXPERIENCES_SHARED.
 */

import { defaultLocale, resolveLocale, type LocaleCode } from '../i18n/config';

/** Locale-agnostic experience fields (id + employer name). */
export interface ExperienceShared {
  id: string;
  company: string;
}

/** Per-locale, human-facing experience fields. */
export interface ExperienceTranslated {
  role: string;
  location: string;
  period: string;
  highlights: string[];
}

/** Resolved experience entry for a specific locale. */
export interface Experience extends ExperienceShared, ExperienceTranslated {}

/**
 * Stable ordering of experience entries (newest first). The `id` MUST be
 * stable; never rename it once it appears in EXPERIENCES_BY_LOCALE.
 */
export const EXPERIENCES_SHARED: ExperienceShared[] = [
  { id: 'sasoftco-techlead', company: 'SASOFTCO' },
  { id: 'sasoftco-fullstack', company: 'SASOFTCO' },
  { id: 'freelance', company: 'Freelance' },
  { id: 'hewtec', company: 'HEWTEC' },
  { id: 'sc-business', company: 'S&C Business Solutions' },
];

export const EXPERIENCES_BY_LOCALE: Record<
  LocaleCode,
  Record<string, ExperienceTranslated>
> = {
  es: {
    'sasoftco-techlead': {
      role: 'Tech Lead — Desarrollo & Estrategia de IA',
      location: 'Bogotá',
      period: 'Ago 2024 – Presente',
      highlights: [
        'Diseñé un agente RAG en Python (LangChain + Weaviate) para consulta de documentación organizacional en lenguaje natural.',
        'Lidero la adopción de Spec-Driven Development integrando bases de conocimiento con agentes de IA.',
        'Migración del monolito Jackcore a microservicios reutilizables en .NET Core + Spring Boot.',
        'Flujos de IA en pull requests para revisión automática de código y estándares.',
      ],
    },
    'sasoftco-fullstack': {
      role: 'Full Stack Developer',
      location: 'Villavicencio',
      period: 'Mar 2023 – Ago 2024',
      highlights: [
        'Generador dinámico de formularios GovcodePro (Angular + Camunda).',
        'Portal de Trámites Cormacarena y Portal de Trámites Empresariales.',
        'Plataforma de Servicios Ciudadanos alineada a estándares de gobierno.',
      ],
    },
    'freelance': {
      role: 'Full Stack Developer — Independiente',
      location: 'Remoto · Colombia',
      period: 'Ene 2022 – Presente',
      highlights: [
        'Trip Planner IA — rediseño frontend en React (startup adquirida por layla.com).',
        'Landing de Luminara y AlbertCTS construidas con Claude Code, Cursor y Copilot.',
        'MVP móvil B2B en React Native para compra-venta de materiales.',
      ],
    },
    'hewtec': {
      role: 'Backend Developer',
      location: 'Bogotá',
      period: 'May 2021 – Nov 2021',
      highlights: [
        'Mejoras al Wizard de generación de plantillas full-stack (React, Node, Postgres).',
      ],
    },
    'sc-business': {
      role: 'Frontend Developer',
      location: 'Villavicencio',
      period: 'Jun 2018 – Sep 2019',
      highlights: [
        'CMS del C.C. Unicentro Villavicencio (JS, Firebase, Firestore).',
      ],
    },
  },
  en: {
    'sasoftco-techlead': {
      role: 'Tech Lead — Development & AI Strategy',
      location: 'Bogotá',
      period: 'Aug 2024 – Present',
      highlights: [
        'Designed a Python RAG agent (LangChain + Weaviate) for natural-language queries against organizational documentation.',
        'Leading the adoption of Spec-Driven Development by integrating knowledge bases with AI agents.',
        'Migration of the Jackcore monolith to reusable microservices in .NET Core + Spring Boot.',
        'AI-powered pull-request workflows for automated code review and standards enforcement.',
      ],
    },
    'sasoftco-fullstack': {
      role: 'Full Stack Developer',
      location: 'Villavicencio',
      period: 'Mar 2023 – Aug 2024',
      highlights: [
        'GovcodePro dynamic form builder (Angular + Camunda).',
        'Cormacarena Procedures Portal and Business Procedures Portal.',
        'Citizen Services Platform aligned with government standards.',
      ],
    },
    'freelance': {
      role: 'Full Stack Developer — Independent',
      location: 'Remote · Colombia',
      period: 'Jan 2022 – Present',
      highlights: [
        'Trip Planner AI — frontend redesign in React (startup acquired by layla.com).',
        'Luminara and AlbertCTS landing pages built with Claude Code, Cursor and Copilot.',
        'B2B mobile MVP in React Native for materials buy/sell.',
      ],
    },
    'hewtec': {
      role: 'Backend Developer',
      location: 'Bogotá',
      period: 'May 2021 – Nov 2021',
      highlights: [
        'Improvements to the full-stack template generation Wizard (React, Node, Postgres).',
      ],
    },
    'sc-business': {
      role: 'Frontend Developer',
      location: 'Villavicencio',
      period: 'Jun 2018 – Sep 2019',
      highlights: [
        'CMS for Unicentro Villavicencio shopping mall (JS, Firebase, Firestore).',
      ],
    },
  },
};

/**
 * Resolve the experience list for a given locale, in stable order. Falls back
 * to the default locale's translations for any id missing in the requested
 * locale (paranoia — the typed Record should already prevent this).
 */
export function getExperiences(locale: string = defaultLocale): Experience[] {
  const code = resolveLocale(locale);
  const map = EXPERIENCES_BY_LOCALE[code];
  const fallback = EXPERIENCES_BY_LOCALE[defaultLocale];
  return EXPERIENCES_SHARED.map((shared) => ({
    ...shared,
    ...(map[shared.id] ?? fallback[shared.id]),
  }));
}

/**
 * Default-locale experience list, kept for backwards-compatibility with
 * existing imports. New code should prefer `getExperiences(locale)`.
 */
export const EXPERIENCE: Experience[] = getExperiences(defaultLocale);
