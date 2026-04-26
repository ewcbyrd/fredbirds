import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    AccountCircle,
    Login,
    Logout,
    Settings,
    EventNote
} from '@mui/icons-material';
import { useUserRole, ACCESS_LEVELS } from '../../hooks/useUserRole';
import { useMember } from '../../hooks/useMember';
import LoginDialog from '../auth/LoginDialog';

const LoginButton = ({ onClick }) => {
    return (
        <Button
            variant="outlined"
            startIcon={<Login />}
            onClick={onClick}
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
    );
};

const LogoutButton = ({ onClose }) => {
    const { logout } = useAuth0();

    const handleLogout = () => {
        onClose && onClose();
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    return (
        <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" sx={{ mr: 1 }} />
            Logout
        </MenuItem>
    );
};

const UserProfile = () => {
    const { user, isAuthenticated, isLoading, error } = useAuth0();
    const { hasAccess, userRole } = useUserRole();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const { member: memberData } = useMember();

    const handleOpenLogin = () => setLoginDialogOpen(true);
    const handleCloseLogin = () => setLoginDialogOpen(false);

    if (error) {
        return (
            <Box>
                <Button
                    variant="outlined"
                    startIcon={<Login />}
                    onClick={handleOpenLogin}
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
                <LoginDialog
                    open={loginDialogOpen}
                    onClose={handleCloseLogin}
                />
            </Box>
        );
    }

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (!isAuthenticated) {
        return (
            <>
                <LoginButton onClick={handleOpenLogin} />
                <LoginDialog
                    open={loginDialogOpen}
                    onClose={handleCloseLogin}
                />
            </>
        );
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        handleClose();
        navigate('/profile');
    };

    const handleMenuItemClick = (path) => {
        handleClose();
        navigate(path);
    };

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
    );
};

export default UserProfile;
