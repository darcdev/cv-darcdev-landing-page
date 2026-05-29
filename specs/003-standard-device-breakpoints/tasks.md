# Tasks: Standard Device Breakpoints

**Input**: Design documents from `specs/003-standard-device-breakpoints/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: No automated tests - visual testing via browser DevTools

**Organization**: Tasks organized by breakpoint size for focused implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files)
- **[Story]**: Which breakpoint this task targets (320, 768, 1024, 1280)
- Include exact file paths in descriptions

## Simplified Breakpoints (4 sizes)

| Breakpoint | Purpose |
|------------|---------|
| 320px | Minimum mobile (iPhone SE) |
| 768px | Tablet / Nav switch |
| 1024px | Laptop (replaces 980px) |
| 1280px+ | Desktop (unchanged) |

---

## Phase 1: Setup

**Purpose**: Audit current breakpoints and plan migrations

- [X] T001 Audit all media queries in `src/styles/global.css` and list current breakpoints
- [X] T002 Audit scoped styles in `src/components/molecules/AvatarSVG.astro`
- [X] T003 Document which rules use 980px (to become 1024px) and 640px (to be removed)

**Checkpoint**: Full inventory of current breakpoints complete

---

## Phase 2: Foundational (Breakpoint Cleanup)

**Purpose**: Remove arbitrary breakpoints and consolidate to standard values

- [X] T004 Replace all `@media (max-width: 980px)` with `@media (max-width: 1024px)` in `src/styles/global.css`
- [X] T005 Merge 640px rules into 768px or remove if redundant in `src/styles/global.css`
- [X] T006 Verify no other arbitrary breakpoints exist (check for 992px, 576px, etc.)
- [X] T007 Run `npm run build` to verify no errors after consolidation

**Checkpoint**: Only standard breakpoints remain (320, 768, 1024)

---

## Phase 3: 320px Support (Priority: P1) - MVP

**Goal**: Ensure design works at minimum 320px viewport width

**Independent Test**: Resize browser to 320px, verify no horizontal scroll and all content visible

### Implementation

- [X] T008 [320] Test current layout at 320px in DevTools and document issues
- [X] T009 [320] Add `@media (max-width: 320px)` rules for avatar sizing in `src/styles/global.css`
- [X] T010 [320] Adjust avatar to `width: min(160px, 50vw)` at 320px in `src/components/molecules/AvatarSVG.astro`
- [X] T011 [320] Verify hero headline `clamp()` formula works at 320px in `src/styles/global.css`
- [X] T012 [320] Verify container padding (16px) leaves enough content width at 320px
- [X] T013 [320] Test hamburger menu at 320px - verify touch targets and usability
- [X] T014 [320] Run `npm run build` and test at 320px in production build

**Checkpoint**: Design fully functional at 320px minimum width

---

## Phase 4: 768px Support (Priority: P2)

**Goal**: Clean tablet breakpoint with proper nav switch

**Independent Test**: Resize to 768px, verify horizontal nav appears and layout is hybrid

### Implementation

- [X] T015 [768] Test current layout at 768px and document any issues
- [X] T016 [768] Verify hamburger menu hides and horizontal nav shows at exactly 768px
- [X] T017 [768] Verify hero grid uses appropriate column layout at 768px
- [X] T018 [768] Verify skills/stats grids show 2 columns at 768px
- [X] T019 [768] Test layout at 769px to confirm desktop nav is active

**Checkpoint**: Clean transition at 768px breakpoint

---

## Phase 5: 1024px Support (Priority: P2)

**Goal**: Proper laptop layout (replacing 980px)

**Independent Test**: Resize to 1024px, verify multi-column grids active

### Implementation

- [X] T020 [1024] Test current layout at 1024px after 980px→1024px migration
- [X] T021 [1024] Verify hero grid shows 2 columns at 1024px
- [X] T022 [1024] Verify projects show expanded view at 1024px
- [X] T023 [1024] Verify all grids use appropriate column counts at 1024px

**Checkpoint**: 1024px layout matches expected tablet landscape / small laptop behavior

---

## Phase 6: 1280px+ Verification (Priority: P2)

**Goal**: Desktop design unchanged

**Independent Test**: View at 1280px and 1920px, verify identical to original design

### Implementation

- [X] T024 [1280] Test layout at 1280px - must match original desktop design exactly
- [X] T025 [1280] Test layout at 1440px - content should be centered with balanced margins
- [X] T026 [1280] Test layout at 1920px - no excessive stretching
- [X] T027 [1280] Visual comparison against original design reference

**Checkpoint**: Desktop design fidelity confirmed

---

## Phase 7: Polish & Validation

**Purpose**: Final verification and cleanup

- [X] T028 Run `npm run build` - verify 0 errors
- [X] T029 Test all 4 breakpoints in sequence: 320px → 768px → 1024px → 1280px
- [X] T030 Run Lighthouse mobile audit - verify score 90+
- [X] T031 Verify no horizontal scrollbar at any viewport width
- [X] T032 Update quickstart.md with simplified 4-breakpoint testing guide

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) - MUST complete before breakpoint phases
    ↓
Phase 3 (320px) ← MVP - Can deliver after this
    ↓
Phase 4 (768px) ← Can run parallel with Phase 5
    ↓
Phase 5 (1024px) ← Can run parallel with Phase 4
    ↓
Phase 6 (1280px+) - Verification only
    ↓
Phase 7 (Polish)
```

### Parallel Opportunities

- T001, T002, T003 can run in parallel (different files)
- Phase 4 and Phase 5 can run in parallel (independent breakpoints)
- T024, T025, T026, T027 can run in parallel (different viewport sizes)

---

## Implementation Strategy

### MVP First (320px Focus)

1. Complete Phase 1: Setup (audit)
2. Complete Phase 2: Foundational (cleanup 980px→1024px, remove 640px)
3. Complete Phase 3: 320px Support
4. **STOP and VALIDATE**: Test 320px thoroughly
5. Design works at minimum width - MVP achieved

### Full Implementation

1. MVP (Phases 1-3)
2. Add Phase 4 (768px) + Phase 5 (1024px) in parallel
3. Add Phase 6 (1280px+ verification)
4. Phase 7 (Polish)

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| Setup | 3 | Audit current state |
| Foundational | 4 | Remove arbitrary breakpoints |
| 320px (MVP) | 7 | Minimum mobile support |
| 768px | 5 | Tablet / nav switch |
| 1024px | 4 | Laptop layout |
| 1280px+ | 4 | Desktop verification |
| Polish | 5 | Final validation |
| **Total** | **32** | |

---

## Notes

- No 480px breakpoint - simplified to 320px minimum
- No 1440px breakpoint - 1280px+ covers all desktop
- 640px rules merged into 768px or removed
- 980px becomes 1024px (industry standard)
