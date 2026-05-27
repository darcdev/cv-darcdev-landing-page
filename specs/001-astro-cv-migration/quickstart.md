# Quickstart: Astro CV Landing Page

**Branch**: `001-astro-cv-migration` | **Date**: 2026-05-26

## Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

## Setup

### 1. Create Astro Project

```bash
pnpm create astro@latest cv-astro -- --template minimal --typescript strict
cd cv-astro
```

### 2. Add Preact Integration

```bash
pnpm astro add preact
```

### 3. Project Structure

Create the following directory structure:

```bash
mkdir -p src/{components/{atoms,molecules,organisms,islands},layouts,pages/blog,content/{projects,posts},data,styles,assets/{images,cv},utils}
```

### 4. Copy Design Tokens

Extract CSS custom properties from `styles.css` to `src/styles/tokens.css`:

```bash
# Manual extraction required - see research.md for token list
```

### 5. Copy Global Styles

Copy remaining global styles (reset, typography, utilities) to `src/styles/global.css`.

## Development

```bash
pnpm dev
```

Opens at `http://localhost:4321`

## Build

```bash
pnpm build
```

Output in `dist/` directory.

## Preview Production Build

```bash
pnpm preview
```

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro configuration with Preact integration |
| `src/layouts/BaseLayout.astro` | Main layout with head, nav, footer |
| `src/pages/index.astro` | Homepage composing all sections |
| `src/styles/tokens.css` | CSS custom properties (design tokens) |
| `src/styles/global.css` | Global styles, reset, typography |
| `src/data/index.ts` | Data exports (profile, experience, skills) |
| `src/content/config.ts` | Content collection schemas |

## Testing

### Visual Regression

Compare screenshots against original `Portfolio.html`:

```bash
# Use Playwright or Percy for visual comparison
pnpm test:visual
```

### Lighthouse

```bash
pnpm lighthouse http://localhost:4321 --output html --output-path ./lighthouse-report.html
```

Target scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Accessibility

```bash
# Use axe-core or similar
pnpm test:a11y
```

## Migration Checklist

- [ ] Design tokens extracted to `tokens.css`
- [ ] Global styles copied to `global.css`
- [ ] Atoms created and styled
- [ ] Molecules composed from atoms
- [ ] Organisms built with molecules
- [ ] Islands hydrated for interactivity
- [ ] Sections composed in index.astro
- [ ] Data migrated to TypeScript/collections
- [ ] Theme toggle working
- [ ] Language selector working
- [ ] Scroll spy working
- [ ] All animations matching original
- [ ] Responsive breakpoints verified
- [ ] Lighthouse scores met
- [ ] Visual regression passed
