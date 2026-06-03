# Implementation Plan: Static Nav Menu

**Branch**: `[001-static-nav]` | **Date**: 2026-05-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-static-nav/spec.md`

## Summary

Keep the site navigation visible during page scroll so visitors can move around the long landing page without returning to the top. The implementation is a small UI behavior adjustment in the existing navigation component and responsive stylesheet.

## Technical Context

**Language/Version**: TypeScript, Astro 4.x, Preact

**Primary Dependencies**: Astro, Preact hooks, existing global stylesheet

**Storage**: N/A

**Testing**: Manual browser verification and responsive viewport checks

**Target Platform**: Web browser

**Project Type**: Web application

**Performance Goals**: Navigation remains visible during normal scroll without layout jumps

**Constraints**: Preserve current visual design and mobile menu behavior

**Scale/Scope**: Single landing page, shared navigation used across the site shell

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Component-First Architecture: pass
- Static-First, Islands for Interactivity: pass
- Design Fidelity (NON-NEGOTIABLE): pass
- Accessibility & Performance Standards: pass
- Maintainability & Extensibility: pass

## Project Structure

### Documentation (this feature)

```text
specs/001-static-nav/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
src/
├── components/
│   └── islands/
│       └── Nav.tsx
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
└── styles/
    └── global.css
```

**Structure Decision**: Update the existing nav island and its global styles only; no new feature modules are needed.

## Complexity Tracking

No constitution violations require justification.
