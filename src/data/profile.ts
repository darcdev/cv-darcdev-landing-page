export interface Profile {
  name: string;
  shortName: string;
  role: string;
  focus: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  years: number;
  bio: string;
  shortBio: string;
  available: boolean;
}

export const PROFILE: Profile = {
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
