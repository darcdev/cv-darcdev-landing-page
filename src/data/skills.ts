import { defaultLocale, resolveLocale, type LocaleCode } from '../i18n/config';

export interface SkillGroupShared {
  id: string;
  items: string[];
}

export interface SkillGroupTranslated {
  group: string;
}

export interface SkillGroup extends SkillGroupShared, SkillGroupTranslated {}

export const SKILLS_SHARED: SkillGroupShared[] = [
  {
    id: 'ai-agents',
    items: ['RAG', 'LangChain', 'Weaviate', 'MCP', 'Agent Skills', 'Spec-Driven Dev', 'Prompt Eng.', 'Human-in-the-loop'],
  },
  {
    id: 'ai-editors',
    items: ['Cursor', 'Claude Code', 'GitHub Copilot', 'OpenCode', 'Codex'],
  },
  {
    id: 'frontend',
    items: ['Angular 14+', 'React', 'React Native', 'TypeScript', 'Next.js', 'Gatsby', 'Web Components'],
  },
  {
    id: 'backend',
    items: ['.NET Core', 'Java Spring Boot', 'Node.js', 'Express', 'GraphQL', 'REST'],
  },
  {
    id: 'architecture',
    items: ['Microservicios', 'Clean Code', 'SOLID', 'BPMN', 'AuthN/AuthZ'],
  },
  {
    id: 'data',
    items: ['SQL Server', 'PostgreSQL', 'Oracle', 'MongoDB', 'Neo4j', 'Firestore'],
  },
];

export const SKILLS_BY_LOCALE: Record<
  LocaleCode,
  Record<string, SkillGroupTranslated>
> = {
  es: {
    'ai-agents': { group: 'IA & Agentes' },
    'ai-editors': { group: 'Editores con IA' },
    'frontend': { group: 'Frontend' },
    'backend': { group: 'Backend' },
    'architecture': { group: 'Arquitectura' },
    'data': { group: 'Datos' },
  },
  en: {
    'ai-agents': { group: 'AI & Agents' },
    'ai-editors': { group: 'AI-powered Editors' },
    'frontend': { group: 'Frontend' },
    'backend': { group: 'Backend' },
    'architecture': { group: 'Architecture' },
    'data': { group: 'Data' },
  },
};

export function getSkills(locale: string = defaultLocale): SkillGroup[] {
  const code = resolveLocale(locale);
  const map = SKILLS_BY_LOCALE[code];
  const fallback = SKILLS_BY_LOCALE[defaultLocale];
  return SKILLS_SHARED.map((shared) => ({
    ...shared,
    ...(map[shared.id] ?? fallback[shared.id]),
  }));
}

export const SKILLS: SkillGroup[] = getSkills(defaultLocale);
