# Research: Astro CV Landing Page Migration

**Branch**: `001-astro-cv-migration` | **Date**: 2026-05-26

## Component Inventory

### From `components.jsx` (554 lines)

| Component | Type | Interactive | Migration Target | Notes |
|-----------|------|-------------|------------------|-------|
| `DotGridBg` | Background | Yes (mouse tracking) | Island (Preact) | Mouse-following glow effect, requires `requestAnimationFrame` |
| `Icon` | Object | No | Atom (Astro) | SVG icons: github, linkedin, download, arrow, sun, moon, search |
| `Nav` | Navigation | Yes (scroll spy, theme, lang) | Organism (Preact Island) | State: active section, theme toggle, language dropdown |
| `FlagES` / `FlagEN` | SVG | No | Atom (Astro) | Inline SVG flags for language selector |
| `AvatarSVG` | Visual | Yes (CSS animations) | Molecule (Astro) | Animated SVG with floating badges, blinking eyes, orbit animation |
| `HeroSocial` | Links | No | Molecule (Astro) | GitHub, LinkedIn, Download CV buttons |
| `Terminal` | Animation | Yes (typing effect) | Island (Preact) | Typing animation with `useState`, `useEffect`, `setInterval` |
| `StripMarquee` | Visual | No (CSS only) | Molecule (Astro) | CSS infinite scroll animation, no JS needed |
| `Cover` | Visual | No | Atom (Astro) | Pattern backgrounds for cards/posts |
| `Filters` | Input | Yes | Molecule (Preact) | Filter chips with active state |
| `Reveal` | Animation | Yes (IntersectionObserver) | Utility (Astro directive) | Reveal-on-scroll wrapper |
| `AskAI` | Demo | Yes (input, click) | Island (Preact) | RAG demo with presets and simulated responses |
| `Footer` | Layout | No | Organism (Astro) | Static footer |

### From `views.jsx` (926 lines)

| Component | Type | Interactive | Migration Target | Notes |
|-----------|------|-------------|------------------|-------|
| `HeroShapes` | Decorative | No (CSS only) | Molecule (Astro) | 12 floating shapes with CSS animations |
| `HeroSection` | Section | Partial | Template (Astro) | Composes HeroShapes, AvatarSVG, Terminal, StripMarquee |
| `AboutSection` | Section | Partial | Template (Astro) | Bio, stats, timeline, skills grid |
| `ProjectsSection` | Section | Yes | Template (Astro + Islands) | Featured cards, filters, search, modal trigger |
| `ProjectGallery` | Gallery | Yes | Island (Preact) | Image carousel with arrows, dots, counter |
| `AskSection` | Section | Partial | Template (Astro) | Wraps AskAI component |
| `MagCard` | Card | Yes (click) | Molecule (Astro) | Blog card with cover, eyebrow, title, excerpt |
| `BlogSection` | Section | Yes | Template (Astro + Islands) | Magazine layout, category filters |
| `ContactSection` | Section | Yes | Template (Astro) | Copy-to-clipboard functionality |
| `ProjectModal` | Modal | Yes | Island (Preact) | Full project details, escape to close |
| `PostPage` | Page | Yes | Page (Astro) | Full blog post with TOC, progress bar, author bio |
| `PostModal` | Modal | Yes | Deprecated | Kept for backwards compat, use PostPage instead |

### From `data.jsx` (429 lines)

| Data | Records | Migration Target |
|------|---------|------------------|
| `PROFILE` | 1 object | `src/data/profile.ts` |
| `EXPERIENCE` | 5 entries | `src/data/experience.ts` |
| `SKILLS` | 6 categories | `src/data/skills.ts` |
| `PROJECTS` | 9 projects | `src/content/projects/*.yaml` or `src/data/projects.ts` |
| `POSTS` | 6 posts | `src/content/posts/*.md` |
| `CATEGORIES` | Derived | Computed from posts |
| `PROJECT_TYPES` | Derived | Computed from projects |

## Interactive Components Summary

Components requiring client-side JavaScript (Islands):

1. **DotGridBg** - Mouse tracking for glow effect
2. **Nav** - Scroll spy, theme toggle, language dropdown
3. **Terminal** - Typing animation with intervals
4. **Filters** - State for active filter
5. **AskAI** - Input handling, preset clicks, simulated responses
6. **ProjectGallery** - Carousel state, arrow navigation
7. **ProjectModal** - Open/close state, escape key
8. **ContactSection** - Copy-to-clipboard (can be vanilla JS)
9. **PostPage** - Reading progress bar (can be vanilla JS)

## CSS Analysis Summary

