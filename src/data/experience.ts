export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export const EXPERIENCE: Experience[] = [
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
