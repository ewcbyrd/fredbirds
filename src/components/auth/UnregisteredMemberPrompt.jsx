import React, { useEffect, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useLocation } from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box
} from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { useUserRole, ACCESS_LEVELS } from '../../hooks/useUserRole'
import JoinDialog from './JoinDialog'

const DISMISS_KEY = 'fredbirds_skip_register_prompt_v2'

/**
 * After Auth0 login, if the user has no club membership, automatically
 * prompt them to register and open the join experience from the CTA.
 */
const UnregisteredMemberPrompt = () => {
    const { isAuthenticated, isLoading: authLoading, user } = useAuth0()
    const { hasAccess, isPending, roleLoading } = useUserRole()
    const location = useLocation()
    const [promptOpen, setPromptOpen] = useState(false)
    const [joinOpen, setJoinOpen] = useState(false)
    const wasAuthenticated = useRef(false)

    // Drop session dismiss when the user logs out so the next login prompts again
    useEffect(() => {
        if (wasAuthenticated.current && !isAuthenticated && !authLoading) {
            sessionStorage.removeItem(DISMISS_KEY)
        }
        wasAuthenticated.current = isAuthenticated
    }, [isAuthenticated, authLoading])

    const ready = isAuthenticated && !authLoading && !roleLoading
    const needsRegistration =
        ready &&
        !isPending &&
        !hasAccess(ACCESS_LEVELS.MEMBER) &&
        location.pathname !== '/join'

    useEffect(() => {
        if (!needsRegistration) {
            if (!isAuthenticated) {
                setPromptOpen(false)
            }
            return
        }

        if (sessionStorage.getItem(DISMISS_KEY) === 'true') {
            return
        }

        setPromptOpen(true)
    }, [needsRegistration, isAuthenticated, user?.email])

    const handleDismiss = () => {
        sessionStorage.setItem(DISMISS_KEY, 'true')
        setPromptOpen(false)
    }

    const handleRegister = () => {
        setPromptOpen(false)
        setJoinOpen(true)
    }

    const handleJoinClose = () => {
        setJoinOpen(false)
        // Still unregistered — bring the prompt back unless they dismissed
        if (
            needsRegistration &&
            sessionStorage.getItem(DISMISS_KEY) !== 'true'
        ) {
            setPromptOpen(true)
        }
    }

    return (
        <>
            <Dialog
                open={promptOpen && !joinOpen}
                onClose={handleDismiss}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
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
                    <HowToRegIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Finish joining the club
                    </Typography>
                </Box>

                <DialogContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        You&apos;re logged in
                        {user?.email ? (
                            <>
                                {' '}
                                as <strong>{user.email}</strong>
                            </>
                        ) : null}
                        , but you&apos;re not on the club membership list yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Join for free so we can add you as a member. Your login
                        already gives full website access once you&apos;re a
                        member.
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        justifyContent: 'center',
                        gap: 1
                    }}
                >
                    <Button onClick={handleDismiss} color="inherit">
                        Maybe later
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<HowToRegIcon />}
                        onClick={handleRegister}
                    >
                        Finish joining
                    </Button>
                </DialogActions>
            </Dialog>

            <JoinDialog open={joinOpen} onClose={handleJoinClose} />
        </>
    )
}

export default UnregisteredMemberPrompt
