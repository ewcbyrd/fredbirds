import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress
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

const AnnouncementForm = ({ announcement, onSuccess, onCancel }) => {
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
    const [sendingEmails, setSendingEmails] = useState(false);
    const [savedAnnouncement, setSavedAnnouncement] = useState(null);

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
        if (formData.expires && formData.expires < formData.date) {
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
                expires: formData.expires
                    ? toUTCMidnight(formData.expires)
                    : null
            };

            let createdAnnouncement;
            if (announcement && announcement._id) {
                // Update existing announcement
                await updateAnnouncement(announcement._id, announcementData);
                createdAnnouncement = {
                    ...announcementData,
                    _id: announcement._id
                };
            } else {
                // Create new announcement
                createdAnnouncement =
                    await createAnnouncement(announcementData);
            }

            // Save the announcement for email sending
            setSavedAnnouncement(createdAnnouncement);

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
        setSendingEmails(true);
        setError(null);

        try {
            const results = await sendAnnouncementEmails(
                savedAnnouncement,
                emailRecipients
            );

            setEmailConfirmOpen(false);
            setSuccess(true);

            // Show detailed results
            if (results.failed > 0) {
                setError(
                    `Announcement saved. Emails sent to ${results.success} members, but ${results.failed} failed.`
                );
            }

            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err) {
            console.error('Error sending emails:', err);
            setError(
                `Announcement saved, but failed to send emails: ${err.message}`
            );
            setEmailConfirmOpen(false);
        } finally {
            setSendingEmails(false);
        }
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
                            label="Expires (Optional)"
                            value={formData.expires}
                            onChange={(date) => handleChange('expires', date)}
                            minDate={formData.date}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    disabled: loading,
                                    helperText:
                                        'Announcement will be hidden after this date'
                                }
                            }}
                        />
                    </Stack>

                    {/* Email Recipients Selector - only show when creating new announcement */}
                    {!announcement && (
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
                loading={sendingEmails}
            />
        </LocalizationProvider>
    );
};

export default AnnouncementForm;
