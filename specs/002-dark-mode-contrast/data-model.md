# Data Model: Dark Mode Contrast

## Entities

### Ask Section

- **Purpose**: Container for the badges and search field affected by the visual fix.
- **Fields**: themeState, layoutState, contentVisibility
- **Relationships**: Contains one or more badges and one search field.

### Badge

- **Purpose**: Compact label shown in the Ask section.
- **Fields**: labelText, contrastState, backgroundTreatment
- **Relationships**: Belongs to the Ask Section.

### Search Field

- **Purpose**: User input used to search within the Ask section.
- **Fields**: placeholderText, borderVisibility, textContrast, focusState
- **Relationships**: Belongs to the Ask Section.

### Theme State

- **Purpose**: Describes whether the page is in light or dark mode.
- **Fields**: mode, contrastProfile, sharedStylingRules
- **Relationships**: Applies to the Ask Section, Badge, and Search Field.

## Rules

- Dark mode must make badge text readable at normal viewing distance.
- The search field boundary must remain visually distinct even when not focused.
- Theme-specific styling must not alter the section's layout structure.
