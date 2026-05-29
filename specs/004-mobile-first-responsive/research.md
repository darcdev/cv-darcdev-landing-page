# Research: Mobile-First Responsive CSS

**Feature**: 004-mobile-first-responsive
**Date**: 2026-05-28

## Research Questions

### Q1: What are mobile-first CSS best practices?

**Decision**: Use `min-width` media queries starting from base mobile styles

**Rationale**:
- Base styles apply to all devices (280px+)
- Progressive enhancement adds complexity for larger screens
- Smaller CSS payloads for mobile users (base styles are simpler)
- Better performance on mobile devices (less CSS to parse/override)

**Alternatives Considered**:
1. **Desktop-first (max-width)**: Current approach. Rejected because it requires overriding complex styles for mobile.
2. **Container queries**: Modern approach but has browser support concerns (Safari 16+). Can be added later.
3. **CSS-in-JS**: Would require architecture changes. Rejected for scope control.

### Q2: What breakpoints should we use?

**Decision**: 5 standard breakpoints based on real device sizes

| Breakpoint | Query | Target Devices |
|------------|-------|----------------|
| 280px | Base (no query) | Minimum viewport, accessibility zoom |
| 480px | `min-width: 480px` | Large phones, landscape |
| 768px | `min-width: 768px` | Tablets portrait, iPad Mini |
| 1024px | `min-width: 1024px` | Tablets landscape, small laptops |
| 1280px | `min-width: 1280px` | Laptops, desktops |

**Rationale**:
- 280px: Covers very small devices and users with accessibility zoom
- 480px: iPhone Plus/Max in portrait, most Android phones
- 768px: iPad Mini/Air portrait, common tablet breakpoint
- 1024px: iPad Pro portrait, small laptops
- 1280px: Standard laptop width, desktop starting point

**Alternatives Considered**:
- **Tailwind defaults** (640, 768, 1024, 1280, 1536): 640px doesn't map to real devices
- **Bootstrap defaults** (576, 768, 992, 1200, 1400): Too many breakpoints, arbitrary values

### Q3: How should we handle flexbox vs grid?

**Decision**: Prefer flexbox for single-direction layouts, grid for 2D layouts

**Rationale**:
- Flexbox: Better for stacking (mobile), simpler mental model
- Grid: Better for complex layouts (tablet+), more powerful for magazine-style layouts

**Pattern**:
```css
/* Base: flexbox for stacking */
.component {
  display: flex;
  flex-direction: column;
}

/* 768px+: grid for complex layout */
@media (min-width: 768px) {
  .component {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### Q4: How to handle text scaling?

**Decision**: Use `clamp()` for fluid typography

**Pattern**:
```css
.heading {
  /* Fluid: min 24px, preferred 5vw, max 48px */
  font-size: clamp(24px, 5vw, 48px);
}
```

**Rationale**:
- Smooth scaling between breakpoints
- No jarring size jumps
- Respects user font size preferences

### Q5: How to prevent horizontal overflow?

**Decision**: Apply defensive CSS patterns

**Patterns**:
```css
/* Prevent image overflow */
img { max-width: 100%; height: auto; }

/* Prevent text overflow */
.text-container {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Prevent flex children from overflowing */
.flex-child { min-width: 0; }

/* Prevent grid children from overflowing */
.grid-child { min-width: 0; }
```

## Technical Decisions

### CSS Custom Properties for Breakpoints

Define breakpoint values as custom properties for documentation (cannot use in media queries directly):

```css
:root {
  --bp-sm: 480px;   /* Large phones */
  --bp-md: 768px;   /* Tablets */
  --bp-lg: 1024px;  /* Small laptops */
  --bp-xl: 1280px;  /* Desktops */
}
```

### Migration Strategy

1. **Phase 1**: Convert base styles to mobile-first (remove desktop assumptions)
2. **Phase 2**: Convert all `max-width` queries to `min-width` queries
3. **Phase 3**: Fix each component section (6 components)
4. **Phase 4**: Verify desktop unchanged, test all breakpoints

### Testing Strategy

For each breakpoint:
1. Open DevTools Device Toolbar
2. Set viewport to breakpoint width
3. Scroll through entire page
4. Verify no horizontal scrollbar
5. Verify touch targets (44x44px minimum)
6. Verify text readability

## References

- [CSS-Tricks: Mobile-First](https://css-tricks.com/how-to-develop-and-test-a-mobile-first-design-in-2021/)
- [Web.dev: Responsive Design](https://web.dev/responsive-web-design-basics/)
- [MDN: Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
