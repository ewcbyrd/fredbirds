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
  ListItemIcon,
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
import InfoIcon from '@mui/icons-material/Info'
import GroupsIcon from '@mui/icons-material/Groups'
import BadgeIcon from '@mui/icons-material/Badge' // For Membership/Card
import MenuBookIcon from '@mui/icons-material/MenuBook' // Generic Resources/Membership
import CalendarTodayIcon from '@mui/icons-material/CalendarToday' // Events
import AnnouncementIcon from '@mui/icons-material/Announcement' // News
import AutoStoriesIcon from '@mui/icons-material/AutoStories' // Newsletters
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary' // Photos
import VisibilityIcon from '@mui/icons-material/Visibility' // Sightings
import RssFeedIcon from '@mui/icons-material/RssFeed' // Birding News
import ContactSupportIcon from '@mui/icons-material/ContactSupport' // FAQs
import { PersonAdd, Close } from '@mui/icons-material'
import UserProfile from './UserProfile'

// Component to handle scroll transparency effect
// Component to handle scroll transparency effect
function ScrollHandler(props) {
  const { children } = props

  return React.cloneElement(children, {
    elevation: 4,
    sx: {
      ...children.props.sx,
      bgcolor: 'rgba(30, 70, 32, 0.95)', // Deep Forest with transparency
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease-in-out',
      py: 0.5 // Consistent comfortable height
    }
  })
}

export default function Header(props) {
  const { onNavigate } = props
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

  // Only Members Directory is restricted
  const memberOnlyPaths = ['/members-directory']

  // Filter function to check if menu item should be shown
  const shouldShowMenuItem = (path) => {
    if (memberOnlyPaths.includes(path)) {
      return hasAccess(ACCESS_LEVELS.MEMBER)
    }
    return true // All other pages are public
  }

  const getIconForPath = (path) => {
    switch (path) {
      case '/': return <HomeIcon />
      case '/about': return <InfoIcon />
      case '/officers': return <GroupsIcon />
      case '/members-directory': return <GroupsIcon />
      case '/membership': return <BadgeIcon />
      case '/faqs': return <ContactSupportIcon />
      case '/events': return <CalendarTodayIcon />
      case '/announcements': return <AnnouncementIcon />
      case '/newsletters': return <AutoStoriesIcon />
      case '/photos': return <PhotoLibraryIcon />
      case '/sightings': return <VisibilityIcon />
      case '/newsfeed': return <RssFeedIcon />
      default: return <HomeIcon />
    }
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
      <ScrollHandler {...props}>
        <AppBar position="fixed" sx={{ bgcolor: 'transparent', boxShadow: 0 }}>
          <Toolbar sx={{ width: '100%', mx: 'auto', px: { xs: 2, md: 6, lg: 10 } }}>
            {/* Logo/Home Button */}
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => handleNavigate('/')}
              sx={{
                mr: 1,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <HomeIcon sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Club Name - with subtle text shadow for readability on hero */}
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              component="div"
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
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
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                {filteredPrimaryNav.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      py: 0.8,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: location.pathname === item.path ? '100%' : '0%',
                        height: '3px',
                        bgcolor: '#c17817', // Golden amber accent
                        transition: 'width 0.3s ease-in-out'
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '&::after': {
                          width: '100%'
                        }
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
                bgcolor: 'rgba(255,255,255,0.1)', // Glass background
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 26 }} />
            </IconButton>

            {/* User Profile / Login */}
            <Box>
              <UserProfile />
            </Box>
          </Toolbar>
        </AppBar>
      </ScrollHandler>

      {/* Onboarding Banner - Pushed down by fixed header */}
      <Box sx={{ pt: 10 }}>
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
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            bgcolor: '#f8f9fa' // Light grey clean background
          },
          zIndex: (theme) => theme.zIndex.drawer + 2
        }}
      >
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e4620 0%, #2c5f2d 100%)', // Deep Forest Gradient
          color: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ pb: 4 }}>
          {filteredMenuSections.map((section, idx) => (
            <React.Fragment key={section.title}>
              <ListSubheader sx={{
                bgcolor: 'transparent',
                fontWeight: 700,
                color: '#2c5f2d',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1,
                mt: idx === 0 ? 0 : 2
              }}>
                {section.title}
              </ListSubheader>
              {section.items.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: '#e8f5e9',
                        color: '#1e4620',
                        '& .MuiListItemIcon-root': {
                          color: '#2e7d32'
                        }
                      },
                      '&:hover': {
                        bgcolor: '#f1f8f4'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: '#757575' }}>
                      {getIconForPath(item.path)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 700 : 500
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {idx < filteredMenuSections.length - 1 && <Divider variant="middle" sx={{ my: 1, borderColor: '#eee' }} />}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  )
}
