# Research: Standard Device Breakpoints

**Feature**: 003-standard-device-breakpoints
**Date**: 2026-05-28

## Research Questions

### Q1: What are industry-standard responsive breakpoints?

**Decision**: Use the following 6 breakpoints based on real device market share

| Breakpoint | Rationale | Source |
|------------|-----------|--------|
| 320px | iPhone SE (2nd/3rd gen), older Android - minimum viable | Apple Device Specs, StatCounter |
| 480px | Large phones landscape, Galaxy S series | Samsung Device Specs |
| 768px | iPad portrait (all generations), Android tablets | Apple Device Specs, industry standard |
| 1024px | iPad landscape, iPad Pro 11", small laptops | Apple Device Specs |
| 1280px | MacBook Air, standard laptops, 720p displays | Common laptop resolutions |
| 1440px | MacBook Pro 14", large laptops | Common laptop resolutions |

**Alternatives Considered**:

1. **Tailwind defaults** (640, 768, 1024, 1280, 1536): Rejected because 640px doesn't map to real devices
2. **Bootstrap defaults** (576, 768, 992, 1200, 1400): Rejected because 576px and 992px are arbitrary
3. **Material Design** (600, 905, 1240, 1440): Rejected because 600px and 905px don't align with Apple devices which dominate premium traffic

### Q2: What is the minimum supported viewport width?

**Decision**: 320px

**Rationale**:
- iPhone SE (2nd/3rd generation) has 375px logical width but users may have larger text enabled
- Android devices with 320px logical width still exist (Galaxy J series)
- Browser DevTools commonly test at 320px as minimum
- Supporting 320px ensures no edge cases break the layout

**Alternatives Considered**:
- 360px: Most common Android width, but excludes iPhone SE with accessibility settings
- 375px: iPhone 6/7/8 minimum, but excludes budget Android devices

### Q3: How should media queries be structured?

**Decision**: Mobile-first with `min-width` queries

**Rationale**:
- Base styles target 320px (smallest supported)
- Progressive enhancement adds complexity for larger screens
- Aligns with modern best practices and better performance (smaller devices get simpler CSS)

**Current State**: The codebase uses `max-width` (desktop-first) approach. Full migration to mobile-first would require extensive refactoring.

**Compromise Decision**: Keep `max-width` approach for this feature to minimize scope. Future refactor can address mobile-first migration.

### Q4: What CSS changes are needed for 320px support?

**Research Findings** (from current global.css analysis):

1. **Avatar**: Current `min(180px, 55vw)` at 480px = 176px at 320px. Needs adjustment to ensure proper margins.
2. **Container padding**: 16px at 480px. At 320px, content width = 320-32 = 288px. Acceptable.
3. **Hero headline**: `clamp(32px, 9vw, 46px)` at 320px = 28.8px. May need adjustment.
4. **Buttons**: Stack vertically at 480px. Should work at 320px.

**Decision**: Add explicit 320px breakpoint rules for:
- Avatar sizing: `min(160px, 50vw)` to ensure 8px+ margins
- Font sizes: Verify clamp formulas work correctly
- Verify no horizontal overflow

## Technical Decisions

### Breakpoint Token System

Define CSS custom properties for consistency:

```css
:root {
  --bp-xs: 320px;   /* Small phones */
  --bp-sm: 480px;   /* Large phones */
  --bp-md: 768px;   /* Tablets portrait */
  --bp-lg: 1024px;  /* Tablets landscape */
  --bp-xl: 1280px;  /* Laptops */
  --bp-2xl: 1440px; /* Large desktops */
}
```

**Note**: CSS custom properties cannot be used directly in media query conditions. These serve as documentation and can be used with CSS-in-JS or preprocessors if added later.

### Migration Path

1. Replace 980px → 1024px (direct substitution)
2. Merge 640px rules into 480px or 768px based on context
3. Add 320px rules where needed
4. Verify desktop (1280px+) unchanged

## References

- [StatCounter Global Stats - Screen Resolution](https://gs.statcounter.com/screen-resolution-stats)
- [Apple Device Specifications](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Material Design Responsive Layout](https://m3.material.io/foundations/layout/applying-layout)
- [CSS Tricks - Responsive Design Breakpoints](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/)
