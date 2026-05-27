# Data Model: Astro CV Landing Page

**Branch**: `001-astro-cv-migration` | **Date**: 2026-05-26

## Entity Types

### Profile

```typescript
interface Profile {
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
```

### Experience

```typescript
interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}
```

### Skill

```typescript
interface SkillGroup {
  group: string;
  items: string[];
}
```

### Project

```typescript
interface Project {
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
```

### Post

```typescript
interface PostBodyBlock {
  type: 'p' | 'h2' | 'quote' | 'code';
  text: string;
  lang?: string;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readMin: number;
  featured: boolean;
  cover: 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';
  body: PostBodyBlock[];
}
```

## Derived Types

```typescript
type ProjectType = 'Todos' | 'IA / Agentes' | 'Plataforma / IA' | 'DevOps / IA' | 'Arquitectura' | 'Producto' | 'Producto / IA' | 'Web' | 'Mobile';

type PostCategory = 'Todos' | 'IA Aplicada' | 'Workflows con IA' | 'Arquitectura' | 'DevEx';

type CoverPattern = 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';

type Theme = 'light' | 'dark';

type Language = 'es' | 'en';
```

## Content Collections Schema

### Projects Collection

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    year: z.string(),
    role: z.string(),
    client: z.string(),
    status: z.enum(['Producción', 'Rollout', 'MVP', 'Adquirida']),
    type: z.string(),
    featured: z.boolean().default(false),
    liveUrl: z.string().url().optional(),
    tags: z.array(z.string()),
    summary: z.string(),
    problem: z.string(),
    solution: z.string(),
    impact: z.array(z.string()),
    stack: z.array(z.string()),
  }),
});
```

### Posts Collection

```typescript
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
    readMin: z.number(),
    featured: z.boolean().default(false),
    cover: z.enum(['rag', 'spec', 'mcp', 'arch', 'oss', 'pr']),
  }),
});
```

## Data Files Structure

```text
src/data/
├── profile.ts      # Profile object
├── experience.ts   # Experience[] array
├── skills.ts       # SkillGroup[] array
└── index.ts        # Re-exports all data

src/content/
├── config.ts       # Collection definitions
├── projects/
│   ├── rag-agent.yaml
│   ├── spec-driven.yaml
│   └── ...
└── posts/
    ├── rag-en-produccion.md
    ├── spec-driven.md
    └── ...
```

## State Management

### Theme State

```typescript
interface ThemeState {
  current: Theme;
  toggle: () => void;
}
```

Persisted in `localStorage` with key `theme`. Default derived from `prefers-color-scheme`.

### Language State

```typescript
interface LangState {
  current: Language;
  setLang: (lang: Language) => void;
}
```

Persisted in `localStorage` with key `lang`. Default: `es`.

### Navigation State

```typescript
interface NavState {
  activeSection: string;
  scrollTo: (sectionId: string) => void;
}
```

Managed by IntersectionObserver watching section visibility.

### Modal State

```typescript
interface ModalState {
  openProject: string | null;
  openPost: string | null;
  setOpenProject: (id: string | null) => void;
  setOpenPost: (id: string | null) => void;
}
```

## Utility Types

```typescript
interface TerminalLine {
  prompt?: string;
  cmd?: string;
  out?: React.ReactNode;
}

interface HeroShape {
  type: 'tri' | 'sq' | 'cir' | 'ring' | 'plus' | 'line' | 'dot';
  top: string;
  left: string;
  size: number;
  delay: number;
  rot: number;
  dur: number;
}

interface ContactLink {
  key: string;
  value: string;
  href: string | null;
  copyable: boolean;
}
```
