/**
 * Locale-aware data accessor.
 *
 * The `*.ts` files in this directory remain the Spanish source-of-truth for
 * all CV content (profile, experience, projects, posts, skills). This module
 * provides English overrides via parallel translation maps and exposes
 * `localized*` getters that return content in the requested locale.
 *
 * SSG renders Spanish (default locale). Client-side, when the user toggles
 * language, the islands re-fetch via these getters using the new locale.
 *
 * Adding a new language requires:
 *   1. Adding an `<code>` block to each translation map below.
 *   2. Adding the locale to src/i18n/config.ts.
 * No component code changes.
 */

import { defaultLocale } from '../i18n/config';
import { PROFILE, type Profile } from './profile';
import { EXPERIENCE, type Experience } from './experience';
import { PROJECTS, type Project } from './projects';
import { SKILLS, type SkillGroup } from './skills';

// ── Profile overrides ────────────────────────────────────────────────────────

const PROFILE_OVERRIDES: Record<string, Partial<Profile>> = {
  en: {
    role: 'Tech Lead · Software Architect',
    focus: 'Applied AI for Software Development',
    location: 'Bogotá, Colombia',
    bio: 'Tech Lead with 7+ years building and leading full-stack solutions for government and private companies. I combine architecture, hands-on coding and cross-team leadership — today applying AI to the development cycle: agents, RAG, MCP and Spec-Driven Development.',
    shortBio: 'I build agents, RAG systems and architectures that connect teams with AI.',
  },
};

export function localizedProfile(locale: string): Profile {
  return { ...PROFILE, ...(PROFILE_OVERRIDES[locale] ?? {}) };
}

// ── Experience overrides ─────────────────────────────────────────────────────

type ExperienceOverride = Partial<Pick<Experience, 'role' | 'period' | 'highlights' | 'location'>>;

const EXPERIENCE_OVERRIDES: Record<string, ExperienceOverride[]> = {
  en: [
    {
      role: 'Tech Lead — Development & AI Strategy',
      period: 'Aug 2024 – Present',
      highlights: [
        'Designed a Python RAG agent (LangChain + Weaviate) for natural-language queries against organizational documentation.',
        'Leading the adoption of Spec-Driven Development by integrating knowledge bases with AI agents.',
        'Migration of the Jackcore monolith to reusable microservices in .NET Core + Spring Boot.',
        'AI-powered pull-request workflows for automated code review and standards enforcement.',
      ],
    },
    {
      role: 'Full Stack Developer',
      period: 'Mar 2023 – Aug 2024',
      highlights: [
        'GovcodePro dynamic form builder (Angular + Camunda).',
        'Cormacarena Procedures Portal and Business Procedures Portal.',
        'Citizen Services Platform aligned with government standards.',
      ],
    },
    {
      role: 'Full Stack Developer — Independent',
      location: 'Remote · Colombia',
      period: 'Jan 2022 – Present',
      highlights: [
        'Trip Planner AI — frontend redesign in React (startup acquired by layla.com).',
        'Luminara and AlbertCTS landing pages built with Claude Code, Cursor and Copilot.',
        'B2B mobile MVP in React Native for materials buy/sell.',
      ],
    },
    {
      role: 'Backend Developer',
      period: 'May 2021 – Nov 2021',
      highlights: [
        'Improvements to the full-stack template generation Wizard (React, Node, Postgres).',
      ],
    },
    {
      role: 'Frontend Developer',
      period: 'Jun 2018 – Sep 2019',
      highlights: [
        'CMS for Unicentro Villavicencio shopping mall (JS, Firebase, Firestore).',
      ],
    },
  ],
};

export function localizedExperience(locale: string): Experience[] {
  const overrides = EXPERIENCE_OVERRIDES[locale];
  if (!overrides) return EXPERIENCE;
  return EXPERIENCE.map((e, i) => ({ ...e, ...(overrides[i] ?? {}) }));
}

// ── Skill overrides (only group names; tech names stay) ──────────────────────

