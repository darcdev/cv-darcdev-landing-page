# Quickstart: Mobile Responsive Layout

**Feature**: 002-mobile-responsive-layout
**Date**: 2026-05-28

## Prerequisites

- Node.js 18+ installed
- pnpm/npm/yarn available
- Modern browser with DevTools (Chrome/Firefox recommended)

## Setup

```bash
# Clone and checkout feature branch
git checkout 002-mobile-responsive-layout

# Install dependencies
npm install

# Start dev server
npm run dev
```

Dev server runs at `http://localhost:4321`

## Development Workflow

### 1. Testing Responsive Changes

**Browser DevTools** (Recommended):
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Test at these widths: 320px, 480px, 640px, 768px, 1024px, 1280px

**Physical Devices**:
1. Find your local IP: `hostname -I` or check network settings
2. Access `http://<your-ip>:4321` from mobile device

### 2. Key Files to Modify

| File | Purpose |
|------|---------|
| `src/components/islands/Nav.tsx` | Hamburger menu logic |
| `src/components/molecules/AvatarSVG.astro` | Avatar responsive sizing |
| `src/styles/global.css` | Media queries (lines 2015-2059) |

### 3. CSS Testing Approach

```css
/* Quick debug: Add border to see element bounds */
.avatar-wrap { border: 2px solid red; }

/* Check for overflow sources */
* { outline: 1px solid rgba(255,0,0,0.2); }
```

### 4. Lighthouse Audit

After changes, run Lighthouse in Chrome DevTools:
1. Go to DevTools > Lighthouse tab
2. Select "Mobile" device
3. Check "Performance" and "Accessibility"
4. Click "Analyze page load"
5. Target: Performance 90+, Accessibility 100

## Verification Commands

```bash
# Build to catch TypeScript errors
npm run build

# Preview production build
npm run preview
```

## Breakpoint Reference

| Name | Width | Nav Behavior |
|------|-------|--------------|
| xs | < 480px | Hamburger |
| sm | 480-640px | Hamburger |
| md | 640-768px | Hamburger |
| lg | 768-1024px | Condensed |
| xl | > 1024px | Full |

## Common Issues

### Avatar Overflow
- Check `max-width` on `.avatar-wrap`
- Verify no fixed `left`/`right` positions pushing outside viewport

### Hamburger Not Appearing
- Confirm media query is `max-width: 768px`
- Check `menuOpen` state is updating
- Verify `.show-mobile` class is applied

### Horizontal Scroll
- Add `overflow-x: hidden` to `.app`
- Search for elements with `width > 100vw`
- Test at 320px viewport width

## Resources

- [Astro Responsive Images](https://docs.astro.build/en/guides/images/)
- [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [Preact State Management](https://preactjs.com/guide/v10/hooks/)
