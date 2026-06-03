# Data Model: Static Nav Menu

## Entities

### Navigation Menu

- **Purpose**: The site-wide menu shown at the top of the page.
- **Attributes**: visibility, current active section, open/closed mobile state, theme toggle state, language selection.

### Navigation Item

- **Purpose**: A selectable destination in the menu.
- **Attributes**: identifier, label, target section, active state.

### Viewport State

- **Purpose**: Describes whether the menu is currently visible while the user scrolls.
- **Attributes**: scroll position, sticky state, screen size.

## Relationships

- A Navigation Menu contains multiple Navigation Items.
- Viewport State determines whether the Navigation Menu stays visible during scroll.

## Validation Rules

- The navigation menu must remain visible once the user starts scrolling.
- Active item state must continue to reflect the current section.
- Mobile open/closed behavior must remain independent from sticky visibility.
