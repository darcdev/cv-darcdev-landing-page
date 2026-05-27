export type ProjectStatus = 'Producción' | 'Rollout' | 'MVP' | 'Adquirida';
export type CoverPattern = 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  client: string;
  status: ProjectStatus;
  type: string;
  featured: boolean;
  liveUrl?: string;
  tags: string[];
  summary: string;
  problem: string;
  solution: string;
  impact: string[];
  stack: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "rag-agent",
    title: "Agente Conversacional RAG",
    tagline: "Documentación organizacional consultada en lenguaje natural.",
    year: "2025",
    role: "Tech Lead",
    client: "SASOFTCO · Interno",
    status: "Producción",
    type: "IA / Agentes",
    featured: true,
    tags: ["Python", "LangChain", "Weaviate", "RAG", "LLMs"],
    summary: "Agente RAG sobre la base documental interna. Reemplaza búsquedas manuales sobre cientos de páginas técnicas por consultas conversacionales con citas verificables.",
    problem: "Los equipos funcionales perdían horas buscando información dispersa entre PDFs, wikis y repositorios.",
    solution: "Pipeline de ingesta con chunking semántico, embeddings y reranking sobre Weaviate. Capa de orquestación en LangChain con tools para autorización y trazabilidad.",
    impact: [
      "−85% tiempo de respuesta a consultas técnicas",
      "100% de respuestas con cita a fuente",
      "12 equipos adoptaron la herramienta en 3 meses",
    ],
    stack: ["Python", "LangChain", "Weaviate", "FastAPI", "OpenAI", "Docker"],
  },
  {
    id: "spec-driven",
    title: "Spec-Driven Development con IA",
    tagline: "De la especificación al código, con agentes auditados.",
    year: "2025",
    role: "Tech Lead",
    client: "SASOFTCO",
    status: "Rollout",
    type: "Plataforma / IA",
    featured: true,
    tags: ["MCP", "Agentes", "DevEx", "Spec-Driven"],
    summary: "Integración de bases de conocimiento de proyectos con agentes de IA mediante MCP. Reduce time-to-market y homogeniza la calidad del equipo.",
    problem: "Cada equipo escribía specs distintas; los agentes de IA no tenían contexto de proyecto.",
    solution: "Servidores MCP exponen specs, ADRs y estándares. Agent skills orquestan generación, revisión y aceptación con human-in-the-loop.",
    impact: [
      "Time-to-market reducido en proyectos piloto",
      "Estándares aplicados de forma automática",
      "Onboarding más corto para nuevos devs",
    ],
    stack: ["MCP", "Claude Code", "TypeScript", "Markdown", "GitHub Actions"],
  },
  {
    id: "ai-pr-review",
    title: "Revisión de PRs con IA",
    tagline: "Calidad automática como primera línea de defensa.",
    year: "2024",
    role: "Tech Lead",
    client: "SASOFTCO",
    status: "Producción",
    type: "DevOps / IA",
    featured: false,
    tags: ["CI/CD", "LLMs", "GitHub Actions"],
    summary: "Flujo de IA en pull requests que valida estándares de la compañía, detecta deuda técnica y sugiere refactors antes del review humano.",
    problem: "Reviewers gastaban tiempo en hallazgos repetitivos.",
    solution: "Pipeline en GitHub Actions con prompts especializados por lenguaje y reglas custom de la organización.",
    impact: ["−40% comentarios manuales repetitivos", "Mayor consistencia entre equipos"],
    stack: ["GitHub Actions", "TypeScript", "OpenAI", "Reglas custom"],
  },
  {
    id: "jackcore",
    title: "Migración Monolito → Microservicios",
    tagline: "Jackcore convertido en capacidades reutilizables.",
    year: "2024",
    role: "Tech Lead / Arquitecto",
    client: "SASOFTCO · Gobierno",
    status: "Producción",
    type: "Arquitectura",
    featured: true,
    tags: [".NET Core", "Spring Boot", "Angular", "Microservicios"],
    summary: "Lideré la migración del monolito Jackcore a una arquitectura de microservicios: autenticación, BPMN, notificaciones, conversión de documentos y almacenamiento.",
    problem: "El monolito frenaba la velocidad de nuevos desarrollos y dificultaba el reuso entre productos.",
    solution: "Identificación de capacidades transversales, contracts-first, gateways y autenticación centralizada consumidas desde apps Angular.",
    impact: [
      "Múltiples sistemas internos reutilizan las capacidades",
      "Costo de nuevos desarrollos reducido",
      "Despliegues independientes por dominio",
    ],
    stack: [".NET Core", "Java Spring Boot", "Angular", "SQL Server", "Oracle"],
  },
  {
    id: "govcodepro",
    title: "GovcodePro — Form Builder Dinámico",
    tagline: "De días a minutos para crear formularios complejos.",
    year: "2024",
    role: "Full Stack Dev",
    client: "SASOFTCO · Gobierno",
    status: "Producción",
    type: "Producto",
    featured: false,
    tags: ["Angular", "Camunda", "BPMN"],
    summary: "Generador dinámico de formularios integrado a Camunda Forms Modeler. Hoy es la base de varios portales y trámites gubernamentales.",
    problem: "Formularios complejos requerían días de desarrollo a la medida.",
    solution: "Motor declarativo con validaciones, reglas y orquestación BPMN.",
    impact: ["Creación de formularios pasó de días a minutos", "Adoptado por múltiples portales"],
    stack: ["Angular", "Camunda", "TypeScript", ".NET Core"],
  },
  {
    id: "trip-planner",
    title: "Trip Planner IA",
    tagline: "Frontend rediseñado para una startup adquirida por layla.com.",
    year: "2023",
    role: "Frontend Architect",
    client: "Startup · Freelance",
    status: "Adquirida",
    type: "Producto / IA",
    featured: true,
    liveUrl: "https://layla.com",
    tags: ["React", "TypeScript", "IA"],
    summary: "Rediseño de la arquitectura frontend en React de Trip Planner IA — startup de planificación de viajes con IA posteriormente adquirida por layla.com.",
    problem: "Arquitectura frontend acoplada limitaba escalar features de planificación con IA.",
    solution: "Arquitectura por features, state management aislado, streaming UI para respuestas del modelo y observabilidad de prompts.",
    impact: ["Mejor rendimiento percibido", "Base sostenible para nuevos features de IA"],
    stack: ["React", "TypeScript", "Vite", "OpenAI"],
  },
  {
    id: "luminara",
    title: "Landing Luminara",
    tagline: "Construida con Claude Code y Cursor, sin sacrificar calidad.",
    year: "2025",
    role: "Full Stack Dev",
    client: "Luminara · Freelance",
    status: "Producción",
    type: "Web",
    featured: false,
    liveUrl: "https://luminara.com",
    tags: ["Next.js", "Claude Code", "Cursor"],
    summary: "Landing construida principalmente con asistencia de IA (Claude Code + Cursor), con revisión humana continua para mantener calidad y mantenibilidad.",
    problem: "Time-to-market crítico para una landing con animaciones y SEO.",
    solution: "Workflow Spec-Driven con prompts versionados y revisión humana en cada commit.",
    impact: ["Entrega acelerada", "Código sostenible para iteraciones futuras"],
    stack: ["Next.js", "Tailwind", "TypeScript"],
  },
  {
    id: "albertcts",
    title: "Landing AlbertCTS",
    tagline: "70% menos tiempo de entrega con prácticas de IA.",
    year: "2024",
    role: "Full Stack Dev",
    client: "AlbertCTS · Freelance",
    status: "Producción",
    type: "Web",
    featured: false,
    liveUrl: "https://albertcts.com",
    tags: ["Cursor", "Copilot", "Next.js"],
    summary: "Landing entregada con Cursor + GitHub Copilot, reduciendo el tiempo total en ~70% comparado con el flujo tradicional.",
    problem: "Cliente necesitaba presencia online con corto plazo de entrega.",
    solution: "Componentes reusables, generación asistida y revisión humana.",
    impact: ["Time-to-market −70%", "Cliente activo en producción"],
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "b2b-materiales",
    title: "MVP B2B de Materiales",
    tagline: "App móvil con trazabilidad transaccional por cliente.",
    year: "2023",
    role: "Mobile Dev",
    client: "Confidencial · Freelance",
    status: "MVP",
    type: "Mobile",
    featured: false,
    tags: ["React Native", "Node.js", "B2B"],
    summary: "MVP móvil para una plataforma B2B de compra-venta de materiales con trazabilidad por cliente.",
    problem: "Operadores trabajaban con planillas y llamadas.",
    solution: "App nativa con flujo de cotización, orden y seguimiento.",
    impact: ["MVP validado con primeros clientes piloto"],
    stack: ["React Native", "Node.js", "PostgreSQL"],
  },
];

export const PROJECT_TYPES = ["Todos", ...Array.from(new Set(PROJECTS.map((p) => p.type)))];

export function pickCover(project: Project): CoverPattern {
  const map: Record<string, CoverPattern> = {
    "rag-agent": "rag",
    "spec-driven": "spec",
    "ai-pr-review": "pr",
    "jackcore": "arch",
    "govcodepro": "mcp",
    "trip-planner": "oss",
    "luminara": "spec",
    "albertcts": "rag",
    "b2b-materiales": "arch",
  };
  return map[project.id] || "rag";
}
