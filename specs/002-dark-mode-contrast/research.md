# Research: Dark Mode Contrast

## Decision 1: Scope the fix to the Ask section only

- **Decision**: Improve contrast, border visibility, and text readability only in the Ask section badges and search field.
- **Rationale**: The reported issue is localized, and a narrow fix preserves design fidelity and reduces risk.
- **Alternatives considered**: Restyling the full site theme; redesigning the section layout.

## Decision 2: Treat contrast and boundary clarity as accessibility requirements

- **Decision**: Use accessibility-minded contrast expectations for text and control boundaries in dark mode.
- **Rationale**: The user cannot easily notice the field border or read text, which is a classic readability/accessibility failure.
- **Alternatives considered**: Small aesthetic tweaks without contrast targets; only changing hover/focus states.

## Decision 3: Preserve light mode behavior

- **Decision**: Keep light mode visually unchanged unless a shared style adjustment is needed to maintain consistency.
- **Rationale**: The request is specifically about dark mode, and the constitution prioritizes design fidelity.
- **Alternatives considered**: Reworking both themes together; introducing a new component variant.

## Decision 4: Validate with visual review rather than functional checks

- **Decision**: Verify the change by inspecting the section in both themes on desktop and mobile.
- **Rationale**: This is a presentation issue, so success depends on perceived clarity rather than new behavior.
- **Alternatives considered**: Automated interaction tests; backend or data validation.
