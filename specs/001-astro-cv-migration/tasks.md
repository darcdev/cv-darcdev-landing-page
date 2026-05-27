# Tasks: Astro CV Landing Page Migration

**Input**: Design documents from `/specs/001-astro-cv-migration/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested in feature specification. Visual regression and Lighthouse audits will be performed manually.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Per plan.md, using Astro project structure:

```text
src/
├── components/{atoms,molecules,organisms,islands}/
├── layouts/
├── pages/
├── content/{projects,posts}/
├── data/
├── styles/
├── assets/
└── utils/
```

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Scaffold Astro project and configure tooling

- [ ] T001 Create Astro project with `pnpm create astro@latest` using minimal template and strict TypeScript
- [ ] T002 Add Preact integration with `pnpm astro add preact`
- [ ] T003 [P] Create directory structure: `src/components/{atoms,molecules,organisms,islands}`, `src/layouts`, `src/data`, `src/content/{projects,posts}`, `src/styles`, `src/assets/{images,cv}`, `src/utils`
- [ ] T004 [P] Copy CV PDF from `uploads/CV_Diego_Andres_Cabrera_Rojas_CV.pdf` to `src/assets/cv/`
- [ ] T005 [P] Configure astro.config.mjs with Preact integration and static output mode

---

## Phase 2: Foundational (Design System & Data)

**Purpose**: Extract design tokens, global styles, and migrate data - BLOCKS all user stories

**⚠️ CRITICAL**: No component work can begin until this phase is complete

- [ ] T006 Extract CSS custom properties from `styles.css` :root to `src/styles/tokens.css` (colors, fonts, spacing, radius)
- [ ] T007 Extract dark theme variables from `styles.css` [data-theme="dark"] to `src/styles/tokens.css`
- [ ] T008 [P] Copy global styles (reset, typography, utilities) from `styles.css` to `src/styles/global.css`
- [ ] T009 [P] Copy all animation keyframes (@keyframes blink, scroll, float-*, orbit, pulse) to `src/styles/global.css`
- [ ] T010 [P] Migrate PROFILE data from `data.jsx` to `src/data/profile.ts` with TypeScript types
- [ ] T011 [P] Migrate EXPERIENCE data from `data.jsx` to `src/data/experience.ts` with TypeScript types
- [ ] T012 [P] Migrate SKILLS data from `data.jsx` to `src/data/skills.ts` with TypeScript types
- [ ] T013 [P] Migrate PROJECTS data from `data.jsx` to `src/data/projects.ts` with TypeScript types
- [ ] T014 [P] Migrate POSTS data from `data.jsx` to `src/data/posts.ts` with TypeScript types
- [ ] T015 Create `src/data/index.ts` re-exporting all data with derived CATEGORIES and PROJECT_TYPES
- [ ] T016 Create `src/layouts/BaseLayout.astro` with html, head (fonts, meta), body structure importing global styles

**Checkpoint**: Foundation ready - design tokens, global styles, data, and base layout available

---

## Phase 3: User Story 1 - View Portfolio Homepage (Priority: P1) 🎯 MVP

**Goal**: Hero section with animated avatar, terminal typing effect, and technology marquee

**Independent Test**: Load homepage, verify dot-grid background appears, avatar animates with floating badges, terminal types commands, marquee scrolls

### Atoms for User Story 1

- [ ] T017 [P] [US1] Create Icon component (SVG icons: github, linkedin, download, arrow, sun, moon, search) in `src/components/atoms/Icon.astro`
- [ ] T018 [P] [US1] Create Button component (primary, outline, ghost variants) in `src/components/atoms/Button.astro`
- [ ] T019 [P] [US1] Create StatusPill component with pulse animation in `src/components/atoms/StatusPill.astro`
- [ ] T020 [P] [US1] Create Cover component (pattern backgrounds: rag, spec, mcp, arch, oss, pr) in `src/components/atoms/Cover.astro`

### Molecules for User Story 1

- [ ] T021 [P] [US1] Create HeroShapes component (12 floating geometric shapes with CSS animations) in `src/components/molecules/HeroShapes.astro`
- [ ] T022 [P] [US1] Create AvatarSVG component (animated avatar with blinking eyes, floating badges, orbit) in `src/components/molecules/AvatarSVG.astro`
- [ ] T023 [P] [US1] Create HeroSocial component (GitHub, LinkedIn, Download CV buttons) in `src/components/molecules/HeroSocial.astro`
- [ ] T024 [P] [US1] Create StripMarquee component (CSS infinite scroll, no JS) in `src/components/molecules/StripMarquee.astro`

### Islands for User Story 1

- [ ] T025 [US1] Create DotGridBg island (mouse-following glow effect with requestAnimationFrame) in `src/components/islands/DotGridBg.tsx`
- [ ] T026 [US1] Create Terminal island (typing animation with useState, useEffect, setInterval) in `src/components/islands/Terminal.tsx`

### Section for User Story 1

- [ ] T027 [US1] Create HeroSection component composing HeroShapes, DotGridBg, AvatarSVG, HeroSocial, Terminal, StripMarquee in `src/components/organisms/HeroSection.astro`
- [ ] T028 [US1] Copy all hero-related CSS classes from `styles.css` to HeroSection scoped styles (hero, hero-grid, hero-headline, hero-sub, hero-meta, hero-side, etc.)
- [ ] T029 [US1] Create initial `src/pages/index.astro` with BaseLayout and HeroSection

**Checkpoint**: Homepage renders with complete hero section - avatar animates, terminal types, marquee scrolls, dot-grid follows mouse

---

## Phase 4: User Story 2 - Navigate and Explore Sections (Priority: P1)

**Goal**: Sticky navigation with scroll spy, theme toggle, language selector, and smooth scroll

**Independent Test**: Click nav links to verify smooth scroll, scroll manually to verify active section updates, toggle theme and language

### Atoms for User Story 2

- [ ] T030 [P] [US2] Create FlagES and FlagEN SVG components in `src/components/atoms/Flag.astro`
- [ ] T031 [P] [US2] Create Chip component (filter chips with active state) in `src/components/atoms/Chip.astro`

### Islands for User Story 2

- [ ] T032 [US2] Create Nav island (scroll spy via IntersectionObserver, theme toggle, language dropdown) in `src/components/islands/Nav.tsx`
- [ ] T033 [US2] Implement theme persistence in Nav (localStorage key "theme", default from prefers-color-scheme)
- [ ] T034 [US2] Implement language state in Nav (localStorage key "lang", default "es")
- [ ] T035 [US2] Implement smooth scroll to section via scrollTo prop in Nav

### Organisms for User Story 2

- [ ] T036 [US2] Create Footer component (static, copyright, built-with text) in `src/components/organisms/Footer.astro`
- [ ] T037 [US2] Copy all nav-related CSS classes from `styles.css` to Nav island styles (nav, nav-inner, nav-link, nav-logo, nav-icon-btn, nav-lang-*, etc.)

### Integration for User Story 2

- [ ] T038 [US2] Update BaseLayout.astro to include Nav island with client:load directive and Footer
- [ ] T039 [US2] Add section placeholders (about, projects, blog, contact) to index.astro for scroll spy testing
- [ ] T040 [US2] Implement data-theme attribute toggle on document.documentElement in Nav

**Checkpoint**: Navigation works with scroll spy, theme toggle persists, language selector shows dropdown, smooth scroll to sections

---

## Phase 5: User Story 3 - Toggle Theme (Priority: P2)

**Goal**: Dark/light theme switching with all colors transitioning consistently

**Independent Test**: Toggle theme, verify all components update colors including hero, avatar, terminal, marquee

### Implementation for User Story 3

- [ ] T041 [US3] Verify all CSS classes use `var(--ink)`, `var(--paper)`, `var(--accent)`, `var(--muted)` instead of hardcoded colors
- [ ] T042 [US3] Add CSS transition for color properties on body element in `src/styles/global.css`
- [ ] T043 [US3] Update DotGridBg island to use CSS variables for glow colors
- [ ] T044 [US3] Update Terminal island styles to use CSS variables for prompt, cmd, out colors
- [ ] T045 [US3] Update AvatarSVG to use CSS variables for all fill/stroke colors

**Checkpoint**: Theme toggle smoothly transitions all page elements between light and dark modes

---

## Phase 6: User Story 4 - Browse Projects (Priority: P2)

**Goal**: Projects section with featured cards, image galleries, filter chips, and modal details

**Independent Test**: View projects section, filter by type, click gallery arrows, open modal with full details

### Molecules for User Story 4

- [ ] T046 [P] [US4] Create ProjectCard component (featured card with gallery, title, tagline, meta) in `src/components/molecules/ProjectCard.astro`
- [ ] T047 [P] [US4] Create ProjectRow component (list item with number, title, tags, tagline, meta, arrow) in `src/components/molecules/ProjectRow.astro`

### Islands for User Story 4

- [ ] T048 [US4] Create Filters island (chips with active state, onChange callback) in `src/components/islands/Filters.tsx`
- [ ] T049 [US4] Create ProjectGallery island (carousel with arrows, dots, counter, slide state) in `src/components/islands/ProjectGallery.tsx`
- [ ] T050 [US4] Create ProjectModal island (full details, escape to close, body scroll lock) in `src/components/islands/ProjectModal.tsx`

### Utils for User Story 4

- [ ] T051 [US4] Create Reveal utility component (IntersectionObserver-based reveal-on-scroll) in `src/components/islands/Reveal.tsx`
- [ ] T052 [US4] Create pickCover utility function (maps project.id to cover pattern) in `src/utils/covers.ts`

### Section for User Story 4

- [ ] T053 [US4] Create ProjectsSection component composing featured cards, filters, project list in `src/components/organisms/ProjectsSection.astro`
- [ ] T054 [US4] Copy all projects-related CSS classes from `styles.css` to ProjectsSection (feat-card, feat-cover, gallery-*, proj-list, proj-row, modal-*, etc.)
- [ ] T055 [US4] Add ProjectsSection to index.astro with section id="projects"

**Checkpoint**: Projects section shows featured cards with galleries, filters work, clicking opens modal with full details

---

## Phase 7: User Story 5 - Read Blog Posts (Priority: P2)

**Goal**: Blog section with magazine layout and full post page with TOC and reading progress

**Independent Test**: View blog section, filter by category, click post to see full page with progress bar and TOC

### Molecules for User Story 5

- [ ] T056 [P] [US5] Create MagCard component (big, side, base variants for magazine layout) in `src/components/molecules/MagCard.astro`

### Islands for User Story 5

- [ ] T057 [US5] Create ReadingProgress island (scroll-based progress bar at top) in `src/components/islands/ReadingProgress.tsx`

### Section for User Story 5

- [ ] T058 [US5] Create BlogSection component with magazine layout (big card, side cards, bottom row) in `src/components/organisms/BlogSection.astro`
- [ ] T059 [US5] Copy all blog-related CSS classes from `styles.css` to BlogSection (blog-mag, mag-card, mag-top, mag-bottom, mag-cover, etc.)
- [ ] T060 [US5] Add BlogSection to index.astro with section id="blog"

### Pages for User Story 5

- [ ] T061 [US5] Create `src/pages/blog/[slug].astro` for individual post pages
- [ ] T062 [US5] Implement PostPage layout with hero, TOC sidebar, article body, author bio in blog/[slug].astro
- [ ] T063 [US5] Add ReadingProgress island to blog/[slug].astro with client:load
- [ ] T064 [US5] Copy all post-related CSS classes from `styles.css` to blog/[slug].astro (post-page, post-hero, post-layout, post-toc, article-body, etc.)
- [ ] T065 [US5] Implement "Volver al blog" navigation returning to index.astro#blog

**Checkpoint**: Blog section shows magazine layout, clicking post navigates to full page with progress bar and TOC

---

## Phase 8: User Story 6 - Interact with Ask AI Demo (Priority: P3)

**Goal**: RAG demonstration section with preset questions and simulated responses

**Independent Test**: View Ask AI section, click preset buttons, type custom question, verify response appears with sources

### Islands for User Story 6

- [ ] T066 [US6] Create AskAI island (input, presets, simulated responses with typing delay) in `src/components/islands/AskAI.tsx`
- [ ] T067 [US6] Implement preset questions and responses matching original data from `components.jsx`

### Section for User Story 6

- [ ] T068 [US6] Create AskSection component wrapping AskAI island in `src/components/organisms/AskSection.astro`
- [ ] T069 [US6] Copy all ask-related CSS classes from `styles.css` to AskSection (ask, ask-input, ask-output, ask-suggestions, ask-sug, etc.)
- [ ] T070 [US6] Add AskSection to index.astro between projects and blog sections

**Checkpoint**: Ask AI demo accepts input, shows presets, displays simulated responses with source citations

---

## Phase 9: User Story 7 - Contact and Download CV (Priority: P2)

**Goal**: Contact section with copy-to-clipboard and CV download

**Independent Test**: Click email/phone to copy, verify "copiado" appears, click Download CV to verify download, verify external links open in new tab

### Molecules for User Story 7

- [ ] T071 [P] [US7] Create ContactLink component (key-value row with copy functionality) in `src/components/molecules/ContactLink.astro`

### Islands for User Story 7

- [ ] T072 [US7] Create CopyToClipboard island (handles copy action and "copiado" feedback) in `src/components/islands/CopyToClipboard.tsx`

### Section for User Story 7

- [ ] T073 [US7] Create ContactSection component with heading, description, contact links, CV download in `src/components/organisms/ContactSection.astro`
- [ ] T074 [US7] Copy all contact-related CSS classes from `styles.css` to ContactSection (contact-grid, contact-link, contact-big, etc.)
- [ ] T075 [US7] Add ContactSection to index.astro with section id="contact"

**Checkpoint**: Contact section displays all info, copy-to-clipboard works with feedback, CV downloads, external links open in new tab

---

## Phase 10: User Story 8 - View on Mobile Devices (Priority: P2)

**Goal**: Fully responsive design matching original breakpoints

**Independent Test**: View site at 900px, 700px, 540px widths, verify content stacks, touch targets sized appropriately

### Implementation for User Story 8

- [ ] T076 [US8] Copy all responsive breakpoint styles from `styles.css` @media queries to relevant component scoped styles
- [ ] T077 [US8] Verify hero section stacks vertically on mobile (hero-grid → single column)
- [ ] T078 [US8] Verify navigation adapts for mobile (may need mobile menu consideration)
- [ ] T079 [US8] Verify project cards stack properly on mobile
- [ ] T080 [US8] Verify blog magazine layout adapts (big card → single column)
- [ ] T081 [US8] Verify modal displays correctly on mobile with proper padding/margins
- [ ] T082 [US8] Verify touch targets are minimum 44x44px for all interactive elements

**Checkpoint**: Site is fully responsive across all breakpoints, matching original design behavior

---

## Phase 11: About Section (Priority: P2)

**Goal**: About section with bio, stats, experience timeline, and skills grid

**Independent Test**: Scroll to about section, verify bio displays, stats grid shows, timeline reveals, skills grouped correctly

### Molecules for About Section

- [ ] T083 [P] Create StatCell component (number + label) in `src/components/molecules/StatCell.astro`
- [ ] T084 [P] Create TimelineItem component (role, company, period, highlights) in `src/components/molecules/TimelineItem.astro`
- [ ] T085 [P] Create SkillCard component (group name + skill chips) in `src/components/molecules/SkillCard.astro`

### Section for About

- [ ] T086 Create AboutSection component composing bio, stats grid, timeline, skills in `src/components/organisms/AboutSection.astro`
- [ ] T087 Copy all about-related CSS classes from `styles.css` to AboutSection (about-grid, about-card, stats-grid, stat-cell, timeline, tl-item, skills-grid, skill-card, skill-chip, etc.)
- [ ] T088 Add AboutSection to index.astro with section id="about"
- [ ] T089 Add Reveal animations to stats, timeline items, and skill cards

**Checkpoint**: About section displays complete bio, stats, experience timeline, and skills with reveal animations

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements affecting all user stories

- [ ] T090 Add all Reveal animations to sections throughout index.astro
- [ ] T091 Verify all CSS class names from `styles.css` are present in migrated components
- [ ] T092 [P] Configure Astro Image optimization for any images in assets/
- [ ] T093 [P] Add proper ARIA labels to all interactive elements (buttons, links, modals)
- [ ] T094 [P] Add keyboard navigation support for modals (focus trap, escape key)
- [ ] T095 [P] Add meta tags for SEO (title, description, og:image) in BaseLayout.astro
- [ ] T096 Run Lighthouse audit and address any Performance/Accessibility issues
- [ ] T097 Visual comparison against original Portfolio.html at all breakpoints
- [ ] T098 Verify site works with JavaScript disabled (core content accessible)
- [ ] T099 Final CSS cleanup - remove any unused classes
- [ ] T100 Run build and verify no errors: `pnpm build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phases 3-11)**: All depend on Foundational phase completion
  - US1 (Hero) and US2 (Nav) are P1 - do first
  - US3 (Theme) depends on US2 completion
  - US4-US8 can proceed in any order after P1 stories
  - About Section is independent but logically after Hero/Nav