const SKILL_GROUP_OVERRIDES: Record<string, Record<string, string>> = {
  en: {
    'IA & Agentes': 'AI & Agents',
    'Editores con IA': 'AI-powered Editors',
    'Frontend': 'Frontend',
    'Backend': 'Backend',
    'Arquitectura': 'Architecture',
    'Datos': 'Data',
  },
};

export function localizedSkills(locale: string): SkillGroup[] {
  const map = SKILL_GROUP_OVERRIDES[locale];
  if (!map) return SKILLS;
  return SKILLS.map((s) => ({ ...s, group: map[s.group] ?? s.group }));
}

// ── Project overrides ────────────────────────────────────────────────────────

type ProjectOverride = Partial<
  Pick<Project, 'title' | 'tagline' | 'role' | 'client' | 'status' | 'type' | 'summary' | 'problem' | 'solution' | 'impact'>
>;

const PROJECT_OVERRIDES: Record<string, Record<string, ProjectOverride>> = {
  en: {
    'rag-agent': {
      title: 'Conversational RAG Agent',
      tagline: 'Organizational documentation queried in natural language.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Internal',
      status: 'Producción',
      type: 'AI / Agents',
      summary: 'A RAG agent over the internal documentation base. Replaces manual searches across hundreds of technical pages with conversational queries that include verifiable citations.',
      problem: 'Functional teams were losing hours searching for information scattered across PDFs, wikis and repositories.',
      solution: 'Ingestion pipeline with semantic chunking, embeddings and reranking on Weaviate. Orchestration layer in LangChain with tools for authorization and traceability.',
      impact: [
        '−85% response time for technical queries',
        '100% of answers include source citations',
        '12 teams adopted the tool within 3 months',
      ],
    },
    'spec-driven': {
      title: 'Spec-Driven Development with AI',
      tagline: 'From specification to code, with audited agents.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      status: 'Rollout',
      type: 'Platform / AI',
      summary: 'Integration of project knowledge bases with AI agents through MCP. Reduces time-to-market and standardizes team quality.',
      problem: 'Each team wrote different specs; AI agents had no project context.',
      solution: 'MCP servers expose specs, ADRs and standards. Agent skills orchestrate generation, review and acceptance with human-in-the-loop.',
      impact: [
        'Time-to-market reduced in pilot projects',
        'Standards applied automatically',
        'Shorter onboarding for new developers',
      ],
    },
    'ai-pr-review': {
      title: 'AI-powered PR Review',
      tagline: 'Automated quality as the first line of defense.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      status: 'Producción',
      type: 'DevOps / AI',
      summary: 'AI workflow on pull requests that validates company standards, detects technical debt and suggests refactors before human review.',
      problem: 'Reviewers were spending time on repetitive findings.',
      solution: 'GitHub Actions pipeline with language-specialized prompts and custom organizational rules.',
      impact: ['−40% repetitive manual comments', 'Higher consistency across teams'],
    },
    'jackcore': {
      title: 'Monolith → Microservices Migration',
      tagline: 'Jackcore turned into reusable capabilities.',
      role: 'Tech Lead / Architect',
      client: 'SASOFTCO · Government',
      status: 'Producción',
      type: 'Architecture',
      summary: 'Led the migration of the Jackcore monolith to a microservices architecture: authentication, BPMN, notifications, document conversion and storage.',
      problem: 'The monolith slowed new development and made it hard to reuse capabilities across products.',
      solution: 'Identification of cross-cutting capabilities, contracts-first, gateways and centralized auth consumed from Angular apps.',
      impact: [
        'Multiple internal systems reuse the capabilities',
        'Cost of new development reduced',
        'Independent deployments per domain',
      ],
    },
    'govcodepro': {
      title: 'GovcodePro — Dynamic Form Builder',
      tagline: 'From days to minutes to create complex forms.',
      role: 'Full Stack Dev',
      client: 'SASOFTCO · Government',
      status: 'Producción',
      type: 'Product',
      summary: 'Dynamic form generator integrated with Camunda Forms Modeler. Today it powers several government portals and procedures.',
      problem: 'Complex forms required days of bespoke development.',
      solution: 'Declarative engine with validations, rules and BPMN orchestration.',
      impact: ['Form creation went from days to minutes', 'Adopted by multiple portals'],
    },
    'trip-planner': {
      title: 'Trip Planner AI',
      tagline: 'Frontend redesigned for a startup acquired by layla.com.',
      role: 'Frontend Architect',
      client: 'Startup · Freelance',
      status: 'Adquirida',
      type: 'Product / AI',
      summary: 'Frontend architecture redesign in React for Trip Planner AI — an AI travel-planning startup later acquired by layla.com.',
      problem: 'Coupled frontend architecture limited scaling AI planning features.',
      solution: 'Feature-based architecture, isolated state management, streaming UI for model responses and prompt observability.',
      impact: ['Better perceived performance', 'Sustainable foundation for new AI features'],
    },
    'luminara': {
      title: 'Luminara Landing',
      tagline: 'Built with Claude Code and Cursor, without sacrificing quality.',
      role: 'Full Stack Dev',
      client: 'Luminara · Freelance',
      status: 'Producción',
      type: 'Web',
      summary: 'Landing built primarily with AI assistance (Claude Code + Cursor), with continuous human review to maintain quality and maintainability.',
      problem: 'Critical time-to-market for a landing with animations and SEO.',
      solution: 'Spec-Driven workflow with versioned prompts and human review on every commit.',
      impact: ['Accelerated delivery', 'Sustainable code for future iterations'],
    },
    'albertcts': {
      title: 'AlbertCTS Landing',
      tagline: '70% less delivery time with AI practices.',
      role: 'Full Stack Dev',
      client: 'AlbertCTS · Freelance',
      status: 'Producción',
      type: 'Web',
      summary: 'Landing delivered with Cursor + GitHub Copilot, reducing total time by ~70% compared with the traditional flow.',
      problem: 'Client needed an online presence with a tight delivery deadline.',
      solution: 'Reusable components, AI-assisted generation and human review.',
      impact: ['Time-to-market −70%', 'Client live in production'],
    },
    'b2b-materiales': {
      title: 'B2B Materials MVP',
      tagline: 'Mobile app with per-client transactional traceability.',
      role: 'Mobile Dev',
      client: 'Confidential · Freelance',
      status: 'MVP',
      type: 'Mobile',
      summary: 'Mobile MVP for a B2B materials buy/sell platform with per-client traceability.',
      problem: 'Operators worked with spreadsheets and phone calls.',
      solution: 'Native app with quote, order and tracking flow.',
      impact: ['MVP validated with first pilot clients'],
    },
  },
};

