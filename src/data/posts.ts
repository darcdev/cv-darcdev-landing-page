export type CoverPattern = 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';

export interface PostBodyBlock {
  type: 'p' | 'h2' | 'quote' | 'code';
  text: string;
  lang?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readMin: number;
  featured: boolean;
  cover: CoverPattern;
  body: PostBodyBlock[];
}

export const POSTS: Post[] = [
  {
    id: "rag-en-produccion",
    title: "Llevar un RAG a producción sin perder la cabeza",
    excerpt: "Lecciones del agente conversacional que construimos sobre LangChain + Weaviate: chunking, citas verificables, evaluaciones y la parte aburrida que nadie cuenta.",
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
    excerpt: "Por qué especificar antes de pedirle código a un agente cambia totalmente el resultado — y cómo lo estamos integrando con MCP.",
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
    excerpt: "MCP suena abstracto hasta que lo enchufas a tu Jira, tu repo y tu documentación. Aquí los tres servidores que más me ahorran tiempo.",
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
    excerpt: "Lo que aprendí liderando la migración de Jackcore. Spoiler: la parte técnica es la fácil.",
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
    excerpt: "Una guía honesta para decidir entre un modelo cerrado y uno open source según tu caso de uso, presupuesto y restricciones de datos.",
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
    excerpt: "Automatizar la revisión de PRs suena bien hasta que el bot empieza a comentar todo. Reglas, prompts y límites.",
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

export const CATEGORIES = ["Todos", ...Array.from(new Set(POSTS.map((p) => p.category)))];
