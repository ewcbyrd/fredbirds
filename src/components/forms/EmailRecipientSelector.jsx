import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { getActiveMembers } from '../../services/restdbService';
import { formatName } from '../../utils/memberUtils';

/**
 * EmailRecipientSelector component
 * Allows selection of active members to email
 *
 * @param {Function} onSelectionChange - Callback with selected email addresses
 * @param {boolean} disabled - Disable all inputs
 */
const EmailRecipientSelector = ({ onSelectionChange, disabled = false }) => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [emailAllMembers, setEmailAllMembers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch active members on mount
    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getActiveMembers();
                setMembers(data);
                setFilteredMembers(data);
            } catch (err) {
                console.error('Error fetching active members:', err);
                setError(err.message || 'Failed to load members');
            } finally {
                setLoading(false);
            }
        };

        if (emailEnabled) {
            fetchMembers();
        }
    }, [emailEnabled]);

    // Filter members based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredMembers(members);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = members.filter((member) => {
            const name = formatName(member).toLowerCase();
            const email = (member.email || '').toLowerCase();
            return name.includes(term) || email.includes(term);
        });
        setFilteredMembers(filtered);
    }, [searchTerm, members]);

    // Notify parent of selection changes
    useEffect(() => {
        if (!emailEnabled) {
            onSelectionChange([]);
            return;
        }

        if (emailAllMembers) {
            const allEmails = members.map((m) => m.email).filter(Boolean);
            onSelectionChange(allEmails);
        } else {
            onSelectionChange(selectedEmails);
        }
    }, [
        emailEnabled,
        emailAllMembers,
        selectedEmails,
        members,
        onSelectionChange
    ]);

    const handleEmailEnabledChange = (event) => {
        const enabled = event.target.checked;
        setEmailEnabled(enabled);
        if (!enabled) {
            setEmailAllMembers(false);
            setSelectedEmails([]);
            setSearchTerm('');
        }
    };

    const handleEmailAllChange = (event) => {
        const checked = event.target.checked;
        setEmailAllMembers(checked);
        if (checked) {
            setSelectedEmails([]);
        }
    };

    const handleMemberToggle = (email) => {
        setSelectedEmails((prev) => {
            if (prev.includes(email)) {
                return prev.filter((e) => e !== email);
            } else {
                return [...prev, email];
            }
        });
    };

    const handleSelectAll = () => {
        const allEmails = filteredMembers.map((m) => m.email).filter(Boolean);
        setSelectedEmails(allEmails);
    };

    const handleDeselectAll = () => {
        setSelectedEmails([]);
    };

    const selectedCount = emailAllMembers
        ? members.length
        : selectedEmails.length;

    return (
        <Box sx={{ mt: 3, mb: 2 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={emailEnabled}
                        onChange={handleEmailEnabledChange}
                        disabled={disabled}
                    />
                }
                label="Email this announcement to members"
            />

            {emailEnabled && (
                <Box sx={{ ml: 4, mt: 2 }}>
                    {loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                my: 2
                            }}
                        >
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                                Loading members...
                            </Typography>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && members.length === 0 && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            No active members found
                        </Alert>
                    )}

                    {!loading && !error && members.length > 0 && (
                        <>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={emailAllMembers}
                                        onChange={handleEmailAllChange}
                                        disabled={disabled}
                                    />
                                }
                                label={`Email all active members (${members.length})`}
                            />

                            {!emailAllMembers && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Or select specific members:
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        disabled={disabled}
                                        sx={{ mb: 2 }}
                                    />

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            fontWeight="600"
                                        >
                                            {selectedEmails.length} member
                                            {selectedEmails.length !== 1
                                                ? 's'
                                                : ''}{' '}
                                            selected
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                onClick={handleSelectAll}
                                                disabled={
                                                    disabled ||
                                                    filteredMembers.length === 0
                                                }
                                            >
                                                Select All
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={handleDeselectAll}
                                                disabled={
                                                    disabled ||
                                                    selectedEmails.length === 0
                                                }
                                            >
                                                Deselect All
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            maxHeight: 300,
                                            overflowY: 'auto',
                                            p: 1
                                        }}
                                    >
                                        {filteredMembers.length === 0 ? (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center'
                                                }}
                                            >
                                                No members match your search
                                            </Typography>
                                        ) : (
                                            filteredMembers.map((member) => (
                                                <FormControlLabel
                                                    key={member._id}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedEmails.includes(
                                                                member.email
                                                            )}
                                                            onChange={() =>
                                                                handleMemberToggle(
                                                                    member.email
                                                                )
                                                            }
                                                            disabled={disabled}
                                                            size="small"
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography variant="body2">
                                                                {formatName(
                                                                    member
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {member.email}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    sx={{
                                                        display: 'flex',
                                                        width: '100%',
                                                        m: 0,
                                                        py: 0.5,
                                                        borderBottom:
                                                            '1px solid',
                                                        borderColor: 'divider',
                                                        '&:last-child': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}
                                                />
                                            ))
                                        )}
                                    </Box>
                                </Box>
                            )}

                            {selectedCount > 0 && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    This announcement will be emailed to{' '}
                                    {selectedCount} member
                                    {selectedCount !== 1 ? 's' : ''}
                                </Alert>
                            )}
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default EmailRecipientSelector;
