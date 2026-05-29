# Data Model: Responsive Breakpoint System

**Feature**: 004-mobile-first-responsive
**Date**: 2026-05-28

## Entities

### Breakpoint

A viewport width threshold where layout behavior changes.

| Property | Type | Description |
|----------|------|-------------|
| name | string | Human-readable identifier (base, sm, md, lg, xl) |
| width | number | Pixel value (280, 480, 768, 1024, 1280) |
| query | string | CSS media query (`min-width: Xpx`) |
| devices | string[] | Target devices for this breakpoint |

### Standard Breakpoints (5 sizes - Mobile-First)

```
base (280px) → query: none (default styles)
sm   (480px) → query: @media (min-width: 480px)
md   (768px) → query: @media (min-width: 768px)
lg   (1024px) → query: @media (min-width: 1024px)
xl   (1280px) → query: @media (min-width: 1280px)
```

### Layout Mode

Describes the visual arrangement of content at each breakpoint.

| Mode | Description | Typical Usage |
|------|-------------|---------------|
| stack | All content stacks vertically | Base (mobile) |
| side-by-side | Two items on same row | 480px+ for key-value pairs |
| two-column | Grid with 2 columns | 768px+ for sections |
| multi-column | Grid with 3-4 columns | 1024px+ for grids |
| desktop | Full desktop layout | 1280px+ |

## Component-Breakpoint Matrix

| Component | Base (280) | 480px | 768px | 1024px | 1280px |
|-----------|------------|-------|-------|--------|--------|
| .bio-large | small text | larger | 2-col grid | same | same |
| .kv-list .row | stacked | side-by-side | same | same | same |
| .blog-mag | 1-col uniform | same | magazine | same | same |
| .ask | 1-col stack | 2-col grid | same | same | same |
| .contact-grid | 1-col | same | 2-col | same | same |
| .contact-link | stacked | side-by-side | same | same | same |
| .post-cta | constrained | same | full | same | same |

## CSS Media Query Map

### Current (Desktop-First)

```css
/* Base: desktop styles */
@media (max-width: 1024px) { /* tablet */ }
@media (max-width: 768px)  { /* mobile */ }
@media (max-width: 320px)  { /* small */ }
```

### Target (Mobile-First)

```css
/* Base: mobile styles (280px) */
@media (min-width: 480px) { /* large phones */ }
@media (min-width: 768px) { /* tablets */ }
@media (min-width: 1024px) { /* laptops */ }
@media (min-width: 1280px) { /* desktops */ }
```

## Component States by Breakpoint

### .kv-list .row

| Breakpoint | flex-direction | justify-content | text-align |
|------------|----------------|-----------------|------------|
| Base | column | flex-start | left |
| 480px+ | row | space-between | left/right |

### .ask

| Breakpoint | display | grid-template-columns | gap |
|------------|---------|----------------------|-----|
| Base | flex | n/a (column) | 24px |
| 480px+ | grid | 1fr 1fr | 36px |

### .blog-mag

| Breakpoint | Layout | Card Style |
|------------|--------|------------|
| Base | Single column | Uniform cards |
| 768px+ | Magazine grid | Featured + side + base cards |

### .contact-link

| Breakpoint | flex-direction | Layout |
|------------|----------------|--------|
| Base | column | Label on top, value below |
| 480px+ | row | Label left, value right |

## Validation Rules

1. **No horizontal scroll**: At any breakpoint, page width must not exceed viewport
2. **Touch targets**: All interactive elements ≥ 44x44px below 768px
3. **Text readability**: Minimum 14px font size, adequate line height
4. **Content visibility**: No content hidden or truncated unexpectedly
5. **Desktop fidelity**: Layout at 1280px+ must match original design exactly
