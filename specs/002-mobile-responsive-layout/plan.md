# Implementation Plan: Mobile Responsive Layout

**Branch**: `002-mobile-responsive-layout` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-mobile-responsive-layout/spec.md`

## Summary

Make the CV landing page fully responsive across all device sizes. Key changes include: (1) Transform the horizontal Nav into a hamburger menu on mobile, (2) Fix avatar overflow and center it on mobile, (3) Ensure all sections stack and center properly on small screens.

## Technical Context

**Language/Version**: TypeScript 5.6 with Astro 4.16

**Primary Dependencies**: Astro 4.x, Preact 10.x, CSS (scoped + global)

**Storage**: N/A (static site)

**Testing**: Manual visual testing, Lighthouse audits, browser DevTools responsive mode

**Target Platform**: Web browsers (desktop, tablet, mobile) - 320px to 1920px viewport width

**Project Type**: Static website (SSG)

**Performance Goals**: Lighthouse mobile score 90+, no layout shift during resize

**Constraints**: No horizontal scrollbar at any viewport width, touch targets 44x44px minimum

**Scale/Scope**: Single page application with 6 main sections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | PASS | Changes will be in existing components (Nav.tsx, AvatarSVG.astro) + global CSS media queries |
| II. Static-First, Islands for Interactivity | PASS | Nav is already an island; hamburger toggle is interactive feature requiring JS |
| III. Design Fidelity (NON-NEGOTIABLE) | PASS | Mobile layout adapts design proportionally; desktop remains unchanged |
| IV. Accessibility & Performance Standards | PASS | Touch targets 44x44px, keyboard navigation for hamburger menu |
| V. Maintainability & Extensibility | PASS | Using CSS custom properties for breakpoints, modular component updates |

**Gate Result**: PASS - No violations

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-responsive-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output - responsive patterns
├── data-model.md        # Phase 1 output - breakpoint system
├── quickstart.md        # Phase 1 output - dev setup
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── islands/
│   │   └── Nav.tsx           # UPDATE: Add hamburger menu logic
│   ├── molecules/
│   │   └── AvatarSVG.astro   # UPDATE: Responsive sizing
│   └── organisms/
│       └── HeroSection.astro # UPDATE: Mobile layout adjustments
├── styles/
│   └── global.css            # UPDATE: Add/enhance media queries
└── layouts/
    └── BaseLayout.astro      # No changes expected
```

**Structure Decision**: Single Astro project with component updates and CSS enhancements. No new directories needed.
