import React from 'react'
import {
    Button,
    DialogContentText,
    CircularProgress
} from '@mui/material'
import AppDialog from './AppDialog'

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'primary',
    loading = false,
    disabled = false
}) => {
    const actions = (
        <>
            <Button onClick={onClose} disabled={loading || disabled} color="inherit">
                {cancelText}
            </Button>
            <Button
                onClick={onConfirm}
                disabled={loading || disabled}
                color={confirmColor}
                variant="contained"
                autoFocus
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {confirmText}
            </Button>
        </>
    )

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title={title}
            actions={actions}
            maxWidth="xs"
            loading={loading}
        >
            <DialogContentText id="alert-dialog-description">
                {message}
            </DialogContentText>
        </AppDialog>
    )
}

export default ConfirmDialog
