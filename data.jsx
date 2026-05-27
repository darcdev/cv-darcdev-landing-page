// Profile, projects and blog data
const PROFILE = {
  name: "Diego Andrés Cabrera Rojas",
  shortName: "Diego Cabrera",
  role: "Tech Lead · Arquitecto de Software",
  focus: "IA Aplicada al Desarrollo",
  location: "Bogotá, Colombia",
  email: "diegoandresrojas2000@gmail.com",
  phone: "+57 320 418 0598",
  linkedin: "linkedin.com/in/diego-cabrera",
  github: "github.com/diegocabrera",
  years: 7,
  bio: "Tech Lead con más de 7 años construyendo y liderando soluciones full-stack para gobierno y empresa privada. Combino arquitectura, código hands-on y liderazgo transversal — hoy aplicando IA al ciclo de desarrollo: agentes, RAG, MCP y Spec-Driven Development.",
  shortBio: "Construyo agentes, sistemas RAG y arquitecturas que conectan equipos con IA.",
  available: true,
};

const EXPERIENCE = [
  {
    role: "Tech Lead — Desarrollo & Estrategia de IA",
    company: "SASOFTCO",
    location: "Bogotá",
    period: "Ago 2024 – Presente",
    highlights: [
      "Diseñé un agente RAG en Python (LangChain + Weaviate) para consulta de documentación organizacional en lenguaje natural.",
      "Lidero la adopción de Spec-Driven Development integrando bases de conocimiento con agentes de IA.",
      "Migración del monolito Jackcore a microservicios reutilizables en .NET Core + Spring Boot.",
      "Flujos de IA en pull requests para revisión automática de código y estándares.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "SASOFTCO",
    location: "Villavicencio",
    period: "Mar 2023 – Ago 2024",
    highlights: [
      "Generador dinámico de formularios GovcodePro (Angular + Camunda).",
      "Portal de Trámites Cormacarena y Portal de Trámites Empresariales.",
      "Plataforma de Servicios Ciudadanos alineada a estándares de gobierno.",
    ],
  },
  {
    role: "Full Stack Developer — Independiente",
    company: "Freelance",
    location: "Remoto · Colombia",
    period: "Ene 2022 – Presente",
    highlights: [
      "Trip Planner IA — rediseño frontend en React (startup adquirida por layla.com).",
      "Landing de Luminara y AlbertCTS construidas con Claude Code, Cursor y Copilot.",
      "MVP móvil B2B en React Native para compra-venta de materiales.",
    ],
  },
  {
    role: "Backend Developer",
    company: "HEWTEC",
    location: "Bogotá",
    period: "May 2021 – Nov 2021",
    highlights: [
      "Mejoras al Wizard de generación de plantillas full-stack (React, Node, Postgres).",
    ],
  },
  {
    role: "Frontend Developer",
    company: "S&C Business Solutions",
    location: "Villavicencio",
    period: "Jun 2018 – Sep 2019",
    highlights: [
      "CMS del C.C. Unicentro Villavicencio (JS, Firebase, Firestore).",
    ],
  },
];

const SKILLS = [
  {
    group: "IA & Agentes",
    items: ["RAG", "LangChain", "Weaviate", "MCP", "Agent Skills", "Spec-Driven Dev", "Prompt Eng.", "Human-in-the-loop"],
  },
  {
    group: "Editores con IA",
    items: ["Cursor", "Claude Code", "GitHub Copilot", "OpenCode", "Codex"],
  },
  {
    group: "Frontend",
    items: ["Angular 14+", "React", "React Native", "TypeScript", "Next.js", "Gatsby", "Web Components"],
  },
  {
    group: "Backend",
    items: [".NET Core", "Java Spring Boot", "Node.js", "Express", "GraphQL", "REST"],
  },
  {
    group: "Arquitectura",
    items: ["Microservicios", "Clean Code", "SOLID", "BPMN", "AuthN/AuthZ"],
  },
  {
    group: "Datos",
    items: ["SQL Server", "PostgreSQL", "Oracle", "MongoDB", "Neo4j", "Firestore"],
  },
];

const PROJECTS = [
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
    summary:
      "Agente RAG sobre la base documental interna. Reemplaza búsquedas manuales sobre cientos de páginas técnicas por consultas conversacionales con citas verificables.",
    problem:
      "Los equipos funcionales perdían horas buscando información dispersa entre PDFs, wikis y repositorios.",
    solution:
      "Pipeline de ingesta con chunking semántico, embeddings y reranking sobre Weaviate. Capa de orquestación en LangChain con tools para autorización y trazabilidad.",
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
    summary:
      "Integración de bases de conocimiento de proyectos con agentes de IA mediante MCP. Reduce time-to-market y homogeniza la calidad del equipo.",
    problem:
      "Cada equipo escribía specs distintas; los agentes de IA no tenían contexto de proyecto.",
    solution:
      "Servidores MCP exponen specs, ADRs y estándares. Agent skills orquestan generación, revisión y aceptación con human-in-the-loop.",
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
    summary:
      "Flujo de IA en pull requests que valida estándares de la compañía, detecta deuda técnica y sugiere refactors antes del review humano.",
    problem: "Reviewers gastaban tiempo en hallazgos repetitivos.",
    solution:
      "Pipeline en GitHub Actions con prompts especializados por lenguaje y reglas custom de la organización.",
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
    summary:
      "Lideré la migración del monolito Jackcore a una arquitectura de microservicios: autenticación, BPMN, notificaciones, conversión de documentos y almacenamiento.",
    problem:
      "El monolito frenaba la velocidad de nuevos desarrollos y dificultaba el reuso entre productos.",
    solution:
      "Identificación de capacidades transversales, contracts-first, gateways y autenticación centralizada consumidas desde apps Angular.",
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
    summary:
      "Generador dinámico de formularios integrado a Camunda Forms Modeler. Hoy es la base de varios portales y trámites gubernamentales.",
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
    summary:
      "Rediseño de la arquitectura frontend en React de Trip Planner IA — startup de planificación de viajes con IA posteriormente adquirida por layla.com.",
    problem:
      "Arquitectura frontend acoplada limitaba escalar features de planificación con IA.",
    solution:
      "Arquitectura por features, state management aislado, streaming UI para respuestas del modelo y observabilidad de prompts.",
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
    summary:
      "Landing construida principalmente con asistencia de IA (Claude Code + Cursor), con revisión humana continua para mantener calidad y mantenibilidad.",
    problem: "Time-to-market crítico para una landing con animaciones y SEO.",
    solution:
      "Workflow Spec-Driven con prompts versionados y revisión humana en cada commit.",
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
    summary:
      "Landing entregada con Cursor + GitHub Copilot, reduciendo el tiempo total en ~70% comparado con el flujo tradicional.",
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
    summary:
      "MVP móvil para una plataforma B2B de compra-venta de materiales con trazabilidad por cliente.",
    problem: "Operadores trabajaban con planillas y llamadas.",
    solution: "App nativa con flujo de cotización, orden y seguimiento.",
    impact: ["MVP validado con primeros clientes piloto"],
    stack: ["React Native", "Node.js", "PostgreSQL"],
  },
];

