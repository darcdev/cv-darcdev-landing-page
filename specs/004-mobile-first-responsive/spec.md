# Feature Specification: Mobile-First Responsive Redesign

**Feature Branch**: `004-mobile-first-responsive`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "Mobile-first CSS approach with 280px minimum viewport, maximum 5 standard breakpoints, fix responsive issues in about section, information table, blog cards, Ask Diego demo, contact section, and construimos algo juntos section"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Small Mobile Viewport (280-479px) (Priority: P1)

A user visits the portfolio on a very small device (280px-479px viewport). All content displays in a single column without horizontal scrolling. Text is readable, touch targets are accessible, and no content overflows the viewport.

**Why this priority**: 280px is the minimum supported viewport. If this doesn't work, the site is broken for the smallest devices. This is the foundation of mobile-first design.

**Independent Test**: Open site in DevTools at 280px width. Scroll through entire page. No horizontal scrollbar should appear, all text should be readable, all interactive elements should be tappable.

**Acceptance Scenarios**:

1. **Given** the viewport is 280px wide, **When** user loads the page, **Then** all content fits within the viewport with no horizontal scroll
2. **Given** the viewport is 320px wide, **When** user views the About section, **Then** the bio text wraps naturally and the info table displays labels and values stacked vertically
3. **Given** the viewport is 360px wide, **When** user views the Blog section, **Then** all blog cards display one per row with uniform styling (no "featured" larger cards)
4. **Given** the viewport is 400px wide, **When** user views the Contact section, **Then** each contact item (Email, Phone, etc.) shows label on one line and value on the next line

---

### User Story 2 - Ask Diego Demo Responsiveness (Priority: P1)

A user interacts with the "Ask Diego" AI demo section on any mobile device. The input field, suggestion badges, and response area all adapt to the viewport width without overflowing or breaking the layout.

**Why this priority**: This is an interactive feature that currently breaks on mobile. Fixing it is critical for the user experience of the demo feature.

**Independent Test**: Resize browser from 280px to 768px. At each width, the Ask Diego section should display cleanly with input field, badges wrapping, and response area fitting within bounds.

**Acceptance Scenarios**:

1. **Given** the viewport is less than 480px, **When** user views Ask Diego section, **Then** the layout changes from 2-column grid to single column stack
2. **Given** the viewport is 320px, **When** user sees suggestion badges, **Then** badges wrap to multiple lines without overflowing
3. **Given** the viewport is any mobile width, **When** user types in the input field, **Then** the input field and send button remain usable with adequate touch targets

---

### User Story 3 - Information Table Stacking (Priority: P2)

A user views the "About" section info card (Location, Email, Phone, Languages) on mobile. Instead of cramped side-by-side layout, labels display on one line and values on the next line for each item.

**Why this priority**: The current side-by-side layout causes text overflow on narrow screens. Stacking improves readability significantly on mobile.

**Independent Test**: View About section info card at 320px. Each info row should show the label (e.g., "UBICACION") on top and the value (e.g., "Montevideo, Uruguay") below it.

**Acceptance Scenarios**:

1. **Given** the viewport is less than 480px, **When** user views the info card, **Then** each key-value pair stacks vertically (label above value)
2. **Given** the viewport is 480px or wider, **When** user views the info card, **Then** key-value pairs display horizontally as before

---

### User Story 4 - Blog Section Uniform Cards (Priority: P2)

A user browses the Blog section on any device. On mobile, cards display one per row with consistent styling. The varying "featured" card sizes are removed for cleaner mobile experience.

**Why this priority**: The current featured card layout breaks on mobile with varying sizes. Uniform cards provide a cleaner, more predictable mobile experience.

**Independent Test**: View Blog section at 360px. All cards should be the same style, displayed one per row, with consistent cover image heights and body padding.

**Acceptance Scenarios**:

1. **Given** the viewport is less than 768px, **When** user views Blog section, **Then** all cards display uniformly (no featured/side/base variations)
2. **Given** the viewport is less than 480px, **When** user scrolls through blog cards, **Then** each card takes full width (one per row)
3. **Given** the viewport is 768px or wider, **When** user views Blog section, **Then** the magazine-style layout with featured cards is maintained

---

