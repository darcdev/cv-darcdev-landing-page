# Tasks: Mobile Responsive Layout

**Input**: Design documents from `/specs/002-mobile-responsive-layout/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested - manual visual testing per quickstart.md

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- File paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare responsive foundation before component changes

- [x] T001 Add overflow-x: hidden to .app container in src/styles/global.css
- [x] T002 [P] Add responsive visibility helpers (.hide-mobile, .show-mobile) in src/styles/global.css

**Checkpoint**: Foundation ready for user story implementation

---

## Phase 2: User Story 1 - Mobile Navigation Experience (Priority: P1) 🎯 MVP

**Goal**: Transform horizontal nav into hamburger menu on mobile (<768px)

**Independent Test**: View page on mobile viewport, tap hamburger icon, verify menu opens/closes, navigate to sections

### Implementation for User Story 1

- [x] T003 [US1] Add menuOpen state and toggle handler in src/components/islands/Nav.tsx
- [x] T004 [US1] Create HamburgerIcon SVG component in src/components/islands/Nav.tsx
- [x] T005 [US1] Add hamburger button JSX (visible on mobile only) in src/components/islands/Nav.tsx
- [x] T006 [US1] Create mobile menu slide-in panel JSX in src/components/islands/Nav.tsx
- [x] T007 [US1] Add close-on-link-click behavior in src/components/islands/Nav.tsx
- [x] T008 [US1] Add close-on-outside-click behavior in src/components/islands/Nav.tsx
- [x] T009 [US1] Add CSS for hamburger button (.hamburger-btn) in src/styles/global.css
- [x] T010 [US1] Add CSS for mobile menu panel (.mobile-menu) in src/styles/global.css
- [x] T011 [US1] Add CSS for slide-in animation in src/styles/global.css
- [x] T012 [US1] Add media query to hide desktop nav-links on mobile in src/styles/global.css
- [x] T013 [US1] Add keyboard accessibility (Escape to close) in src/components/islands/Nav.tsx
- [x] T014 [US1] Ensure touch targets are 44x44px minimum in src/styles/global.css

**Checkpoint**: Hamburger menu fully functional on mobile viewports

---

## Phase 3: User Story 2 - Avatar Display on Mobile (Priority: P1)

**Goal**: Avatar contained within viewport, centered, properly scaled on mobile

**Independent Test**: View hero section on 320px viewport, avatar is fully visible, centered, circular

### Implementation for User Story 2

- [x] T015 [P] [US2] Add responsive sizing to .avatar-wrap in src/styles/global.css (use min(200px, 60vw))
- [x] T016 [P] [US2] Add margin: 0 auto to center avatar on mobile in src/styles/global.css
- [x] T017 [US2] Scale .avatar-photo proportionally in AvatarSVG scoped styles in src/components/molecules/AvatarSVG.astro
- [x] T018 [US2] Adjust avatar badges (.avatar-badge-*) positioning for mobile in src/styles/global.css
- [x] T019 [US2] Adjust .av-chip-photo and .av-orbit-photo for mobile in src/components/molecules/AvatarSVG.astro

**Checkpoint**: Avatar displays correctly at all viewport widths without overflow

---

## Phase 4: User Story 3 - Centered Content Layout on Mobile (Priority: P2)

**Goal**: All sections stack vertically and center on mobile

**Independent Test**: Scroll through entire page on mobile, all content centered, no horizontal scroll

### Implementation for User Story 3

- [x] T020 [P] [US3] Update .hero-grid media query for single-column stacking in src/styles/global.css
- [x] T021 [P] [US3] Center hero text content on mobile in src/styles/global.css
- [x] T022 [P] [US3] Update .hero-side to center contents on mobile in src/styles/global.css
- [x] T023 [US3] Ensure .hero-meta buttons wrap and center on mobile in src/styles/global.css
- [x] T024 [US3] Update .about-grid for single-column on mobile in src/styles/global.css
- [x] T025 [US3] Update .skills-grid for single-column on mobile in src/styles/global.css
- [x] T026 [US3] Update .stats-grid for single-column on mobile in src/styles/global.css
- [x] T027 [US3] Update project cards (.proj-row) for mobile layout in src/styles/global.css
- [x] T028 [US3] Update .contact-grid for single-column on mobile in src/styles/global.css

**Checkpoint**: All content sections properly centered and stacked on mobile

---

## Phase 5: User Story 4 - Fully Responsive Across Breakpoints (Priority: P2)

**Goal**: Smooth transitions across all breakpoints (320px-1920px)

**Independent Test**: Resize browser from 320px to 1920px, no layout breaks, smooth transitions

### Implementation for User Story 4

- [x] T029 [P] [US4] Add 480px (xs) breakpoint media queries in src/styles/global.css
- [x] T030 [P] [US4] Adjust container padding per breakpoint in src/styles/global.css
- [x] T031 [US4] Fine-tune font sizes for small mobile (xs) in src/styles/global.css
- [x] T032 [US4] Adjust .hero-headline clamp values for mobile in src/styles/global.css
- [x] T033 [US4] Ensure terminal component (.terminal) is responsive in src/styles/global.css
- [x] T034 [US4] Test and fix any overflow issues at 320px viewport in src/styles/global.css
- [x] T035 [US4] Add smooth CSS transitions for layout changes in src/styles/global.css

**Checkpoint**: Page responds fluidly to all viewport sizes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and refinements

- [x] T036 Run Lighthouse mobile audit and document score
- [x] T037 Test hamburger menu with keyboard navigation (Tab, Enter, Escape)
- [x] T038 Verify no horizontal scrollbar at any viewport width (320px-1920px)
- [x] T039 Test in Chrome, Firefox, Safari mobile emulators
- [x] T040 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **US1 (Phase 2)**: Depends on Setup - Nav component changes
- **US2 (Phase 3)**: Depends on Setup - Can run parallel with US1 (different files)
- **US3 (Phase 4)**: Depends on Setup - Can run parallel with US1/US2 (different sections of global.css)
- **US4 (Phase 5)**: Depends on US1-US3 completion (refines their work)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Nav) | Setup | US2, US3 |
| US2 (Avatar) | Setup | US1, US3 |
| US3 (Content) | Setup | US1, US2 |
| US4 (Breakpoints) | US1, US2, US3 | None |

### Within Each User Story

- CSS changes can often be parallelized if in different sections
- Component JS changes sequential within same file
- Test after each user story completion

---

## Parallel Execution Examples

### Phase 2 (US1) Parallel Opportunities

```
# These can run in parallel (different aspects):
T009 [US1] Add CSS for hamburger button
T010 [US1] Add CSS for mobile menu panel
T011 [US1] Add CSS for slide-in animation
```

### Phase 3 (US2) Parallel Opportunities

```
# These can run in parallel (different files/sections):
T015 [US2] Add responsive sizing to .avatar-wrap
T016 [US2] Center avatar on mobile
```

### Cross-Story Parallel

```
# US1 and US2 can run simultaneously:
Developer A: T003-T014 (Nav hamburger menu)
Developer B: T015-T019 (Avatar responsive)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: US1 - Mobile Navigation (T003-T014)
3. **STOP and VALIDATE**: Hamburger menu works on mobile
4. This alone makes site navigable on mobile

### Incremental Delivery

1. Setup → Foundation ready
2. Add US1 (Nav) → Mobile navigation works (MVP!)
3. Add US2 (Avatar) → Hero section looks correct
4. Add US3 (Content) → All sections properly laid out
5. Add US4 (Breakpoints) → Smooth responsive experience
6. Polish → Production ready

### Recommended Order (Solo Developer)

```
T001 → T002 → [US1: T003-T014] → [US2: T015-T019] → [US3: T020-T028] → [US4: T029-T035] → [Polish: T036-T040]
```

---

## Notes

- All CSS changes in global.css - organize by media query section
- Nav.tsx is a Preact component - follow existing patterns
- AvatarSVG.astro uses scoped styles - some changes there
- Test at: 320px, 480px, 640px, 768px, 1024px, 1280px
- Commit after each completed user story phase