const POSTS = [
  {
    id: "rag-en-produccion",
    title: "Llevar un RAG a producción sin perder la cabeza",
    excerpt:
      "Lecciones del agente conversacional que construimos sobre LangChain + Weaviate: chunking, citas verificables, evaluaciones y la parte aburrida que nadie cuenta.",
    category: "IA Aplicada",
    tags: ["RAG", "LangChain", "Weaviate"],
    date: "12 May 2026",
    readMin: 9,
    featured: true,
    cover: "rag",
    body: [
      { type: "p", text: "Construir un RAG en una notebook es fácil. Construirlo en producción, con usuarios reales preguntando lo impredecible, con documentos que cambian cada semana y con auditoría detrás, es otra cosa." },
      { type: "h2", text: "Lo que importa antes del modelo" },
      { type: "p", text: "Antes de elegir un modelo o una vector store, decide cómo se ve una buena respuesta. ¿Necesita citas? ¿Debe rechazar cuando no sabe? ¿Cuál es el costo aceptable por consulta?" },
      { type: "quote", text: "Un RAG sin evaluaciones es un demo. Con evaluaciones, es un producto." },
      { type: "h2", text: "Chunking: el detalle que decide todo" },
      { type: "p", text: "El chunking dicta el 60% de la calidad. Nosotros combinamos chunking semántico con un overlap calibrado y enriquecemos cada chunk con metadata estructurada (sección, fuente, fecha)." },
      { type: "code", lang: "python", text: "def chunk(doc):\n    sections = split_by_headings(doc)\n    return [\n        Chunk(\n            text=sec.text,\n            meta={\n                'source': doc.source,\n                'section': sec.title,\n                'updated': doc.updated_at,\n            },\n        )\n        for sec in sections\n    ]" },
      { type: "h2", text: "Citas, no alucinaciones" },
      { type: "p", text: "Cada respuesta del agente trae citas con enlace a la fuente original. Si el modelo no encuentra evidencia, responde 'no tengo información suficiente' antes que inventar. Suena obvio; muy pocos lo hacen bien." },
      { type: "h2", text: "Evaluación continua" },
      { type: "p", text: "Tenemos un golden set de ~150 preguntas reales. Cada cambio del prompt, del retriever o del modelo se evalúa antes de promover. Sin eso, cualquier cambio es una apuesta." },
    ],
  },
  {
    id: "spec-driven",
    title: "Spec-Driven Development: del prompt al producto",
    excerpt:
      "Por qué especificar antes de pedirle código a un agente cambia totalmente el resultado — y cómo lo estamos integrando con MCP.",
    category: "Workflows con IA",
    tags: ["Spec-Driven", "MCP", "DevEx"],
    date: "28 Abr 2026",
    readMin: 7,
    featured: true,
    cover: "spec",
    body: [
      { type: "p", text: "Pedirle a un LLM 'haz tal feature' sin contexto es como contratar a un dev senior y no decirle ni el dominio del negocio. Va a producir algo. Probablemente no lo que necesitas." },
      { type: "h2", text: "La spec como contrato" },
      { type: "p", text: "Trato la spec como el contrato entre humano y agente: requisitos, criterios de aceptación, ejemplos de input/output, ADRs relevantes, código a tocar." },
      { type: "h2", text: "MCP como puente" },
      { type: "p", text: "MCP nos permite exponer la base de conocimiento del proyecto al agente. La spec ya no se pega manualmente en el chat — el agente la consulta cuando la necesita." },
      { type: "code", lang: "ts", text: "// servidor MCP que expone specs y ADRs\nserver.tool('get_spec', async ({ id }) => {\n  return fs.readFile(`specs/${id}.md`);\n});" },
      { type: "h2", text: "Human-in-the-loop, siempre" },
      { type: "p", text: "El agente propone. El humano aprueba. La velocidad sube; la responsabilidad no se delega." },
    ],
  },
  {
    id: "mcp-en-la-practica",
    title: "MCP en la práctica: 3 integraciones que cambiaron mi flujo",
    excerpt:
      "MCP suena abstracto hasta que lo enchufas a tu Jira, tu repo y tu documentación. Aquí los tres servidores que más me ahorran tiempo.",
    category: "Workflows con IA",
    tags: ["MCP", "Agentes"],
    date: "10 Abr 2026",
    readMin: 6,
    featured: false,
    cover: "mcp",
    body: [
      { type: "p", text: "MCP es plumbing. No es sexy hasta que lo tienes funcionando." },
      { type: "h2", text: "1. Servidor de specs internas" },
      { type: "p", text: "Expone los specs y ADRs del repo. El agente entra con contexto, no a ciegas." },
      { type: "h2", text: "2. Servidor de tickets" },
      { type: "p", text: "Lee Jira/Linear. El agente puede revisar un ticket antes de proponer un PR." },
      { type: "h2", text: "3. Servidor de runbooks" },
      { type: "p", text: "Los runbooks de incidentes accesibles al agente de soporte. La primera línea responde en segundos." },
    ],
  },
  {
    id: "monolito-microservicios",
    title: "Migración monolito → microservicios: 7 lecciones",
    excerpt:
      "Lo que aprendí liderando la migración de Jackcore. Spoiler: la parte técnica es la fácil.",
    category: "Arquitectura",
    tags: ["Microservicios", "Arquitectura", ".NET Core"],
    date: "18 Mar 2026",
    readMin: 11,
    featured: false,
    cover: "arch",
    body: [
      { type: "p", text: "Migrar un monolito no se trata sólo de partir código. Se trata de partir un negocio, un equipo y un set de hábitos." },
      { type: "h2", text: "1. Empieza por las capacidades, no por los servicios" },
      { type: "p", text: "Identifica qué hace tu sistema que otros sistemas reusarían. Esas son tus primeras capacidades transversales." },
      { type: "h2", text: "2. Contracts-first" },
      { type: "p", text: "Define los contratos antes de tocar código. Si los contratos son inestables, todo lo demás también lo será." },
      { type: "h2", text: "3. Autenticación centralizada, temprano" },
      { type: "p", text: "Es la pieza que toca todo. Si no la centralizas pronto, cada servicio reinventa la rueda mal." },
    ],
  },
  {
    id: "open-source-models",
    title: "Modelos open source: cuándo sí, cuándo no",
    excerpt:
      "Una guía honesta para decidir entre un modelo cerrado y uno open source según tu caso de uso, presupuesto y restricciones de datos.",
    category: "IA Aplicada",
    tags: ["LLMs", "Open Source"],
    date: "02 Mar 2026",
    readMin: 8,
    featured: false,
    cover: "oss",
    body: [
      { type: "p", text: "La pregunta no es 'cuál modelo es mejor'. Es 'cuál modelo es mejor para este caso de uso, con estos datos y este presupuesto'." },
      { type: "h2", text: "Cuándo open source gana" },
      { type: "p", text: "Cuando los datos no pueden salir de tu infraestructura, cuando el volumen es masivo, cuando necesitas fine-tunear con tu dominio." },
      { type: "h2", text: "Cuándo no" },
      { type: "p", text: "Cuando necesitas el frontier inmediato, cuando no tienes equipo de MLOps, cuando el caso es de bajo volumen." },
    ],
  },
  {
    id: "ia-en-pull-requests",
    title: "IA en pull requests: cómo no romper al equipo",
    excerpt:
      "Automatizar la revisión de PRs suena bien hasta que el bot empieza a comentar todo. Reglas, prompts y límites.",
    category: "DevEx",
    tags: ["CI/CD", "DevEx", "Agentes"],
    date: "14 Feb 2026",
    readMin: 5,
    featured: false,
    cover: "pr",
    body: [
      { type: "p", text: "Un bot que comenta todo es ruido. Un bot bien afinado es una primera línea de defensa que el equipo agradece." },
      { type: "h2", text: "Reglas, no opiniones" },
      { type: "p", text: "El bot revisa estándares y reglas explícitas, no estilo subjetivo. El estilo se queda con los humanos." },
    ],
  },
];

const CATEGORIES = ["Todos", ...Array.from(new Set(POSTS.map((p) => p.category)))];
const PROJECT_TYPES = ["Todos", ...Array.from(new Set(PROJECTS.map((p) => p.type)))];

Object.assign(window, {
  PROFILE,
  EXPERIENCE,
  SKILLS,
  PROJECTS,
  POSTS,
  CATEGORIES,
  PROJECT_TYPES,
});
