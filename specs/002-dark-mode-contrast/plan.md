# Implementation Plan: Dark Mode Contrast

**Branch**: `001-static-nav` | **Date**: 2026-06-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-dark-mode-contrast/spec.md`

**Note**: This plan is for improving readability and border visibility in the Ask section's dark mode presentation.

## Summary

Improve the Ask section so badges and the search field remain clearly visible in dark mode, with stronger border definition and readable text while preserving the existing layout and light mode behavior.

## Technical Context

**Language/Version**: TypeScript / Astro 4.x / Preact

**Primary Dependencies**: Existing Astro component structure, global theme tokens, dark mode styling

**Storage**: N/A

**Testing**: Visual/manual verification and existing project checks

**Target Platform**: Web browser on desktop and mobile

**Project Type**: Web application / landing page

**Performance Goals**: No perceptible slowdown or layout shift from the style update

**Constraints**: Preserve current layout, keep changes scoped to the Ask section, maintain dark/light parity

**Scale/Scope**: Single section UI refresh within one page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Component-first architecture: pass, the change remains section-scoped and component-aligned.
- Static-first, islands for interactivity: pass, no new client-side behavior is introduced.
- Design fidelity: pass, the update improves contrast without changing the section layout.
- Accessibility & performance: pass, the purpose is to improve readability and input discoverability.
- Maintainability & extensibility: pass, the fix can be expressed through existing theme/styling patterns.

## Project Structure

### Documentation (this feature)

```text
specs/002-dark-mode-contrast/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── islands/
├── layouts/
├── pages/
├── styles/
└── data/

tests/
└── visual/
```

**Structure Decision**: Use the existing Astro component structure and limit changes to the Ask section styling and its supporting theme tokens.

## Complexity Tracking

No constitution violations identified.
