/**
 * Grounding context for the "ask" demo.
 *
 * Builds a compact, locale-aware knowledge base out of the SAME typed data that
 * renders the site (profile / experience / skills / projects). There is no
 * vector store here on purpose: the corpus is small enough to fit in a single
 * prompt, so "retrieval" is just a deterministic serialization. That keeps the
 * demo honest (every answer really is grounded in this file's output) without
 * paying for an embedding pipeline.
 *
 * Token budget matters — the free Gemini tier is limited — so the serialization
 * is deliberately lossy: highlights and projects are capped, and long prose is
 * left out. If you add data here, keep an eye on `estimateTokens()`.
 *
 * SHIPS TO THE BROWSER. The ask island imports this directly now that Gemini is
 * called client-side, so the corpus is in the JS bundle — sent twice, once as
 * rendered HTML and once as this serialization. That is the accepted cost of
 * dropping the server route; none of the data is private (it all renders on the
 * page anyway), but the token-budget note above now doubles as a BUNDLE-size
 * note. Keep the caps.
 */
import { getProfile } from '../../data/profile';
import { getExperiences } from '../../data/experience';
import { getSkills } from '../../data/skills';
import { getProjects, getStatusLabel } from '../../data/projects';
import { resolveLocale } from '../../i18n/config';

/** Max highlights kept per role. Roles list newest-first, so this favours recency. */
const MAX_HIGHLIGHTS_PER_ROLE = 3;
/** Max projects described in detail; the rest are listed by title only. */
const MAX_DETAILED_PROJECTS = 6;

function section(title: string, body: string): string {
  return `## ${title}\n${body}`;
}

function buildContext(locale: string): string {
  const code = resolveLocale(locale);
  const profile = getProfile(code);
  const experiences = getExperiences(code);
  const skills = getSkills(code);
  const projects = getProjects(code);

  // NOTE: phone number is intentionally excluded. It renders in the contact
  // section for humans, but there is no reason to feed it to a model and make
  // it trivially scrapable through the demo.
  const identity = [
    `Nombre: ${profile.name} (${profile.shortName})`,
    `Rol: ${profile.role}`,
    `Foco: ${profile.focus}`,
    `Ubicación: ${profile.location}`,
    `Años de experiencia: ${profile.years}`,
    `Proyectos en producción: ${profile.productionProjects}`,
    `Trámites implementados: ${profile.proceduresImplemented}`,
    `Soluciones de IA en producción: ${profile.aiSolutionsInProduction}`,
    `Disponible para nuevos proyectos: ${profile.available ? 'sí' : 'no'}`,
    `Email: ${profile.email}`,
    `LinkedIn: ${profile.linkedin}`,
    `GitHub: ${profile.github}`,
    `Bio: ${profile.bio}`,
  ].join('\n');

  const roles = experiences
    .map((exp) => {
      const company = exp.companyLabel ?? exp.company;
      const bullets = exp.highlights
        .slice(0, MAX_HIGHLIGHTS_PER_ROLE)
        .map((h) => `  - ${h}`)
        .join('\n');
      return `### ${exp.role} — ${company} (${exp.period}, ${exp.location})\n${bullets}`;
    })
    .join('\n');

  const stack = skills
    .map((group) => `- ${group.group}: ${group.items.join(', ')}`)
    .join('\n');

  const detailed = projects
    .slice(0, MAX_DETAILED_PROJECTS)
    .map((p) => {
      const lines = [
        `### ${p.title} (${p.year}) — ${p.type}`,
        `Cliente: ${p.client} · Rol: ${p.role} · Estado: ${getStatusLabel(p.status, code)}`,
        `Resumen: ${p.summary}`,
        `Stack: ${p.stack.join(', ')}`,
      ];
      if (p.impact.length > 0) lines.push(`Impacto: ${p.impact.join(' | ')}`);
      if (p.liveUrl) lines.push(`Demo: ${p.liveUrl}`);
      return lines.join('\n');
    })
    .join('\n');

  const remaining = projects.slice(MAX_DETAILED_PROJECTS);
  const alsoBuilt =
    remaining.length > 0
      ? section(
          'Otros proyectos (solo título)',
          remaining.map((p) => `- ${p.title} (${p.year}, ${p.type})`).join('\n'),
        )
      : '';

  return [
    section('Perfil', identity),
    section('Trayectoria', roles),
    section('Stack técnico', stack),
    section('Proyectos destacados', detailed),
    alsoBuilt,
  ]
    .filter(Boolean)
    .join('\n\n');
}

/** Per-locale memo — the corpus is static at runtime, so build it once. */
const cache = new Map<string, string>();

/** Returns the grounding corpus for `locale`, built once per process. */
export function getKnowledgeContext(locale: string): string {
  const code = resolveLocale(locale);
  const hit = cache.get(code);
  if (hit) return hit;
  const built = buildContext(code);
  cache.set(code, built);
  return built;
}

/** Rough token estimate (~4 chars/token). For budget sanity checks only. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
