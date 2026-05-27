// Atom Component Contracts
// specs/001-astro-cv-migration/contracts/atoms.ts

export interface IconProps {
  name: 'github' | 'linkedin' | 'download' | 'arrow' | 'sun' | 'moon' | 'search';
  size?: number;
  class?: string;
}

export interface FlagProps {
  code: 'es' | 'en';
  class?: string;
}

export interface CoverProps {
  kind: 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';
  label?: string;
  class?: string;
}

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: string;
}

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'accent';
  children: string;
}

export interface ButtonProps {
  variant: 'primary' | 'outline' | 'ghost';
  href?: string;
  download?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface StatusPillProps {
  pulse?: boolean;
  children: React.ReactNode;
}
