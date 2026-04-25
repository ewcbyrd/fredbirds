import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    saveMember,
    patchMember,
    getMember
} from '../../services/restdbService';
import { sendWelcomeEmail } from '../../utils/emailTemplates';
import AppDialog from '../common/AppDialog';

const MemberFormModal = ({ open, onClose, member, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Member',
        isActive: true,
        isOfficer: false,
        position: null,
        showInDirectory: true,
        showEmail: false,
        showPhone: false,
        sendWelcomeEmail: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (member) {
            // Editing existing member
            const memberRole = member.role
                ? member.role.charAt(0).toUpperCase() + member.role.slice(1)
                : 'Member';
            setFormData({
                firstName: member.firstName || member.first || '',
                lastName: member.lastName || member.last || '',
                email: member.email || '',
                phone: member.phone || '',
                role: memberRole,
                isActive: member.isActive !== false,
                isOfficer: member.isOfficer === true,
                position: member.position || null,
                showInDirectory: member.showInDirectory !== false,
                showEmail: member.showEmail === true,
                showPhone: member.showPhone === true
            });
        } else {
            // Creating new member
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                role: 'Member',
                isActive: true,
                isOfficer: false,
                position: null,
                showInDirectory: true,
                showEmail: false,
                showPhone: false,
                sendWelcomeEmail: true
            });
        }
        setError(null);
        setSuccess(false);
    }, [member, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        // Format phone number if it's the phone field
        if (name === 'phone' && type !== 'checkbox') {
            finalValue = formatPhoneInput(value);
        }

        const updates = {
            [name]: finalValue
        };

        // If unchecking isOfficer, clear the position
        if (name === 'isOfficer' && !checked) {
            updates.position = null;
        }

        setFormData((prev) => ({
            ...prev,
            ...updates
        }));
    };

    const formatPhoneInput = (value) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');

        // Format as ###-###-#### (up to 10 digits)
        if (cleaned.length === 0) return '';
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6)
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        // Use HTML5 email validation which is more standard
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.value = formData.email.trim();
        if (!emailInput.checkValidity()) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.isOfficer && !formData.position) {
            setError('Position is required when marking as an officer');
            return false;
        }
        if (formData.isOfficer && formData.role.toLowerCase() === 'member') {
            setError('Officer role cannot be "Member"');
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
            const memberData = {
                first: formData.firstName.trim(),
                last: formData.lastName.trim(),
                email: formData.email.trim().replace(/\s/g, '').toLowerCase(),
                phone: formData.phone.trim(),
                role: formData.role.toLowerCase(),
                isActive: formData.isActive,
                isOfficer: formData.isOfficer,
                position: formData.position || null,
                showInDirectory: formData.showInDirectory,
                showEmail: formData.showEmail,
                showPhone: formData.showPhone
            };

            if (member && member._id) {
                // Update existing member
                await patchMember(member._id, memberData);
                setSuccess(true);
            } else {
                // Create new member
                await saveMember(JSON.stringify(memberData));
                setSuccess(true);

                // Send welcome email if checkbox was checked (best-effort)
                if (formData.sendWelcomeEmail) {
                    try {
                        await sendWelcomeEmail(
                            formData.firstName.trim(),
                            formData.email.trim().toLowerCase()
                        );
                        console.log('Welcome email sent to new member');
                    } catch (emailErr) {
                        console.error(
                            'Failed to send welcome email:',
                            emailErr
                        );
                        // Don't fail the whole operation if email fails
                    }
                }
            }

            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Error saving member:', err);
            setError(err.message || 'Failed to save member');
        } finally {
            setLoading(false);
        }
    };

    const title = member ? 'Edit Member' : 'Add New Member';

    const actions = (
        <>
            <Button onClick={onClose} disabled={loading}>
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{ position: 'relative' }}
            >
                {loading && (
                    <CircularProgress size={24} sx={{ position: 'absolute' }} />
                )}
                {member ? 'Update Member' : 'Create Member'}
            </Button>
        </>
    );

    return (
        <AppDialog
            open={open}
            onClose={onClose}
            title={title}
            actions={actions}
            loading={loading}
            maxWidth="sm"
        >
            <Box sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Member {member ? 'updated' : 'created'} successfully!
                    </Alert>
                )}

                <Stack spacing={2}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading}
                        required
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading}
                        required
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading}
                        required
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        disabled={loading}
                    />

                    <FormControl fullWidth disabled={loading}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role"
                        >
                            <MenuItem value="Member">Member</MenuItem>
                            <MenuItem value="Officer">Officer</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isOfficer"
                                checked={formData.isOfficer}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        }
                        label="Is Officer"
                    />

                    <FormControl fullWidth disabled={loading}>
                        <InputLabel>Position</InputLabel>
                        <Select
                            name="position"
                            value={formData.position || ''}
                            onChange={handleChange}
                            label="Position"
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="President">President</MenuItem>
                            <MenuItem value="Treasurer">Treasurer</MenuItem>
                            <MenuItem value="Trip Coordinator">
                                Trip Coordinator
                            </MenuItem>
                            <MenuItem value="Web Master">Web Master</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        }
                        label="Active Member"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showInDirectory"
                                checked={formData.showInDirectory}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        }
                        label="Show in Member Directory"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showEmail"
                                checked={formData.showEmail}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        }
                        label="Show Email Address"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="showPhone"
                                checked={formData.showPhone}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        }
                        label="Show Phone Number"
                    />

                    {!member && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="sendWelcomeEmail"
                                    checked={formData.sendWelcomeEmail}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            }
                            label="Send Welcome Email"
                        />
                    )}
                </Stack>
            </Box>
        </AppDialog>
    );
};

export default MemberFormModal;
