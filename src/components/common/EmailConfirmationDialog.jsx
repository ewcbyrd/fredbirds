import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EmailIcon from '@mui/icons-material/Email';

/**
 * EmailConfirmationDialog component
 * Shows confirmation before sending announcement emails
 *
 * @param {boolean} open - Dialog open state
 * @param {number} recipientCount - Number of recipients
 * @param {string} announcementHeadline - Headline of announcement
 * @param {Function} onConfirm - Called when user confirms
 * @param {Function} onCancel - Called when user cancels
 * @param {boolean} loading - Show loading state
 */
const EmailConfirmationDialog = ({
    open,
    recipientCount,
    announcementHeadline,
    onConfirm,
    onCancel,
    loading = false
}) => {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="primary" />
                    Confirm Email
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    This will email the announcement to{' '}
                    <strong>{recipientCount}</strong> member
                    {recipientCount !== 1 ? 's' : ''}. Continue?
                </Typography>
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        borderLeft: 4,
                        borderColor: 'primary.main'
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                    >
                        Announcement:
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                        {announcementHeadline}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    disabled={loading}
                    startIcon={
                        loading ? <CircularProgress size={16} /> : <EmailIcon />
                    }
                >
                    {loading ? 'Sending...' : 'Send Email'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailConfirmationDialog;