/** Localized status labels for projects. Project.status is structural (used as union) so we map at render time. */
const STATUS_LABELS: Record<string, Record<string, string>> = {
  es: { 'Producción': 'Producción', 'Rollout': 'Rollout', 'MVP': 'MVP', 'Adquirida': 'Adquirida' },
  en: { 'Producción': 'In production', 'Rollout': 'Rollout', 'MVP': 'MVP', 'Adquirida': 'Acquired' },
};

export function localizedStatus(status: string, locale: string): string {
  return STATUS_LABELS[locale]?.[status] ?? status;
}

const PROJECT_TYPES_ALL_LABEL: Record<string, string> = { es: 'Todos', en: 'All' };
export function localizedAllLabel(locale: string): string {
  return PROJECT_TYPES_ALL_LABEL[locale] ?? PROJECT_TYPES_ALL_LABEL[defaultLocale];
}

export function localizedProjects(locale: string): Project[] {
  const overrides = PROJECT_OVERRIDES[locale];
  if (!overrides) return PROJECTS;
  return PROJECTS.map((p) => {
    const o = overrides[p.id];
    if (!o) return p;
    const merged: Project = { ...p, ...o };
    // Preserve the structural status union as-is — components display it via localizedStatus()
    merged.status = p.status;
    return merged;
  });
}

export function localizedProjectTypes(locale: string): string[] {
  const all = localizedAllLabel(locale);
  const types = Array.from(new Set(localizedProjects(locale).map((p) => p.type)));
  return [all, ...types];
}

