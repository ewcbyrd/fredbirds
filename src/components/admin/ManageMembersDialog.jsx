import React, { useState, useEffect } from 'react';
import {
    Button,
    Avatar,
    Typography,
    Chip,
    Stack,
    Tabs,
    Tab,
    Badge,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import {
    Edit as EditIcon,
    CheckCircle,
    Cancel,
    HowToReg as ApproveIcon,
    PersonOff as RejectIcon
} from '@mui/icons-material';
import {
    getAllMembers,
    getPendingMembers,
    patchMember,
    deleteMember,
    sendEmail
} from '../../services/restdbService';
import MemberFormModal from '../forms/MemberFormModal';
import AppDialog from '../common/AppDialog';
import AdminResourceList from '../common/AdminResourceList';
import AdminItemCard from '../common/AdminItemCard';

const ManageMembersDialog = ({ open, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);

    // All Members tab state
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Pending tab state
    const [pendingMembers, setPendingMembers] = useState([]);
    const [filteredPending, setFilteredPending] = useState([]);
    const [pendingLoading, setPendingLoading] = useState(false);
    const [pendingError, setPendingError] = useState(null);
    const [pendingSearchTerm, setPendingSearchTerm] = useState('');
    const [pendingCount, setPendingCount] = useState(0);

    // Reject confirmation dialog state
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [memberToReject, setMemberToReject] = useState(null);

    useEffect(() => {
        if (open) {
            fetchMembers();
            fetchPendingMembers();
        }
    }, [open, refreshTrigger]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllMembers();

            if (Array.isArray(data)) {
                // Exclude pending and rejected members from the All Members tab
                const approvedMembers = data.filter(
                    (m) => m.status !== 'pending' && m.status !== 'rejected'
                );

                // Sort by last name, then first name
                const sortedMembers = approvedMembers.sort((a, b) => {
                    const getLastName = (member) => {
                        if (member.Name) {
                            const parts = member.Name.split(' ');
                            return parts.length > 1
                                ? parts[parts.length - 1]
                                : parts[0] || '';
                        }
                        return member.lastName || member.last || '';
                    };

                    const getFirstName = (member) => {
                        if (member.Name) {
                            const parts = member.Name.split(' ');
                            return parts.length > 1
                                ? parts.slice(0, -1).join(' ')
                                : '';
                        }
                        return member.firstName || member.first || '';
                    };

                    const lastNameA = getLastName(a).toLowerCase();
                    const lastNameB = getLastName(b).toLowerCase();

                    if (lastNameA !== lastNameB) {
                        return lastNameA.localeCompare(lastNameB);
                    }

                    const firstNameA = getFirstName(a).toLowerCase();
                    const firstNameB = getFirstName(b).toLowerCase();
                    return firstNameA.localeCompare(firstNameB);
                });

                setMembers(sortedMembers);
                setFilteredMembers(sortedMembers);
            }
        } catch (err) {
            console.error('Error fetching members:', err);
            setError('Unable to load members');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingMembers = async () => {
        try {
            setPendingLoading(true);
            setPendingError(null);
            const data = await getPendingMembers();

            if (Array.isArray(data)) {
                // Sort by registration date, newest first
                const sorted = data.sort((a, b) => {
                    const dateA = a.registeredAt
                        ? new Date(a.registeredAt)
                        : new Date(0);
                    const dateB = b.registeredAt
                        ? new Date(b.registeredAt)
                        : new Date(0);
                    return dateB - dateA;
                });
                setPendingMembers(sorted);
                setFilteredPending(sorted);
                setPendingCount(sorted.length);
            } else {
                setPendingMembers([]);
                setFilteredPending([]);
                setPendingCount(0);
            }
        } catch (err) {
            console.error('Error fetching pending members:', err);
            setPendingError('Unable to load pending registrations');
        } finally {
            setPendingLoading(false);
        }
    };

    useEffect(() => {
        if (!searchTerm) {
            setFilteredMembers(members);
            return;
        }

        const filtered = members.filter((member) => {
            const fullName = formatName(member).toLowerCase();
            const email = (member.email || '').toLowerCase();
            const search = searchTerm.toLowerCase();

            return fullName.includes(search) || email.includes(search);
        });

        setFilteredMembers(filtered);
    }, [searchTerm, members]);

    useEffect(() => {
        if (!pendingSearchTerm) {
            setFilteredPending(pendingMembers);
            return;
        }

        const filtered = pendingMembers.filter((member) => {
            const fullName = formatName(member).toLowerCase();
            const email = (member.email || '').toLowerCase();
            const search = pendingSearchTerm.toLowerCase();

            return fullName.includes(search) || email.includes(search);
        });

        setFilteredPending(filtered);
    }, [pendingSearchTerm, pendingMembers]);

    const formatName = (member) => {
        if (member.Name) {
            return member.Name;
        }

        const firstName = member.firstName || member.first || '';
        const lastName = member.lastName || member.last || '';
        const fullName = `${firstName} ${lastName}`.trim();

        if (fullName) {
            return fullName;
        }

        if (member.name) {
            return member.name;
        }

        return 'Name not provided';
    };

    const getInitials = (member) => {
        const name = formatName(member);
        const nameParts = name.split(' ');
        return (
            nameParts
                .map((part) => part.charAt(0))
                .join('')
                .toUpperCase() || 'M'
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const handleCreateClick = () => {
        setSelectedMember(null);
        setFormModalOpen(true);
    };

    const handleEditMember = (member) => {
        setSelectedMember(member);
        setFormModalOpen(true);
    };

    const handleFormModalClose = () => {
        setFormModalOpen(false);
        setSelectedMember(null);
    };

    const handleMemberSaved = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleToggleActive = async (member, e) => {
        e.stopPropagation();
        try {
            const isCurrentlyActive = member.isActive !== false;
            const newActiveStatus = !isCurrentlyActive;
            await patchMember(member._id, { isActive: newActiveStatus });

            // Update the member in the local state
            const updatedMembers = members.map((m) =>
                m._id === member._id ? { ...m, isActive: newActiveStatus } : m
            );
            setMembers(updatedMembers);
            // Also update filtered list to reflect changes immediately
            setFilteredMembers(
                filteredMembers.map((m) =>
                    m._id === member._id
                        ? { ...m, isActive: newActiveStatus }
                        : m
                )
            );
        } catch (err) {
            console.error('Error toggling member status:', err);
            setError('Failed to update member status');
        }
    };

    const handleApproveMember = async (member, e) => {
        e.stopPropagation();
        try {
            await patchMember(member._id, {
                status: 'approved',
                isActive: true
            });

            // Send approval email (best-effort — don't block UI if it fails)
            try {
                const firstName =
                    member.firstName ||
                    member.first ||
                    formatName(member).split(' ')[0];
                await sendEmail({
                    to: member.email,
                    subject:
                        "You're In! Welcome to the Fredericksburg Birding Club",
                    html: [
                        `<p>Hi <strong>${firstName}</strong>,</p>`,
                        '<p>Great news &mdash; your membership with the Fredericksburg Birding Club has been approved! ',
                        "You're now an official member.</p>",
                        '<h3 style="margin-bottom: 8px;">Set Up Your Login</h3>',
                        '<ol>',
                        '<li>Visit <a href="https://www.fredbirds.com">www.fredbirds.com</a></li>',
                        '<li>Click <strong>&ldquo;Member Login&rdquo;</strong> in the top right corner</li>',
                        `<li>Enter your email address (<strong>${member.email}</strong>) and click <strong>&ldquo;Continue&rdquo;</strong></li>`,
                        "<li>You'll be redirected to our secure login page &mdash; click <strong>&ldquo;Sign Up&rdquo;</strong> to create your account</li>",
                        "<li>Once logged in, you'll have full access to all member features</li>",
                        '</ol>',
                        `<p><strong>Important:</strong> You must sign up with <strong>${member.email}</strong> so we can match your login to your membership.</p>`,
                        '<p>As a member you can:</p>',
                        '<ul>',
                        '<li><strong>Member directory</strong> &mdash; find and connect with fellow club members</li>',
                        '<li><strong>Events &amp; field trips</strong> &mdash; browse upcoming outings and register to attend</li>',
                        '<li><strong>Bird sightings</strong> &mdash; log your sightings and see what others are spotting nearby</li>',
                        '</ul>',
                        "<p>You'll also be added to the club mailing list so you'll stay in the loop on all club news and activities.</p>",
                        '<p>If you have any questions, reach out to us at ',
                        '<a href="mailto:admin@fredbirds.com">admin@fredbirds.com</a>.</p>',
                        '<p>Welcome aboard &mdash; we look forward to birding with you!<br/>',
                        'Fredericksburg Birding Club<br/>',
                        '<a href="https://www.fredbirds.com">www.fredbirds.com</a></p>'
                    ].join(''),
                    text: [
                        `Hi ${firstName},`,
                        '',
                        'Great news - your membership with the Fredericksburg Birding Club has been approved! ',
                        "You're now an official member.",
                        '',
                        'SET UP YOUR LOGIN',
                        '',
                        '1. Visit www.fredbirds.com',
                        '2. Click "Member Login" in the top right corner',
                        `3. Enter your email address (${member.email}) and click "Continue"`,
                        '4. You\'ll be redirected to our secure login page - click "Sign Up" to create your account',
                        "5. Once logged in, you'll have full access to all member features",
                        '',
                        `Important: You must sign up with ${member.email} so we can match your login to your membership.`,
                        '',
                        'As a member you can:',
                        '',
                        '- Member directory - find and connect with fellow club members',
                        '- Events & field trips - browse upcoming outings and register to attend',
                        '- Bird sightings - log your sightings and see what others are spotting nearby',
                        '',
                        "You'll also be added to the club mailing list so you'll stay in the loop on all club news and activities.",
                        '',
                        'If you have any questions, reach out to us at admin@fredbirds.com.',
                        '',
                        'Welcome aboard - we look forward to birding with you!',
                        'Fredericksburg Birding Club',
                        'www.fredbirds.com'
                    ].join('\n')
                });
            } catch (emailErr) {
                console.error('Failed to send approval email:', emailErr);
            }

            // Remove from pending list immediately
            const updated = pendingMembers.filter((m) => m._id !== member._id);
            setPendingMembers(updated);
            setFilteredPending(
                filteredPending.filter((m) => m._id !== member._id)
            );
            setPendingCount(updated.length);

            // Refresh all members list to include the newly approved member
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error('Error approving member:', err);
            setPendingError('Failed to approve member');
        }
    };

    const handleRejectMember = (member, e) => {
        e.stopPropagation();
        setMemberToReject(member);
        setRejectDialogOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!memberToReject) return;
        try {
            await deleteMember(memberToReject._id);

            // Remove from pending list immediately
            const updated = pendingMembers.filter(
                (m) => m._id !== memberToReject._id
            );
            setPendingMembers(updated);
            setFilteredPending(
                filteredPending.filter((m) => m._id !== memberToReject._id)
            );
            setPendingCount(updated.length);
        } catch (err) {
            console.error('Error rejecting member:', err);
            setPendingError('Failed to reject registration');
        } finally {
            setRejectDialogOpen(false);
            setMemberToReject(null);
        }
    };

    const handleCancelReject = () => {
        setRejectDialogOpen(false);
        setMemberToReject(null);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderMember = (member) => {
        const actions = (
            <>
                <Button
                    size="small"
                    startIcon={
                        member.isActive !== false ? <Cancel /> : <CheckCircle />
                    }
                    color={member.isActive !== false ? 'error' : 'success'}
                    onClick={(e) => handleToggleActive(member, e)}
                >
                    {member.isActive !== false ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditMember(member)}
                >
                    Edit
                </Button>
            </>
        );

        return (
            <AdminItemCard
                key={member._id}
                title={formatName(member)}
                subtitle={member.email}
                icon={
                    <Avatar
                        sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}
                    >
                        {getInitials(member)}
                    </Avatar>
                }
                actions={actions}
            >
                {member.phone && (
                    <Typography variant="body2" color="text.secondary">
                        {member.phone}
                    </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {member.isOfficer && member.position && (
                        <Chip
                            label={member.position}
                            size="small"
                            variant="outlined"
                            color="primary"
                        />
                    )}
                    {member.isActive !== false ? (
                        <Chip label="Active" size="small" color="success" />
                    ) : (
                        <Chip label="Inactive" size="small" color="error" />
                    )}
                </Stack>
            </AdminItemCard>
        );
    };

    const renderPendingMember = (member) => {
        const actions = (
            <>
                <Button
                    size="small"
                    startIcon={<ApproveIcon />}
                    color="success"
                    onClick={(e) => handleApproveMember(member, e)}
                >
                    Approve
                </Button>
                <Button
                    size="small"
                    startIcon={<RejectIcon />}
                    color="error"
                    onClick={(e) => handleRejectMember(member, e)}
                >
                    Reject
                </Button>
            </>
        );

        return (
            <AdminItemCard
                key={member._id}
                title={formatName(member)}
                subtitle={member.email}
                icon={
                    <Avatar
                        sx={{
                            bgcolor: 'secondary.main',
                            width: 56,
                            height: 56
                        }}
                    >
                        {getInitials(member)}
                    </Avatar>
                }
                actions={actions}
            >
                {member.phone && (
                    <Typography variant="body2" color="text.secondary">
                        {member.phone}
                    </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label="Pending" size="small" color="warning" />
                    {member.registeredAt && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            Registered {formatDate(member.registeredAt)}
                        </Typography>
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
                title="Manage Members"
                maxWidth="md"
                PaperProps={{
                    sx: {
                        minHeight: '70vh',
                        maxHeight: '90vh'
                    }
                }}
            >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="member management tabs"
                    >
                        <Tab label="All Members" />
                        <Tab
                            label={
                                <Badge
                                    badgeContent={pendingCount}
                                    color="warning"
                                    sx={{
                                        pr: 2,
                                        '& .MuiBadge-badge': {
                                            right: 2,
                                            top: 2
                                        }
                                    }}
                                >
                                    Pending
                                </Badge>
                            }
                        />
                    </Tabs>
                </Box>

                {/* All Members Tab */}
                {activeTab === 0 && (
                    <AdminResourceList
                        items={filteredMembers}
                        renderItem={renderMember}
                        onAdd={handleCreateClick}
                        onSearch={setSearchTerm}
                        loading={loading}
                        error={error}
                        addButtonText="Add New Member"
                        searchPlaceholder="Search members..."
                        emptyMessage={
                            searchTerm
                                ? 'No members found matching your search.'
                                : 'No members found. Create your first member!'
                        }
                    />
                )}

                {/* Pending Tab */}
                {activeTab === 1 && (
                    <AdminResourceList
                        items={filteredPending}
                        renderItem={renderPendingMember}
                        onSearch={setPendingSearchTerm}
                        loading={pendingLoading}
                        error={pendingError}
                        searchPlaceholder="Search pending registrations..."
                        emptyMessage="No pending registrations to review."
                        showSearch={pendingMembers.length > 0}
                    />
                )}
            </AppDialog>

            <MemberFormModal
                open={formModalOpen}
                onClose={handleFormModalClose}
                member={selectedMember}
                onSuccess={handleMemberSaved}
            />

            {/* Reject Confirmation Dialog */}
            <Dialog
                open={rejectDialogOpen}
                onClose={handleCancelReject}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Reject Registration?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently delete{' '}
                        {memberToReject ? formatName(memberToReject) : ''}'s
                        registration. They will be able to re-apply in the
                        future.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelReject}>Cancel</Button>
                    <Button
                        onClick={handleConfirmReject}
                        color="error"
                        variant="contained"
                    >
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageMembersDialog;
