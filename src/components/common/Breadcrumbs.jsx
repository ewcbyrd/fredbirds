import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'

/**
 * Breadcrumbs component for navigation wayfinding
 * Automatically generates breadcrumbs based on current route
 */
const Breadcrumbs = ({ customCrumbs = null }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // If custom breadcrumbs provided, use those
  if (customCrumbs) {
    return (
      <Box sx={{ py: 2 }}>
        <MuiBreadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ fontSize: '0.875rem' }}
        >
          <Link
            component="button"
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' }
            }}
          >
            <HomeIcon fontSize="small" />
            Home
          </Link>
          {customCrumbs.map((crumb, index) => {
            const isLast = index === customCrumbs.length - 1
            return isLast ? (
              <Typography key={crumb.label} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.label}
                component="button"
                onClick={() => navigate(crumb.path)}
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                }}
              >
                {crumb.label}
              </Link>
            )
          })}
        </MuiBreadcrumbs>
      </Box>
    )
  }

  return null // Auto-generation can be added later if needed
}

export default Breadcrumbs
