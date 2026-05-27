<!--
============================================================
SYNC IMPACT REPORT
============================================================
Version change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)

Modified principles: N/A (Initial version)

Added sections:
  - Core Principles (5 principles defined)
  - Technical Standards (stack, conventions)
  - Development Workflow
  - Governance

Removed sections: None

Templates requiring updates:
  - .specify/templates/plan-template.md: N/A (compatible)
  - .specify/templates/spec-template.md: N/A (compatible)
  - .specify/templates/tasks-template.md: N/A (compatible)

Follow-up TODOs: None
============================================================
-->

# CV Landing Page Constitution

## Core Principles

### I. Component-First Architecture

Every UI piece MUST be an Astro component (.astro) or framework component (React/Preact for interactive islands).
Components follow atomic design hierarchy: atoms → molecules → organisms → templates → pages.
Each component MUST be self-contained with its own styles (scoped CSS or CSS modules).
No global styles except design tokens (colors, typography, spacing) defined in a central theme.

**Rationale**: Enables reusability, testability, and maintainability. Mirrors the existing React component structure while leveraging Astro's superior static rendering.

### II. Static-First, Islands for Interactivity

Default to static HTML rendering. JavaScript MUST only ship for genuinely interactive features.
Interactive components (theme toggle, nav scroll spy, terminal animation, image galleries) use Astro Islands with `client:visible` or `client:idle` directives.
The landing page MUST work with JavaScript disabled for core content viewing.

**Rationale**: Optimal performance (Core Web Vitals), SEO benefits, and accessibility. Interactive features (theme switcher, terminal, Ask AI demo) are progressive enhancements.

### III. Design Fidelity (NON-NEGOTIABLE)

The Astro implementation MUST replicate the exact visual design from `Portfolio.html` and `styles.css`.
All animations, transitions, hover states, and responsive breakpoints MUST match the original.
The dot-grid background, floating shapes, SVG avatar with animations, and terminal typing effect MUST be preserved.
Dark/light theme support MUST work identically to the current implementation.

**Rationale**: The design was crafted intentionally. Migration to Astro is about architecture improvement, not redesign. Visual regression is unacceptable.

### IV. Accessibility & Performance Standards

All interactive elements MUST have proper ARIA labels and keyboard navigation.
Images MUST use Astro's `<Image>` component for optimization (WebP, lazy loading, responsive srcset).
Target Lighthouse scores: Performance 95+, Accessibility 100, Best Practices 100, SEO 100.
WCAG 2.1 AA compliance is required for all content and interactions.

**Rationale**: A professional CV/portfolio reflects the owner's technical standards. Accessibility and performance are non-negotiable quality indicators.

### V. Maintainability & Extensibility

Data (profile, experience, skills, projects, posts) MUST be externalized in content collections or TypeScript data files.
Styles MUST use CSS custom properties (design tokens) for theme consistency.
The project structure MUST support future additions: new sections, blog posts, projects, and i18n.
Code MUST be formatted with Prettier and follow Astro's recommended patterns.

**Rationale**: A personal portfolio evolves over time. The architecture must accommodate growth without major refactoring.

## Technical Standards

### Technology Stack

- **Framework**: Astro 4.x (latest stable)
- **Interactive Islands**: React 18 or Preact (for components requiring client-side state)
- **Styling**: Scoped CSS in Astro components + global design tokens
- **Language**: TypeScript for all `.ts` and `.astro` files with strict mode
- **Build**: Astro's built-in Vite bundler
- **Deployment**: Static output (SSG mode)

### Project Structure

```text
src/
├── components/          # Atomic design components
│   ├── atoms/           # Buttons, icons, badges, chips
│   ├── molecules/       # Cards, form groups, nav items
│   ├── organisms/       # Nav, Hero, Terminal, Footer
│   └── islands/         # Client-side interactive components
├── layouts/             # Page layouts (BaseLayout.astro)
├── pages/               # Route pages (index.astro, blog/[slug].astro)
├── content/             # Content collections (projects, posts)
├── data/                # Static data (profile, experience, skills)
├── styles/              # Global styles and design tokens
│   ├── tokens.css       # CSS custom properties
│   └── global.css       # Reset, base typography
├── assets/              # Static assets (images, fonts, CV PDF)
└── utils/               # Helper functions
```

### Naming Conventions

- Components: PascalCase (`HeroSection.astro`, `NavLink.astro`)
- Data files: camelCase (`profile.ts`, `projectsData.ts`)
- CSS classes: kebab-case (preserving original class names from `styles.css`)
- Content slugs: kebab-case (`rag-en-produccion.md`)

## Development Workflow

### Component Development Order

1. Setup project structure and design tokens from `styles.css`
2. Implement atoms (Icon, Button, Chip, Badge)
3. Build molecules (NavLink, StatusPill, StatCell)
4. Compose organisms (Nav, Hero, Terminal, Footer)
5. Create layouts and pages
6. Add interactive islands (theme toggle, scroll spy, animations)
7. Migrate data to content collections
8. Optimize and test

### Quality Gates

- All components MUST render without JavaScript for static content
- Visual comparison against original design at each milestone
- Lighthouse audit before merging any significant changes
- Manual keyboard navigation testing for all interactive elements

## Governance

This constitution establishes the non-negotiable standards for the CV Landing Page project.
Amendments require documentation of the rationale and impact on existing components.
All development decisions MUST align with these principles.
When in doubt, prioritize: Performance → Accessibility → Design Fidelity → Developer Experience.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
