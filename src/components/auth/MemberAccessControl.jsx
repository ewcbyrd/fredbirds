import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole, ACCESS_LEVELS } from '../../hooks/useUserRole';
import { useMember } from '../../hooks/useMember';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import { HowToReg, Lock, PendingActions } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MemberAccessControl = ({
    children,
    requiredLevel = ACCESS_LEVELS.MEMBER,
    fallback = null,
    showMessage = true,
    customMessage = null
}) => {
    console.log(
        'MemberAccessControl component loaded with requiredLevel:',
        requiredLevel
    );
    const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
    const { hasAccess, isPending, roleLoading } = useUserRole();
    const navigate = useNavigate();
    const {
        member: memberRecord,
        loading: memberLoading,
        error: memberError
    } = useMember({
        enabled: !authLoading && !roleLoading
    });

    // Show loading while checking everything
    if (authLoading || roleLoading || memberLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={3}
            >
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                    Verifying member access...
                </Typography>
            </Box>
        );
    }

    // For PUBLIC level access, just use normal AccessControl logic
    if (requiredLevel === ACCESS_LEVELS.PUBLIC) {
        if (hasAccess(requiredLevel)) {
            return <>{children}</>;
        }
    }

    // For MEMBER+ level access, require both role AND member record
    if (
        requiredLevel === ACCESS_LEVELS.MEMBER ||
        requiredLevel === ACCESS_LEVELS.OFFICER ||
        requiredLevel === ACCESS_LEVELS.ADMIN
    ) {
        console.log('MemberAccessControl Debug:', {
            requiredLevel,
            isAuthenticated,
            isPending,
            hasAccess: hasAccess(requiredLevel),
            memberRecord: !!memberRecord,
            memberError
        });

        // Authenticated but pending approval — application is under review
        if (isAuthenticated && isPending) {
            if (fallback) return fallback;
            if (!showMessage) return null;

            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={4}
                    textAlign="center"
                >
                    <PendingActions
                        color="warning"
                        sx={{ fontSize: 64, mb: 2 }}
                    />
                    <Typography
                        variant="h5"
                        sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
                    >
                        Application Under Review
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, maxWidth: 500 }}
                    >
                        Your membership request has been received and is being
                        reviewed by a club officer. You'll receive an email once
                        your membership has been approved.
                    </Typography>
                    <Alert severity="info" sx={{ maxWidth: 500 }}>
                        If you have questions, contact us at{' '}
                        <a href="mailto:admin@fredbirds.com">
                            admin@fredbirds.com
                        </a>
                    </Alert>
                </Box>
            );
        }

        // Authenticated but no member record — need to register first
        if (isAuthenticated && (!memberRecord || memberError)) {
            console.log('Access denied due to missing member record');
            if (fallback) return fallback;
            if (!showMessage) return null;

            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={4}
                    textAlign="center"
                >
                    <HowToReg color="primary" sx={{ fontSize: 64, mb: 2 }} />
                    <Typography
                        variant="h5"
                        sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
                    >
                        Join the Club
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, maxWidth: 500 }}
                    >
                        You're logged in, but you need to register as a member
                        to access club features.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<HowToReg />}
                        onClick={() => navigate('/join')}
                    >
                        Register to Join
                    </Button>
                </Box>
            );
        }

        // Then check role access for non-authenticated users
        if (!hasAccess(requiredLevel)) {
            console.log('Access denied due to insufficient role');
            if (fallback) return fallback;
            if (!showMessage) return null;

            const defaultMessage = !isAuthenticated
                ? 'Please log in to access this content.'
                : `This content requires ${requiredLevel} access.`;

            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={4}
                >
                    <Lock color="action" sx={{ fontSize: 48, mb: 2 }} />
                    <Alert severity="warning">
                        {customMessage || defaultMessage}
                    </Alert>
                </Box>
            );
        }
    }

    console.log('MemberAccessControl: Access granted');
    // All checks passed - render content
    return <>{children}</>;
};

export default MemberAccessControl;
