import React, { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import {
    Button,
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material'
import {
    AccountCircle,
    Logout,
    EventNote,
    Login as LoginIcon,
    HowToReg
} from '@mui/icons-material'
import { useUserRole, ACCESS_LEVELS } from '../../hooks/useUserRole'
import { useMember } from '../../hooks/useMember'
import { startLogin } from '../../utils/authUtils'
import JoinDialog from '../auth/JoinDialog'

const DISMISS_KEY = 'fredbirds_skip_register_prompt_v2'

const headerButtonSx = (color = 'white') => ({
    borderColor: color,
    color: color,
    textTransform: 'none',
    '&:hover': {
        borderColor: color,
        bgcolor:
            color === 'orange'
                ? 'rgba(255, 165, 0, 0.1)'
                : 'rgba(255, 255, 255, 0.1)'
    }
})

const LogoutButton = ({ onClose }) => {
    const { logout } = useAuth0()

    const handleLogout = () => {
        onClose && onClose()
        sessionStorage.removeItem(DISMISS_KEY)
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
    const { user, isAuthenticated, isLoading, error, loginWithRedirect } =
        useAuth0()
    const { hasAccess, isPending } = useUserRole()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null)
    const [joinDialogOpen, setJoinDialogOpen] = useState(false)
    const { member: memberData } = useMember()

    const handleLogin = () => {
        startLogin(loginWithRedirect)
    }

    if (error) {
        return (
            <Box>
                <Button
                    variant="outlined"
                    startIcon={<LoginIcon />}
                    onClick={handleLogin}
                    sx={headerButtonSx('orange')}
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
        return (
            <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                sx={headerButtonSx('white')}
            >
                Log in
            </Button>
        )
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleProfileClick = () => {
        handleClose()
        navigate('/profile')
    }

    const handleMenuItemClick = (path) => {
        handleClose()
        navigate(path)
    }

    const handleCompleteRegistration = () => {
        handleClose()
        sessionStorage.removeItem(DISMISS_KEY)
        setJoinDialogOpen(true)
    }

    const needsRegistration =
        !isPending && !hasAccess(ACCESS_LEVELS.MEMBER)

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
                    src={user?.picture}
                    alt={
                        memberData
                            ? `${memberData.first} ${memberData.last}`
                            : user?.name
                    }
                    sx={{ width: 32, height: 32, mr: 1 }}
                />
                <Box
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        textAlign: 'left'
                    }}
                >
                    <Typography variant="body2">
                        {memberData
                            ? `${memberData.first} ${memberData.last}`.trim() ||
                              memberData.first ||
                              user?.given_name ||
                              user?.name
                            : user?.given_name || user?.name}
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
                {needsRegistration && (
                    <MenuItem onClick={handleCompleteRegistration}>
                        <HowToReg fontSize="small" sx={{ mr: 1 }} />
                        Complete registration
                    </MenuItem>
                )}

                <MenuItem onClick={handleProfileClick}>
                    <AccountCircle fontSize="small" sx={{ mr: 1 }} />
                    My Profile
                </MenuItem>

                {hasAccess(ACCESS_LEVELS.OFFICER) && (
                    <MenuItem
                        onClick={() => handleMenuItemClick('/officer-tools')}
                    >
                        <EventNote fontSize="small" sx={{ mr: 1 }} />
                        Officer Tools
                    </MenuItem>
                )}

                <Divider />
                <LogoutButton onClose={handleClose} />
            </Menu>

            <JoinDialog
                open={joinDialogOpen}
                onClose={() => setJoinDialogOpen(false)}
            />
        </Box>
    )
}

export default UserProfile
