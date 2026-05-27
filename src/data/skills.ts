export interface SkillGroup {
  group: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
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
