import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    Alert,
    Link
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { getUserRole } from '../../services/restdbService';
import AppDialog from '../common/AppDialog';

/**
 * Custom login dialog that checks email against the member database
 * before handing off to Auth0 for authentication.
 *
 * States:
 * - 'entry': Email input form
 * - 'checking': Loading while API call runs
 * - 'pending': Member found but pending approval
 * - 'not-found': No member record for this email
 */
const LoginDialog = ({ open, onClose }) => {
    const { loginWithRedirect } = useAuth0();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [state, setState] = useState('entry');
    const [memberName, setMemberName] = useState('');
    const [error, setError] = useState(null);

    const handleReset = () => {
        setState('entry');
        setError(null);
    };

    const handleClose = () => {
        // Reset state when closing so it's fresh next time
        setEmail('');
        setState('entry');
        setMemberName('');
        setError(null);
        onClose();
    };

    const isValidEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmed = email.trim();
        if (!trimmed) {
            setError('Please enter your email address');
            return;
        }
        if (!isValidEmail(trimmed)) {
            setError('Please enter a valid email address');
            return;
        }

        setError(null);
        setState('checking');

        try {
            // Pass null for auth0Id since user isn't authenticated yet
            const data = await getUserRole(trimmed, null);

            if (data.error || data.role === 'public') {
                setState('not-found');
                return;
            }

            if (data.role === 'pending') {
                setMemberName(data.user?.name || '');
                setState('pending');
                return;
            }

            // Active member, officer, or admin — hand off to Auth0
            const firstName = data.user?.name
                ? data.user.name.split(' ')[0]
                : '';
            setMemberName(firstName);

            // Brief welcome, then redirect
            setState('redirecting');
            setTimeout(() => {
                loginWithRedirect({
                    authorizationParams: {
                        login_hint: trimmed,
                        screen_hint: 'login'
                    }
                });
            }, 1000);
        } catch (err) {
            console.error('Login check failed:', err);
            setError('Unable to verify your membership. Please try again.');
            setState('entry');
        }
    };

    const handleJoinClick = () => {
        handleClose();
        navigate('/join');
    };

    const getTitle = () => {
        switch (state) {
            case 'redirecting':
                return 'Welcome Back!';
            case 'pending':
                return 'Application Under Review';
            case 'not-found':
                return 'Membership Not Found';
            default:
                return 'Member Login';
        }
    };

    return (
        <AppDialog
            open={open}
            onClose={handleClose}
            title={getTitle()}
            maxWidth="xs"
        >
            {/* Email entry form */}
            {(state === 'entry' || state === 'checking') && (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Enter the email address associated with your membership.
                    </Typography>

                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={state === 'checking'}
                        fullWidth
                        autoFocus
                        autoComplete="email"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={state === 'checking'}
                        startIcon={
                            state === 'checking' ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <LoginIcon />
                            )
                        }
                        fullWidth
                    >
                        {state === 'checking' ? 'Checking...' : 'Continue'}
                    </Button>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center' }}
                    >
                        Not a member yet?{' '}
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={handleJoinClick}
                            sx={{ fontWeight: 600 }}
                        >
                            Join the club
                        </Link>
                    </Typography>
                </Box>
            )}

            {/* Redirecting to Auth0 */}
            {state === 'redirecting' && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        py: 2
                    }}
                >
                    <Typography variant="h6" color="primary.main">
                        {memberName
                            ? `Welcome back, ${memberName}!`
                            : 'Welcome back!'}
                    </Typography>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary">
                        Redirecting to secure login...
                    </Typography>
                </Box>
            )}

            {/* Pending member */}
            {state === 'pending' && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Alert severity="info">
                        Your membership application is still under review. We'll
                        email you at <strong>{email}</strong> when it's
                        approved.
                    </Alert>

                    <Typography variant="body2" color="text.secondary">
                        If you've been waiting more than a few days, please
                        contact us at{' '}
                        <Link href="mailto:admin@fredbirds.com">
                            admin@fredbirds.com
                        </Link>
                        .
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Button variant="text" onClick={handleReset}>
                            Try a different email
                        </Button>
                        <Button variant="contained" onClick={handleClose}>
                            OK
                        </Button>
                    </Box>
                </Box>
            )}

            {/* No member record found */}
            {state === 'not-found' && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Alert severity="warning">
                        No membership found for <strong>{email}</strong>.
                    </Alert>

                    <Typography variant="body2" color="text.secondary">
                        If you've already registered, make sure you're using the
                        same email address. Otherwise, you can join the club to
                        get started.
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Button variant="text" onClick={handleReset}>
                            Try a different email
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<HowToRegIcon />}
                            onClick={handleJoinClick}
                        >
                            Join the Club
                        </Button>
                    </Box>
                </Box>
            )}
        </AppDialog>
    );
};

export default LoginDialog;
