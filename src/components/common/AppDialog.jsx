import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Slide
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Transition for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const AppDialog = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'sm',
    fullWidth = true,
    loading = false,
    fullScreen = false,
    showCloseIcon = true,
    contentSx = {},
    ...props
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const isFullScreen = fullScreen || (props.mobileFullScreen && isMobile)

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            fullScreen={isFullScreen}
            TransitionComponent={Transition}
            aria-labelledby="app-dialog-title"
            PaperProps={{
                sx: {
                    borderRadius: isFullScreen ? 0 : 2,
                    ...props.paperSx
                }
            }}
            {...props}
        >
            {(title || showCloseIcon) && (
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} id="app-dialog-title">
                    {title && (
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                    )}
                    {showCloseIcon && (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            disabled={loading}
                            sx={{
                                color: (theme) => theme.palette.grey[500],
                                ml: 'auto' // Ensure it pushes to the right even if title is missing
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </DialogTitle>
            )}

            <DialogContent dividers sx={{ p: isMobile ? 2 : 3, ...contentSx }}>
                {children}
            </DialogContent>

            {actions && (
                <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    )
}

export default AppDialog
