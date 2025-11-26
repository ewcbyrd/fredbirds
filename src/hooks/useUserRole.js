import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getUserRole } from '../services/restdbService'

// Define access levels
export const ACCESS_LEVELS = {
  PUBLIC: 'public',
  MEMBER: 'member',
  OFFICER: 'officer', 
  ADMIN: 'admin'
}

// Role hierarchy (higher numbers have more access)
const ROLE_HIERARCHY = {
  [ACCESS_LEVELS.PUBLIC]: 0,
  [ACCESS_LEVELS.MEMBER]: 1,
  [ACCESS_LEVELS.OFFICER]: 2,
  [ACCESS_LEVELS.ADMIN]: 3
}

export const useUserRole = () => {
  console.log('useUserRole hook initialized')
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [userRole, setUserRole] = useState(ACCESS_LEVELS.PUBLIC)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    console.log('useUserRole effect triggered:', { user: user?.email, isAuthenticated, isLoading })
    const determineUserRole = async () => {
      setRoleLoading(true)
      
      if (!isAuthenticated || !user) {
        console.log('useUserRole - Setting PUBLIC (not authenticated)')
        setUserRole(ACCESS_LEVELS.PUBLIC)
        setRoleLoading(false)
        return
      }

      try {
        // Method 1: Check Auth0 app_metadata (requires API setup)
        if (user.app_metadata?.role) {
          setUserRole(user.app_metadata.role)
          setRoleLoading(false)
          return
        }

        // Method 2: Check Auth0 custom claims
        if (user['https://birdingclub.com/roles']) {
          const roles = user['https://birdingclub.com/roles']
          const highestRole = Array.isArray(roles) ? roles[0] : roles
          setUserRole(highestRole)
          setRoleLoading(false)
          return
        }

        // Temporary Method 2.5: Hardcoded admin check for your email
        if (user.email === 'scottbyrd681@gmail.com') {
          console.log('Setting admin role for scottbyrd681@gmail.com')
          setUserRole(ACCESS_LEVELS.ADMIN)
          setRoleLoading(false)
          return
        }

        // Method 3: Database lookup by email using existing API
        console.log('Making API call to check user role with:', { 
          email: user.email,
          auth0Id: user.sub 
        })
        
        try {
          const data = await getUserRole(user.email, user.sub)
          console.log('useUserRole - API Response data:', data)
          
          // Check if the response contains an error
          if (data.error) {
            console.log('useUserRole - API returned error:', data.error)
            console.log('useUserRole - Defaulting to PUBLIC due to member not found')
            setUserRole(ACCESS_LEVELS.PUBLIC)
          } else {
            const assignedRole = data.role || ACCESS_LEVELS.PUBLIC
            console.log('useUserRole - Assigned role:', assignedRole)
            setUserRole(assignedRole)
          }
        } catch (error) {
          console.error('useUserRole - API call failed:', error)
          console.log('useUserRole - Error status:', error.message)
          // For authenticated users without member records, default to PUBLIC
          // This prevents bypass of member record requirement
          console.log('useUserRole - Defaulting to PUBLIC due to API failure')
          setUserRole(ACCESS_LEVELS.PUBLIC)
        }
      } catch (error) {
        console.error('Error determining user role:', error)
        // Default to PUBLIC for authenticated users without member records
        setUserRole(ACCESS_LEVELS.PUBLIC)
      }

      setRoleLoading(false)
    }

    if (!isLoading) {
      determineUserRole()
    }
  }, [user, isAuthenticated, isLoading])

  const hasAccess = (requiredLevel) => {
    const hasAccessResult = ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredLevel]
    console.log('useUserRole - hasAccess check:', {
      userRole,
      requiredLevel,
      userRoleLevel: ROLE_HIERARCHY[userRole],
      requiredRoleLevel: ROLE_HIERARCHY[requiredLevel],
      hasAccess: hasAccessResult
    })
    return hasAccessResult
  }

  const isRole = (role) => {
    return userRole === role
  }

  return {
    userRole,
    roleLoading,
    hasAccess,
    isRole,
    isPublic: userRole === ACCESS_LEVELS.PUBLIC,
    isMember: hasAccess(ACCESS_LEVELS.MEMBER),
    isOfficer: hasAccess(ACCESS_LEVELS.OFFICER),
    isAdmin: hasAccess(ACCESS_LEVELS.ADMIN)
  }
}