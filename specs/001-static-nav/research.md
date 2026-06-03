# Research: Static Nav Menu

## Decisions

### Keep the current nav island

- **Decision**: Preserve `src/components/islands/Nav.tsx` and adjust its visible behavior instead of introducing a new navigation component.
- **Rationale**: The navigation already owns scroll state, responsive menu state, and section highlighting.
- **Alternatives considered**: Rebuilding the nav in a new component; moving behavior into the layout.

### Use the existing sticky header pattern

- **Decision**: Keep the navigation anchored in the viewport during scroll using the existing sticky header approach already present in the stylesheet.
- **Rationale**: This satisfies the request with the smallest visual and behavioral change.
- **Alternatives considered**: Fixed positioning; JS-driven scroll listeners.

### Preserve mobile menu behavior

- **Decision**: Keep the hamburger-driven mobile menu and overlay unchanged.
- **Rationale**: The request is about visibility while scrolling, not menu structure or interaction.
- **Alternatives considered**: Replacing the menu with an always-expanded mobile nav.

## Findings

- The nav is rendered from `src/layouts/BaseLayout.astro` and implemented in `src/components/islands/Nav.tsx`.
- The stylesheet already defines `.nav { position: sticky; top: 14px; }`, so the feature is primarily a verification and refinement task.
- The project already uses responsive mobile menu styles in `src/styles/global.css`.

## Outcome

No unresolved technical questions remain for this feature.
