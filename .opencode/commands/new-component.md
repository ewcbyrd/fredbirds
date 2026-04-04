---
description: Scaffold a new component following project conventions
---

Create a new React component named `$ARGUMENTS` following the fredbirds project conventions:

1. Create the file at `src/components/$ARGUMENTS.jsx`
2. Use the standard component structure:
   - Functional component with `export default function $ARGUMENTS() { ... }`
   - MUI `sx` prop for all styling (no CSS modules, no Tailwind, no styled-components)
   - Import ordering per AGENTS.md: React first, then third-party, then MUI, then local components, then services
3. Use single quotes, 4-space indentation, no semicolons, no trailing commas
4. Add a basic JSX structure with a `PageContainer` wrapper if it is a page component
5. Include any props that were described along with the component name

If the component name was not provided, ask what the component should be called and what it should do.