### User Story 5 - Contact Section Mobile Layout (Priority: P2)

A user views the Contact section on mobile. The big heading and contact links adapt to mobile width. Each contact item shows label and value stacked vertically.

**Why this priority**: Contact information must be accessible and readable on mobile for users to reach out.

**Independent Test**: View Contact section at 320px. Heading should scale down, and each contact link should show label on top line, value below.

**Acceptance Scenarios**:

1. **Given** the viewport is less than 768px, **When** user views Contact section, **Then** the grid becomes single column
2. **Given** the viewport is less than 480px, **When** user views a contact link, **Then** the label and value stack vertically

---

### User Story 6 - "Construimos Algo Juntos" Section (Priority: P2)

A user views the CTA section at the bottom of the page on mobile. The section content fits within the viewport without overflowing.

**Why this priority**: This section currently overflows on mobile, breaking the page layout.

**Independent Test**: View the CTA section at 280px. All content should fit within viewport bounds.

**Acceptance Scenarios**:

1. **Given** the viewport is any width, **When** user views the CTA section, **Then** no content overflows horizontally
2. **Given** the viewport is less than 480px, **When** user views the CTA section, **Then** text and buttons stack and wrap appropriately

---

### Edge Cases

- What happens at exactly 280px (minimum supported)?
- How does the layout behave during viewport resize animations?
- What happens if a user has very large text/accessibility settings enabled?
- How do embedded media (images, videos) scale at minimum width?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: CSS MUST use mobile-first approach (min-width media queries instead of max-width)
- **FR-002**: Site MUST support minimum viewport width of 280px without horizontal scrolling
- **FR-003**: Site MUST use maximum 5 standard breakpoints: 280px (base), 480px, 768px, 1024px, 1280px
- **FR-004**: About section bio text (.bio-large) MUST scale and wrap appropriately at all viewport widths
- **FR-005**: Information table (.kv-list) MUST stack label above value on viewports below 480px
- **FR-006**: Blog section MUST display uniform cards (one per row) on viewports below 768px
- **FR-007**: Ask Diego section MUST change from 2-column to single-column layout below 480px
- **FR-008**: Ask Diego suggestion badges MUST wrap without overflowing at any viewport width
- **FR-009**: Contact section links MUST stack label and value vertically below 480px
- **FR-010**: "Construimos algo juntos" CTA section MUST NOT overflow at any viewport width
- **FR-011**: CSS SHOULD prefer flexbox over grid for simple single-direction layouts on mobile
- **FR-012**: CSS MAY use grid for complex multi-column layouts at larger breakpoints (768px+)
- **FR-013**: Desktop design (1280px+) MUST remain visually identical to current design

### Key Entities

- **Breakpoint**: A viewport width threshold where layout behavior changes (280, 480, 768, 1024, 1280)
- **Layout Mode**: The visual arrangement at each breakpoint (single-column, two-column, multi-column)
- **Component**: A section or element that requires responsive behavior (About, Blog, Ask, Contact, CTA)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Site displays without horizontal scrollbar at all viewports from 280px to 1920px
- **SC-002**: All text remains readable (no truncation or overflow) at 280px minimum width
- **SC-003**: All interactive elements maintain minimum 44x44px touch target at mobile sizes
- **SC-004**: Page loads and renders correctly on real devices: iPhone SE (375px), iPhone 14 (390px), iPad Mini (768px)
- **SC-005**: Lighthouse mobile performance score remains 90+ after changes
- **SC-006**: All 6 identified sections (About, Info table, Blog, Ask Diego, Contact, CTA) display correctly at 280px, 480px, 768px, 1024px, and 1280px
- **SC-007**: CSS file size does not increase by more than 20% due to mobile-first refactoring

## Assumptions

- Users access the site on devices with viewport widths from 280px (very small phones, accessibility zoom) to 1920px (large desktop monitors)
- The existing desktop design (1280px+) is finalized and should not change
- Mobile-first CSS will improve maintainability and performance for mobile users
- Standard industry breakpoints (480px, 768px, 1024px, 1280px) align with real device sizes
- JavaScript interactions (hamburger menu, theme toggle, terminal) already work on mobile
- The current Astro/Preact architecture does not need to change for responsive CSS updates
