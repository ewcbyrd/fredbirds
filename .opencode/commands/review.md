---
description: Review current changes for quality and conventions
agent: plan
---

Review the current uncommitted changes in this project:

!`git diff`
!`git diff --cached`
!`git status`

Check for:
1. **Code style**: Single quotes, no semicolons, 4-space indent, no trailing commas
2. **MUI conventions**: Using `sx` prop only (no CSS modules, styled-components, or inline styles)
3. **Import ordering**: React -> third-party -> hooks -> MUI styles -> MUI components -> MUI icons -> local components -> services -> CSS
4. **Access control**: Are protected features properly gated with `MemberAccessControl` or `ProtectedRoute`?
5. **Error handling**: Are API calls wrapped in try/catch with proper error state using `useState` and `Alert`?
6. **API calls**: Are they going through service files in `src/services/` rather than directly from components?
7. **Accessibility**: Proper ARIA labels, alt text, keyboard navigation
8. **Component patterns**: Functional components only, default exports, proper naming conventions

Provide specific, actionable feedback for each issue found. Reference file paths and line numbers.
