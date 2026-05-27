<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

## Current Feature: Astro CV Landing Page Migration

**Branch**: `001-astro-cv-migration`

**Plan**: [specs/001-astro-cv-migration/plan.md](specs/001-astro-cv-migration/plan.md)

### Quick Reference

- **Stack**: Astro 4.x, Preact, TypeScript
- **Styling**: Scoped CSS + design tokens from original `styles.css`
- **Structure**: Atomic design (atoms → molecules → organisms → islands)
- **Data**: TypeScript files + content collections

### Key Documents

- [Specification](specs/001-astro-cv-migration/spec.md) - User stories and requirements
- [Plan](specs/001-astro-cv-migration/plan.md) - Technical context and structure
- [Research](specs/001-astro-cv-migration/research.md) - Component inventory
- [Data Model](specs/001-astro-cv-migration/data-model.md) - TypeScript types
- [Quickstart](specs/001-astro-cv-migration/quickstart.md) - Development setup

### Constitution Principles

1. **Component-First Architecture** - Atomic design hierarchy
2. **Static-First, Islands for Interactivity** - Minimal JS shipping
3. **Design Fidelity (NON-NEGOTIABLE)** - 100% visual match with original
4. **Accessibility & Performance** - Lighthouse 95+, WCAG 2.1 AA
5. **Maintainability & Extensibility** - Content collections, CSS tokens

### Original Source Files (DO NOT MODIFY)

- `Portfolio.html` - HTML structure
- `styles.css` - 2424 lines of CSS (copy all classes intact)
- `app.jsx`, `components.jsx`, `views.jsx`, `data.jsx` - React source
<!-- SPECKIT END -->
