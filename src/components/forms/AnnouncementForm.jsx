import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress,
    Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    createAnnouncement,
    updateAnnouncement
} from '../../services/restdbService';
import { parseUTCDate } from '../../utils/dateUtils';
import { sendAnnouncementEmails } from '../../utils/announcementEmailUtils';
import EmailRecipientSelector from './EmailRecipientSelector';
import EmailConfirmationDialog from '../common/EmailConfirmationDialog';
import { useUserRole } from '../../hooks/useUserRole';

const AnnouncementForm = ({ announcement, onSuccess, onCancel }) => {
    const { isOfficer } = useUserRole();
    const [formData, setFormData] = useState({
        headline: '',
        details: '',
        date: new Date(),
        expires: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [emailRecipients, setEmailRecipients] = useState([]);
    const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);
    const [savedAnnouncement, setSavedAnnouncement] = useState(null);
    const [emailResultsSnackbar, setEmailResultsSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    useEffect(() => {
        if (announcement) {
            // Editing existing announcement
            setFormData({
                headline: announcement.headline || '',
                details: announcement.details || '',
                date: parseUTCDate(announcement.date) || new Date(),
                expires: parseUTCDate(announcement.expires)
            });
        } else {
            // Creating new announcement
            setFormData({
                headline: '',
                details: '',
                date: new Date(),
                expires: null
            });
        }
        setError(null);
        setSuccess(false);
    }, [announcement]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
    };

    const validateForm = () => {
        if (!formData.headline.trim()) {
            setError('Headline is required');
            return false;
        }
        if (!formData.details.trim()) {
            setError('Details are required');
            return false;
        }
        if (!formData.date) {
            setError('Date is required');
            return false;
        }
        if (!formData.expires) {
            setError('Expiration date is required');
            return false;
        }
        if (formData.expires < formData.date) {
            setError('Expiration date must be after creation date');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Helper function to convert date to UTC midnight
            const toUTCMidnight = (date) => {
                if (!date) return null;
                const utcDate = new Date(
                    Date.UTC(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        0,
                        0,
                        0,
                        0
                    )
                );
                return utcDate.toISOString();
            };

            const announcementData = {
                headline: formData.headline.trim(),
                details: formData.details.trim(),
                date: toUTCMidnight(formData.date),
                expires: toUTCMidnight(formData.expires)
            };

            if (announcement && announcement._id) {
                // Update existing announcement
                await updateAnnouncement(announcement._id, announcementData);
            } else {
                // Create new announcement
                await createAnnouncement(announcementData);
            }

            // Save the announcement data for email sending (use announcementData which has headline & details)
            setSavedAnnouncement(announcementData);

            // If emails should be sent, show confirmation dialog
            if (emailRecipients.length > 0) {
                setEmailConfirmOpen(true);
            } else {
                // No emails to send, just show success and close
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            }
        } catch (err) {
            console.error('Error saving announcement:', err);
            setError(err.message || 'Failed to save announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailConfirm = async () => {
        setEmailConfirmOpen(false);
        setSuccess(true);

        // Fire and forget - send emails in background without blocking UI
        sendAnnouncementEmails(savedAnnouncement, emailRecipients)
            .then((results) => {
                console.log(
                    `Emails sent successfully to ${results.success} members`
                );

                let message = '';
                let severity = 'success';

                if (results.invalidEmails && results.invalidEmails.length > 0) {
                    console.warn(
                        `${results.invalidEmails.length} invalid email addresses were filtered out`
                    );
                }

                if (results.retried > 0) {
                    console.log(
                        `${results.retried} emails succeeded after retrying`
                    );
                }

                if (results.failed > 0) {
                    console.warn(`${results.failed} emails failed to send`);
                    severity = 'warning';
                    message = `Emails sent to ${results.success} members. ${results.failed} failed to send.`;
                } else {
                    message = `Emails sent successfully to ${results.success} members!`;
                }

                if (results.retried > 0) {
                    message += ` (${results.retried} retried)`;
                }

                if (results.invalidEmails && results.invalidEmails.length > 0) {
                    message += ` (${results.invalidEmails.length} invalid addresses skipped)`;
                }

                setEmailResultsSnackbar({
                    open: true,
                    message,
                    severity
                });
            })
            .catch((err) => {
                console.error('Error sending emails:', err);
                setEmailResultsSnackbar({
                    open: true,
                    message: 'Failed to send emails. Please try again.',
                    severity: 'error'
                });
            });

        // Close form immediately
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    const handleEmailCancel = () => {
        setEmailConfirmOpen(false);
        setSuccess(true);
        setTimeout(() => {
            onSuccess();
        }, 2000);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Announcement {announcement ? 'updated' : 'created'}{' '}
                        successfully!
                    </Alert>
                )}

                <Stack spacing={2}>
                    <TextField
                        label="Headline"
                        name="headline"
                        value={formData.headline}
                        onChange={(e) =>
                            handleChange('headline', e.target.value)
                        }
                        fullWidth
                        disabled={loading}
                        required
                    />

                    <TextField
                        label="Details"
                        name="details"
                        value={formData.details}
                        onChange={(e) =>
                            handleChange('details', e.target.value)
                        }
                        fullWidth
                        multiline
                        rows={6}
                        disabled={loading}
                        required
                        helperText="URLs will be automatically converted to clickable links"
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <DatePicker
                            label="Date *"
                            value={formData.date}
                            onChange={(date) => handleChange('date', date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    disabled: loading
                                }
                            }}
                        />
                        <DatePicker
                            label="Expires"
                            value={formData.expires}
                            onChange={(date) => handleChange('expires', date)}
                            minDate={formData.date}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    disabled: loading,
                                    helperText:
                                        'Announcement will be hidden after this date'
                                }
                            }}
                        />
                    </Stack>

                    {/* Email Recipients Selector - only show to officers when creating new announcement */}
                    {!announcement && isOfficer && (
                        <EmailRecipientSelector
                            onSelectionChange={setEmailRecipients}
                            disabled={loading}
                        />
                    )}

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        sx={{ pt: 2 }}
                    >
                        <Button onClick={onCancel} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            sx={{ position: 'relative' }}
                        >
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{ position: 'absolute' }}
                                />
                            )}
                            {announcement
                                ? 'Update Announcement'
                                : 'Create Announcement'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            {/* Email Confirmation Dialog */}
            <EmailConfirmationDialog
                open={emailConfirmOpen}
                recipientCount={emailRecipients.length}
                announcementHeadline={formData.headline}
                onConfirm={handleEmailConfirm}
                onCancel={handleEmailCancel}
                loading={false}
            />

            {/* Email Results Snackbar */}
            <Snackbar
                open={emailResultsSnackbar.open}
                autoHideDuration={6000}
                onClose={() =>
                    setEmailResultsSnackbar({
                        ...emailResultsSnackbar,
                        open: false
                    })
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() =>
                        setEmailResultsSnackbar({
                            ...emailResultsSnackbar,
                            open: false
                        })
                    }
                    severity={emailResultsSnackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {emailResultsSnackbar.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default AnnouncementForm;
