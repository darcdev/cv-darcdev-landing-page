# Research: Mobile Responsive Layout

**Feature**: 002-mobile-responsive-layout
**Date**: 2026-05-28

## Research Summary

This document captures research findings for implementing responsive layout across all device sizes.

---

## R1: Hamburger Menu Patterns for Preact

**Question**: What's the best pattern for hamburger menu in Preact islands?

**Decision**: Use local state with CSS-driven slide-in panel

**Rationale**:
- Preact already manages Nav state (theme, lang, active section)
- Adding `isMenuOpen` state is straightforward
- CSS transitions provide smooth animation without additional dependencies
- Maintains static-first principle: menu items render as HTML, JS only toggles visibility

**Alternatives Considered**:
- Full-screen overlay: Too heavy for simple navigation
- Bottom sheet: Non-standard for desktop-mobile hybrid sites
- Accordion: Doesn't fit floating pill nav design

**Implementation Notes**:
```tsx
const [menuOpen, setMenuOpen] = useState(false);
// Toggle hamburger icon ↔ X icon based on menuOpen
// Render nav-links in a slide-out panel when menuOpen && isMobile
```

---

## R2: Mobile Breakpoint Strategy

**Question**: What breakpoints should be used for responsive behavior?

**Decision**: Three-tier breakpoint system aligned with existing CSS

**Rationale**:
- 768px: Standard tablet/mobile split (already used in global.css)
- 640px: Small mobile adjustments (already used)
- 480px: Extra-small mobile (add for fine-tuning)
- Consistent with industry standards and existing codebase

**Breakpoint System**:
| Breakpoint | Range | Layout Behavior |
|------------|-------|-----------------|
| Desktop | 1025px+ | Full horizontal nav, two-column hero |
| Tablet | 769px-1024px | Horizontal nav (condensed), single-column hero |
| Mobile | 481px-768px | Hamburger menu, stacked layout |
| Small Mobile | 320px-480px | Hamburger menu, reduced padding |

---

## R3: Avatar Responsive Sizing

**Question**: How to size avatar component for mobile without overflow?

**Decision**: Use relative sizing with max-width constraints

**Rationale**:
- Current `.avatar-wrap` is 320px fixed on desktop, 280px on tablet
- Mobile needs fluid sizing: `min(200px, 60vw)` ensures it fits viewport
- Badges and orbit elements scale proportionally with parent

**Implementation**:
```css
@media (max-width: 768px) {
  .avatar-wrap {
    width: min(200px, 60vw);
    margin: 0 auto; /* center */
  }
  .avatar-photo { width: 80% !important; }
}
```

---

## R4: Touch Target Accessibility

**Question**: How to ensure 44x44px touch targets on mobile?

**Decision**: Add minimum size constraints to interactive elements in media queries

**Rationale**:
- WCAG 2.1 AAA recommends 44x44px minimum for touch targets
- Current nav links are ~34x34px on mobile
- Hamburger button must be at least 44x44px

**Implementation**:
```css
@media (max-width: 768px) {
  .nav-link, .nav-icon-btn { min-width: 44px; min-height: 44px; }
  .hamburger-btn { width: 44px; height: 44px; }
}
```

---

## R5: Preventing Horizontal Scroll

**Question**: How to prevent horizontal overflow on any viewport?

**Decision**: Combination of overflow-x: hidden on body + box-sizing audit

**Rationale**:
- Root cause is often fixed-width elements exceeding viewport
- Avatar was overflowing due to absolute positioning and fixed sizes
- Apply `max-width: 100%` to containers, use `min()` for fixed elements

**Implementation Checklist**:
- [ ] Add `overflow-x: hidden` to `.app` container
- [ ] Audit all absolute positioned elements (badges, shapes)
- [ ] Replace fixed widths with `min(fixed, 100%)` where appropriate
- [ ] Test at 320px viewport width

---

## Key Decisions Summary

| Topic | Decision |
|-------|----------|
| Menu Pattern | CSS slide-in with Preact state toggle |
| Breakpoints | 768px (tablet), 640px (small), 480px (xs) |
| Avatar Sizing | `min(200px, 60vw)` with auto margins |
| Touch Targets | 44x44px minimum on all interactive elements |
| Overflow Prevention | Container constraints + overflow-x: hidden |
