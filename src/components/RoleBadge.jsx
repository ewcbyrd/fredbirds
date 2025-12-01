import React from 'react'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { Chip, Box } from '@mui/material'
import { 
  Public, 
  Person, 
  Star, 
  AdminPanelSettings 
} from '@mui/icons-material'

const RoleBadge = ({ showIcon = true, variant = "outlined" }) => {
  const { userRole, roleLoading } = useUserRole()

  if (roleLoading) {
    return (
      <Chip 
        size="small" 
        variant={variant}
        label="Loading..." 
      />
    )
  }

  const roleConfig = {
    [ACCESS_LEVELS.PUBLIC]: {
      label: 'Visitor',
      color: 'default',
      icon: <Public />
    },
    [ACCESS_LEVELS.MEMBER]: {
      label: 'Member',
      color: 'primary',
      icon: <Person />
    },
    [ACCESS_LEVELS.OFFICER]: {
      label: 'Officer',
      color: 'secondary',
      icon: <Star />
    },
    [ACCESS_LEVELS.ADMIN]: {
      label: 'Admin',
      color: 'error',
      icon: <AdminPanelSettings />
    }
  }

  const config = roleConfig[userRole] || roleConfig[ACCESS_LEVELS.PUBLIC]

  return (
    <Chip
      size="small"
      variant={variant}
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      label={config.label}
    />
  )
}

export default RoleBadge