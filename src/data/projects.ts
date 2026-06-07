/**
 * Projects, split into shared (locale-agnostic) and translated fields.
 *
 * - `status` is a stable code ('in-production' | 'rollout' | 'mvp' | 'acquired'),
 *   never a localized label. Use `getStatusLabel(status, locale)` to render.
 * - `cover` is now an explicit shared field per project (replaces the old
 *   imperative `pickCover` switch).
 * - Tags and stack are technical names; they stay in shared.
 *
 * To add a new locale: extend the registry in src/i18n/config.ts and add
 * matching entries to PROJECTS_BY_LOCALE, PROJECT_STATUS_LABELS,
 * PROJECT_TYPES_ALL_LABEL — TypeScript will refuse to compile if any of them
 * is missing the new locale.
 */

import { defaultLocale, resolveLocale, type LocaleCode } from '../i18n/config';

/** Stable status code. NEVER store localized labels here. */
export type ProjectStatus = 'in-production' | 'rollout' | 'mvp' | 'acquired';
export type CoverPattern = 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';

/**
 * Source of a single project image (locale-agnostic).
 *
 * - `local` paths are relative to `src/assets/images/projects/<project-id>/`
 *   and MUST point to an existing file (validated by scripts/check-images.ts).
 * - `external` URLs MUST start with `https://`.
 */
export type ProjectImageSource =
  | { kind: 'local'; path: string }
  | { kind: 'external'; url: string };

/**
 * Per-locale alt-text and optional caption for a single project image.
 * Length MUST mirror `ProjectShared.images.length` in the default locale.
 */
export interface ProjectImageTranslated {
  /** Required and non-empty in the default locale; falls back at runtime in others. */
  alt: string;
  caption?: string;
}

/** Locale-agnostic project fields. */
export interface ProjectShared {
  id: string;
  year: string;
  featured: boolean;
  liveUrl?: string;
  tags: string[];
  stack: string[];
  status: ProjectStatus;
  cover: CoverPattern;
  /** Ordered list of project images. Empty array → SVG cover pattern is used (SC-007). */
  images: ProjectImageSource[];
}

/** Per-locale, human-facing project fields. */
export interface ProjectTranslated {
  title: string;
  tagline: string;
  role: string;
  client: string;
  /** User-facing category (e.g. "IA / Agentes" / "AI / Agents"). */
  type: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string[];
  /**
   * Per-locale alt/caption metadata, position-aligned with `ProjectShared.images`.
   * Length MUST equal `images.length` in the default locale.
   */
  images: ProjectImageTranslated[];
}

/**
 * Resolved project for a specific locale.
 *
 * `images` is the merged view: each entry carries the locale-agnostic source
 * (`ProjectImageSource`) AND the translated alt / caption already resolved
 * via default-locale fallback. Consumers (resolveProjectImages, ProjectsSection)
 * can rely on `images[i].alt` being non-empty.
 */
export interface Project
  extends Omit<ProjectShared, 'images'>,
    Omit<ProjectTranslated, 'images'> {
  images: Array<ProjectImageSource & ProjectImageTranslated>;
}

