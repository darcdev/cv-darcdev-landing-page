import { defaultLocale, resolveLocale, type LocaleCode } from '../i18n/config';

export interface ExperienceShared {
  id: string;
  company: string;
}

export interface ExperienceTranslated {
  role: string;
  location: string;
  period: string;
  highlights: string[];
  companyLabel?: string;
}

export interface Experience extends ExperienceShared, ExperienceTranslated {}

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
      role: 'Tech Lead — Desarrollo y Estrategia de IA',
      location: 'Bogotá, Colombia',
      period: 'Ago. 2024 – Presente',
      highlights: [
        'Lidero el proyecto Positiva ISARL, sistema central de la organización: dirijo la respuesta a los incidentes técnicos reportados y planeo la estrategia de migración para desacoplar el monolito en microservicios con Java (Spring) y .NET Core.',
        'Lideré el equipo de Positiva CMDB: definí la arquitectura y el modelo de datos de un portal que orquesta mediante n8n los incidentes de infraestructura — aplicaciones, servidores y sistemas — reportados en SolarWinds hacia Aranda, donde se crean tickets automáticamente, eliminando el reporte manual por operador y agilizando los tiempos de resolución.',
        'Lideré el diseño y construcción de un asistente para Positiva que responde consultas sobre la documentación organizacional en lenguaje natural (Python, LangChain, Weaviate), permitiendo a los usuarios funcionales encontrar respuestas en segundos en lugar de buscar manualmente entre cientos de páginas técnicas.',
        'Implemento optimizaciones en el proceso de desarrollo aplicando herramientas de IA y metodologías como Spec-Driven Development, apoyadas en las bases de conocimiento del proyecto, para agilizar los tiempos de entrega y unificar los estándares del equipo.',
        'Implementé revisiones automáticas de código en cada pull request, validando estándares de la compañía de forma consistente y liberando tiempo de revisión de los desarrolladores senior.',
        'Dirigí la migración del monolito Jackcore a una arquitectura de microservicios reutilizables en .NET Core (autenticación, BPMN, notificaciones, conversión de documentos, almacenamiento), reduciendo el costo y el tiempo de los nuevos desarrollos al permitir su reutilización entre múltiples sistemas.',
        'Brindo soporte técnico transversal a proyectos del portafolio (MinTIC, Alcaldía de Chiquinquirá, otras entidades), reduciendo tiempos de mantenimiento e incidentes en producción.',
      ],
    },
    'sasoftco-fullstack': {
      role: 'Full Stack Developer',
      location: 'Villavicencio, Colombia',
      period: 'Mar. 2023 – Ago. 2024',
      highlights: [
        'Diseñé y construí el generador dinámico de formularios de GovcodePro (Angular + Camunda Forms Modeler), reduciendo la creación de formularios complejos de días a minutos; hoy es componente clave de múltiples portales y trámites gubernamentales.',
        'Entregué el Portal de Trámites de Cormacarena (Angular y .NET Core) alineado a lineamientos del Gobierno Colombiano, digitalizando trámites ambientales y reduciendo los tiempos de respuesta ciudadana.',
        'Construí un Portal de Trámites Empresariales en Angular y .NET Core para MinTIC, alcaldías como Chiquinquirá y Zipaquirá, que automatiza gestión de trámites, autenticación y reportes, aumentando la eficiencia operativa de las entidades cliente.',
        'Implementé la Plataforma de Servicios Ciudadanos centralizada alineada a estándares de accesibilidad del gobierno, mejorando la experiencia de usuario en trámites en línea.',
      ],
    },
    'freelance': {
      role: 'Full Stack Developer — Independiente',
      companyLabel: 'Proyectos freelance',
      location: 'Colombia (Remoto)',
      period: 'Ene. 2022 – Presente',
      highlights: [
        'Desarrollé la landing page de Luminara con Claude Code, Cursor y flujos asistidos por IA, acelerando la entrega sin sacrificar calidad ni mantenibilidad.',
        'Implementé la landing page de AlbertCTS con Cursor, GitHub Copilot y prácticas de IA, reduciendo el tiempo de entrega en un 70%.',
        'Rediseñé la arquitectura frontend en React de Trip Planner IA, startup de planificación de viajes posteriormente adquirida por layla.com, mejorando escalabilidad y rendimiento en producción.',
        'Desarrollé un MVP móvil en React Native para una plataforma B2B de compra-venta de materiales, con trazabilidad de transacciones por cliente.',
      ],
    },
    'hewtec': {
      role: 'Backend Developer',
      location: 'Bogotá, Colombia',
      period: 'May. 2021 – Nov. 2021',
      highlights: [
        'Optimicé la herramienta Wizard de generación automatizada de plantillas full-stack (React, Node.js, Express, PostgreSQL) bajo arquitectura REST, acelerando el arranque de nuevos proyectos internos.',
        'Capacité a múltiples equipos internos en instalación, componentes y reutilización efectiva de la herramienta.',
      ],
    },
    'sc-business': {
      role: 'Frontend Developer',
      location: 'Villavicencio, Colombia',
      period: 'Jun. 2018 – Sep. 2019',
      highlights: [
        'Implementé el CMS del Centro Comercial Unicentro Villavicencio (JavaScript, Firebase, Firestore Realtime), reduciendo el tiempo de actualización de información de tiendas.',
        'Desarrollé aplicaciones web responsive con React.js, Firebase y Vanilla JS para múltiples negocios locales, optimizando su presencia digital.',
      ],
    },
  },
  en: {
    'sasoftco-techlead': {
      role: 'Tech Lead — Development & AI Strategy',
      location: 'Bogotá, Colombia',
      period: 'Aug 2024 – Present',
      highlights: [
        'Lead the Positiva ISARL project, the organization\'s core system: I drive the response to reported technical incidents and plan the migration strategy to decouple the monolith into microservices using Java (Spring) and .NET Core.',
        'Led the Positiva CMDB team: defined the architecture and data model of a portal that orchestrates via n8n infrastructure incidents — applications, servers and systems — reported in SolarWinds into Aranda, where tickets are created automatically, eliminating manual operator reporting and speeding up resolution times.',
        'Led the design and build of an assistant for Positiva that answers questions about organizational documentation in natural language (Python, LangChain, Weaviate), letting business users find answers in seconds instead of searching manually across hundreds of technical pages.',
        'Implement optimizations in the development process by applying AI tools and methodologies such as Spec-Driven Development, backed by project knowledge bases, to speed up delivery times and unify the team\'s standards.',
        'Implemented automated code review on every pull request, consistently validating company standards and freeing up review time for senior developers.',
        'Directed the migration of the Jackcore monolith to a reusable microservices architecture in .NET Core (authentication, BPMN, notifications, document conversion, storage), reducing the cost and time of new development by allowing reuse across multiple systems.',
        'Provide cross-functional technical support to portfolio projects (MinTIC, Alcaldía de Chiquinquirá, other agencies), reducing maintenance time and production incidents.',
      ],
    },
    'sasoftco-fullstack': {
      role: 'Full Stack Developer',
      location: 'Villavicencio, Colombia',
      period: 'Mar 2023 – Aug 2024',
      highlights: [
        'Designed and built GovcodePro\'s dynamic form generator (Angular + Camunda Forms Modeler), cutting complex form creation from days to minutes; now a core component across multiple government portals and procedures.',
        'Delivered Cormacarena\'s procedures portal (Angular and .NET Core) aligned with Colombian government guidelines, digitizing environmental procedures and reducing citizen response times.',
        'Built an enterprise procedures portal in Angular and .NET Core for MinTIC and municipal governments such as Chiquinquirá and Zipaquirá, automating procedure management, authentication, and reporting, increasing client agencies\' operational efficiency.',
        'Implemented a centralized Citizen Services Platform aligned with government accessibility standards, improving the user experience of online procedures.',
      ],
    },
    'freelance': {
      role: 'Full Stack Developer — Freelance',
      companyLabel: 'Freelance projects',
      location: 'Colombia (Remote)',
      period: 'Jan 2022 – Present',
      highlights: [
        'Built Luminara\'s landing page with Claude Code, Cursor, and AI-assisted workflows, accelerating delivery without sacrificing quality or maintainability.',
        'Implemented AlbertCTS\'s landing page with Cursor, GitHub Copilot, and AI practices, cutting delivery time by 70%.',
        'Redesigned the React frontend architecture of Trip Planner IA, an AI travel-planning startup later acquired by layla.com, improving scalability and production performance.',
        'Developed a React Native mobile MVP for a B2B materials marketplace, with per-client transaction traceability.',
      ],
    },
    'hewtec': {
      role: 'Backend Developer',
      location: 'Bogotá, Colombia',
      period: 'May 2021 – Nov 2021',
      highlights: [
        'Optimized the Wizard tool for automated full-stack template generation (React, Node.js, Express, PostgreSQL) under a REST architecture, accelerating the bootstrap of new internal projects.',
        'Trained multiple internal teams on installation, components, and effective reuse of the tool.',
      ],
    },
    'sc-business': {
      role: 'Frontend Developer',
      location: 'Villavicencio, Colombia',
      period: 'Jun 2018 – Sep 2019',
      highlights: [
        'Implemented the CMS for Unicentro Villavicencio shopping mall (JavaScript, Firebase, Firestore Realtime), reducing the time to update store information.',
        'Built responsive web applications with React.js, Firebase, and Vanilla JS for multiple local businesses, optimizing their digital presence.',
      ],
    },
  },
};

export function getExperiences(locale: string = defaultLocale): Experience[] {
  const code = resolveLocale(locale);
  const map = EXPERIENCES_BY_LOCALE[code];
  const fallback = EXPERIENCES_BY_LOCALE[defaultLocale];
  return EXPERIENCES_SHARED.map((shared) => {
    const translated = map[shared.id] ?? fallback[shared.id];
    const { companyLabel, ...rest } = translated;
    return {
      ...shared,
      ...rest,
      company: companyLabel ?? shared.company,
    };
  });
}

export const EXPERIENCE: Experience[] = getExperiences(defaultLocale);
