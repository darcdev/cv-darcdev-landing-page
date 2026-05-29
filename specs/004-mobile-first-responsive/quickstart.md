# Quickstart: Mobile-First Responsive Redesign

**Feature**: 004-mobile-first-responsive
**Date**: 2026-05-28

## Prerequisites

- Node.js 18+
- npm or pnpm
- Modern browser with DevTools

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

## Testing Breakpoints

### Browser DevTools Method

1. Open Chrome/Firefox DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test at each standard breakpoint:

| Width | Device Preset | What to Check |
|-------|---------------|---------------|
| 280px | Custom | No horizontal scroll, all content visible |
| 320px | iPhone SE | Info table stacked, bio readable |
| 375px | iPhone 12 | Blog cards one per row |
| 480px | Custom | Info table side-by-side |
| 768px | iPad Mini | Magazine layout, 2-col grids |
| 1024px | iPad Pro | Full tablet layout |
| 1280px | Laptop | Desktop design unchanged |

### Specific Component Tests

#### About Section (.bio-large, .kv-list)
- [ ] 280px: Bio text wraps, info table stacks vertically
- [ ] 480px: Info table switches to side-by-side
- [ ] 768px: Two-column grid layout

#### Blog Section (.blog-mag)
- [ ] 280px: All cards uniform, single column
- [ ] 768px: Magazine layout with featured card

#### Ask Diego (.ask)
- [ ] 280px: Single column stack
- [ ] 480px: Two-column grid layout
- [ ] Badges wrap at all widths

#### Contact Section
- [ ] 280px: Single column, links stacked
- [ ] 480px: Links side-by-side
- [ ] 768px: Two-column grid

#### Construimos Algo Juntos (.post-cta)
- [ ] 280px: No overflow, content contained
- [ ] All widths: No horizontal scrollbar

## Files to Modify

### Primary: `src/styles/global.css`

Convert all media queries from `max-width` to `min-width`:

```css
/* BEFORE (desktop-first) */
.component { /* desktop styles */ }
@media (max-width: 768px) { /* mobile override */ }

/* AFTER (mobile-first) */
.component { /* mobile styles */ }
@media (min-width: 768px) { /* desktop enhancement */ }
```

### Secondary: Component Scoped Styles

Check and update any scoped styles in:
- `src/components/molecules/AvatarSVG.astro`
- Other components with `<style>` blocks

## Build Verification

```bash
# Verify no build errors
npm run build

# Check for TypeScript errors
npm run astro check
```

## Lighthouse Audit

After changes, run Lighthouse mobile audit:

1. Open DevTools → Lighthouse tab
2. Select "Mobile" device
3. Check "Performance" category
4. Run audit
5. Verify score >= 90

## Checklist Before Done

- [ ] Base styles work at 280px minimum
- [ ] All 5 breakpoints tested (280, 480, 768, 1024, 1280)
- [ ] No horizontal scroll at any width
- [ ] Desktop (1280px+) unchanged
- [ ] Lighthouse mobile 90+
- [ ] Build passes
