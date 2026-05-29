# Data Model: Breakpoint System

**Feature**: 003-standard-device-breakpoints
**Date**: 2026-05-28

## Entities

### Breakpoint

A viewport width threshold where layout behavior changes.

| Property | Type | Description |
|----------|------|-------------|
| name | string | Human-readable identifier (xs, md, lg, xl) |
| width | number | Pixel value (320, 768, 1024, 1280) |
| devices | string[] | Target devices for this breakpoint |
| layoutMode | enum | single-column, hybrid, multi-column, full-desktop |
| navMode | enum | hamburger, horizontal |

### Standard Breakpoints Definition (4 sizes)

```
xs  (320px)  → layoutMode: single-column,  navMode: hamburger
md  (768px)  → layoutMode: hybrid,         navMode: horizontal
lg  (1024px) → layoutMode: multi-column,   navMode: horizontal
xl  (1280px) → layoutMode: full-desktop,   navMode: horizontal
```

### Layout Mode

Describes the visual arrangement of content at each breakpoint.

| Mode | Description | Grid Columns |
|------|-------------|--------------|
| single-column | All content stacks vertically | 1 |
| hybrid | Some sections use 2 columns | 1-2 |
| multi-column | Most sections use grids | 2-3 |
| full-desktop | Original design with full grids | 2-4 |

### Navigation Mode

| Mode | Description | Trigger |
|------|-------------|---------|
| hamburger | Hidden menu, hamburger icon button | < 768px |
| horizontal | Full horizontal nav links visible | >= 768px |

## Component-Breakpoint Matrix (4 sizes)

| Component | 320px | 768px | 1024px | 1280px+ |
|-----------|-------|-------|--------|---------|
| Nav | hamburger | horizontal | horizontal | horizontal |
| Hero Grid | 1 col | 1 col | 2 col | 2 col |
| Avatar | 160px | 220px | 280px | 280px |
| Skills Grid | 1 col | 2 col | 2 col | 4 col |
| Stats Grid | 1 col | 2 col | 2 col | 4 col |
| Projects | compact | compact | expanded | expanded |
| Contact | 1 col | 1 col | 2 col | 2 col |

## CSS Media Query Map

### Current (Before)

```css
@media (max-width: 980px)  { /* tablet layouts */ }
@media (max-width: 768px)  { /* mobile layouts */ }
@media (max-width: 640px)  { /* small mobile - REMOVE */ }
@media (max-width: 480px)  { /* extra small - MERGE */ }
```

### Target (After) - 4 breakpoints only

```css
@media (max-width: 1024px) { /* tablet landscape, replaces 980px */ }
@media (max-width: 768px)  { /* tablet portrait, mobile nav trigger */ }
@media (max-width: 320px)  { /* small phones, minimum support */ }
```

## Validation Rules

1. **Only 4 breakpoints**: 320px, 768px, 1024px, 1280px+ (no 480px, 640px, 980px, 1440px)
2. **Consistent nav trigger**: Hamburger menu MUST trigger at exactly 768px
3. **Touch targets**: All interactive elements MUST be 44x44px minimum below 768px
4. **No horizontal scroll**: Content MUST fit within viewport at all breakpoints
5. **Desktop fidelity**: Layouts at 1280px+ MUST match original design exactly
