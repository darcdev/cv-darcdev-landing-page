# Feature Specification: Astro CV Landing Page Migration

**Feature Branch**: `001-astro-cv-migration`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Build CV landing page that represents the same but organized, reusable, and scalable code, without losing anything - faithful design and functionality"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Portfolio Homepage (Priority: P1)

A visitor arrives at the portfolio website and sees Diego Cabrera's professional introduction. They can view the hero section with animated avatar, read the bio, scroll through the terminal demonstration, and see the technology marquee strip. The page loads quickly and all visual elements appear as designed.

**Why this priority**: The homepage hero is the first impression. Without it, there is no portfolio. This establishes the core layout, design tokens, and component foundation.

**Independent Test**: Can be fully tested by loading the homepage and verifying all hero elements render correctly with animations, and delivers a complete first-impression experience.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page finishes loading, **Then** the dot-grid background with mouse-following glow appears, the animated SVG avatar displays with floating badges, and the terminal begins its typing animation.

2. **Given** a visitor is viewing the hero section, **When** they move their mouse across the screen, **Then** the dot-glow effect smoothly follows the cursor position.

3. **Given** the page is loaded, **When** the terminal animation completes, **Then** all command outputs are visible and the cursor continues blinking.

4. **Given** a visitor views the hero section, **When** they observe the floating geometric shapes, **Then** the shapes animate continuously with varying speeds and rotations.

---

### User Story 2 - Navigate and Explore Sections (Priority: P1)

A visitor uses the navigation to explore different sections of the portfolio: About, Projects, Blog, and Contact. The navigation highlights the current section as they scroll, and clicking navigation links smoothly scrolls to the target section.

**Why this priority**: Navigation is essential for a multi-section single-page application. Users must be able to find and access all content areas.

**Independent Test**: Can be fully tested by clicking each navigation link and verifying smooth scroll behavior, and by scrolling manually to verify the active section indicator updates correctly.

**Acceptance Scenarios**:

1. **Given** a visitor is on any section, **When** they click a navigation link, **Then** the page smoothly scrolls to that section and the navigation link becomes active.

2. **Given** a visitor scrolls through the page, **When** a new section enters the viewport, **Then** the navigation automatically updates to highlight the current section.

3. **Given** a visitor is viewing the page, **When** they scroll past the header, **Then** the navigation remains sticky at the top of the viewport.

---

### User Story 3 - Toggle Theme (Priority: P2)

A visitor prefers a dark color scheme and clicks the theme toggle button. The entire site transitions to dark mode with all colors, shadows, and contrasts adjusted appropriately. Their preference persists during their session.

**Why this priority**: Theme support is a key feature of the existing design and enhances user experience, but the site functions without it.

**Independent Test**: Can be fully tested by toggling the theme button and verifying all components update their colors correctly.

**Acceptance Scenarios**:

1. **Given** a visitor is viewing the site in light mode, **When** they click the theme toggle button, **Then** all page elements transition to dark mode colors smoothly.

2. **Given** the site is in dark mode, **When** the visitor navigates between sections, **Then** all components maintain the dark theme consistently.

3. **Given** a visitor toggles the theme, **When** the transition completes, **Then** text remains readable with sufficient contrast in both modes.

---

### User Story 4 - Browse Projects (Priority: P2)

A visitor wants to see Diego's work history. They scroll to the Projects section, see featured project cards with image galleries, filter projects by type, and can click any project to view detailed information in a modal.

**Why this priority**: Projects demonstrate professional competence. This is critical for the portfolio's purpose but depends on the foundational layout.

**Independent Test**: Can be fully tested by viewing the projects section, using filters, navigating card galleries, and opening/closing project modals.

**Acceptance Scenarios**:

1. **Given** a visitor views the Projects section, **When** the section loads, **Then** three featured project cards display with image galleries and a list of all projects appears below.

2. **Given** a visitor is viewing project cards, **When** they click gallery navigation arrows, **Then** the gallery slides to show the next/previous image with smooth transition.

3. **Given** a visitor clicks a filter chip, **When** the filter is applied, **Then** only matching projects are displayed and the count updates.