From `styles.css` (2424 lines):

### Design Tokens (`:root`)

```css
--ink: #181a20;
--paper: #f5f5f0;
--accent: #2563eb;
--muted: #6b7280;
--font-body: 'Geist', system-ui, sans-serif;
--font-mono: 'Geist Mono', monospace;
--font-serif: 'Playfair Display', Georgia, serif;
--radius: 10px;
--gap: 28px;
```

### Dark Theme (`[data-theme="dark"]`)

```css
--ink: #e8e8e0;
--paper: #0d0f12;
--accent: #4a90ff;
--muted: #888;
```

### Key CSS Classes to Preserve

- `.dot-grid`, `.dot-cursor`, `.dot-glow` - Background effects
- `.nav`, `.nav-inner`, `.nav-link`, `.nav-icon-btn` - Navigation
- `.hero`, `.hero-grid`, `.hero-headline`, `.hero-sub` - Hero section
- `.avatar-wrap`, `.avatar-svg`, `.avatar-badge` - Avatar
- `.terminal`, `.terminal-head`, `.terminal-body` - Terminal
- `.strip`, `.strip-track` - Marquee
- `.section`, `.section-divider`, `.container` - Layout
- `.reveal`, `.reveal.in` - Scroll animations
- `.stats-grid`, `.stat-cell` - Statistics
- `.timeline`, `.tl-item` - Experience timeline
- `.skills-grid`, `.skill-card`, `.skill-chip` - Skills
- `.feat-card`, `.feat-cover`, `.gallery` - Project cards
- `.proj-list`, `.proj-row` - Project list
- `.modal`, `.modal-backdrop` - Modals
- `.ask`, `.ask-input`, `.ask-output` - Ask AI demo
- `.blog-mag`, `.mag-card`, `.mag-top`, `.mag-bottom` - Blog magazine
- `.contact-grid`, `.contact-link` - Contact section
- `.post-page`, `.post-hero`, `.post-layout` - Blog post page
- `.reading-bar` - Reading progress
- `.btn`, `.btn-primary`, `.btn-outline` - Buttons
- `.chip`, `.filters` - Filter chips
- `.status-pill`, `.pulse` - Status indicators

### Responsive Breakpoints

```css
@media (max-width: 900px) { ... }
@media (max-width: 700px) { ... }
@media (max-width: 540px) { ... }
```

### Animations

- `@keyframes blink` - Cursor blink
- `@keyframes scroll` - Marquee scroll
- `@keyframes float-*` - Floating shapes (multiple variants)
- `@keyframes orbit` - Avatar orbit dot
- `@keyframes pulse` - Status indicator pulse
- Avatar eye blink via `.av-eyes` animation

## Migration Strategy

### Phase 1: Foundation
1. Scaffold Astro project with Preact integration
2. Extract design tokens to `src/styles/tokens.css`
3. Copy global styles to `src/styles/global.css`
4. Set up base layout with theme support

### Phase 2: Static Components (Astro)
1. Atoms: Icon, FlagES, FlagEN, Cover, Chip, Badge
2. Molecules: HeroSocial, StripMarquee, AvatarSVG, HeroShapes, MagCard
3. Organisms: Footer
4. Layouts: BaseLayout

### Phase 3: Interactive Islands (Preact)
1. DotGridBg - Mouse tracking
2. Nav - Scroll spy + theme + language
3. Terminal - Typing animation
4. Filters - Active state
5. ProjectGallery - Carousel
6. AskAI - Demo interaction
7. Modal wrapper - Open/close logic

### Phase 4: Sections & Pages
1. HeroSection, AboutSection, ProjectsSection
2. AskSection, BlogSection, ContactSection
3. index.astro composing all sections
4. blog/[slug].astro for post pages

### Phase 5: Data & Content
1. Migrate PROFILE, EXPERIENCE, SKILLS to TypeScript
2. Create content collections for PROJECTS and POSTS
3. Generate category/type filters from data

## Dependencies

```json
{
  "astro": "^4.x",
  "@astrojs/preact": "^3.x",
  "preact": "^10.x"
}
```

## Risk Areas

1. **Mouse glow effect** - DotGridBg must maintain smooth animation
2. **Scroll spy** - Must work with Astro's client:visible hydration
3. **Theme persistence** - localStorage + SSR considerations
4. **Terminal timing** - Animation timing must match original
5. **Modal focus trapping** - Accessibility concern

## Open Questions

1. Should image-slot custom element be migrated to Astro Image component?
2. Should blog posts use MDX for more control?
3. Should language strings be externalized for proper i18n?
