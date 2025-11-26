import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { getMemberByEmail } from '../services/restdbService'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Box,
  Divider,
  ListSubheader,
  useMediaQuery,
  useTheme,
  Alert,
  Collapse
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import CloseIcon from '@mui/icons-material/Close'
import { PersonAdd, Close } from '@mui/icons-material'
import UserProfile from './UserProfile'

export default function Header({ onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated } = useAuth0()
  const { hasAccess } = useUserRole()

  // Check if user needs to complete onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isAuthenticated || !user?.email || bannerDismissed) {
        setShowOnboardingBanner(false)
        return
      }

      try {
        await getMemberByEmail(user.email)
        // If we get here, member record exists
        setShowOnboardingBanner(false)
      } catch (error) {
        // No member record found - show onboarding banner
        setShowOnboardingBanner(true)
      }
    }

    checkOnboardingStatus()
  }, [user?.email, isAuthenticated, bannerDismissed])

  const handleDismissBanner = () => {
    setBannerDismissed(true)
    setShowOnboardingBanner(false)
  }

  const handleCompleteOnboarding = () => {
    navigate('/member-onboarding')
    setDrawerOpen(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  // Define which paths require authentication
  const memberOnlyPaths = [
    '/announcements',
    '/sightings', 
    '/newsfeed',
    '/newsletters',
    '/membership',
    '/officers',
    '/photos',
    '/members-directory'
  ]

  // Filter function to check if menu item should be shown
  const shouldShowMenuItem = (path) => {
    if (memberOnlyPaths.includes(path)) {
      return hasAccess(ACCESS_LEVELS.MEMBER)
    }
    return true // Public pages are always shown
  }

  const menuSections = [
    {
      title: 'Club Information',
      items: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Officers', path: '/officers' },
        { label: 'Members Directory', path: '/members-directory' },
        { label: 'Membership', path: '/membership' },
        { label: "FAQ's", path: '/faqs' }
      ]
    },
    {
      title: 'Club Activities',
      items: [
        { label: 'Events', path: '/events' },
        { label: 'Club News', path: '/announcements' },
        { label: 'Newsletters', path: '/newsletters' },
        { label: 'Photos', path: '/photos' }
      ]
    },
    {
      title: 'Birding Resources',
      items: [
        { label: 'Sightings', path: '/sightings' },
        { label: 'Birding News', path: '/newsfeed' }
      ]
    }
  ]

  const primaryNav = [
    { label: 'Home', path: '/' },
    { label: 'Sightings', path: '/sightings' },
    { label: 'Events', path: '/events' },
    { label: 'Membership', path: '/membership' }
  ]

  // Filter menu sections based on authentication
  const filteredMenuSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => shouldShowMenuItem(item.path))
  })).filter(section => section.items.length > 0)

  // Filter primary nav items
  const filteredPrimaryNav = primaryNav.filter(item => shouldShowMenuItem(item.path))

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#2c5f2d', boxShadow: 2 }}>
        <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto', px: { xs: 2, md: 3 } }}>
          {/* Logo/Home Button */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleNavigate('/')}
            sx={{ 
              mr: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <HomeIcon sx={{ fontSize: 28 }} />
          </IconButton>
          
          {/* Club Name */}
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            sx={{ 
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9
              }
            }}
            onClick={() => handleNavigate('/')}
          >
            {isMobile ? 'FBC' : 'Fredericksburg Birding Club'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
              {filteredPrimaryNav.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    bgcolor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Menu Icon */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ 
              mr: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>

          {/* User Profile / Login */}
          <Box>
            <UserProfile />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Onboarding Banner */}
      <Collapse in={showOnboardingBanner}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 0,
            bgcolor: '#e3f2fd',
            borderColor: '#2196f3',
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleCompleteOnboarding}
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' }
                }}
              >
                Complete Setup
              </Button>
              <IconButton
                size="small"
                onClick={handleDismissBanner}
                sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Welcome to Fredericksburg Birding Club!
            </Typography>
            <Typography variant="body2">
              Complete your member profile to access club features and connect with fellow birders.
            </Typography>
          </Box>
        </Alert>
      </Collapse>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#f5f5f5'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#2c5f2d', color: 'white' }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton color="inherit" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {filteredMenuSections.map((section, idx) => (
            <React.Fragment key={section.title}>
              <ListSubheader sx={{ bgcolor: 'transparent', fontWeight: 600, color: '#2c5f2d' }}>
                {section.title}
              </ListSubheader>
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: '#e8f5e9',
                        borderLeft: '4px solid #2c5f2d'
                      }
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              {idx < filteredMenuSections.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  )
}
