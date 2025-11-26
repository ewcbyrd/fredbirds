import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getMemberByEmail } from '../services/restdbService'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material'
import { PersonAdd, Lock } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const MemberAccessControl = ({ 
  children, 
  requiredLevel = ACCESS_LEVELS.MEMBER,
  fallback = null,
  showMessage = true,
  customMessage = null 
}) => {
  console.log('MemberAccessControl component loaded with requiredLevel:', requiredLevel)
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0()
  const { hasAccess, roleLoading } = useUserRole()
  const navigate = useNavigate()
  const [memberRecord, setMemberRecord] = useState(null)
  const [memberLoading, setMemberLoading] = useState(true)
  const [memberError, setMemberError] = useState(null)

  // Check for member record when component mounts
  useEffect(() => {
    const checkMemberRecord = async () => {
      if (!user?.email || !isAuthenticated) {
        setMemberLoading(false)
        return
      }

      try {
        setMemberLoading(true)
        const data = await getMemberByEmail(user.email)
        setMemberRecord(data)
        setMemberError(null)
      } catch (error) {
        console.error('Error checking member record:', error)
        setMemberError(error.message)
      } finally {
        setMemberLoading(false)
      }
    }

    if (!authLoading && !roleLoading) {
      checkMemberRecord()
    }
  }, [user?.email, isAuthenticated, authLoading, roleLoading])

  // Show loading while checking everything
  if (authLoading || roleLoading || memberLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Verifying member access...
        </Typography>
      </Box>
    )
  }

  // For PUBLIC level access, just use normal AccessControl logic
  if (requiredLevel === ACCESS_LEVELS.PUBLIC) {
    if (hasAccess(requiredLevel)) {
      return <>{children}</>
    }
  }

  // For MEMBER+ level access, require both role AND member record
  if (requiredLevel === ACCESS_LEVELS.MEMBER || 
      requiredLevel === ACCESS_LEVELS.OFFICER || 
      requiredLevel === ACCESS_LEVELS.ADMIN) {
    
    console.log('MemberAccessControl Debug:', {
      requiredLevel,
      isAuthenticated,
      hasAccess: hasAccess(requiredLevel),
      memberRecord: !!memberRecord,
      memberError
    })
    
    // For authenticated users, check member record first
    if (isAuthenticated && (!memberRecord || memberError)) {
      console.log('Access denied due to missing member record')
      if (fallback) return fallback
      if (!showMessage) return null
      
      return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4} textAlign="center">
          <PersonAdd color="primary" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom color="primary">
            Complete Member Registration
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
            You're logged in, but need to complete your member profile to access club features. 
            This will only take a minute!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/member-onboarding')}
          >
            Complete Registration
          </Button>
        </Box>
      )
    }
    
    // Then check role access for non-authenticated users
    if (!hasAccess(requiredLevel)) {
      console.log('Access denied due to insufficient role')
      if (fallback) return fallback
      if (!showMessage) return null
      
      const defaultMessage = !isAuthenticated
        ? "Please log in to access this content."
        : `This content requires ${requiredLevel} access.`
        
      return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
          <Lock color="action" sx={{ fontSize: 48, mb: 2 }} />
          <Alert severity="warning">
            {customMessage || defaultMessage}
          </Alert>
        </Box>
      )
    }
  }

  console.log('MemberAccessControl: Access granted')
  // All checks passed - render content
  return <>{children}</>
}

export default MemberAccessControl