4. **Given** a visitor clicks a project row or card, **When** the click registers, **Then** a modal opens with full project details including summary, problem, solution, impact, and tech stack.

5. **Given** a project modal is open, **When** the visitor clicks outside or presses Escape, **Then** the modal closes and focus returns to the page.

---

### User Story 5 - Read Blog Posts (Priority: P2)

A visitor interested in Diego's writing navigates to the Blog section. They see a magazine-style layout with featured articles, can filter by category, and can click any post to read the full article with table of contents and reading progress indicator.

**Why this priority**: Blog content showcases expertise and thought leadership. Important for the portfolio but secondary to core profile presentation.

**Independent Test**: Can be fully tested by viewing the blog section, filtering posts, and opening a full post view with all reading features.

**Acceptance Scenarios**:

1. **Given** a visitor views the Blog section, **When** the section loads, **Then** a magazine layout displays with one featured large card, side cards, and bottom row cards.

2. **Given** a visitor clicks a blog post card, **When** the click registers, **Then** the full post page view opens with hero, table of contents, article body, and author bio.

3. **Given** a visitor is reading a post, **When** they scroll through the article, **Then** the reading progress bar at the top updates to show completion percentage.

4. **Given** a visitor is on a post page, **When** they click "Volver al blog", **Then** they return to the main view scrolled to the Blog section.

---

### User Story 6 - Interact with Ask AI Demo (Priority: P3)

A visitor discovers the "Ask AI" section and wants to try the RAG demonstration. They can type questions or click suggested prompts, and receive simulated AI-generated responses with source citations.

**Why this priority**: This is a showcase feature demonstrating AI expertise. Valuable but not essential for the core portfolio function.

**Independent Test**: Can be fully tested by typing questions and clicking suggestion buttons, then verifying responses appear with citations.

**Acceptance Scenarios**:

1. **Given** a visitor is in the Ask AI section, **When** they click a suggested question button, **Then** the input populates and a response appears with typing effect and source citations.

2. **Given** a visitor types a custom question, **When** they press Enter or click the send button, **Then** the system responds with a relevant pre-defined answer or default response.

---

### User Story 7 - Contact and Download CV (Priority: P2)

A visitor decides to reach out to Diego. They scroll to the Contact section, see all contact methods, can copy email/phone to clipboard, and can download the CV PDF.

**Why this priority**: Contact is the conversion goal of the portfolio. Essential for the site to fulfill its purpose.

**Independent Test**: Can be fully tested by clicking contact links to verify copy functionality and downloading the CV file.

**Acceptance Scenarios**:

1. **Given** a visitor is in the Contact section, **When** they click the email link, **Then** the email address is copied to clipboard and "copiado" confirmation appears.

2. **Given** a visitor clicks "Descargar CV", **When** the click registers, **Then** the CV PDF file downloads to their device.

3. **Given** a visitor clicks external links (LinkedIn, GitHub), **When** the click registers, **Then** the link opens in a new tab.

---

### User Story 8 - View on Mobile Devices (Priority: P2)

A visitor accesses the portfolio from a mobile device. All sections adapt responsively, navigation transforms to fit smaller screens, and touch interactions work correctly for galleries and modals.

**Why this priority**: Mobile traffic is significant. The portfolio must be fully functional on all device sizes.

**Independent Test**: Can be fully tested by viewing the site at various viewport widths and verifying all content is accessible and interactive.

**Acceptance Scenarios**:

1. **Given** a visitor views the site on a mobile device, **When** the page loads, **Then** all content stacks vertically, text is readable without zooming, and touch targets are adequately sized.

2. **Given** a visitor is on mobile, **When** they tap navigation links, **Then** the page scrolls to the correct section.

3. **Given** a visitor views project galleries on mobile, **When** they swipe or tap arrows, **Then** the gallery navigates correctly.

---

### Edge Cases

