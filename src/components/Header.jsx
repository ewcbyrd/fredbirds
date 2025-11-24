import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import CloseIcon from '@mui/icons-material/Close'

export default function Header({ onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleNavigate = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const menuSections = [
    {
      title: 'Club Information',
      items: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Officers', path: '/officers' },
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
              {primaryNav.map((item) => (
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
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

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
          {menuSections.map((section, idx) => (
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
              {idx < menuSections.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  )
}
