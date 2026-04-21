import React, { useState, useEffect } from 'react';
import { Button, Typography, Chip, Stack, Alert } from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import {
    getAnnouncements,
    deleteAnnouncement
} from '../../services/restdbService';
import { sendAnnouncementEmails } from '../../utils/announcementEmailUtils';
import AnnouncementFormModal from '../forms/AnnouncementFormModal';
import AppDialog from '../common/AppDialog';
import ConfirmDialog from '../common/ConfirmDialog';
import AdminResourceList from '../common/AdminResourceList';
import AdminItemCard from '../common/AdminItemCard';
import EmailRecipientSelector from '../forms/EmailRecipientSelector';
import EmailConfirmationDialog from '../common/EmailConfirmationDialog';
import { useUserRole } from '../../hooks/useUserRole';

const ManageAnnouncementsDialog = ({ open, onClose }) => {
    const { isOfficer } = useUserRole();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [selectedAnnouncementForEmail, setSelectedAnnouncementForEmail] =
        useState(null);
    const [emailRecipients, setEmailRecipients] = useState([]);
    const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);
    const [emailError, setEmailError] = useState(null);

    useEffect(() => {
        if (open) {
            fetchAnnouncements();
        }
    }, [open, refreshTrigger]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAnnouncements();

            if (Array.isArray(data)) {
                // Filter out expired announcements (kept as is based on previous logic)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // This logic filters out expired items for the list
                const nonExpiredAnnouncements = data.filter((announcement) => {
                    if (!announcement.expires) return true;
                    const expiresDate = new Date(announcement.expires);
                    expiresDate.setHours(0, 0, 0, 0);
                    return expiresDate >= today;
                });

                const sortedAnnouncements = nonExpiredAnnouncements.sort(
                    (a, b) => {
                        const dateA = new Date(a.date || 0);
                        const dateB = new Date(b.date || 0);
                        return dateB - dateA;
                    }
                );

                setAnnouncements(sortedAnnouncements);
            }
        } catch (err) {
            console.error('Error fetching announcements:', err);
            setError('Unable to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleCreateClick = () => {
        setSelectedAnnouncement(null);
        setFormModalOpen(true);
    };

    const handleEditAnnouncement = (announcement) => {
        setSelectedAnnouncement(announcement);
        setFormModalOpen(true);
    };

    const handleDeleteClick = (announcement) => {
        setDeleteConfirmation(announcement);
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation) return;

        try {
            setDeleteLoading(deleteConfirmation._id);
            await deleteAnnouncement(deleteConfirmation._id);
            setRefreshTrigger((prev) => prev + 1);
            setDeleteConfirmation(null);
        } catch (err) {
            console.error('Error deleting announcement:', err);
            setError('Failed to delete announcement');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedAnnouncement(null);
    };

    const handleAnnouncementSaved = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleEmailClick = (announcement) => {
        setSelectedAnnouncementForEmail(announcement);
        setEmailModalOpen(true);
        setEmailError(null);
    };

    const handleEmailModalClose = () => {
        setEmailModalOpen(false);
        setSelectedAnnouncementForEmail(null);
        setEmailRecipients([]);
        setEmailError(null);
    };

    const handleSendEmail = () => {
        if (emailRecipients.length === 0) {
            setEmailError('Please select at least one recipient');
            return;
        }
        setEmailConfirmOpen(true);
    };

    const handleEmailConfirm = async () => {
        setEmailConfirmOpen(false);
        setEmailModalOpen(false);

        // Fire and forget - send emails in background without blocking UI
        sendAnnouncementEmails(selectedAnnouncementForEmail, emailRecipients)
            .then((results) => {
                console.log(
                    `Emails sent successfully to ${results.success} members`
                );
                if (results.failed > 0) {
                    console.warn(`${results.failed} emails failed to send`);
                }
            })
            .catch((err) => {
                console.error('Error sending emails:', err);
            });

        // Reset state immediately
        setSelectedAnnouncementForEmail(null);
        setEmailRecipients([]);
    };

    const handleEmailCancel = () => {
        setEmailConfirmOpen(false);
    };

    // Render function for individual items
    const renderAnnouncement = (announcement) => {
        const actions = (
            <>
                {isOfficer && (
                    <Button
                        size="small"
                        startIcon={<EmailIcon />}
                        onClick={() => handleEmailClick(announcement)}
                        color="primary"
                    >
                        Email
                    </Button>
                )}
                <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditAnnouncement(announcement)}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDeleteClick(announcement)}
                    disabled={deleteLoading === announcement._id}
                >
                    Delete
                </Button>
            </>
        );

        return (
            <AdminItemCard
                key={announcement._id}
                title={announcement.headline}
                subtitle={`Created: ${formatDate(announcement.date)}`}
                actions={actions}
            >
                <Typography
                    variant="body2"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1
                    }}
                >
                    {announcement.details}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {announcement.expires && (
                        <Chip
                            label={`Expires: ${formatDate(announcement.expires)}`}
                            size="small"
                            variant="outlined"
                            color="warning"
                        />
                    )}
                </Stack>
            </AdminItemCard>
        );
    };

    return (
        <>
            <AppDialog
                open={open}
                onClose={onClose}
                title="Manage Announcements"
                maxWidth="md"
                PaperProps={{
                    sx: {
                        minHeight: '70vh',
                        maxHeight: '90vh'
                    }
                }}
            >
                <AdminResourceList
                    items={announcements}
                    renderItem={renderAnnouncement}
                    onAdd={handleCreateClick}
                    loading={loading}
                    error={error}
                    addButtonText="Add New Announcement"
                    emptyMessage="No active announcements found. Create your first announcement!"
                    showSearch={false} // Announcements don't have search implemented in this view yet
                />
            </AppDialog>

            <AnnouncementFormModal
                open={formModalOpen}
                onClose={handleFormModalClose}
                announcement={selectedAnnouncement}
                onSuccess={handleAnnouncementSaved}
            />

            <ConfirmDialog
                open={!!deleteConfirmation}
                onClose={() => setDeleteConfirmation(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Announcement"
                message={`Are you sure you want to delete the announcement "${deleteConfirmation?.headline}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmColor="error"
                loading={!!deleteLoading}
            />

            {/* Email Announcement Modal */}
            <AppDialog
                open={emailModalOpen}
                onClose={handleEmailModalClose}
                title="Email Announcement"
                maxWidth="sm"
            >
                <Stack spacing={2} sx={{ p: 2 }}>
                    <Typography variant="body1">
                        <strong>Announcement:</strong>{' '}
                        {selectedAnnouncementForEmail?.headline}
                    </Typography>

                    <EmailRecipientSelector
                        onSelectionChange={setEmailRecipients}
                    />

                    {emailError && (
                        <Alert
                            severity="error"
                            onClose={() => setEmailError(null)}
                        >
                            {emailError}
                        </Alert>
                    )}

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >
                        <Button onClick={handleEmailModalClose}>Cancel</Button>
                        <Button
                            onClick={handleSendEmail}
                            variant="contained"
                            disabled={emailRecipients.length === 0}
                        >
                            Send Email
                        </Button>
                    </Stack>
                </Stack>
            </AppDialog>

            {/* Email Confirmation Dialog */}
            <EmailConfirmationDialog
                open={emailConfirmOpen}
                recipientCount={emailRecipients.length}
                announcementHeadline={
                    selectedAnnouncementForEmail?.headline || ''
                }
                onConfirm={handleEmailConfirm}
                onCancel={handleEmailCancel}
                loading={false}
            />
        </>
    );
};

export default ManageAnnouncementsDialog;