- **Polish (Phase 12)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Hero)**: Foundational → No story dependencies
- **US2 (Nav)**: Foundational → No story dependencies (but integrates with US1 layout)
- **US3 (Theme)**: US2 → Theme toggle is in Nav
- **US4 (Projects)**: Foundational → Independent, uses Reveal
- **US5 (Blog)**: Foundational → Independent, uses Reveal
- **US6 (Ask AI)**: Foundational → Independent
- **US7 (Contact)**: Foundational → Independent
- **US8 (Mobile)**: All sections → Verifies responsive across all
- **About Section**: Foundational → Independent

### Within Each Phase

- Atoms before molecules
- Molecules before organisms
- Islands before sections that use them
- Sections before pages

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All data migration tasks (T010-T014) can run in parallel
- All atom creation tasks within a story can run in parallel
- All molecule creation tasks within a story can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all atoms for US1 together:
Task T017: Create Icon component in src/components/atoms/Icon.astro
Task T018: Create Button component in src/components/atoms/Button.astro
Task T019: Create StatusPill component in src/components/atoms/StatusPill.astro
Task T020: Create Cover component in src/components/atoms/Cover.astro

# Launch all molecules for US1 together:
Task T021: Create HeroShapes in src/components/molecules/HeroShapes.astro
Task T022: Create AvatarSVG in src/components/molecules/AvatarSVG.astro
Task T023: Create HeroSocial in src/components/molecules/HeroSocial.astro
Task T024: Create StripMarquee in src/components/molecules/StripMarquee.astro
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Hero)
4. Complete Phase 4: User Story 2 (Navigation)
5. **STOP and VALIDATE**: Homepage renders with hero and working navigation
6. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Hero) → Test independently → Deploy (visual impact)
3. Add US2 (Nav) → Test independently → Deploy (navigation works)
4. Add US3 (Theme) → Test independently → Deploy (dark mode!)
5. Add About Section → Test independently → Deploy
6. Add US4 (Projects) → Test independently → Deploy
7. Add US5 (Blog) → Test independently → Deploy
8. Add US6 (Ask AI) → Test independently → Deploy
9. Add US7 (Contact) → Test independently → Deploy
10. Add US8 (Mobile verification) + Polish → Final deployment

### Parallel Team Strategy

With multiple developers after Foundational is complete:

- Developer A: User Story 1 (Hero) → User Story 4 (Projects)
- Developer B: User Story 2 (Nav) → User Story 5 (Blog)
- Developer C: About Section → User Story 6-7

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Design Fidelity**: Every CSS class from `styles.css` must be preserved exactly
- Avoid: vague tasks, same file conflicts, hardcoded colors (use CSS variables)
