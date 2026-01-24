---
description: Create a new UI component following standardized patterns
---

1. **Review Standards**: Read `COMPONENT_GUIDE.md` to understand available base components (`AppCard`, `AppDialog`, etc.) and their props.
2. **Context**: Understand the requirements for the new component.
3. **Draft**: Create the component file in the appropriate directory (e.g., `src/components/` or `src/components/common/`).
   - If it's a list or grid, use `AppCard` or `AdminResourceList`.
   - If it's a modal, use `AppDialog`.
4. **Refine**: Ensure props interface matches established patterns (e.g., passing `sx` props for override).
5. **Verify**: Check that the new component renders correctly and matches the design system.
