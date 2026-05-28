<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

## Current Feature: Mobile Responsive Layout

**Branch**: `002-mobile-responsive-layout`

**Plan**: [specs/002-mobile-responsive-layout/plan.md](specs/002-mobile-responsive-layout/plan.md)

### Quick Reference

- **Stack**: Astro 4.x, Preact, TypeScript
- **Focus**: Responsive CSS, hamburger menu, mobile layout
- **Breakpoints**: 768px (mobile nav), 640px (small), 480px (xs)
- **Key Changes**: Nav.tsx, AvatarSVG.astro, global.css

### Key Documents

- [Specification](specs/002-mobile-responsive-layout/spec.md) - User stories and requirements
- [Plan](specs/002-mobile-responsive-layout/plan.md) - Technical context and structure
- [Research](specs/002-mobile-responsive-layout/research.md) - Responsive patterns
- [Data Model](specs/002-mobile-responsive-layout/data-model.md) - Breakpoint system
- [Quickstart](specs/002-mobile-responsive-layout/quickstart.md) - Development setup

### Constitution Principles

1. **Component-First Architecture** - Atomic design hierarchy
2. **Static-First, Islands for Interactivity** - Minimal JS shipping
3. **Design Fidelity (NON-NEGOTIABLE)** - Desktop unchanged, mobile adapts proportionally
4. **Accessibility & Performance** - 44x44px touch targets, Lighthouse 90+
5. **Maintainability & Extensibility** - CSS custom properties for breakpoints

### Files to Modify

- `src/components/islands/Nav.tsx` - Add hamburger menu
- `src/components/molecules/AvatarSVG.astro` - Responsive sizing
- `src/styles/global.css` - Media queries (lines 2015-2059)
<!-- SPECKIT END -->
