# Implementation Plan: Mobile-First Responsive Redesign

**Branch**: `004-mobile-first-responsive` | **Date**: 2026-05-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-mobile-first-responsive/spec.md`

## Summary

Convert the CV landing page CSS from desktop-first (`max-width`) to mobile-first (`min-width`) approach, fixing 6 responsive issues identified by the user. The base styles target 280px minimum viewport, progressively enhancing to larger screens using 5 standard breakpoints: 280px (base), 480px, 768px, 1024px, 1280px.

## Technical Context

**Language/Version**: TypeScript (Astro 4.x), CSS3

**Primary Dependencies**: Astro, Preact (islands)

**Storage**: N/A (static site)

**Testing**: Visual regression via browser DevTools, Lighthouse audit

**Target Platform**: Web browsers (mobile, tablet, desktop)

**Project Type**: Static website (SSG)

**Performance Goals**: Lighthouse mobile 90+, no layout shifts

**Constraints**: 280px minimum viewport, 44x44px touch targets, no horizontal scroll

**Scale/Scope**: Single-page CV landing with ~10 sections, 6 components requiring fixes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Component-First | Scoped CSS in components | PASS | Changes to global.css + component scoped styles |
| II. Static-First | No new JS required | PASS | Pure CSS refactor |
| III. Design Fidelity | Desktop unchanged, mobile adapts | PASS | Desktop (1280px+) remains identical |
| IV. Accessibility | 44x44px touch targets | PASS | Spec requires touch targets |
| V. Maintainability | CSS custom properties | PASS | Can define breakpoint tokens |

**Gate Status**: PASS - All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/004-mobile-first-responsive/
├── plan.md              # This file
├── research.md          # Phase 0: Mobile-first CSS patterns
├── data-model.md        # Phase 1: Breakpoint system design
├── quickstart.md        # Phase 1: Development setup
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files to modify)

```text
src/
├── styles/
│   └── global.css           # Main responsive CSS (complete rewrite of media queries)
└── components/
    ├── atoms/               # Minor responsive adjustments
    ├── molecules/
    │   └── AvatarSVG.astro  # Avatar responsive styles
    └── organisms/           # Section-level responsive fixes
```

**Structure Decision**: CSS-only refactor. No new files needed. Modifications to existing responsive rules in `global.css` and component scoped styles.

## Mobile-First Strategy

### Current State (Desktop-First)

```css
/* Base styles: desktop */
.component { /* desktop styles */ }

/* Overrides for smaller screens */
@media (max-width: 1024px) { /* tablet */ }
@media (max-width: 768px) { /* mobile */ }
@media (max-width: 320px) { /* small mobile */ }
```

### Target State (Mobile-First)

```css
/* Base styles: mobile (280px minimum) */
.component { /* mobile-first styles */ }

/* Enhancements for larger screens */
@media (min-width: 480px) { /* large phones */ }
@media (min-width: 768px) { /* tablets */ }
@media (min-width: 1024px) { /* small laptops */ }
@media (min-width: 1280px) { /* desktops */ }
```

## Component Fix Strategy

### 1. About Section (.bio-large)
- Base: Full width, smaller font
- 480px+: Increase font size
- 768px+: Two-column grid layout

### 2. Info Table (.kv-list)
- Base: Stack label/value vertically (flex-direction: column)
- 480px+: Side-by-side layout (flex-direction: row)

### 3. Blog Section (.blog-mag)
- Base: Single column, uniform cards (no featured variation)
- 768px+: Magazine layout with featured cards

### 4. Ask Diego (.ask)
- Base: Single column stack
- 480px+: Two-column grid layout

### 5. Construimos Algo Juntos (.post-cta)
- Base: Constrain widths, wrap content
- 768px+: Full width layout

### 6. Contact Section (.contact-grid, .contact-link)
- Base: Single column, stacked label/value
- 480px+: Side-by-side label/value
- 768px+: Two-column grid

## Complexity Tracking

No constitution violations. Pure CSS refactor with no new abstractions.
