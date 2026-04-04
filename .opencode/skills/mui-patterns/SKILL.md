---
name: mui-patterns
description: MUI v5 styling conventions, theme values, and component patterns for the fredbirds project
---

## MUI Styling Rules

This project uses MUI v5 exclusively with the `sx` prop. Follow these rules strictly:

### Styling Approach
- **ONLY use the `sx` prop** for all component styling
- **NEVER use** CSS modules, Tailwind, styled-components, `makeStyles`, or inline `style` attributes
- **NEVER add** significant styles to `src/index.css` -- it is intentionally minimal (global resets only)
- Use `useTheme()` and `useMediaQuery()` for dynamic theme/responsive logic

### Responsive Design
- Use MUI responsive shorthand for breakpoints within `sx`:
  ```jsx
  sx={{ px: { xs: 2, sm: 3, md: 6 }, fontSize: { xs: '0.875rem', md: '1rem' } }}
  ```
- Use `useMediaQuery(theme.breakpoints.down('md'))` for conditional rendering logic

### Theme Values (defined in App.jsx)

**Palette:**
- Primary: `#2d5016` (Deep Forest Green), light: `#4a7c59`, dark: `#1e3910`
- Secondary: `#c17817` (Golden Amber), light: `#d4a574`, dark: `#8f570f`
- Background: default `#f8f9fa`, paper `#ffffff`
- Text: primary `#1a1a1a`, secondary `#5c5c5c`
- Accent colors: blue `#5b9bd5`, brown `#8b6f47`, teal `#2c7873`, sage `#6b8e6f`

**Typography:**
- Body font: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`
- Heading font: `"Outfit", sans-serif`
- Base font size: 16px (not the MUI default of 14px)

Always reference theme colors via `theme.palette.*` or `sx={{ color: 'primary.main' }}` rather than hardcoding hex values.

### Common Component Patterns

**Page components** use `PageContainer` from `src/components/common/PageContainer.jsx`:
```jsx
import PageContainer from './common/PageContainer'

export default function MyPage() {
    return (
        <PageContainer title="Page Title">
            {/* page content */}
        </PageContainer>
    )
}
```

**Dialogs** use `AppDialog` from `src/components/common/AppDialog.jsx` (not raw MUI Dialog):
```jsx
import AppDialog from './common/AppDialog'
```

**Cards** use `AppCard` from `src/components/common/AppCard.jsx`:
```jsx
import AppCard from './common/AppCard'
```

**Confirmation dialogs** use `ConfirmDialog` from `src/components/common/ConfirmDialog.jsx`.

### Import Style for MUI
- Import MUI components individually (not from barrel exports):
  ```jsx
  // Correct
  import Box from '@mui/material/Box'
  import Typography from '@mui/material/Typography'

  // Avoid
  import { Box, Typography } from '@mui/material'
  ```
- Import MUI icons individually:
  ```jsx
  import EditIcon from '@mui/icons-material/Edit'
  ```
