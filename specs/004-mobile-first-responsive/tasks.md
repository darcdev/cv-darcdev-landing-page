# Tasks: Mobile-First Responsive Redesign

**Input**: Design documents from `specs/004-mobile-first-responsive/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: No automated tests - visual testing via browser DevTools at each breakpoint

**Organization**: Tasks organized by user story for independent implementation and testing

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files/sections)
- **[Story]**: Which user story this task targets (US1-US6)
- Include exact CSS selectors and file paths in descriptions

## Standard Breakpoints (Mobile-First)

| Breakpoint | Query | Purpose |
|------------|-------|---------|
| 280px | Base (no query) | Minimum mobile |
| 480px | `@media (min-width: 480px)` | Large phones |
| 768px | `@media (min-width: 768px)` | Tablets |
| 1024px | `@media (min-width: 1024px)` | Small laptops |
| 1280px | `@media (min-width: 1280px)` | Desktops |

---

## Phase 1: Setup

**Purpose**: Audit current CSS and understand structure

- [x] T001 Audit all media queries in `src/styles/global.css` - document current breakpoints
- [x] T002 [P] Audit scoped styles in `src/components/molecules/AvatarSVG.astro`
- [x] T003 Create backup of current responsive CSS for comparison

**Checkpoint**: Full understanding of current responsive structure ✅

---

## Phase 2: Foundational (Mobile-First Base Conversion)

**Purpose**: Convert base styles from desktop-first to mobile-first approach

**⚠️ CRITICAL**: This must complete before any user story work begins

- [x] T004 Remove all existing `@media (max-width: *)` queries from `src/styles/global.css` responsive section
- [x] T005 Establish base mobile styles (280px) for `.container` in `src/styles/global.css`
- [x] T006 [P] Establish base mobile styles for `.hero-grid` in `src/styles/global.css`
- [x] T007 [P] Establish base mobile styles for `.nav` in `src/styles/global.css`
- [x] T008 Add `@media (min-width: 480px)` section structure in `src/styles/global.css`
- [x] T009 [P] Add `@media (min-width: 768px)` section structure in `src/styles/global.css`
- [x] T010 [P] Add `@media (min-width: 1024px)` section structure in `src/styles/global.css`
- [x] T011 [P] Add `@media (min-width: 1280px)` section structure in `src/styles/global.css`
- [x] T012 Run `npm run build` to verify no CSS errors

**Checkpoint**: Mobile-first foundation ready - user story implementation can begin ✅

---

## Phase 3: User Story 1 - Small Mobile Viewport (Priority: P1) 🎯 MVP

**Goal**: All content displays correctly at 280-479px without horizontal scroll

**Independent Test**: Open DevTools at 280px → scroll entire page → no horizontal scrollbar

### Implementation for US1

- [x] T013 [US1] Set base `.bio-large` font-size with `clamp()` for small screens in `src/styles/global.css`
- [x] T014 [US1] Set base `.about-grid` to single column (no grid) in `src/styles/global.css`
- [x] T015 [P] [US1] Set base `.skills-grid` to single column in `src/styles/global.css`
- [x] T016 [P] [US1] Set base `.stats-grid` to single column in `src/styles/global.css`
- [x] T017 [US1] Add `overflow-wrap: break-word` to text containers in `src/styles/global.css`
- [x] T018 [US1] Set all images to `max-width: 100%` in `src/styles/global.css`
- [x] T019 [US1] Update `.avatar-wrap` base width to `min(160px, 50vw)` in `src/styles/global.css`
- [x] T020 [US1] Convert AvatarSVG.astro scoped styles to mobile-first in `src/components/molecules/AvatarSVG.astro`
- [x] T021 [US1] Test at 280px, 320px, 360px, 400px widths - verify no horizontal scroll

**Checkpoint**: Site works at 280px minimum - MVP achieved ✅

---

## Phase 4: User Story 2 - Ask Diego Demo (Priority: P1)

**Goal**: Ask Diego section adapts from 2-column grid to single column on mobile

**Independent Test**: View `.ask` section at 280px → single column stack, badges wrap

### Implementation for US2

- [x] T022 [US2] Set base `.ask` to `display: flex; flex-direction: column` in `src/styles/global.css`
- [x] T023 [US2] Set `.ask-input-row` to stack vertically on base in `src/styles/global.css`
- [x] T024 [US2] Ensure `.ask-suggestions` badges wrap with `flex-wrap: wrap` in `src/styles/global.css`
- [x] T025 [US2] Set `.ask-output` to `min-height: auto` on mobile in `src/styles/global.css`
- [x] T026 [US2] Add 480px+ breakpoint: `.ask` becomes `display: grid; grid-template-columns: 1fr 1fr` in `src/styles/global.css`
- [x] T027 [US2] Test Ask Diego at 280px, 480px, 768px - verify layout transitions

**Checkpoint**: Ask Diego demo works on all mobile sizes ✅

---

## Phase 5: User Story 3 - Info Table Stacking (Priority: P2)

**Goal**: `.kv-list .row` stacks label above value on mobile

**Independent Test**: View info card at 320px → each row shows label on top, value below

### Implementation for US3

- [x] T028 [US3] Set base `.kv-list .row` to `flex-direction: column` in `src/styles/global.css`
- [x] T029 [US3] Set `.kv-list .k` to `text-align: left` on base in `src/styles/global.css`
- [x] T030 [US3] Set `.kv-list .v` to `text-align: left` on base in `src/styles/global.css`
- [x] T031 [US3] Add 480px+ breakpoint: `.kv-list .row` becomes `flex-direction: row` in `src/styles/global.css`
- [x] T032 [US3] Add 480px+ breakpoint: restore `.kv-list .v` `text-align: right` in `src/styles/global.css`
- [x] T033 [US3] Test info table at 320px, 480px - verify stacking behavior

**Checkpoint**: Info table readable on all mobile sizes ✅

---

## Phase 6: User Story 4 - Blog Section Uniform Cards (Priority: P2)

**Goal**: Blog cards display uniformly, one per row on mobile

**Independent Test**: View blog section at 360px → all cards same style, single column

### Implementation for US4

- [x] T034 [US4] Set base `.blog-mag` to single column flex layout in `src/styles/global.css`
- [x] T035 [US4] Set base `.mag-top` to single column in `src/styles/global.css`
- [x] T036 [US4] Set base `.mag-bottom` to single column in `src/styles/global.css`
- [x] T037 [US4] Set base `.mag-card` to uniform vertical layout in `src/styles/global.css`
- [x] T038 [P] [US4] Override `.mag-card.mag-big` to match base card style on mobile in `src/styles/global.css`
- [x] T039 [P] [US4] Override `.mag-card.mag-side` to vertical layout on mobile in `src/styles/global.css`
- [x] T040 [US4] Add 768px+ breakpoint: restore magazine layout with `grid-template-columns: 2fr 1fr` in `src/styles/global.css`
- [x] T041 [US4] Add 768px+ breakpoint: restore `.mag-card.mag-big` featured styles in `src/styles/global.css`
- [x] T042 [US4] Test blog section at 360px, 768px - verify card layout changes

**Checkpoint**: Blog section works uniformly on mobile, magazine on tablet+ ✅

---

## Phase 7: User Story 5 - Contact Section (Priority: P2)

**Goal**: Contact section stacks on mobile with label/value vertically

**Independent Test**: View contact section at 320px → single column, links stacked

### Implementation for US5

- [x] T043 [US5] Set base `.contact-grid` to single column in `src/styles/global.css`
- [x] T044 [US5] Set base `.contact-link` to `flex-direction: column` in `src/styles/global.css`
- [x] T045 [US5] Set `.contact-link .k` to `text-align: left` on base in `src/styles/global.css`
- [x] T046 [US5] Set `.contact-link .v` to `text-align: left` on base in `src/styles/global.css`
- [x] T047 [US5] Add 480px+ breakpoint: `.contact-link` becomes `flex-direction: row` in `src/styles/global.css`
- [x] T048 [US5] Add 768px+ breakpoint: `.contact-grid` becomes 2 columns in `src/styles/global.css`
- [x] T049 [US5] Test contact section at 320px, 480px, 768px - verify layout transitions

**Checkpoint**: Contact section accessible on all mobile sizes ✅

---

## Phase 8: User Story 6 - CTA Section (Priority: P2)

**Goal**: "Construimos algo juntos" section doesn't overflow on any viewport

**Independent Test**: View CTA section at 280px → no horizontal overflow

### Implementation for US6

- [x] T050 [US6] Set base `.post-cta` to constrained width with `max-width: 100%` in `src/styles/global.css`
- [x] T051 [US6] Ensure `.post-cta h2` uses `clamp()` for responsive sizing in `src/styles/global.css`
- [x] T052 [US6] Set `.post-cta .btn` to stack/wrap on base in `src/styles/global.css`
- [x] T053 [US6] Add `word-wrap: break-word` to `.post-cta p` in `src/styles/global.css`
- [x] T054 [US6] Test CTA section at 280px, 480px - verify no overflow

**Checkpoint**: CTA section contained at all viewports ✅

---

## Phase 9: Polish & Validation

**Purpose**: Final verification and cross-cutting improvements

- [x] T055 Verify desktop (1280px+) design unchanged - compare against original
- [x] T056 [P] Test all 5 breakpoints in sequence: 280px → 480px → 768px → 1024px → 1280px
- [ ] T057 [P] Run Lighthouse mobile audit - verify score 90+
- [ ] T058 Verify touch targets ≥44x44px on all interactive elements below 768px
- [x] T059 Run `npm run build` - verify 0 errors
- [ ] T060 Update `quickstart.md` with final testing guide

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) - MUST complete before user stories
    ↓
Phase 3 (US1: Small Mobile) ← MVP - Can deliver after this
    ↓
Phase 4-8 (US2-US6) ← Can run in parallel after MVP
    ↓
Phase 9 (Polish)
```

