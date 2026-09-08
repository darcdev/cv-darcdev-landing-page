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
    id: 'joobia',
    year: '2026',
    featured: true,
    status: 'rollout',
    cover: 'rag',
    tags: ['LangChain', 'Agentes', 'Tavily', 'CV', 'RAG'],
    stack: ['LangChain', 'Python', 'Tavily', 'OpenAI', 'FastAPI'],
    images: [
      { kind: 'local', path: 'joobia/joobia-1.png' },
      { kind: 'local', path: 'joobia/joobia-2.png' },
      { kind: 'local', path: 'joobia/joobia-3.png' },
    ],
  },
  {
    id: 'rag-agent',
    year: '2025',
    featured: true,
    status: 'in-production',
    cover: 'rag',
    tags: ['Python', 'LangChain', 'Weaviate', 'RAG', 'LLMs'],
    stack: ['Python', 'LangChain', 'Weaviate', 'FastAPI', 'OpenAI', 'Docker'],
    images: [
      { kind: 'local', path: 'rag-agent/rag_conocimiento-positiva-1.jpg' },
      { kind: 'local', path: 'rag-agent/rag_conocimiento-positiva-2.jpg' },
      { kind: 'local', path: 'rag-agent/rag_conocimiento-positiva-3.jpg' },
    ],
  },
  {
    id: 'generator-forms',
    year: '2024',
    featured: true,
    status: 'in-production',
    cover: 'mcp',
    tags: ['Angular', 'Camunda', 'BPMN', 'Formularios', 'No-code'],
    stack: ['Angular', 'Camunda Forms Modeler', 'bpmn.io', 'BPMN', 'TypeScript', '.NET Core'],
    images: [
      { kind: 'local', path: 'generator-forms/generator-forms-1.png' },
      { kind: 'local', path: 'generator-forms/generator-forms-2.png' },
      { kind: 'local', path: 'generator-forms/generator-forms-3.png' },
    ],
  },
  {
    id: 'form-visualizer',
    year: '2025',
    featured: true,
    status: 'in-production',
    cover: 'arch',
    tags: ['Angular', 'Formularios', 'Motor declarativo', 'Tipos'],
    stack: ['Angular', 'TypeScript', 'Motor declarativo', 'Eventos'],
    images: [
      { kind: 'local', path: 'form-visualizer/forms-1.png' },
      { kind: 'local', path: 'form-visualizer/forms-2.png' },
    ],
  },
  {
    id: 'whatsapp-agente',
    year: '2025',
    featured: true,
    status: 'rollout',
    cover: 'mcp',
    tags: ['LangChain', 'WhatsApp Business', 'Agentes', 'Trámites'],
    stack: ['LangChain', 'Python', 'WhatsApp Business API', 'OpenAI', 'FastAPI'],
    images: [
      { kind: 'local', path: 'whatsapp-agente/bot_ia_whatsapp.jpg' },
      { kind: 'local', path: 'whatsapp-agente/bot_ia_whatsapp_saludo.jpg' },
    ],
  },
  {
    id: 'portales-tramites',
    year: '2024',
    featured: true,
    status: 'in-production',
    cover: 'arch',
    tags: ['Angular', '.NET Core', 'Gobierno', 'Trámites'],
    stack: ['Angular', '.NET Core', 'TypeScript', 'SQL Server', 'Camunda'],
    images: [
      { kind: 'local', path: 'portales-tramites/tramites-1.png' },
      { kind: 'local', path: 'portales-tramites/tramites-2.png' },
      { kind: 'local', path: 'portales-tramites/tramites-3.png' },
    ],
  },
  {
    id: 'positiva-cmdb',
    year: '2024',
    featured: false,
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
    tags: ['SDD', 'OpenSpec', 'OpenCode', 'Modelos', 'DevEx'],
    stack: ['OpenSpec', 'OpenCode', 'Claude Code', 'Codex', 'Markdown'],
    images: [],
  },
  {
    id: 'ai-pr-review',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'pr',
    tags: ['CI/CD', 'LLMs', 'Azure DevOps'],
    stack: ['Azure DevOps', 'TypeScript', 'OpenAI', 'Reglas custom'],
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
    images: [
      { kind: 'local', path: 'jackcore/jackcore-1.png' },
      { kind: 'local', path: 'jackcore/jackcore-2.png' },
      { kind: 'local', path: 'jackcore/jackcore-3.png' },
    ],
  },
  {
    id: 'trip-planner',
    year: '2023',
    featured: false,
    status: 'acquired',
    cover: 'oss',
    liveUrl: 'https://tripplanner.ai/',
    tags: ['React', 'TypeScript', 'IA'],
    stack: ['React', 'TypeScript', 'Vite', 'OpenAI'],
    images: [
      { kind: 'external', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80' },
      { kind: 'external', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80' },
    ],
  },
  {
    id: 'albertcts',
    year: '2024',
    featured: false,
    status: 'in-production',
    cover: 'rag',
    liveUrl: 'https://www.albertcts.com/',
    tags: ['Cursor', 'Copilot', 'Next.js'],
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
    images: [
      { kind: 'local', path: 'albertcts/landing-page-main.png' },
    ],
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
    'joobia': {
      title: 'Joobia — Optimización de CV con agentes',
      tagline: 'Flujo multiagente que mejora tu CV contra una oferta real.',
      role: 'Tech Lead / Arquitecto',
      client: 'Proyecto propio · En desarrollo',
      type: 'IA / Agentes',
      summary: 'Aplicación agéntica que crea un CV en base a la oferta de trabajo. Cada agente cumple un rol: uno lee la oferta en línea, otro analiza tu CV, otro planea, otro orquesta y al final un sintetizador entrega el resultado listo para usar.',
      problem: 'Ajustar el CV a cada oferta tomaba horas de mano y lectura; se terminaba mandando un CV genérico que no conversaba con lo que pedía la vacante.',
      solution: 'Flujo multiagente con LangChain: búsqueda de la oferta con Tavily, análisis del CV del usuario, planeación y orquestación por agentes, y síntesis final que arma el CV. La lectura y el análisis del documento quedan en manos del sistema, no del candidato.',
      impact: [
        'El CV se alinea a la oferta sin reescribirlo a mano',
        'La búsqueda de la vacante es automática, no manual',
        'Primera versión del CV lista en minutos, no en horas',
      ],
      images: [
        { alt: 'Pantalla principal de Joobia con la oferta y el CV cargados' },
        { alt: 'Flujo de agentes de Joobia analizando la oferta' },
        { alt: 'CV resultante de Joobia listo para revisión' },
      ],
    },
    'rag-agent': {
      title: 'Asistente IA — Base de Conocimiento',
      tagline: 'De buscar a mano a preguntar: el documento aparece con su cita.',
      role: 'Tech Lead — Diseño de Solución',
      client: 'Positiva · SASOFTCO',
      type: 'IA / Agentes',
      summary: 'Dirigí el diseño y la implementación de un agente con LangChain conectado a la base de conocimiento de Positiva. Se pregunta por un tema y devuelve el contenido más relevante desde toda la base, además de resumir la página en la que está trabajando el usuario. Está pensado para sumar capacidades y conectarse con otras funciones del sistema.',
      problem: 'Los funcionales perdían minutos importantes buscando a mano, acordándose del nombre del documento. Encontrar uno tomaba entre 4 y 5 minutos o más, y entenderlo, otro rato.',
      solution: 'Un agente con LangChain que se conecta a la base de datos RAG, encuentra el contenido más relevante y analiza el documento en cuestión de minutos. Las respuestas siempre están contrastadas con citas a las fuentes originales, así no inventa información.',
      impact: [
        'De 4–5 minutos (o más) a unos 30 segundos para encontrar un documento',
        'Un documento se entiende y analiza en minutos, no en horas',
        'Toda respuesta apunta a la fuente original con cita',
      ],
      images: [
        { alt: 'Pantalla del asistente de conocimiento de Positiva con una consulta resuelta', caption: 'El asistente responde consultas de toda la base de conocimiento.' },
        { alt: 'Conversación del asistente con citas a los documentos fuente' },
        { alt: 'Resultado con la fuente original consultada por el asistente' },
      ],
    },
    'generator-forms': {
      title: 'Generador de Formularios y Procesos',
      tagline: 'Un formulario que tardaba 8 a 16 horas, hoy se hace en minutos.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Gobierno',
      type: 'Producto',
      summary: 'Creador de formularios no-code con interfaz gráfica: creás variables, las editás y las ves aplicadas al instante, sin tocar JSON. Además permite armar procesos BPMN desde el navegador, con versionado para guardar y volver en el tiempo.',
      problem: 'Crear un formulario tomaba de 8 a 16 horas editando JSON a mano, y mantener los procesos BPMN exigía instalar el proveedor de escritorio en cada máquina.',
      solution: 'Interfaz gráfica para variables y formularios sin escribir JSON, y un editor BPMN embebido con la herramienta open source bpmn.io, con una capa propia para versionar, guardar y deshacer. Todo centralizado en la web, sin instalaciones.',
      impact: [
        'Crear un formulario pasó de 8–16 horas a minutos',
        'Se acabó editar JSON directo a mano',
        'Sin instalar el proveedor de escritorio para mantener BPMN',
      ],
      images: [
        { alt: 'Editor de formularios de Generator Forms con variables y configuración' },
        { alt: 'Diseño visual de variables en el generador de formularios' },
        { alt: 'Editor de procesos BPMN embebido con bpmn.io en el navegador' },
      ],
    },
    'form-visualizer': {
      title: 'Visualizador de Formularios',
      tagline: 'Un formulario entero que se dibuja solo desde su configuración.',
      role: 'Tech Lead / Frontend Architect',
      client: 'SASOFTCO · Interno',
      type: 'Producto',
      summary: 'Librería de frontend genérica que toma un formulario definido por un estándar empresarial y reconstruye sus componentes visualmente a partir del JSON de configuración. Detona eventos de cambio, valida campos (como los requeridos), muestra u oculta según condiciones, y soporta formularios lineales, por tabs o combinados, con secciones repetibles.',
      problem: 'Cada formulario nuevo implicaba dibujar componentes a mano en el frontend; según la complejidad, de horas a días de trabajo.',
      solution: 'Un visualizador declarativo que no depende de componentes pre-dibujados: se declara qué componentes se quieren y cada app decide su apariencia. Dos portales con distinta UI ya lo usan, cada uno con la estética que necesita.',
      impact: [
        'Representar componentes pasó de horas/días a segundos al cargar la configuración',
        'Sin tocar código para trazar un formulario',
        'Una sola librería sirve a portales con distinta apariencia',
      ],
      images: [
        { alt: 'Formulario renderizado por el visualizador desde su configuración' },
        { alt: 'Estructura del formulario con secciones y componentes declarados' },
      ],
    },
    'whatsapp-agente': {
      title: 'Asistente IA — Trámites por WhatsApp',
      tagline: 'El estado del trámite se pregunta, no se busca en el portal.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Gobierno',
      type: 'IA / Agentes',
      summary: 'Bot agéntico sobre WhatsApp Business con LangChain. El ciudadano consulta el estado de su trámite, recibe avisos si debe subsanar o información general, desde el canal más accesible. Solo cuando tiene que completar datos se le activa la URL para continuar en el portal del gobierno.',
      problem: 'El ciudadano tenía que entrar siempre al sitio web para saber el estado de su trámite, una fricción constante en pleno proceso de transformación digital.',
      solution: 'Un agente en LangChain sobre WhatsApp Business que responde en el canal que la gente ya usa. La primera fase está culminada y quedan capas por sumar para que el agente resuelva más cosas solo.',
      impact: [
        'Consultar el estado del trámite sin entrar al portal',
        'Aviso de subsanación directo al ciudadano en WhatsApp',
        'Primera fase en producción, con más capacidades planeadas',
      ],
      images: [
        { alt: 'Vista principal del bot de WhatsApp para consulta de trámites' },
        { alt: 'Mensaje de saludo del bot de WhatsApp', caption: 'El bot responde desde el saludo.' },
      ],
    },
    'portales-tramites': {
      title: 'Portales de Trámites Ciudadanos',
      tagline: 'De esperar 10–15 días yendo presencial a resolver en horas.',
      role: 'Tech Lead / Full Stack Dev',
      client: 'SASOFTCO · Gobierno',
      type: 'Gobierno',
      summary: 'Dos portales: uno donde el ciudadano radica su solicitud en línea y otro donde los funcionarios revisan el trámite, lo pasan por etapas, revisan formularios, piden subsanación y lo llevan hasta el final. Todo digital, y complementado con el generador de formularios para que administren sus procesos sin tocar código.',
      problem: 'Un trámite podía tardar de 10 a 15 días y obligaba al ciudadano a ir presencial.',
      solution: 'Radicación digital por parte del ciudadano y gestión por etapas por parte de los funcionarios, con revisión de formularios y pedidos de subsanación online.',
      impact: [
        'Resolución en horas o 3–5 días máximo, contra 10–15 días',
        'Atención presencial reducida en al menos un 50%',
        'Las entidades administran sus procesos sin intervención externa',
      ],
      images: [
        { alt: 'Portal ciudadano para radicación de trámites en línea' },
        { alt: 'Portal de funcionarios con el detalle de un trámite' },
        { alt: 'Gestión por etapas de un trámite en el portal de funcionarios' },
      ],
    },
    'spec-driven': {
      title: 'Spec-Driven Development — Estrategia de IA',
      tagline: 'El equipo trabaja con specs y decide qué modelo usar, sin atarse a uno.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'Plataforma / IA',
      summary: 'Lideré la estrategia de IA del equipo para optimizar el flujo con Spec-Driven Development y OpenSpec por debajo (framework Gentle-AI), trabajando con OpenCode. Propuse abrir el stack a modelos open-weight o de cualquier proveedor para no quedar lockeado con un vendor y elegir según precio y rendimiento, y complementar con modelos de frontera como Claude y OpenAI vía Claude Code y Codex para lo más complejo.',
      problem: 'Cada equipo escribía specs distintas, los agentes no tenían contexto de proyecto, y el stack de IA dependía de un único proveedor, limitando costos, modelo y flexibilidad.',
      solution: 'Estudiamos el estado de IA de la empresa, y desde mi rol lideré la estrategia: montar el flujo sobre SDD con OpenSpec (Gentle-AI) y OpenCode para trabajo diario con modelos open-weight o a preferencia, más un proveedor de frontera (Claude, OpenAI) con Claude Code y Codex para razonamiento avanzado y tareas pesadas: los dos mundos conviven según el costo y la complejidad.',
      impact: [
        'Sin vendor lock-in: libertad de elegir modelo por precio o rendimiento',
        'Dos mundos de IA: open-weight para el día a día y frontera para lo complejo',
        'Costos optimizados y productividad mejorada en todo el desarrollo',
      ],
      images: [],
    },
    'ai-pr-review': {
      title: 'Revisión de PRs con IA',
      tagline: 'Cada PR pasa por las reglas de la compañía antes del review humano.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'DevOps / IA',
      summary: 'Flujo de IA en pull requests que valida estándares de la compañía, detecta deuda técnica y sugiere refactors antes del review humano.',
      problem: 'Reviewers gastaban tiempo en hallazgos repetitivos.',
      solution: 'Pipeline en Azure DevOps con prompts especializados por lenguaje y reglas custom de la organización.',
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
      images: [
        { alt: 'Vista general de la arquitectura de microservicios de Jackcore' },
        { alt: 'Detalle de una de las capacidades reutilizables de Jackcore' },
        { alt: 'Consumo de las capacidades desde una aplicación Angular' },
      ],
    },
    'positiva-cmdb': {
      title: 'Positiva CMDB — Orquestación de Incidentes',
      tagline: 'SolarWinds → Aranda sin nadie copiando incidentes a mano.',
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
    'trip-planner': {
      title: 'Trip Planner IA',
      tagline: 'Frontend rediseñado para una startup adquirida por tripplanner.ai.',
      role: 'Frontend Architect',
      client: 'Startup · Freelance',
      type: 'Producto / IA',
      summary: 'Rediseño de la arquitectura frontend en React de Trip Planner IA — startup de planificación de viajes con IA posteriormente adquirida por tripplanner.ai.',
      problem: 'Arquitectura frontend acoplada limitaba escalar features de planificación con IA.',
      solution: 'Arquitectura por features, state management aislado, streaming UI para respuestas del modelo y observabilidad de prompts.',
      impact: ['Mejor rendimiento percibido', 'Base sostenible para nuevos features de IA'],
      images: [
        { alt: 'Mochilero observando montañas al atardecer', caption: 'Inspiración de viaje generada por el agente.' },
        { alt: 'Vista aérea de carretera de montaña al amanecer' },
      ],
    },
    'albertcts': {
      title: 'Landing AlbertCTS',
      tagline: 'Entregada en un 70% menos de tiempo con IA.',
      role: 'Full Stack Dev',
      client: 'AlbertCTS · Freelance',
      type: 'Web',
      summary: 'Landing entregada con Cursor + GitHub Copilot, reduciendo el tiempo total en ~70% comparado con el flujo tradicional.',
      problem: 'Cliente necesitaba presencia online con corto plazo de entrega.',
      solution: 'Componentes reusables, generación asistida y revisión humana.',
      impact: ['Time-to-market −70%', 'Cliente activo en producción'],
      images: [
        { alt: 'Página principal de la landing de AlbertCTS' },
      ],
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
    'joobia': {
      title: 'Joobia — CV optimization with agents',
      tagline: 'A multi-agent flow that tunes your CV against a real job offer.',
      role: 'Tech Lead / Architect',
      client: 'Own project · In progress',
      type: 'AI / Agents',
      summary: 'An agentic app that takes a job offer and puts together a CV that matches it. Each agent has a role: one reads the offer online, another analyzes your CV, another plans, another orchestrates, and a final synthesizer hands you the result ready to use.',
      problem: 'Tailoring the CV to each offer took hours by hand and a lot of reading, so people ended up sending a generic CV that didn\'t speak to what the job asked for.',
      solution: 'A multi-agent flow with LangChain: offer search with Tavily, CV analysis, planning and orchestration by agents, and a final synthesis that builds the CV. Reading and analyzing the document happens in the system, not by the candidate.',
      impact: [
        'The CV aligns with the offer without rewriting it by hand',
        'Finding the opening is automatic, not manual',
        'A first CV version is ready in minutes, not hours',
      ],
      images: [
        { alt: 'Joobia main screen with the job offer and CV loaded' },
        { alt: 'Joobia agent flow analyzing the job offer' },
        { alt: 'Resulting CV from Joobia ready for review' },
      ],
    },
    'rag-agent': {
      title: 'AI Assistant — Knowledge Base',
      tagline: 'From searching by hand to asking: the document shows up with its citation.',
      role: 'Tech Lead — Solution Design',
      client: 'Positiva · SASOFTCO',
      type: 'AI / Agents',
      summary: 'Led the design and implementation of a LangChain agent hooked into Positiva\'s knowledge base. Ask about a topic and it returns the most relevant content from the whole base, plus it can summarize the page the user is working on. It\'s built to add capabilities and connect with other parts of the system.',
      problem: 'Business users lost valuable minutes searching by hand, remembering the document\'s name. Finding one took 4 to 5 minutes or more, and reading it took even longer.',
      solution: 'A LangChain agent that connects to the RAG database, finds the most relevant content and analyzes the document in a matter of minutes. Answers always carry citations to the original sources, so it doesn\'t make things up.',
      impact: [
        'From 4–5 minutes (or more) to about 30 seconds to find a document',
        'A document gets read and analyzed in minutes, not hours',
        'Every answer points back to the source with a citation',
      ],
      images: [
        { alt: 'Positiva knowledge assistant screen with a resolved query', caption: 'The assistant answers queries across the whole knowledge base.' },
        { alt: 'Assistant conversation with citations to source documents' },
        { alt: 'Answer showing the original source consulted by the assistant' },
      ],
    },
    'generator-forms': {
      title: 'Form & Process Builder',
      tagline: 'A form that took 8–16 hours now takes minutes.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Government',
      type: 'Product',
      summary: 'A no-code form builder with a graphical interface: you create variables, edit them and see them applied instantly — no handwritten JSON. It also lets you build BPMN processes from the browser, with versioning to save and travel back in time.',
      problem: 'Building a form took 8 to 16 hours editing JSON by hand, and maintaining BPMN processes meant installing the desktop provider on every machine.',
      solution: 'A graphical interface for variables and forms with no JSON, plus an embedded BPMN editor using the open-source bpmn.io tool, with our own layer to version, save and undo. Everything is centralized on the web — no installs.',
      impact: [
        'Building a form went from 8–16 hours to minutes',
        'No more editing JSON by hand',
        'No desktop provider install to maintain BPMN',
      ],
      images: [
        { alt: 'Generator Forms form editor with variables and configuration' },
        { alt: 'Visual variable design in the form generator' },
        { alt: 'Embedded BPMN process editor using bpmn.io in the browser' },
      ],
    },
    'form-visualizer': {
      title: 'Form Visualizer',
      tagline: 'A whole form that draws itself from its configuration.',
      role: 'Tech Lead / Frontend Architect',
      client: 'SASOFTCO · Internal',
      type: 'Product',
      summary: 'A generic frontend library that takes a form defined by a company standard and rebuilds its components visually from the JSON configuration. It fires change events, validates fields (like required ones), shows or hides fields based on conditions, and supports linear, tabbed or combined forms with repeatable sections.',
      problem: 'Each new form meant drawing components by hand in the frontend; depending on complexity, from hours to days of work.',
      solution: 'A declarative visualizer that doesn\'t depend on pre-drawn components: you declare which components you want and each app decides its look. Two portals with different UI already use it, each with the styling it needs.',
      impact: [
        'Rendering components went from hours/days to seconds on config load',
        'Drawing a form without touching code',
        'One library serves portals with different appearances',
      ],
      images: [
        { alt: 'Form rendered by the visualizer from its configuration' },
        { alt: 'Form structure with declared sections and components' },
      ],
    },
    'whatsapp-agente': {
      title: 'AI Assistant — Procedures on WhatsApp',
      tagline: 'The procedure status gets asked, not searched on the portal.',
      role: 'Tech Lead',
      client: 'SASOFTCO · Government',
      type: 'AI / Agents',
      summary: 'An agentic bot on WhatsApp Business with LangChain. Citizens check the status of their procedure, get alerts if they need to fix something or general info, all from the most accessible channel. Only when they have to complete data does the URL kick in to continue on the government portal.',
      problem: 'Citizens had to log into the website every time to learn their procedure status — constant friction in the middle of a digital-transformation push.',
      solution: 'A LangChain agent on WhatsApp Business that answers on the channel people already use. The first phase is done and more layers are planned so the agent resolves more on its own.',
      impact: [
        'Checking procedure status without logging into the portal',
        'Fix-it alerts sent straight to the citizen on WhatsApp',
        'First phase live, with more capabilities planned',
      ],
      images: [
        { alt: 'Main view of the WhatsApp bot for checking procedure status' },
        { alt: 'Welcome message from the WhatsApp bot', caption: 'The bot responds from the very first greeting.' },
      ],
    },
    'portales-tramites': {
      title: 'Citizen Procedures Portals',
      tagline: 'From waiting 10–15 days in person to resolving in hours.',
      role: 'Tech Lead / Full Stack Dev',
      client: 'SASOFTCO · Government',
      type: 'Government',
      summary: 'Two portals: one where citizens file their request online and another where officials review the procedure, move it through stages, review forms, request fixes and take it to the end. Fully digital, and paired with the form builder so agencies run their own processes without touching code.',
      problem: 'A procedure could take 10 to 15 days and forced citizens to show up in person.',
      solution: 'Online filing by citizens and stage-by-stage handling by officials, with form review and fix requests done online.',
      impact: [
        'Resolution in hours or 3–5 days max, versus 10–15 days',
        'In-person visits cut by at least 50%',
        'Agencies manage their processes without outside help',
      ],
      images: [
        { alt: 'Citizen portal for filing procedures online' },
        { alt: 'Official portal with a procedure detail view' },
        { alt: 'Stage-by-stage management of a procedure in the official portal' },
      ],
    },
    'spec-driven': {
      title: 'Spec-Driven Development — AI Strategy',
      tagline: 'The team works from specs and picks the model — no vendor lock-in.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'Platform / AI',
      summary: 'Led the team\'s AI strategy to optimize the workflow with Spec-Driven Development on top of OpenSpec (the Gentle-AI framework), working through OpenCode. I pushed to open the stack to open-weight models or any provider so we\'re not locked to a vendor, choosing by price and performance, paired with frontier models like Claude and OpenAI via Claude Code and Codex for the tougher stuff.',
      problem: 'Each team wrote different specs, agents had no project context, and the AI stack depended on a single vendor, capping cost, model choice and flexibility.',
      solution: 'We studied the company\'s AI maturity, and from my role I led the strategy: setting up the flow on SDD with OpenSpec (Gentle-AI) and OpenCode for daily work with open-weight or preferred models, plus a frontier provider (Claude, OpenAI) with Claude Code and Codex for advanced reasoning and heavy tasks — both worlds coexist depending on cost and complexity.',
      impact: [
        'No vendor lock-in: free to pick models by price or performance',
        'Two AI worlds: open-weight for daily work, frontier for the complex',
        'Optimized costs and better productivity across development',
      ],
      images: [],
    },
    'ai-pr-review': {
      title: 'AI-powered PR Review',
      tagline: 'Every PR runs against company rules before human review.',
      role: 'Tech Lead',
      client: 'SASOFTCO',
      type: 'DevOps / AI',
      summary: 'AI workflow on pull requests that validates company standards, detects technical debt and suggests refactors before human review.',
      problem: 'Reviewers were spending time on repetitive findings.',
      solution: 'Azure DevOps pipeline with language-specialized prompts and custom organizational rules.',
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
      images: [
        { alt: 'Overall view of the Jackcore microservices architecture' },
        { alt: 'Detail of one of Jackcore\'s reusable capabilities' },
        { alt: 'Capabilities consumed from an Angular app' },
      ],
    },
    'positiva-cmdb': {
      title: 'Positiva CMDB — Incident Orchestration',
      tagline: 'SolarWinds → Aranda with no one retyping incidents by hand.',
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
    'trip-planner': {
      title: 'Trip Planner AI',
      tagline: 'Frontend redesigned for a startup acquired by tripplanner.ai.',
      role: 'Frontend Architect',
      client: 'Startup · Freelance',
      type: 'Product / AI',
      summary: 'Frontend architecture redesign in React for Trip Planner AI — an AI travel-planning startup later acquired by tripplanner.ai.',
      problem: 'Coupled frontend architecture limited scaling AI planning features.',
      solution: 'Feature-based architecture, isolated state management, streaming UI for model responses and prompt observability.',
      impact: ['Better perceived performance', 'Sustainable foundation for new AI features'],
      images: [
        { alt: 'Backpacker watching mountains at sunset', caption: 'Travel inspiration generated by the agent.' },
        { alt: 'Aerial view of a mountain road at sunrise' },
      ],
    },
    'albertcts': {
      title: 'AlbertCTS Landing',
      tagline: 'Delivered in 70% less time with AI.',
      role: 'Full Stack Dev',
      client: 'AlbertCTS · Freelance',
      type: 'Web',
      summary: 'Landing delivered with Cursor + GitHub Copilot, reducing total time by ~70% compared with the traditional flow.',
      problem: 'Client needed an online presence with a tight delivery deadline.',
      solution: 'Reusable components, AI-assisted generation and human review.',
      impact: ['Time-to-market −70%', 'Client live in production'],
      images: [
        { alt: 'Main landing page of the AlbertCTS site' },
      ],
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
