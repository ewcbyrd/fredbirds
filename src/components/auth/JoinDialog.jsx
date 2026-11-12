import React from 'react'
import { Box, Typography } from '@mui/material'
import AppDialog from '../common/AppDialog'
import JoinForm from '../members/JoinForm'

const DISMISS_KEY = 'fredbirds_skip_register_prompt_v2'

/**
 * Modal membership registration for logged-in users.
 */
const JoinDialog = ({ open, onClose }) => {
    const handleJoinSuccess = () => {
        sessionStorage.removeItem(DISMISS_KEY)
        onClose()
        // Reload so role/member hooks pick up the new membership
        window.location.assign('/')
    }

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title="Join the Club"
            maxWidth="sm"
            mobileFullScreen
            contentSx={{ p: { xs: 2, sm: 3 } }}
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Membership is free. Confirm your details to finish joining with
                the account you&apos;re already logged in with.
            </Typography>
            <Box sx={{ mx: { xs: -1, sm: 0 } }}>
                <JoinForm embedded onSuccess={handleJoinSuccess} />
            </Box>
        </AppDialog>
    )
}

export default JoinDialog
