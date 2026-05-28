# Data Model: Mobile Responsive Layout

**Feature**: 002-mobile-responsive-layout
**Date**: 2026-05-28

## Overview

This feature primarily involves CSS and component behavior changes rather than data structures. The "data model" here describes the breakpoint system and state management for responsive behavior.

---

## Breakpoint System

### CSS Custom Properties (Design Tokens)

```css
:root {
  /* Responsive breakpoints */
  --bp-xs: 480px;    /* Extra small mobile */
  --bp-sm: 640px;    /* Small mobile */
  --bp-md: 768px;    /* Tablet / Mobile nav trigger */
  --bp-lg: 1024px;   /* Small desktop */
  --bp-xl: 1280px;   /* Large desktop */
}
```

### Breakpoint Behavior Matrix

| Component | xs (<480) | sm (480-640) | md (640-768) | lg (768-1024) | xl (1024+) |
|-----------|-----------|--------------|--------------|---------------|------------|
| Nav | Hamburger | Hamburger | Hamburger | Condensed horizontal | Full horizontal |
| Hero Grid | 1 column | 1 column | 1 column | 1 column | 2 columns |
| Avatar | 60vw max | 180px | 200px | 280px | 320px |
| Container padding | 16px | 18px | 18px | 24px | 24px |

---

## Component State

### Nav Component (Nav.tsx)

**New State**:
```typescript
interface NavState {
  active: string;           // Current section ID (existing)
  theme: "light" | "dark";  // Theme toggle (existing)
  lang: "es" | "en";        // Language (existing)
  langOpen: boolean;        // Lang dropdown open (existing)
  menuOpen: boolean;        // NEW: Mobile hamburger menu open
}
```

**Derived State**:
```typescript
// Detect mobile viewport (could be state or derived)
const isMobile = window.innerWidth < 768;
```

---

## Layout Structure Changes

### Hero Section Grid

**Desktop (1024px+)**:
```
┌─────────────────────────────────────┐
│ ┌─────────────────┐ ┌─────────────┐ │
│ │   Content       │ │   Avatar    │ │
│ │   (text, CTA)   │ │   + Social  │ │
│ └─────────────────┘ └─────────────┘ │
└─────────────────────────────────────┘
```

**Mobile (<768px)**:
```
┌───────────────────┐
│ ┌───────────────┐ │
│ │    Avatar     │ │
│ │  (centered)   │ │
│ └───────────────┘ │
│ ┌───────────────┐ │
│ │    Content    │ │
│ │  (centered)   │ │
│ └───────────────┘ │
└───────────────────┘
```

### Navigation Layout

**Desktop**:
```
┌──────────────────────────────────────────────────────┐
│ [logo] │ Home │ About │ Projects │ Blog │ Contact │ ⚙ │
└──────────────────────────────────────────────────────┘
```

**Mobile**:
```
┌─────────────────────────────┐
│ [logo]           [☰] [⚙]   │
└─────────────────────────────┘
        ↓ (when open)
┌─────────────────────────────┐
│ Home                        │
│ About                       │
│ Projects                    │
│ Blog                        │
│ Contact                     │
└─────────────────────────────┘
```

---

## CSS Class Mapping

| Component | Desktop Classes | Mobile Classes (added) |
|-----------|-----------------|------------------------|
| Nav container | `.nav`, `.nav-inner` | `.nav--mobile-open` |
| Nav links | `.nav-link` | `.nav-link--mobile` (in menu) |
| Hamburger | N/A | `.hamburger-btn`, `.hamburger-btn--open` |
| Mobile menu | N/A | `.mobile-menu`, `.mobile-menu--open` |
| Avatar wrap | `.avatar-wrap` | No new classes, media query sizing |
| Hero grid | `.hero-grid` | No new classes, media query layout |

---

## Responsive Utilities

### Visibility Helpers

```css
.hide-mobile { display: block; }
.show-mobile { display: none; }

@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
  .show-mobile { display: block !important; }
}
```

These will be used to show/hide hamburger button and mobile menu appropriately.
