# Quickstart: Standard Device Breakpoints

**Feature**: 003-standard-device-breakpoints
**Date**: 2026-05-28
**Status**: IMPLEMENTED

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

## Standard Breakpoints (4 sizes)

| Breakpoint | Device Preset | Layout |
|------------|---------------|--------|
| 320px | iPhone SE | Single column, hamburger nav |
| 768px | iPad Mini | 2-column grids, horizontal nav |
| 1024px | iPad Pro | Full tablet layout |
| 1280px+ | Laptop/Desktop | Full desktop design |

## Testing Breakpoints

### Browser DevTools Method

1. Open Chrome/Firefox DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test at each standard breakpoint in sequence:

### Specific Tests per Breakpoint

#### 320px (Minimum Mobile - CRITICAL)
- [ ] No horizontal scrollbar appears
- [ ] Avatar fits with margins on both sides (160px max)
- [ ] All text is readable (no overflow/truncation)
- [ ] Hamburger menu opens and closes smoothly
- [ ] Touch targets are 44x44px minimum
- [ ] Skills/Stats grids show 1 column
- [ ] Buttons stack vertically

#### 768px (Tablet / Nav Switch)
- [ ] Navigation switches to horizontal links
- [ ] Hamburger menu button disappears
- [ ] Hero shows single column, centered
- [ ] Skills/Stats grids show 2 columns
- [ ] Avatar size: ~220px

#### 1024px (Tablet Landscape / Small Laptop)
- [ ] Full grid layouts active
- [ ] Projects show compact view
- [ ] All sections use available horizontal space
- [ ] Hero still single column

#### 1280px+ (Desktop)
- [ ] Hero shows 2-column layout
- [ ] Skills/Stats grids show 4 columns
- [ ] Matches original desktop design exactly
- [ ] No visual differences from reference

## Implementation Summary

### Files Modified

1. **`src/styles/global.css`**
   - Changed 980px → 1024px (line 2154)
   - Removed 640px breakpoint
   - Changed 480px → 320px (line 2281)
   - Added single-column grid rules at 320px

2. **`src/components/molecules/AvatarSVG.astro`**
   - Changed 480px → 320px for avatar decorations

### Breakpoint Changes

| Before | After | Change |
|--------|-------|--------|
| 980px | 1024px | Industry standard tablet landscape |
| 640px | REMOVED | Merged into 768px or removed |
| 480px | 320px | Minimum mobile support |

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

## Final Checklist

- [x] Only 4 standard breakpoints (320, 768, 1024, 1280+)
- [ ] No horizontal scroll at any width
- [ ] Desktop (1280px+) unchanged
- [ ] Lighthouse mobile 90+
- [ ] Build passes
