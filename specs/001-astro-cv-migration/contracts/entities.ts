// Entity Type Contracts
// specs/001-astro-cv-migration/contracts/entities.ts

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

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  client: string;
  status: 'Producción' | 'Rollout' | 'MVP' | 'Adquirida';
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

export type ProjectType = 
  | 'Todos' 
  | 'IA / Agentes' 
  | 'Plataforma / IA' 
  | 'DevOps / IA' 
  | 'Arquitectura' 
  | 'Producto' 
  | 'Producto / IA' 
  | 'Web' 
  | 'Mobile';

export type PostCategory = 
  | 'Todos' 
  | 'IA Aplicada' 
  | 'Workflows con IA' 
  | 'Arquitectura' 
  | 'DevEx';

export type CoverPattern = 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';

export type Theme = 'light' | 'dark';

export type Language = 'es' | 'en';