- What happens when JavaScript is disabled? Core content (text, images, navigation links) must remain accessible; only animations and interactive features degrade.
- How does the system handle slow network connections? Critical content must load first; images should lazy-load with appropriate placeholders.
- What happens if a project/post slug is invalid? The system should display a graceful "not found" state.
- How does the site behave with screen readers? All interactive elements must have appropriate ARIA labels and keyboard navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Site MUST render a complete homepage with hero, about, projects, ask AI, blog, and contact sections matching the original design pixel-perfectly.
- **FR-002**: Navigation MUST include scroll spy that highlights the current section and smooth scroll to section on click.
- **FR-003**: Theme toggle MUST switch between light and dark modes with all color tokens updating consistently.
- **FR-004**: Hero section MUST display animated SVG avatar with blinking eyes, floating badges, and decorative geometric shapes.
- **FR-005**: Hero section MUST include an animated terminal with typing effect that displays predefined commands and outputs.
- **FR-006**: Hero section MUST include a marquee strip with technologies that scrolls continuously.
- **FR-007**: About section MUST display bio, statistics grid, experience timeline, and skills grid.
- **FR-008**: Projects section MUST display featured cards with image galleries, filter chips, and expandable project rows.
- **FR-009**: Projects section MUST support modal view with full project details when a project is clicked.
- **FR-010**: Blog section MUST display posts in magazine layout with featured, side, and bottom card variants.
- **FR-011**: Blog posts MUST open in a full-page view with reading progress bar, table of contents, and author bio.
- **FR-012**: Ask AI section MUST provide interactive demo with preset questions and simulated responses.
- **FR-013**: Contact section MUST display contact information with copy-to-clipboard functionality for email and phone.
- **FR-014**: Site MUST include downloadable CV PDF from hero and contact sections.
- **FR-015**: Site MUST be fully responsive across mobile, tablet, and desktop viewports.
- **FR-016**: All reveal-on-scroll animations MUST trigger when elements enter the viewport.
- **FR-017**: Dot-grid background with mouse-following glow effect MUST be present on all views.
- **FR-018**: Language selector MUST switch between Spanish and English labels (i18n-ready structure).

### Key Entities

- **Profile**: Owner information including name, role, bio, location, contact details, social links, and availability status.
- **Experience**: Work history entries with role, company, location, period, and highlight bullets.
- **Skill**: Grouped technical skills with category name and list of technologies.
- **Project**: Portfolio item with title, tagline, year, role, client, status, type, tags, summary, problem, solution, impact, stack, and optional live URL.
- **Post**: Blog article with title, excerpt, category, tags, date, read time, featured flag, cover pattern, and structured body content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Site achieves Lighthouse Performance score of 95 or higher.
- **SC-002**: Site achieves Lighthouse Accessibility score of 100.
- **SC-003**: Site achieves Lighthouse Best Practices score of 100.
- **SC-004**: Site achieves Lighthouse SEO score of 100.
- **SC-005**: All pages render with core content visible within 1.5 seconds on a standard connection.
- **SC-006**: Total JavaScript shipped to browser is under 50KB gzipped (excluding Astro runtime if any).
- **SC-007**: Visual regression tests confirm 95% or greater pixel match with original design across all sections.
- **SC-008**: All interactive elements are keyboard navigable and screen reader accessible.
- **SC-009**: Site functions with core content accessible when JavaScript is disabled.
- **SC-010**: All animations run at 60fps without jank on mid-range devices.

## Assumptions

- The existing design in `Portfolio.html`, `styles.css`, and JSX files represents the authoritative visual specification.
- The current React component structure provides the logical decomposition for Astro components.
- Data currently in `data.jsx` will be migrated to TypeScript files or Astro content collections.
- Images referenced by `image-slot` custom elements will be replaced with actual images or maintained as placeholder slots.
- The CV PDF file exists at `uploads/CV_Diego_Andres_Cabrera_Rojas_CV.pdf` and will be migrated to the Astro assets directory.
- No backend services are required; all functionality is client-side or pre-rendered.
- The language toggle switches UI labels only; content is single-language (Spanish) with i18n-ready structure for future expansion.
- Use app.jsx, components.jsx, and tweaks-panel.jsx and view.jsx
- use image-slot.js but more understandable
- i dont like comments unuseful 
