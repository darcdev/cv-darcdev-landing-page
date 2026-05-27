// Organism Component Contracts
// specs/001-astro-cv-migration/contracts/organisms.ts

import type { Project, Post, Experience, SkillGroup } from './entities';

export interface NavProps {
  active: string;
  scrollTo: (id: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  lang: 'es' | 'en';
  setLang: (lang: 'es' | 'en') => void;
  onHome?: () => void;
}

export interface TerminalProps {
  lines?: Array<{
    prompt?: string;
    cmd?: string;
    out?: React.ReactNode;
  }>;
  typingSpeed?: number;
  delayBetweenLines?: number;
}

export interface DotGridBgProps {
  smoothing?: number;
  cursorSmoothing?: number;
}

export interface ProjectGalleryProps {
  project: Project;
  slots?: number;
  variant?: 'card' | 'modal';
}

export interface AskAIProps {
  presets: Record<string, string>;
  defaultResponse?: string;
  defaultSources?: string;
}

export interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export interface PostPageProps {
  post: Post;
  onBack: () => void;
  openPost: (id: string) => void;
  relatedPosts: Post[];
  morePosts: Post[];
}

export interface FooterProps {
  year?: number;
  author?: string;
  location?: string;
}

// Section Props

export interface HeroSectionProps {
  scrollTo: (id: string) => void;
}

export interface AboutSectionProps {
  profile: {
    name: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    languages: string;
    available: boolean;
    modality: string;
  };
  experience: Experience[];
  skills: SkillGroup[];
  stats: Array<{ value: string; label: string; mono?: boolean }>;
}

export interface ProjectsSectionProps {
  projects: Project[];
  projectTypes: string[];
  openProject: (id: string) => void;
}

export interface BlogSectionProps {
  posts: Post[];
  categories: string[];
  openPost: (id: string) => void;
}

export interface ContactSectionProps {
  contacts: Array<{
    key: string;
    value: string;
    href: string | null;
    copyable: boolean;
  }>;
  cvUrl: string;
}

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}