export const PROJECTS_SHARED: ProjectShared[] = [
  {
    id: 'rag-agent',
    year: '2025',
    featured: true,
    status: 'in-production',
    cover: 'rag',
    tags: ['Python', 'LangChain', 'Weaviate', 'RAG', 'LLMs'],
    stack: ['Python', 'LangChain', 'Weaviate', 'FastAPI', 'OpenAI', 'Docker'],
    images: [
      { kind: 'local', path: 'rag-agent/dashboard.jpg' },
      { kind: 'local', path: 'rag-agent/conversation.jpg' },
      { kind: 'local', path: 'rag-agent/architecture.jpg' },
    ],
  },
  {
    id: 'positiva-cmdb',
    year: '2024',
    featured: true,
    status: 'in-production',
    cover: 'arch',
    tags: ['n8n', 'SolarWinds', 'Aranda', 'CMDB', 'DevOps'],
    stack: ['n8n', 'SolarWinds', 'Aranda', 'Angular', '.NET Core'],
    images: [],
  },
  {
    id: 'spec-driven',
    year: '2025',
    featured: false,
    status: 'rollout',
    cover: 'spec',
    tags: ['MCP', 'Agentes', 'DevEx', 'Spec-Driven'],
    stack: ['MCP', 'Claude Code', 'TypeScript', 'Markdown', 'GitHub Actions'],
    images: [],
  },
  {
    id: 'ai-pr-review',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'pr',
    tags: ['CI/CD', 'LLMs', 'GitHub Actions'],
    stack: ['GitHub Actions', 'TypeScript', 'OpenAI', 'Reglas custom'],
    images: [],
  },
  {
    id: 'jackcore',
    year: '2024',
    featured: true,
    status: 'in-production',
    cover: 'arch',
    tags: ['.NET Core', 'Spring Boot', 'Angular', 'Microservicios'],
    stack: ['.NET Core', 'Java Spring Boot', 'Angular', 'SQL Server', 'Oracle'],
    images: [],
  },
  {
    id: 'govcodepro',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'mcp',
    tags: ['Angular', 'Camunda', 'BPMN', 'Formularios'],
    stack: ['Angular', 'Camunda Forms Modeler', 'TypeScript', '.NET Core'],
    images: [],
  },
  {
    id: 'chiquinquira',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'mcp',
    tags: ['Angular', '.NET Core', 'Gobierno', 'Trámites'],
    stack: ['Angular', '.NET Core', 'TypeScript', 'SQL Server'],
    images: [],
  },
  {
    id: 'zipaquira',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'mcp',
    tags: ['Angular', '.NET Core', 'Gobierno', 'Trámites'],
    stack: ['Angular', '.NET Core', 'TypeScript', 'SQL Server'],
    images: [],
  },
  {
    id: 'trip-planner',
    year: '2023',
    featured: false,
    status: 'acquired',
    cover: 'oss',
    liveUrl: 'https://layla.com',
    tags: ['React', 'TypeScript', 'IA'],
    stack: ['React', 'TypeScript', 'Vite', 'OpenAI'],
    images: [
      { kind: 'external', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80' },
      { kind: 'external', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80' },
    ],
  },
  {
    id: 'luminara',
    year: '2025',
    featured: false,
    status: 'in-production',
    cover: 'spec',
    liveUrl: 'https://luminara.com',
    tags: ['Next.js', 'Claude Code', 'Cursor'],
    stack: ['Next.js', 'Tailwind', 'TypeScript'],
    images: [],
  },
  {
    id: 'albertcts',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'rag',
    liveUrl: 'https://albertcts.com',
    tags: ['Cursor', 'Copilot', 'Next.js'],
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
    images: [],
  },
  {
    id: 'b2b-materiales',
    year: '2023',
    featured: false,
    status: 'mvp',
    cover: 'arch',
    tags: ['React Native', 'Node.js', 'B2B'],
    stack: ['React Native', 'Node.js', 'PostgreSQL'],
    images: [],
  },
];

export const PROJECTS_BY_LOCALE: Record<
  LocaleCode,
  Record<string, ProjectTranslated>
> = {
  es: {
    'rag-agent': {
      title: 'Agente Conversacional RAG',
      tagline: 'Documentación organizacional consultada en lenguaje natural.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Interno',
      type: 'IA / Agentes',
      summary: 'Agente RAG sobre la base documental interna. Reemplaza búsquedas manuales sobre cientos de páginas técnicas por consultas conversacionales con citas verificables.',
      problem: 'Los equipos funcionales perdían horas buscando información dispersa entre PDFs, wikis y repositorios.',
      solution: 'Pipeline de ingesta con chunking semántico, embeddings y reranking sobre Weaviate. Capa de orquestación en LangChain con tools para autorización y trazabilidad.',
      impact: [
        '−85% tiempo de respuesta a consultas técnicas',
        '100% de respuestas con cita a fuente',
        '12 equipos adoptaron la herramienta en 3 meses',
      ],
      images: [
        { alt: 'Dashboard del agente RAG mostrando métricas de uso', caption: 'Panel principal con métricas en vivo.' },
        { alt: 'Pantalla de conversación con citas a documentos fuente' },
        { alt: 'Diagrama de arquitectura del pipeline RAG', caption: 'Pipeline: ingesta → embeddings → reranking → respuesta.' },
      ],
    },
    'spec-driven': {
      title: 'Spec-Driven Development con IA',
      tagline: 'De la especificación al código, con agentes auditados.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'Plataforma / IA',
      summary: 'Integración de bases de conocimiento de proyectos con agentes de IA mediante MCP. Reduce time-to-market y homogeniza la calidad del equipo.',
      problem: 'Cada equipo escribía specs distintas; los agentes de IA no tenían contexto de proyecto.',
      solution: 'Servidores MCP exponen specs, ADRs y estándares. Agent skills orquestan generación, revisión y aceptación con human-in-the-loop.',
      impact: [
        'Time-to-market reducido en proyectos piloto',
        'Estándares aplicados de forma automática',
        'Onboarding más corto para nuevos devs',
      ],
      images: [],
    },
    'ai-pr-review': {
      title: 'Revisión de PRs con IA',
      tagline: 'Calidad automática como primera línea de defensa.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'DevOps / IA',
      summary: 'Flujo de IA en pull requests que valida estándares de la compañía, detecta deuda técnica y sugiere refactors antes del review humano.',
      problem: 'Reviewers gastaban tiempo en hallazgos repetitivos.',
      solution: 'Pipeline en GitHub Actions con prompts especializados por lenguaje y reglas custom de la organización.',
      impact: ['−40% comentarios manuales repetitivos', 'Mayor consistencia entre equipos'],
      images: [],
    },
    'jackcore': {
      title: 'Migración Monolito → Microservicios',
      tagline: 'Jackcore convertido en capacidades reutilizables.',
      role: 'Tech Lead / Arquitecto',
      client: 'SASOFTCO · Gobierno',
      type: 'Arquitectura',
      summary: 'Lideré la migración del monolito Jackcore a una arquitectura de microservicios: autenticación, BPMN, notificaciones, conversión de documentos y almacenamiento.',
      problem: 'El monolito frenaba la velocidad de nuevos desarrollos y dificultaba el reuso entre productos.',
      solution: 'Identificación de capacidades transversales, contracts-first, gateways y autenticación centralizada consumidas desde apps Angular.',
      impact: [
        'Múltiples sistemas internos reutilizan las capacidades',
        'Costo de nuevos desarrollos reducido',
        'Despliegues independientes por dominio',
      ],
      images: [],
    },
    'govcodepro': {
      title: 'Generador de Formularios — GovcodePro',
      tagline: 'De días a minutos para crear formularios complejos.',
      role: 'Full Stack Dev',
      client: 'SASOFTCO · Gobierno',
      type: 'Producto',
      summary: 'Diseñé y construí el generador dinámico de formularios GovcodePro (Angular + Camunda Forms Modeler). Hoy es componente clave de múltiples portales y trámites gubernamentales.',
      problem: 'Formularios complejos requerían días de desarrollo a la medida en cada portal o trámite.',
      solution: 'Motor declarativo con validaciones, reglas y orquestación BPMN integrado a Camunda Forms Modeler.',
      impact: ['Creación de formularios pasó de días a minutos', 'Adoptado por múltiples portales gubernamentales'],
      images: [],
    },
    'positiva-cmdb': {
      title: 'Positiva CMDB — Orquestación de Incidentes',
      tagline: 'De SolarWinds a Aranda sin operador manual.',
      role: 'Tech Lead',
      client: 'Positiva · SASOFTCO',
      type: 'Plataforma / DevOps',
      summary: 'Lideré el equipo que construyó un portal para Positiva que orquesta mediante n8n los incidentes de infraestructura — aplicaciones, servidores y sistemas — reportados en SolarWinds hacia Aranda, donde se crean tickets automáticamente.',
      problem: 'El reporte de incidentes entre monitoreo y mesa de ayuda dependía de un operador manual, retrasando la apertura de tickets y la resolución.',
      solution: 'Definí la arquitectura y el modelo de datos del portal; flujos n8n integran SolarWinds con Aranda para crear tickets sin intervención humana en el paso de reporte.',
      impact: [
        'Eliminación del reporte manual de incidentes',
        'Tiempos de resolución más ágiles',
        'Trazabilidad unificada entre monitoreo y mesa de ayuda',
      ],
      images: [],
    },
    'chiquinquira': {
      title: 'Portal de Trámites — Alcaldía de Chiquinquirá',
      tagline: 'Trámites empresariales digitalizados bajo lineamientos del Gobierno Colombiano.',
      role: 'Full Stack Dev',
      client: 'Alcaldía de Chiquinquirá · SASOFTCO',
      type: 'Gobierno',
      summary: 'Portal de trámites empresariales en Angular y .NET Core para la Alcaldía de Chiquinquirá, con gestión de trámites, autenticación y reportes.',
      problem: 'Los trámites empresariales dependían de procesos manuales y canales poco eficientes para ciudadanos y funcionarios.',
      solution: 'Portal centralizado alineado a lineamientos gubernamentales con flujos de trámites, autenticación y reportes operativos.',
      impact: ['Mayor eficiencia operativa de la entidad', 'Trámites empresariales disponibles en línea'],
      images: [],
    },
    'zipaquira': {
      title: 'Portal de Trámites — Alcaldía de Zipaquirá',
      tagline: 'Automatización de trámites empresariales para la alcaldía.',
      role: 'Full Stack Dev',
      client: 'Alcaldía de Zipaquirá · SASOFTCO',
      type: 'Gobierno',
      summary: 'Portal de trámites empresariales en Angular y .NET Core para la Alcaldía de Zipaquirá, automatizando gestión de trámites, autenticación y reportes.',
      problem: 'La gestión de trámites empresariales requería procesos presenciales y seguimiento manual.',
      solution: 'Plataforma web con flujos de trámites, autenticación de usuarios y módulo de reportes para la operación municipal.',
      impact: ['Trámites digitalizados para empresas locales', 'Mejor eficiencia operativa de la alcaldía'],
      images: [],
    },
    'trip-planner': {
      title: 'Trip Planner IA',
      tagline: 'Frontend rediseñado para una startup adquirida por layla.com.',
      role: 'Frontend Architect',
      client: 'Startup · Freelance',
      type: 'Producto / IA',
      summary: 'Rediseño de la arquitectura frontend en React de Trip Planner IA — startup de planificación de viajes con IA posteriormente adquirida por layla.com.',
      problem: 'Arquitectura frontend acoplada limitaba escalar features de planificación con IA.',
      solution: 'Arquitectura por features, state management aislado, streaming UI para respuestas del modelo y observabilidad de prompts.',
      impact: ['Mejor rendimiento percibido', 'Base sostenible para nuevos features de IA'],
      images: [
        { alt: 'Mochilero observando montañas al atardecer', caption: 'Inspiración de viaje generada por el agente.' },
        { alt: 'Vista aérea de carretera de montaña al amanecer' },
      ],
    },
    'luminara': {
      title: 'Landing Luminara',
      tagline: 'Construida con Claude Code y Cursor, sin sacrificar calidad.',
      role: 'Full Stack Dev',
      client: 'Luminara · Freelance',
      type: 'Web',
      summary: 'Landing construida principalmente con asistencia de IA (Claude Code + Cursor), con revisión humana continua para mantener calidad y mantenibilidad.',
      problem: 'Time-to-market crítico para una landing con animaciones y SEO.',
      solution: 'Workflow Spec-Driven con prompts versionados y revisión humana en cada commit.',
      impact: ['Entrega acelerada', 'Código sostenible para iteraciones futuras'],
      images: [],
    },
    'albertcts': {
      title: 'Landing AlbertCTS',
      tagline: '70% menos tiempo de entrega con prácticas de IA.',
      role: 'Full Stack Dev',
      client: 'AlbertCTS · Freelance',
      type: 'Web',
      summary: 'Landing entregada con Cursor + GitHub Copilot, reduciendo el tiempo total en ~70% comparado con el flujo tradicional.',
      problem: 'Cliente necesitaba presencia online con corto plazo de entrega.',
      solution: 'Componentes reusables, generación asistida y revisión humana.',
      impact: ['Time-to-market −70%', 'Cliente activo en producción'],
      images: [],
    },
    'b2b-materiales': {
      title: 'MVP B2B de Materiales',
      tagline: 'App móvil con trazabilidad transaccional por cliente.',
      role: 'Mobile Dev',
      client: 'Confidencial · Freelance',
      type: 'Mobile',
      summary: 'MVP móvil para una plataforma B2B de compra-venta de materiales con trazabilidad por cliente.',
      problem: 'Operadores trabajaban con planillas y llamadas.',
      solution: 'App nativa con flujo de cotización, orden y seguimiento.',
      impact: ['MVP validado con primeros clientes piloto'],
      images: [],
    },
  },
  en: {
    'rag-agent': {
      title: 'Conversational RAG Agent',
      tagline: 'Organizational documentation queried in natural language.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Internal',
      type: 'AI / Agents',
      summary: 'A RAG agent over the internal documentation base. Replaces manual searches across hundreds of technical pages with conversational queries that include verifiable citations.',
      problem: 'Functional teams were losing hours searching for information scattered across PDFs, wikis and repositories.',
      solution: 'Ingestion pipeline with semantic chunking, embeddings and reranking on Weaviate. Orchestration layer in LangChain with tools for authorization and traceability.',
      impact: [
        '−85% response time for technical queries',
        '100% of answers include source citations',
        '12 teams adopted the tool within 3 months',
      ],
      images: [
        { alt: 'RAG agent dashboard with live usage metrics', caption: 'Main panel with live metrics.' },
        { alt: 'Conversation view with citations to source documents' },
        { alt: 'RAG pipeline architecture diagram', caption: 'Pipeline: ingestion → embeddings → reranking → answer.' },
      ],
    },
    'spec-driven': {
      title: 'Spec-Driven Development with AI',
      tagline: 'From specification to code, with audited agents.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'Platform / AI',
      summary: 'Integration of project knowledge bases with AI agents through MCP. Reduces time-to-market and standardizes team quality.',
      problem: 'Each team wrote different specs; AI agents had no project context.',
      solution: 'MCP servers expose specs, ADRs and standards. Agent skills orchestrate generation, review and acceptance with human-in-the-loop.',
      impact: [
        'Time-to-market reduced in pilot projects',
        'Standards applied automatically',
        'Shorter onboarding for new developers',
      ],
      images: [],
    },
    'ai-pr-review': {
      title: 'AI-powered PR Review',
      tagline: 'Automated quality as the first line of defense.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'DevOps / AI',
      summary: 'AI workflow on pull requests that validates company standards, detects technical debt and suggests refactors before human review.',
      problem: 'Reviewers were spending time on repetitive findings.',
      solution: 'GitHub Actions pipeline with language-specialized prompts and custom organizational rules.',
      impact: ['−40% repetitive manual comments', 'Higher consistency across teams'],
      images: [],
    },
    'jackcore': {
      title: 'Monolith → Microservices Migration',
      tagline: 'Jackcore turned into reusable capabilities.',
      role: 'Tech Lead / Architect',
      client: 'SASOFTCO · Government',
      type: 'Architecture',
      summary: 'Led the migration of the Jackcore monolith to a microservices architecture: authentication, BPMN, notifications, document conversion and storage.',
      problem: 'The monolith slowed new development and made it hard to reuse capabilities across products.',
      solution: 'Identification of cross-cutting capabilities, contracts-first, gateways and centralized auth consumed from Angular apps.',
      impact: [
        'Multiple internal systems reuse the capabilities',
        'Cost of new development reduced',
        'Independent deployments per domain',
      ],
      images: [],
    },
    'govcodepro': {
      title: 'Dynamic Form Generator — GovcodePro',
      tagline: 'From days to minutes to create complex forms.',
      role: 'Full Stack Dev',
      client: 'SASOFTCO · Government',
      type: 'Product',
      summary: 'Designed and built GovcodePro\'s dynamic form generator (Angular + Camunda Forms Modeler). Today it is a core component across multiple government portals and procedures.',
      problem: 'Complex forms required days of bespoke development for each portal or procedure.',
      solution: 'Declarative engine with validations, rules and BPMN orchestration integrated with Camunda Forms Modeler.',
      impact: ['Form creation went from days to minutes', 'Adopted by multiple government portals'],
      images: [],
    },
    'positiva-cmdb': {
      title: 'Positiva CMDB — Incident Orchestration',
      tagline: 'From SolarWinds to Aranda without a manual operator.',
      role: 'Tech Lead',
      client: 'Positiva · SASOFTCO',
      type: 'Platform / DevOps',
      summary: 'Led the team that built a portal for Positiva orchestrating via n8n infrastructure incidents — applications, servers and systems — reported in SolarWinds into Aranda, where tickets are created automatically.',
      problem: 'Incident reporting between monitoring and the help desk relied on a manual operator, delaying ticket creation and resolution.',
      solution: 'Defined the portal architecture and data model; n8n workflows integrate SolarWinds with Aranda to create tickets without human intervention in the reporting step.',
      impact: [
        'Manual incident reporting eliminated',
        'Faster resolution times',
        'Unified traceability between monitoring and help desk',
      ],
      images: [],
    },
    'chiquinquira': {
      title: 'Procedures Portal — Alcaldía de Chiquinquirá',
      tagline: 'Digitized business procedures under Colombian government guidelines.',
      role: 'Full Stack Dev',
      client: 'Alcaldía de Chiquinquirá · SASOFTCO',
      type: 'Government',
      summary: 'Enterprise procedures portal in Angular and .NET Core for the Alcaldía de Chiquinquirá, with procedure management, authentication and reporting.',
      problem: 'Business procedures depended on manual processes and inefficient channels for citizens and staff.',
      solution: 'Centralized portal aligned with government guidelines with procedure flows, authentication and operational reporting.',
      impact: ['Higher operational efficiency for the agency', 'Business procedures available online'],
      images: [],
    },
    'zipaquira': {
      title: 'Procedures Portal — Alcaldía de Zipaquirá',
      tagline: 'Automated business procedures for the municipal government.',
      role: 'Full Stack Dev',
      client: 'Alcaldía de Zipaquirá · SASOFTCO',
      type: 'Government',
      summary: 'Enterprise procedures portal in Angular and .NET Core for the Alcaldía de Zipaquirá, automating procedure management, authentication and reporting.',
      problem: 'Business procedure management required in-person processes and manual follow-up.',
      solution: 'Web platform with procedure flows, user authentication and a reporting module for municipal operations.',
      impact: ['Digitized procedures for local businesses', 'Better operational efficiency for the municipality'],
      images: [],
    },
    'trip-planner': {
      title: 'Trip Planner AI',
      tagline: 'Frontend redesigned for a startup acquired by layla.com.',
      role: 'Frontend Architect',
      client: 'Startup · Freelance',
      type: 'Product / AI',
      summary: 'Frontend architecture redesign in React for Trip Planner AI — an AI travel-planning startup later acquired by layla.com.',
      problem: 'Coupled frontend architecture limited scaling AI planning features.',
      solution: 'Feature-based architecture, isolated state management, streaming UI for model responses and prompt observability.',
      impact: ['Better perceived performance', 'Sustainable foundation for new AI features'],
      images: [
        { alt: 'Backpacker watching mountains at sunset', caption: 'Travel inspiration generated by the agent.' },
        { alt: 'Aerial view of a mountain road at sunrise' },
      ],
    },
    'luminara': {
      title: 'Luminara Landing',
      tagline: 'Built with Claude Code and Cursor, without sacrificing quality.',
      role: 'Full Stack Dev',
      client: 'Luminara · Freelance',
      type: 'Web',
      summary: 'Landing built primarily with AI assistance (Claude Code + Cursor), with continuous human review to maintain quality and maintainability.',
      problem: 'Critical time-to-market for a landing with animations and SEO.',
      solution: 'Spec-Driven workflow with versioned prompts and human review on every commit.',
      impact: ['Accelerated delivery', 'Sustainable code for future iterations'],
      images: [],
    },
    'albertcts': {
      title: 'AlbertCTS Landing',
      tagline: '70% less delivery time with AI practices.',
      role: 'Full Stack Dev',
      client: 'AlbertCTS · Freelance',
      type: 'Web',
      summary: 'Landing delivered with Cursor + GitHub Copilot, reducing total time by ~70% compared with the traditional flow.',
      problem: 'Client needed an online presence with a tight delivery deadline.',
      solution: 'Reusable components, AI-assisted generation and human review.',
      impact: ['Time-to-market −70%', 'Client live in production'],
      images: [],
    },
    'b2b-materiales': {
      title: 'B2B Materials MVP',
      tagline: 'Mobile app with per-client transactional traceability.',
      role: 'Mobile Dev',
      client: 'Confidential · Freelance',
      type: 'Mobile',
      summary: 'Mobile MVP for a B2B materials buy/sell platform with per-client traceability.',
      problem: 'Operators worked with spreadsheets and phone calls.',
      solution: 'Native app with quote, order and tracking flow.',
      impact: ['MVP validated with first pilot clients'],
      images: [],
    },
  },
};

/** Localized labels for project status codes. */
export const PROJECT_STATUS_LABELS: Record<
  LocaleCode,
  Record<ProjectStatus, string>
> = {
  es: {
    'in-production': 'Producción',
    'rollout': 'Rollout',
    'mvp': 'MVP',
    'acquired': 'Adquirida',
  },
  en: {
    'in-production': 'In production',
    'rollout': 'Rollout',
    'mvp': 'MVP',
    'acquired': 'Acquired',
  },
};

/** Localized "All" label used by the project-type filter. */
export const PROJECT_TYPES_ALL_LABEL: Record<LocaleCode, string> = {
  es: 'Todos',
  en: 'All',
};

export function getProjects(locale: string = defaultLocale): Project[] {
  const code = resolveLocale(locale);
  const map = PROJECTS_BY_LOCALE[code];
  const fallback = PROJECTS_BY_LOCALE[defaultLocale];
  return PROJECTS_SHARED.map((shared) => {
    const translated = map[shared.id] ?? fallback[shared.id];
    const fallbackTranslated = fallback[shared.id];
    // Position-aligned merge: each source image gets locale alt/caption with
    // default-locale fallback. Length follows the source array (the source of truth).
    const images = shared.images.map((src, i) => {
      const fromLocale = translated.images[i];
      const fromFallback = fallbackTranslated.images[i];
      const alt =
        (fromLocale?.alt && fromLocale.alt.trim().length > 0
          ? fromLocale.alt
          : fromFallback?.alt) ?? '';
      const caption = fromLocale?.caption ?? fromFallback?.caption;
      return { ...src, alt, ...(caption !== undefined ? { caption } : {}) };
    });
    // Drop the per-locale `images` raw array from the spread; the merged version above wins.
    const { images: _ignored, ...translatedRest } = translated;
    return {
      ...shared,
      ...translatedRest,
      images,
    };
  });
}

export function getStatusLabel(status: ProjectStatus, locale: string = defaultLocale): string {
  const code = resolveLocale(locale);
  return PROJECT_STATUS_LABELS[code][status];
}

export function getAllLabel(locale: string = defaultLocale): string {
  const code = resolveLocale(locale);
  return PROJECT_TYPES_ALL_LABEL[code];
}

export function getProjectTypes(locale: string = defaultLocale): string[] {
  const all = getAllLabel(locale);
  const types = Array.from(new Set(getProjects(locale).map((p) => p.type)));
  return [all, ...types];
}

/**
 * Default-locale exports kept for backwards-compatibility.
 * New code should prefer the get* helpers.
 */
export const PROJECTS: Project[] = getProjects(defaultLocale);
export const PROJECT_TYPES: string[] = getProjectTypes(defaultLocale);
