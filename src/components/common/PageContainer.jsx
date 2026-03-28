import React from 'react'
import { Container } from '@mui/material'

/**
 * PageContainer - Provides consistent page layout and spacing
 * 
 * @param {React.ReactNode} children - Page content
 * @param {number|string} maxWidth - Maximum width of container (default: 1200)
 * @param {boolean} disablePadding - Remove all padding (default: false)
 * @param {object} sx - Additional MUI sx prop overrides
 */
const PageContainer = ({ 
  children, 
  maxWidth = 1200, 
  disablePadding = false,
  sx = {},
  ...props 
}) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: maxWidth,
        mx: 'auto',
        px: disablePadding ? 0 : { xs: 3, sm: 4, md: 6, lg: 8 },
        py: disablePadding ? 0 : { xs: 4, md: 6 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Container>
  )
}

export default PageContainer
