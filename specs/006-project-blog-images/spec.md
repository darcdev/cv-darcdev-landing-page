# Feature Specification: Project & Blog Images

**Feature Branch**: `006-project-blog-images`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "allow add images on projects and blogs , in projects not only one image a list of images"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Showcase project work with a gallery of images (Priority: P1)

As the site owner, I want to attach **multiple images** to each project so that visitors can see real screenshots, diagrams, or photos of the work — instead of relying solely on the abstract SVG cover pattern.

**Why this priority**: Projects are the centerpiece of the CV/portfolio. Real visual proof of the work delivered is the single biggest credibility lever; it directly improves conversion from "visitor" to "lead" and is the explicit primary ask in the user input ("not only one image a list of images").

**Independent Test**: Can be fully tested by adding one project with 3 images, opening the project on the live site, and confirming all 3 images render in a navigable gallery on both desktop and mobile, in the correct order, with no layout shift and proper alt text.

**Acceptance Scenarios**:

1. **Given** a project has been authored with an ordered list of 3 images, **When** a visitor opens the project detail/modal view, **Then** all 3 images appear in the order they were authored, the first image is shown as the primary visual, and the visitor can navigate to the other 2 without leaving the project view.
2. **Given** a project has been authored with no images at all, **When** a visitor opens the project, **Then** the existing abstract cover pattern is shown as a fallback and no broken-image placeholder is displayed.
3. **Given** a project has been authored with exactly 1 image, **When** a visitor opens the project, **Then** that single image is shown as the primary visual and the gallery navigation controls are hidden (since there is nothing to navigate to).
4. **Given** a project image fails to load (e.g. broken path), **When** the project view is rendered, **Then** the failed image is gracefully skipped or replaced with the cover-pattern fallback, and the rest of the gallery continues to work.

---

### User Story 2 - Add a hero image to a blog post (Priority: P1)

As a content author, I want to attach a **single hero image** to each blog post so that the post listing and the post detail page show a real, relevant image instead of the generic SVG cover pattern.

**Why this priority**: Blog posts with real images get measurably higher click-through and time-on-page. The current SVG patterns are decorative but undifferentiated — visitors cannot tell posts apart at a glance. This is the second half of the user input ("allow add images on projects **and blogs**").

**Independent Test**: Can be fully tested by adding one image to one existing post, viewing the blog index and the post detail page, and confirming the image appears correctly in both places without breaking any other post that has no image.

**Acceptance Scenarios**:

1. **Given** a blog post has been authored with a hero image, **When** a visitor opens the blog index, **Then** that post's card shows the hero image in the thumbnail position.
2. **Given** a blog post has been authored with a hero image, **When** a visitor opens the post detail page, **Then** the hero image appears at the top of the article and is visually prominent above the article body.
3. **Given** a blog post has no hero image, **When** a visitor views it on the index or detail page, **Then** the existing SVG cover pattern is shown unchanged.

---

### User Story 3 - Authoring images is simple and locale-aware (Priority: P2)

As a content author, I want a clear, low-friction way to declare images on a project or post — including alternative text that adapts per language — so I can ship new content without wrestling with the data model or breaking accessibility.

**Why this priority**: P2 because it does not change what the visitor sees, but it directly determines whether the site owner will actually use the feature. A clunky authoring path means images never get added and the P1 stories deliver no real-world value.

**Independent Test**: Can be fully tested by an author adding images to a project and a post following only the documented authoring guide, without reading source code, and verifying the resulting site builds without errors and shows the images correctly in both Spanish and English.

**Acceptance Scenarios**:

1. **Given** the authoring guide for projects, **When** an author declares a list of images for a project, **Then** they can specify the order, an alt text, and an optional caption for each image, and the alt text is provided per supported locale.
2. **Given** an image's alt text exists in Spanish but not English, **When** the page is viewed in English, **Then** the Spanish alt text is used as a fallback and a build-time warning is emitted (so the gap is visible without breaking the build).
3. **Given** an author saves a project or post with malformed image data (e.g. missing path), **When** the site is built, **Then** the build fails with a clear, locatable error pointing to the offending project or post.

---

### Edge Cases

- **No images authored**: System MUST fall back to the existing SVG cover pattern. No empty slots, no broken icons.
- **Very large image (e.g. >2 MB original)**: System MUST serve a size-appropriate version so that page load is not degraded. Author SHOULD NOT need to manually resize.
- **Single image on a project**: Gallery navigation controls MUST be hidden — there is nothing to navigate.
- **Many images on a project (e.g. 12+)**: Gallery MUST remain usable on mobile (no horizontal overflow, controls remain reachable, performance acceptable).
- **Image fails to load at runtime**: Visitor MUST NOT see a broken-image icon; the cover-pattern fallback or a graceful empty state takes over.
- **Mixed sources (local file + external URL within the same project)**: MUST be supported so authors can mix screenshots they own with diagrams hosted elsewhere.
- **Locale switch with images already shown**: When a visitor switches language, image alt text and caption MUST update without a full page reload, consistent with the existing i18n behavior of the site.
- **Image with no alt text in any locale**: Build MUST fail (accessibility requirement; alt text is mandatory).

## Requirements *(mandatory)*

### Functional Requirements

#### Projects

