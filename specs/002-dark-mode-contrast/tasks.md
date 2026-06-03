# Tasks: Dark Mode Contrast

**Input**: Design documents from `/specs/002-dark-mode-contrast/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md
**Tests**: Not requested; focus on implementation tasks only.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current Ask section styling surface and theme tokens before making changes.

- [X] T001 Review the Ask section markup in `src/components/organisms/AskSection.astro` and `src/components/islands/AskAI.tsx` to confirm the exact elements that need dark mode contrast updates
- [X] T002 Review the existing Ask section styling block in `src/styles/global.css` to identify the current background, border, text, and badge rules that will be adjusted

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared contrast and boundary styling so all user stories can build on the same visual foundation.

**⚠️ CRITICAL**: No user story work should begin until the Ask section foundation styles are updated.

- [X] T003 Update the base Ask section dark mode surface styling in `src/styles/global.css` so the section background and surrounding contrast support readable content
- [X] T004 [P] Define the shared dark mode text and placeholder contrast for the Ask input and output copy in `src/styles/global.css`
- [X] T005 [P] Define the shared dark mode boundary styling for the Ask input and suggestion buttons in `src/styles/global.css`

**Checkpoint**: The Ask section has a consistent dark mode foundation for readable text and visible controls.

---

## Phase 3: User Story 1 - Readable Dark Mode Content (Priority: P1) 🎯 MVP

**Goal**: Make the badges and search field text easy to read in dark mode.

**Independent Test**: Open the Ask section in dark mode and confirm the input text, placeholder, badge labels, and response text are clearly legible without zooming.

### Implementation for User Story 1

- [X] T006 [US1] Update the Ask heading, description, and output text contrast in `src/styles/global.css` so dark mode copy remains readable
- [X] T007 [P] [US1] Update the Ask input text and placeholder contrast in `src/styles/global.css` so the search field is easy to read in dark mode
- [X] T008 [P] [US1] Update the suggestion badge text contrast in `src/styles/global.css` so badge labels stay readable in dark mode

**Checkpoint**: User Story 1 is complete when the Ask section text and badges are readable in dark mode.

---

## Phase 4: User Story 2 - Visible Search Field Boundaries (Priority: P2)

**Goal**: Make the search field border clearly noticeable in dark mode.

**Independent Test**: Open the Ask section in dark mode and confirm the search field boundary is easy to distinguish from the background before and after focus.

### Implementation for User Story 2

- [X] T009 [US2] Strengthen the Ask input border and background boundary in `src/styles/global.css` so the field is visibly separated from the page surface in dark mode
- [X] T010 [P] [US2] Tune the Ask input focus and hover states in `src/styles/global.css` so the field remains obvious when users interact with it
- [X] T011 [US2] Adjust the Ask send button and suggestion button styling in `src/styles/global.css` if needed so the input row feels visually balanced with the stronger field boundary

**Checkpoint**: User Story 2 is complete when the search field is easy to spot in dark mode.

---

## Phase 5: User Story 3 - Consistent Dark Mode Presentation (Priority: P3)

**Goal**: Keep the Ask section polished and usable across dark and light modes.

**Independent Test**: Compare the Ask section in light and dark mode and confirm the layout remains stable while readability improves in dark mode.

### Implementation for User Story 3

- [X] T012 [US3] Review spacing and section padding in `src/styles/global.css` to ensure the updated contrast does not disturb the Ask layout
- [X] T013 [P] [US3] Confirm the Ask section wrapper in `src/components/organisms/AskSection.astro` does not need structural changes after the styling updates
- [X] T014 [US3] Verify the final Ask section styles in `src/styles/global.css` preserve light mode readability while keeping the dark mode contrast improvements

**Checkpoint**: All user stories are independently complete and the Ask section remains visually consistent across themes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and verification across the full Ask experience.

- [X] T015 [P] Review `src/styles/global.css` for any duplicate or conflicting Ask section rules introduced by the contrast update
- [X] T016 Validate the Ask section manually in both themes using `specs/002-dark-mode-contrast/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - MVP slice
- **User Story 2 (P2)**: Can start after Foundational - independent of US1
- **User Story 3 (P3)**: Can start after Foundational - verifies theme consistency

### Parallel Opportunities

- `T004` and `T005` can run in parallel because they touch separate styling concerns in `src/styles/global.css`
- `T007` and `T008` can run in parallel because they adjust separate dark mode text targets
- `T010` can run in parallel with `T011` because they affect different Ask controls
- `T013` can run in parallel with `T014` because one confirms structure and the other validates theme parity

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and verify readability in dark mode

### Incremental Delivery

1. Ship the readable text improvements first
2. Add the visible border and field boundary improvements
3. Finish with consistency checks across both themes

## Task Format Validation

All tasks follow the required checklist format: checkbox, sequential ID, optional `[P]`, optional story label, and exact file path.
