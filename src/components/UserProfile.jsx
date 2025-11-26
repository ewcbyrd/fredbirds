import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { Button, Box, Typography, Avatar, Menu, MenuItem, Divider } from '@mui/material'
import { AccountCircle, Login, Logout, Settings, Dashboard, People, EventNote } from '@mui/icons-material'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { getMemberByEmail } from '../services/restdbService'
import RoleBadge from './RoleBadge'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  const handleLogin = () => {
    console.log('Login button clicked')
    
    // Clear any existing Auth0 state first
    const authKeys = Object.keys(localStorage).filter(key => key.startsWith('auth0'))
    authKeys.forEach(key => localStorage.removeItem(key))
    sessionStorage.clear()
    
    try {
      loginWithRedirect()
      console.log('loginWithRedirect called successfully')
    } catch (error) {
      console.error('Error calling loginWithRedirect:', error)
    }
  }

  return (
    <Button
      variant="outlined"
      startIcon={<Login />}
      onClick={handleLogin}
      sx={{
        borderColor: 'white',
        color: 'white',
        '&:hover': {
          borderColor: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      Member Login
    </Button>
  )
}

const LogoutButton = ({ onClose }) => {
  const { logout } = useAuth0()

  const handleLogout = () => {
    console.log('Logout clicked')
    onClose && onClose()
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      }
    })
  }

  return (
    <MenuItem onClick={handleLogout}>
      <Logout fontSize="small" sx={{ mr: 1 }} />
      Logout
    </MenuItem>
  )
}

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0()
  const { hasAccess, userRole } = useUserRole()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [memberData, setMemberData] = React.useState(null)
  
  // Fetch member data when user is authenticated
  React.useEffect(() => {
    const fetchMemberData = async () => {
      if (isAuthenticated && user?.email) {
        try {
          const member = await getMemberByEmail(user.email)
          setMemberData(member)
        } catch (error) {
          // If no member record found, that's okay - use Auth0 data
          console.log('No member record found, using Auth0 data')
          setMemberData(null)
        }
      }
    }
    
    fetchMemberData()
  }, [isAuthenticated, user?.email])

  // Debug logging
  React.useEffect(() => {
    console.log('Auth0 State:', { isAuthenticated, isLoading, error, user: user?.name })
  }, [isAuthenticated, isLoading, error, user])

  if (error) {
    console.error('Auth0 Error:', error)
    
    // Clear Auth0 state on error and show login button
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<Login />}
          onClick={() => {
            console.log('Retrying login after error...')
            // Clear any existing Auth0 state
            localStorage.removeItem('auth0.is.authenticated')
            sessionStorage.clear()
            // Attempt login again
            loginWithRedirect()
          }}
          sx={{
            borderColor: 'orange',
            color: 'orange',
            '&:hover': {
              borderColor: 'orange',
              bgcolor: 'rgba(255, 165, 0, 0.1)'
            }
          }}
        >
          Retry Login
        </Button>
      </Box>
    )
  }

  if (isLoading) {
    return <Typography>Loading...</Typography>
  }

  if (!isAuthenticated) {
    return <LoginButton />
  }

  const handleMenu = (event) => {
    console.log('Profile menu clicked', event.currentTarget)
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    console.log('Profile menu closing')
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    console.log('Profile menu item clicked')
    handleClose()
    navigate('/profile')
  }

  const handleMenuItemClick = (path) => {
    console.log(`Navigating to: ${path}`)
    handleClose()
    navigate(path)
  }

  return (
    <Box>
      <Button
        onClick={handleMenu}
        sx={{ 
          color: 'white',
          textTransform: 'none',
          minWidth: 'auto',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <Avatar 
          src={memberData?.picture && memberData.picture !== 'imgScott' 
            ? `/resources/photos/${memberData.picture}.jpg`
            : memberData?.picture === 'imgScott'
            ? '/resources/photos/scott_byrd.jpg'
            : user?.picture
          }
          alt={memberData ? `${memberData.first} ${memberData.last}` : user?.name}
          sx={{ width: 32, height: 32, mr: 1 }}
        />
        <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
          <Typography variant="body2">
            {memberData 
              ? `${memberData.first} ${memberData.last}`.trim() || memberData.first || user?.given_name || user?.name
              : user?.given_name || user?.name
            }
          </Typography>
        </Box>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <AccountCircle fontSize="small" sx={{ mr: 1 }} />
          My Profile
        </MenuItem>
        
        {hasAccess(ACCESS_LEVELS.MEMBER) && (
          <MenuItem onClick={() => handleMenuItemClick('/member-dashboard')}>
            <Dashboard fontSize="small" sx={{ mr: 1 }} />
            Member Dashboard
          </MenuItem>
        )}
        
        {hasAccess(ACCESS_LEVELS.OFFICER) && (
          <MenuItem onClick={() => handleMenuItemClick('/officer-tools')}>
            <EventNote fontSize="small" sx={{ mr: 1 }} />
            Officer Tools
          </MenuItem>
        )}
        
        {hasAccess(ACCESS_LEVELS.ADMIN) && (
          <MenuItem onClick={() => handleMenuItemClick('/admin')}>
            <Settings fontSize="small" sx={{ mr: 1 }} />
            Admin Panel
          </MenuItem>
        )}
        
        <Divider />
        <LogoutButton onClose={handleClose} />
      </Menu>
    </Box>
  )
}

export default UserProfile