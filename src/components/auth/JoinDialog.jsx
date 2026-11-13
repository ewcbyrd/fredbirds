import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Typography } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import AppDialog from '../common/AppDialog'
import JoinForm from '../members/JoinForm'
import { startLogin } from '../../utils/authUtils'

const DISMISS_KEY = 'fredbirds_skip_register_prompt_v2'

/**
 * Two-step join modal:
 * 1) Collect membership details (no login required)
 * 2) Optionally create a website login (skipped if already authenticated)
 */
const JoinDialog = ({ open, onClose }) => {
    const { isAuthenticated, loginWithRedirect } = useAuth0()
    const [step, setStep] = useState('form')
    const [joinedEmail, setJoinedEmail] = useState('')

    useEffect(() => {
        if (!open) {
            setStep('form')
            setJoinedEmail('')
        }
    }, [open])

    const finishAuthenticatedJoin = () => {
        sessionStorage.removeItem(DISMISS_KEY)
        onClose()
        window.location.assign('/')
    }

    const handleJoinSuccess = (submitted) => {
        sessionStorage.removeItem(DISMISS_KEY)

        if (isAuthenticated) {
            finishAuthenticatedJoin()
            return
        }

        setJoinedEmail(submitted?.email || '')
        setStep('login')
    }

    const handleCreateLogin = () => {
        startLogin(loginWithRedirect, {
            returnTo: '/',
            screenHint: 'signup',
            loginHint: joinedEmail || undefined
        })
    }

    const handleSkipLogin = () => {
        onClose()
    }

    const title =
        step === 'login' ? "You're a member!" : 'Join the Club'

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="sm"
            mobileFullScreen
            contentSx={{ p: { xs: 2, sm: 3 } }}
        >
            {step === 'form' ? (
                <>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        {isAuthenticated
                            ? 'Confirm your details to be added as a club member. Joining is free.'
                            : 'Fill out the form to be added as a club member. Joining is free — no login required.'}
                    </Typography>
                    <Box sx={{ mx: { xs: -1, sm: 0 } }}>
                        <JoinForm
                            embedded
                            onSuccess={handleJoinSuccess}
                        />
                    </Box>
                </>
            ) : (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                    <HowToRegIcon
                        color="primary"
                        sx={{ fontSize: 48, mb: 1.5 }}
                    />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        Welcome to the Fredericksburg Birding Club. You&apos;re
                        on the membership list
                        {joinedEmail ? (
                            <>
                                {' '}
                                as <strong>{joinedEmail}</strong>
                            </>
                        ) : null}
                        .
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Create a login with that same email for full website
                        access. You can do this now or later.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<LoginIcon />}
                        onClick={handleCreateLogin}
                        sx={{
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 50,
                            mb: 1.5
                        }}
                    >
                        Create your login
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        onClick={handleSkipLogin}
                        sx={{ textTransform: 'none' }}
                    >
                        Not now
                    </Button>
                </Box>
            )}
        </AppDialog>
    )
}

export default JoinDialog
