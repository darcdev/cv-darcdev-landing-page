<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

## Current Feature: Mobile-First Responsive Redesign

**Branch**: `004-mobile-first-responsive`

**Spec**: [specs/004-mobile-first-responsive/spec.md](specs/004-mobile-first-responsive/spec.md)

### Quick Reference

- **Stack**: Astro 4.x, Preact, TypeScript
- **Focus**: Convert to mobile-first CSS, fix 6 responsive issues
- **Problem**: Current desktop-first CSS breaks on small devices, several sections overflow

### Standard Breakpoints (5 sizes - Mobile-First)

| Breakpoint | Target Devices | Approach |
|------------|----------------|----------|
| 280px      | Base (minimum) | Default styles |
| 480px      | Large phones | `@media (min-width: 480px)` |
| 768px      | Tablets portrait | `@media (min-width: 768px)` |
| 1024px     | Tablets landscape, small laptops | `@media (min-width: 1024px)` |
| 1280px+    | Laptops, desktops | `@media (min-width: 1280px)` |

### Sections to Fix

1. **About section** - Bio text must adapt to all sizes
2. **Info table** (.kv-list) - Stack label/value vertically on mobile
3. **Blog section** - Uniform cards, 1 per row on mobile
4. **Ask Diego** (.ask) - Convert 2-col grid to single column
5. **Construimos algo juntos** - Fix overflow
6. **Contact section** - Stack label/value vertically on mobile

### Key Documents

- [Specification](specs/004-mobile-first-responsive/spec.md) - User stories and requirements
- [Plan](specs/004-mobile-first-responsive/plan.md) - Technical context and migration strategy
- [Research](specs/004-mobile-first-responsive/research.md) - Mobile-first CSS patterns
- [Data Model](specs/004-mobile-first-responsive/data-model.md) - Breakpoint system design
- [Quickstart](specs/004-mobile-first-responsive/quickstart.md) - Development and testing setup

### Constitution Principles

1. **Component-First Architecture** - Atomic design hierarchy
2. **Static-First, Islands for Interactivity** - Minimal JS shipping
3. **Design Fidelity (NON-NEGOTIABLE)** - Desktop unchanged, mobile adapts
4. **Accessibility & Performance** - 44x44px touch targets, Lighthouse 90+
5. **Maintainability & Extensibility** - Prefer flexbox over grid on mobile

### Files to Modify

- `src/styles/global.css` - Convert to mobile-first media queries
- Various component `.astro` files with scoped styles
<!-- SPECKIT END -->