### User Story Dependencies

- **US1 (Small Mobile)**: Foundation for all other stories - complete first
- **US2 (Ask Diego)**: Independent after US1
- **US3 (Info Table)**: Independent after US1
- **US4 (Blog Cards)**: Independent after US1
- **US5 (Contact)**: Independent after US1
- **US6 (CTA)**: Independent after US1

### Parallel Opportunities

- T002 can run parallel with T001 (different files)
- T006, T007 can run parallel (different components)
- T008, T009, T010, T011 can run parallel (different breakpoint sections)
- T015, T016 can run parallel (different grid components)
- T038, T039 can run parallel (different card types)
- US2-US6 can all run in parallel after US1 (MVP) completion

---

## Parallel Example: Phase 2

```bash
# After T004-T007 complete, launch all breakpoint structures:
Task: "Add @media (min-width: 480px) section in src/styles/global.css"
Task: "Add @media (min-width: 768px) section in src/styles/global.css"
Task: "Add @media (min-width: 1024px) section in src/styles/global.css"
Task: "Add @media (min-width: 1280px) section in src/styles/global.css"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (audit)
2. Complete Phase 2: Foundational (mobile-first base)
3. Complete Phase 3: US1 - Small Mobile Viewport
4. **STOP and VALIDATE**: Test at 280px, 320px, 360px, 400px
5. Site works at minimum width - MVP achieved

### Full Implementation

1. MVP (Phases 1-3)
2. Add US2 (Ask Diego) - Test independently
3. Add US3-US6 in parallel or sequence - Test each
4. Phase 9 (Polish & Validation)

---

## Notes

- All CSS changes in `src/styles/global.css` unless otherwise specified
- Mobile-first = base styles for 280px, enhance with `min-width` queries
- Prefer `flexbox` for single-direction layouts, `grid` for 2D layouts
- Test each user story independently at all breakpoints before moving on
- Desktop (1280px+) must match original design exactly
