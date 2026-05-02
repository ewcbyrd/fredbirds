import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const JoinSuccessDialog = ({ open, onClose, email, firstName }) => {
    const { loginWithRedirect } = useAuth0();

    const handleCreateLogin = () => {
        onClose();
        // Redirect to Auth0 signup with the registration email pre-filled
        loginWithRedirect({
            authorizationParams: {
                login_hint: email,
                screen_hint: 'signup'
            }
        });
    };

    const handleMaybeLater = () => {
        // Store preference to not show again this session
        sessionStorage.setItem('skipLoginPrompt', 'true');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >
            <Box
                sx={{
                    p: 3,
                    textAlign: 'center',
                    background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    color: 'white'
                }}
            >
                <CheckCircleIcon sx={{ fontSize: 56, mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Welcome to the Club!
                </Typography>
                {firstName && (
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                        Great to have you, {firstName}!
                    </Typography>
                )}
            </Box>

            <DialogContent sx={{ p: 4 }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                    Registration submitted successfully! You've been added to
                    our mailing list at <strong>{email}</strong>
                </Alert>

                <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
                >
                    Want to unlock more features?
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Create a login to access member-only features and get the
                    most out of your membership:
                </Typography>

                <List sx={{ mb: 2 }}>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <EventIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Event Attendance Tracking"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <DashboardIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Personal Member Dashboard"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <GroupIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Member Directory Access"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <PhotoCameraIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Photo Upload & Gallery"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Profile Customization"
                            primaryTypographyProps={{ variant: 'body2' }}
                        />
                    </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', textAlign: 'center', mb: 2 }}
                >
                    You can always create a login later from the Get Started
                    menu
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={handleMaybeLater}
                    variant="text"
                    color="inherit"
                    sx={{ mr: 1 }}
                >
                    Maybe Later
                </Button>
                <Button
                    onClick={handleCreateLogin}
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Create Login Now
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JoinSuccessDialog;
