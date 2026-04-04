import React from 'react';
import AnnouncementForm from './AnnouncementForm';
import AppDialog from '../common/AppDialog';

const AnnouncementFormModal = ({ open, onClose, announcement, onSuccess }) => {
    const title = announcement ? 'Edit Announcement' : 'Add New Announcement';

    const handleSuccess = () => {
        if (onSuccess) onSuccess();
        onClose();
    };

    return (
        <AppDialog open={open} onClose={onClose} title={title} maxWidth="sm">
            <AnnouncementForm
                announcement={announcement}
                onSuccess={handleSuccess}
                onCancel={onClose}
            />
        </AppDialog>
    );
};

export default AnnouncementFormModal;
