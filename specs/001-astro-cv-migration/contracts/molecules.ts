// Molecule Component Contracts
// specs/001-astro-cv-migration/contracts/molecules.ts

import type { Project, Post } from './entities';

export interface NavLinkProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export interface StatCellProps {
  value: string | number;
  label: string;
  mono?: boolean;
}

export interface TimelineItemProps {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
  current?: boolean;
}

export interface SkillCardProps {
  group: string;
  items: string[];
}

export interface HeroSocialProps {
  githubUrl: string;
  linkedinUrl: string;
  cvUrl: string;
}

export interface StripMarqueeProps {
  items: string[];
}

export interface HeroShapesProps {
  shapes?: Array<{
    type: 'tri' | 'sq' | 'cir' | 'ring' | 'plus' | 'line' | 'dot';
    top: string;
    left: string;
    size: number;
    delay: number;
    rot: number;
    dur: number;
  }>;
}

export interface MagCardProps {
  post: Post;
  variant: 'big' | 'side' | 'base';
  onClick: () => void;
}

export interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export interface ProjectRowProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export interface ContactLinkProps {
  label: string;
  value: string;
  href: string | null;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}

export interface FiltersProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export interface AvatarSVGProps {
  class?: string;
}

export interface AvatarBadgeProps {
  position: 1 | 2 | 3;
  children: React.ReactNode;
}
