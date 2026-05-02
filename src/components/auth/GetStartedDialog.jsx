import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    IconButton,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginDialog from './LoginDialog';
import JoinForm from '../members/JoinForm';
import JoinSuccessDialog from './JoinSuccessDialog';

const GetStartedDialog = ({ open, onClose }) => {
    const [view, setView] = useState('choice'); // 'choice', 'join', 'login'
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);

    const handleClose = () => {
        // Reset to initial view when closing
        setView('choice');
        setShowSuccessDialog(false);
        setRegistrationData(null);
        onClose();
    };

    const handleJoinSuccess = (data) => {
        setRegistrationData(data);
        setShowSuccessDialog(true);
        handleClose();
    };

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        setRegistrationData(null);
    };

    const handleBackToChoice = () => {
        setView('choice');
    };

    // Two-column choice view
    if (view === 'choice') {
        return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            overflow: 'visible'
                        }
                    }}
                >
                    <Box
                        sx={{
                            p: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            color: 'white'
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Get Started
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                            sx={{ color: 'white' }}
                            aria-label="Close dialog"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <DialogContent sx={{ p: 4 }}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4, textAlign: 'center' }}
                        >
                            Choose how you'd like to get started with the
                            Fredericksburg Birding Club
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Join the Club Card */}
                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: '#e8f5e9',
                                        border: '2px solid',
                                        borderColor: 'primary.main',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow:
                                                '0 8px 24px rgba(45, 80, 22, 0.2)'
                                        }
                                    }}
                                    onClick={() => setView('join')}
                                >
                                    <Box
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            p: 3,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <PersonAddIcon
                                            sx={{ fontSize: 48, mb: 1 }}
                                        />
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 700 }}
                                        >
                                            Join the Club
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ mt: 1, opacity: 0.9 }}
                                        >
                                            Free membership • Stay informed
                                        </Typography>
                                    </Box>
                                    <CardContent
                                        sx={{
                                            p: 3,
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                mb: 2,
                                                fontWeight: 600,
                                                color: 'primary.dark'
                                            }}
                                        >
                                            What you'll get:
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1.5,
                                                mb: 3
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <CheckCircleIcon
                                                    sx={{
                                                        color: 'primary.main',
                                                        mr: 1.5,
                                                        fontSize: 20
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Event & field trip
                                                    notifications
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <CheckCircleIcon
                                                    sx={{
                                                        color: 'primary.main',
                                                        mr: 1.5,
                                                        fontSize: 20
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Club news & announcements
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ mt: 'auto' }}>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                No account needed
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Member Login Card */}
                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '2px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow:
                                                '0 8px 24px rgba(0, 0, 0, 0.1)',
                                            borderColor: 'primary.light'
                                        }
                                    }}
                                    onClick={() => setView('login')}
                                >
                                    <Box
                                        sx={{
                                            bgcolor: 'background.default',
                                            p: 3,
                                            textAlign: 'center',
                                            borderBottom: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <LoginIcon
                                            sx={{
                                                fontSize: 48,
                                                mb: 1,
                                                color: 'primary.main'
                                            }}
                                        />
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary'
                                            }}
                                        >
                                            Member Login
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            Access your member features
                                        </Typography>
                                    </Box>
                                    <CardContent
                                        sx={{
                                            p: 3,
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                mb: 2,
                                                fontWeight: 600,
                                                color: 'text.primary'
                                            }}
                                        >
                                            Member features:
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1.5,
                                                mb: 3
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        mr: 1.5
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Event attendance tracking
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        mr: 1.5
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Member dashboard
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        mr: 1.5
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Photo upload & gallery
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: 'primary.main',
                                                        mr: 1.5
                                                    }}
                                                />
                                                <Typography variant="body2">
                                                    Profile & directory
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ mt: 'auto' }}>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                Requires account
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>

                {/* Join Success Dialog (separate) */}
                <JoinSuccessDialog
                    open={showSuccessDialog}
                    onClose={handleSuccessDialogClose}
                    email={registrationData?.email}
                    firstName={registrationData?.first}
                />
            </>
        );
    }

    // Join Form View
    if (view === 'join') {
        return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
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
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            color: 'white'
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Join the Club
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                            sx={{ color: 'white' }}
                            aria-label="Close dialog"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <DialogContent sx={{ p: 0 }}>
                        <JoinForm
                            embedded
                            onSuccess={handleJoinSuccess}
                            onBack={handleBackToChoice}
                        />
                    </DialogContent>
                </Dialog>

                {/* Join Success Dialog (separate) */}
                <JoinSuccessDialog
                    open={showSuccessDialog}
                    onClose={handleSuccessDialogClose}
                    email={registrationData?.email}
                    firstName={registrationData?.first}
                />
            </>
        );
    }

    // Login View
    if (view === 'login') {
        return (
            <LoginDialog
                open={open}
                onClose={handleClose}
                standalone={false}
                onNavigateToJoin={() => setView('join')}
            />
        );
    }

    return null;
};

export default GetStartedDialog;
