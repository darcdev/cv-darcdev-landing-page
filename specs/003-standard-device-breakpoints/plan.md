# Implementation Plan: Standard Device Breakpoints

**Branch**: `003-standard-device-breakpoints` | **Date**: 2026-05-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-standard-device-breakpoints/spec.md`

## Summary

Refactor the responsive CSS to use **6 industry-standard breakpoints** based on real device sizes, replacing arbitrary values (980px, 640px) with standard ones. Primary focus is ensuring the design works at 320px minimum viewport width while maintaining desktop design fidelity.

## Technical Context

**Language/Version**: TypeScript (Astro 4.x), CSS3

**Primary Dependencies**: Astro, Preact (islands)

**Storage**: N/A (static site)

**Testing**: Visual regression via browser DevTools, Lighthouse audit

**Target Platform**: Web browsers (mobile, tablet, desktop)

**Project Type**: Static website (SSG)

**Performance Goals**: Lighthouse mobile 90+, no layout shifts

**Constraints**: 320px minimum viewport, 44x44px touch targets, no horizontal scroll

**Scale/Scope**: Single-page CV landing with ~10 sections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Component-First | Scoped CSS in components | PASS | Changes to global.css + AvatarSVG.astro scoped styles |
| II. Static-First | No new JS required | PASS | Pure CSS refactor |
| III. Design Fidelity | Desktop unchanged, mobile adapts | PASS | Desktop (1280px+) remains identical |
| IV. Accessibility | 44x44px touch targets | PASS | Existing hamburger meets requirement |
| V. Maintainability | CSS custom properties | PASS | Will define breakpoint tokens |

**Gate Status**: PASS - All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/003-standard-device-breakpoints/
├── plan.md              # This file
├── research.md          # Phase 0: Breakpoint standards research
├── data-model.md        # Phase 1: Breakpoint system design
├── quickstart.md        # Phase 1: Development setup
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files to modify)

```text
src/
├── styles/
│   └── global.css           # Main responsive CSS (lines 2153-2400)
└── components/
    └── molecules/
        └── AvatarSVG.astro  # Avatar scoped styles for 320px
```

**Structure Decision**: CSS-only refactor. No new files needed. Modifications to existing responsive rules in `global.css` and `AvatarSVG.astro`.

## Current State Analysis

### Existing Breakpoints (PROBLEM)

| Current Value | Usage | Issue |
|---------------|-------|-------|
| 980px | Hero grid, grids | **ARBITRARY** - not a real device |
| 768px | Nav, avatar, hero | **STANDARD** - iPad portrait |
| 640px | Container, nav, skills | **NON-STANDARD** - between devices |
| 480px | Hero, avatar, buttons | **STANDARD** - large phone |

### Target Breakpoints (SOLUTION)

| Breakpoint | Replaces | Devices |
|------------|----------|---------|
| 320px | (new) | iPhone SE, small Android |
| 480px | 480px | Large phones, landscape |
| 768px | 768px | iPad portrait |
| 1024px | 980px | iPad landscape, small laptops |
| 1280px | (desktop default) | Laptops |
| 1440px | (max-width container) | Large desktops |

## Migration Strategy

### Phase 1: Consolidate 980px → 1024px

Replace all `@media (max-width: 980px)` with `@media (max-width: 1024px)`.

### Phase 2: Eliminate 640px

- Container padding rules → merge into 768px or 480px
- Skills/stats grid rules → already in 480px, remove 640px duplicate
- Nav spacing → merge into 768px (handled by hamburger)

### Phase 3: Add 320px Support

- Verify avatar fits with margins
- Verify text doesn't overflow
- Verify buttons stack correctly
- Add explicit 320px rules if needed

### Phase 4: Verify Desktop Unchanged

- 1280px and above must match original design
- No visual changes at desktop widths

## Complexity Tracking

No constitution violations. Pure CSS refactor with no new abstractions.
