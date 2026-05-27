# Implementation Plan: Astro CV Landing Page Migration

**Branch**: `001-astro-cv-migration` | **Date**: 2026-05-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-astro-cv-migration/spec.md`

## Summary

Migrate the existing React (CDN + Babel) CV landing page to Astro 4.x while preserving 100% design and functionality fidelity. The migration adopts Islands Architecture with Preact for interactive components (theme toggle, scroll spy, terminal animation, image galleries), atomic design structure, and TypeScript throughout. All 2400+ lines of CSS will be preserved with original class names.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode, Astro 4.x (latest stable)

**Primary Dependencies**:
- Astro 4.x (framework)
- Preact (islands for interactive components - lighter than React)
- @astrojs/preact (integration)
- astro-icon (SVG icon handling)

**Storage**: N/A (static site, data in TypeScript files and content collections)

**Testing**: 
- Playwright (visual regression, E2E)
- Lighthouse CI (performance/accessibility gates)
- Manual keyboard/screen reader testing

**Target Platform**: Static HTML/CSS/JS deployed to any static host (Vercel, Netlify, GitHub Pages)

**Project Type**: Static website (SSG mode)

**Performance Goals**: 
- Lighthouse Performance 95+
- LCP < 1.5s
- JS bundle < 50KB gzipped
- 60fps animations

**Constraints**: 
- Zero visual regression from original design
- Core content accessible with JS disabled
- WCAG 2.1 AA compliance

**Scale/Scope**: Single-page portfolio with 6 sections, ~15 components, 5 content types

## Constitution Check

*GATE: All principles verified before implementation.*

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Component-First Architecture | ✅ PASS | Atomic design hierarchy defined, scoped CSS per component |
| II. Static-First, Islands | ✅ PASS | Default static rendering, Preact islands for interactive features |
| III. Design Fidelity | ✅ PASS | All CSS classes preserved, visual regression testing planned |
| IV. Accessibility & Performance | ✅ PASS | Lighthouse gates defined, WCAG AA required |
| V. Maintainability & Extensibility | ✅ PASS | Content collections, CSS tokens, extensible structure |

## Project Structure

### Documentation (this feature)

```text
specs/001-astro-cv-migration/
├── plan.md              # This file
├── spec.md              # Feature specification ✅
├── research.md          # Phase 0: Component inventory, CSS analysis
├── data-model.md        # Phase 1: TypeScript types for all entities
├── contracts/           # Phase 1: Component props interfaces
│   ├── atoms.ts
│   ├── molecules.ts
│   └── organisms.ts
├── quickstart.md        # Phase 1: Dev setup instructions
├── checklists/
│   └── requirements.md  # Quality checklist ✅
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── atoms/           # Icon, Button, Chip, Badge, StatusPill
│   ├── molecules/       # NavLink, StatCell, TimelineItem, ProjectCard
│   ├── organisms/       # Nav, Hero, Terminal, AvatarSVG, Footer
│   └── islands/         # ThemeToggle, ScrollSpy, ProjectGallery, AskAI
├── layouts/
│   └── BaseLayout.astro # Main layout with head, nav, footer
├── pages/
│   ├── index.astro      # Homepage with all sections
│   └── blog/
│       └── [slug].astro # Individual blog post pages
├── content/
│   ├── projects/        # Project markdown/yaml files
│   └── posts/           # Blog post markdown files
├── data/
│   ├── profile.ts       # Personal info, contact, social links
│   ├── experience.ts    # Work history
│   └── skills.ts        # Skill categories and technologies
├── styles/
│   ├── tokens.css       # CSS custom properties (from :root in styles.css)
│   └── global.css       # Reset, base typography, shared utilities
├── assets/
│   ├── images/          # Optimized images
│   ├── fonts/           # Custom fonts if any
│   └── cv/              # CV PDF file
└── utils/
    ├── i18n.ts          # Language switching utilities
    └── animations.ts    # Reveal-on-scroll, typing effect utilities
```

### Original Files (SOURCE OF TRUTH - DO NOT MODIFY)

```text
Portfolio.html           # HTML structure reference
styles.css               # 2424 lines - ALL CSS to preserve
app.jsx                  # Root state management patterns
components.jsx           # Component implementations
views.jsx                # Section layouts
data.jsx                 # Content data
tweaks-panel.jsx         # Dev panel (optional migration)
image-slot.js            # Custom element for images
```

**Structure Decision**: Single Astro project with atomic design hierarchy. Interactive components use Preact islands. Content externalized to TypeScript data files and content collections for blog/projects.

## Complexity Tracking

No constitution violations identified. The structure follows all 5 principles with minimal complexity.

## Next Steps

1. **Phase 0 - Research**: Create `research.md` with component inventory from JSX files
2. **Phase 1 - Design**: Create `data-model.md` with TypeScript types, `contracts/` with component interfaces
3. **Phase 2 - Tasks**: Run `/speckit.tasks` to generate implementation checklist
4. **Phase 3 - Implementation**: Scaffold Astro project, migrate components following atomic hierarchy
