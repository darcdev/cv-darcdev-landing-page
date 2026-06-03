<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

## Current Feature: Dark Mode Contrast

**Branch**: `001-static-nav`

**Spec**: [specs/002-dark-mode-contrast/spec.md](specs/002-dark-mode-contrast/spec.md)

### Quick Reference

- **Stack**: Astro 4.x, Preact, TypeScript
- **Focus**: Improve badge and search field readability in dark mode
- **Problem**: Users struggle to notice the border and read text in the Ask section

### Key Change

1. **Ask Section** - Improve dark mode contrast and readability

### Key Documents

- [Specification](specs/002-dark-mode-contrast/spec.md) - User stories and requirements
- [Plan](specs/002-dark-mode-contrast/plan.md) - Technical context and migration strategy
- [Research](specs/002-dark-mode-contrast/research.md) - Dark mode contrast approach
- [Data Model](specs/002-dark-mode-contrast/data-model.md) - Theme state and visual elements
- [Quickstart](specs/002-dark-mode-contrast/quickstart.md) - Verification steps

### Constitution Principles

1. **Component-First Architecture** - Atomic design hierarchy
2. **Static-First, Islands for Interactivity** - Minimal JS shipping
3. **Design Fidelity (NON-NEGOTIABLE)** - Desktop unchanged, mobile adapts
4. **Accessibility & Performance** - 44x44px touch targets, Lighthouse 90+
5. **Maintainability & Extensibility** - Prefer flexbox over grid on mobile

### Files to Modify

- `src/components/...` - Update the Ask section styles for dark mode readability
- `src/styles/global.css` - Adjust shared theme tokens or section styles if needed
<!-- SPECKIT END -->
