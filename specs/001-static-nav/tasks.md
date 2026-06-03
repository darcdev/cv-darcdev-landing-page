# Tasks: Static Nav Menu

## Phase 1: Setup / Baseline

- [X] T001 Review `src/layouts/BaseLayout.astro`, `src/components/islands/Nav.tsx`, and `src/styles/global.css` to confirm the current nav mount point and sticky behavior baseline.

## Phase 2: Foundational

- [X] T002 Verify the shared nav shell in `src/layouts/BaseLayout.astro` still loads `Nav` once for the whole page and does not require new wiring.
- [X] T003 [P] Confirm the existing sticky container rules in `src/styles/global.css` are the correct starting point for a scroll-visible nav.

## Phase 3: User Story 1 - Keep Navigation Visible (Priority: P1) 🎯 MVP

**Goal**: Keep the navigation visible while the user scrolls through the page.

**Independent Test**: Scroll the landing page from top to bottom and confirm the nav remains visible the whole time.

- [X] T004 [US1] Adjust `src/styles/global.css` nav positioning rules so the menu stays visible during vertical scroll.
- [X] T005 [US1] Refine `src/components/islands/Nav.tsx` only if needed to preserve scroll-visible behavior without changing menu interactions.
- [X] T006 [US1] Verify the nav stays visible on the long-page flow defined in `specs/001-static-nav/quickstart.md`.

## Phase 4: User Story 2 - Preserve Navigation Usability (Priority: P2)

**Goal**: Keep the sticky nav usable on smaller screens without blocking content.

**Independent Test**: Open a narrow viewport, scroll the page, and confirm the nav remains usable and does not obstruct normal reading.

- [X] T007 [US2] Update `src/styles/global.css` mobile nav constraints so the visible menu does not overlap critical page content during scroll.
- [X] T008 [US2] Confirm the mobile menu overlay and hamburger flow in `src/components/islands/Nav.tsx` still work with the scroll-visible nav.

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T009 Recheck the final nav behavior against `specs/001-static-nav/quickstart.md` on desktop and mobile viewport sizes.
- [X] T010 Update any brief implementation notes in `specs/001-static-nav/research.md` if the final behavior differs from the initial assumptions.

## Dependencies & Execution Order

- Phase 1 and Phase 2 complete before story work begins.
- US1 is the MVP and should land first.
- US2 builds on the same nav shell and should be verified after US1.

## Parallel Opportunities

- `T003` can run in parallel with `T002`.
- `T006` and `T007` can be validated independently after the shared nav change lands.

## Implementation Strategy

- MVP first: complete US1 so the nav stays visible while scrolling.
- Then validate US2 so the sticky behavior still works on smaller screens.
- Finish with a quick visual and responsive pass using the quickstart steps.