- **FR-001**: Each project MUST be able to declare an ordered list of zero or more images.
- **FR-002**: When a project has one or more images, the first image MUST be used as the project's primary visual on the project detail/modal view, replacing the SVG cover pattern in that location.
- **FR-003**: When a project has two or more images, visitors MUST be able to navigate through every image without leaving the project view.
- **FR-004**: When a project has zero images, the existing SVG cover pattern MUST be shown unchanged (full backward compatibility with current projects).
- **FR-005**: The project image list MUST preserve authored order on render.
- **FR-006**: Each project image MUST support an alt text and an optional caption, both of which MUST be translatable per supported locale.
- **FR-007**: The project listing/grid view (cards, featured tiles) MUST use the project's first image (when present) as the card thumbnail; otherwise the SVG cover pattern is used.

#### Blog posts

- **FR-008**: Each blog post MUST be able to declare an optional single hero image.
- **FR-009**: When a post has a hero image, that image MUST appear as the post's thumbnail in the blog index AND as a prominent hero on the post detail page.
- **FR-010**: When a post has no hero image, the existing SVG cover pattern MUST be shown unchanged in both the index and detail views.
- **FR-011**: The hero image MUST support a translatable alt text per supported locale.

#### Image sources & assets

- **FR-012**: System MUST support images stored as local project assets (under the site's asset directory).
- **FR-013**: System MUST support images referenced by absolute external URL.
- **FR-014**: System MUST serve appropriately sized images for the rendering context (card thumbnail vs. detail hero vs. gallery view) so that visitors do not download larger images than they need.
- **FR-015**: Local images MUST be served in a modern, well-compressed image format (e.g., the format chosen at build time) without requiring the author to pre-process the source file.

#### Authoring & validation

- **FR-016**: Authors MUST be able to add, reorder, and remove images on a project, and add/remove a hero image on a post, by editing the project/post source — no separate tool or admin UI required.
- **FR-017**: A project image entry without alt text in any supported locale MUST cause the build to fail with a clear, locatable error.
- **FR-018**: A project image entry with alt text in some but not all supported locales MUST emit a build-time warning and MUST fall back to the default-locale alt text at runtime.
- **FR-019**: A reference to a missing local image file MUST cause the build to fail with a clear, locatable error.
- **FR-020**: An external image URL that fails to load at runtime MUST NOT break the page; the system MUST gracefully fall back to the SVG cover pattern for that slot.

#### Accessibility & UX

- **FR-021**: Every rendered image MUST expose meaningful alt text in the active locale (or the default-locale fallback), never an empty or placeholder string.
- **FR-022**: The project gallery MUST be operable by keyboard alone (next/previous/close).
- **FR-023**: The project gallery MUST not introduce layout shift on image load (reserved aspect ratio).
- **FR-024**: The project gallery navigation controls MUST meet a minimum 44×44 px touch target on mobile (consistent with existing project accessibility baselines).

### Key Entities

- **Project Image**: A single image attached to a project. Attributes: ordered position in the project's image list, image source (local asset reference or external URL), per-locale alt text (required in default locale), optional per-locale caption. A project has zero or more Project Images.
- **Post Hero Image**: A single image attached to a blog post. Attributes: image source (local asset reference or external URL), per-locale alt text (required in default locale). A post has zero or one Post Hero Image.
- **Project** *(existing, modified)*: Gains an ordered list of Project Images. Existing `cover` SVG-pattern field is retained as the fallback when the image list is empty.
- **Post** *(existing, modified)*: Gains an optional Post Hero Image. Existing `cover` SVG-pattern field is retained as the fallback when no hero image is set.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 80% of currently published projects can have ≥3 real images added to them within 1 working day of authoring effort, with no developer intervention required for any of them.
- **SC-002**: Adding a real hero image to a blog post takes an author no more than 3 minutes from "image file in hand" to "image visible on the published site" (excluding deployment time).
- **SC-003**: On a typical project detail view with 3 gallery images, the visible content (above the fold) becomes interactive in under 2.5 seconds on a mid-range mobile device on a 4G connection.
- **SC-004**: 100% of rendered images on the live site expose non-empty, locale-appropriate alt text — verified by an automated build-time check.
- **SC-005**: Pages with images score ≥ 95 on the Accessibility category and ≥ 90 on the Performance category in an automated Lighthouse audit (consistent with existing site baselines).
- **SC-006**: Zero broken-image icons appear to visitors during a 7-day post-launch window, measured via the absence of failed-image fallbacks being displayed in production.
- **SC-007**: A project authored with zero images and a post authored with no hero image render identically to before this feature shipped (visual regression: pixel-level parity on the SVG cover pattern).

## Assumptions

- The existing SVG cover-pattern system is **kept** and acts as the fallback whenever a project or post does not declare images. The feature is purely additive; no migration is required for existing content.
- The set of supported locales for image alt text and captions is the same set already declared by the site's i18n configuration. Adding a new language for images requires no separate work beyond what's already needed to add a new site language.
- Authors are responsible for the licensing/ownership of any image they add; the system does not perform rights management.
- "List of images" for projects means an **ordered sequence** authored explicitly; sort order is not derived from filenames or upload date.
- Blog posts get exactly one hero image (not a gallery) for v1. A blog gallery is out of scope here and can be a follow-up if needed.
- Original image files provided by authors may be larger than what the site needs to serve; the system handles resizing/optimization at build time so authors do not have to.
- The project gallery is a **viewer**, not an editor: visitors cannot upload, comment on, or share images from the gallery.
- The feature targets the same browsers/devices the rest of the site already supports; no new browser-support commitments are introduced.
