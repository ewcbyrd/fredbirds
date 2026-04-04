import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole } from '../../hooks/useUserRole';
import { getPictureUrl } from '../../services/cloudinaryService';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Avatar,
    Box,
    TextField,
    InputAdornment,
    Alert,
    CircularProgress,
    Chip
} from '@mui/material';
import { Email, Phone, Search, Group } from '@mui/icons-material';
import { getActiveMembers } from '../../services/restdbService';
import {
    getNameParts,
    formatName,
    getInitials,
    formatPhone,
    getMilestoneInfo,
    isOwnProfile
} from '../../utils/memberUtils';
import AppCard from '../common/AppCard';

const MembersDirectory = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth0();
    const { isAdmin, isOfficer } = useUserRole();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getActiveMembers();
                console.log('Members data received:', data);

                if (data && Array.isArray(data)) {
                    // Sort members alphabetically by last name, then first name
                    const sortedMembers = data.sort((a, b) => {
                        const nameA = getNameParts(a);
                        const nameB = getNameParts(b);

                        // First compare last names
                        const lastNameComparison = nameA.last.localeCompare(
                            nameB.last
                        );
                        if (lastNameComparison !== 0) {
                            return lastNameComparison;
                        }

                        // If last names are equal, compare first names
                        return nameA.first.localeCompare(nameB.first);
                    });

                    // Filter members based on showInDirectory setting
                    // Admins and Officers can see all members
                    // Regular members can only see members who have showInDirectory enabled (or themselves)
                    const visibleMembers = sortedMembers.filter((member) => {
                        // Admins and Officers see everyone
                        if (isAdmin || isOfficer) {
                            return true;
                        }

                        // Members can see themselves
                        if (user?.email && member.email === user.email) {
                            return true;
                        }

                        // Otherwise, respect the showInDirectory setting
                        // Default to true if not set (backwards compatible)
                        return member.showInDirectory !== false;
                    });

                    setMembers(visibleMembers);
                    setFilteredMembers(visibleMembers);
                } else {
                    setMembers([]);
                    setFilteredMembers([]);
                }
            } catch (err) {
                console.error('Error fetching members:', err);
                setError('Unable to load members directory');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [isAdmin, isOfficer, user]);

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

    const handleMemberClick = (member) => {
        // Navigate to member profile using email as identifier
        navigate(`/members/${encodeURIComponent(member.email)}`);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                >
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        Loading members directory...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Group sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    color="primary"
                >
                    Members Directory
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Connect with fellow birding enthusiasts in our club
                </Typography>
            </Box>

            {/* Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'grey.50'
                            }
                        }}
                    />
                </CardContent>
            </Card>

            {/* Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Chip
                    icon={<Group />}
                    label={`${filteredMembers.length} ${filteredMembers.length === 1 ? 'Member' : 'Members'}`}
                    color="primary"
                    variant="outlined"
                    size="medium"
                />
            </Box>

            {/* Members List */}
            {/* Members List */}
            {filteredMembers.length === 0 ? (
                <Card>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {searchTerm
                                ? 'No members found matching your search.'
                                : 'No members found.'}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {filteredMembers.map((member, index) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={member._id || member.email || index}
                        >
                            <AppCard
                                onClick={() => handleMemberClick(member)}
                                sx={{ height: '100%' }}
                                contentSx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    pt: 3
                                }}
                                customMedia={
                                    <Avatar
                                        src={getPictureUrl(member.picture)}
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 80,
                                            height: 80,
                                            fontSize: '2rem',
                                            fontWeight: 600,
                                            mb: 2,
                                            mt: 5,
                                            mx: 'auto'
                                        }}
                                    >
                                        {getInitials(member)}
                                    </Avatar>
                                }
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 1,
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {formatName(member)}
                                    </Typography>
                                    {(() => {
                                        const milestone =
                                            getMilestoneInfo(member);
                                        if (milestone) {
                                            const IconComponent =
                                                milestone.icon;
                                            return (
                                                <IconComponent
                                                    sx={{
                                                        color: milestone.color,
                                                        fontSize: 24
                                                    }}
                                                    titleAccess={
                                                        milestone.tooltip
                                                    }
                                                />
                                            );
                                        }
                                        return null;
                                    })()}
                                </Box>

                                <Box sx={{ mt: 'auto', width: '100%' }}>
                                    {(member.showEmail === true ||
                                        isOwnProfile(user, member)) && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                                mb: 1,
                                                color: 'text.secondary'
                                            }}
                                        >
                                            <Email
                                                fontSize="small"
                                                color="action"
                                            />
                                            <Typography
                                                variant="body2"
                                                noWrap
                                                sx={{ maxWidth: '100%' }}
                                            >
                                                {member.email ||
                                                    'Email not provided'}
                                            </Typography>
                                        </Box>
                                    )}
                                    {member.phone &&
                                        (member.showPhone === true ||
                                            isOwnProfile(user, member)) && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                <Phone
                                                    fontSize="small"
                                                    color="action"
                                                />
                                                <Typography variant="body2">
                                                    {formatPhone(member.phone)}
                                                </Typography>
                                            </Box>
                                        )}
                                </Box>
                            </AppCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Footer note */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Click on any member to view their profile and birding
                    activity
                </Typography>
            </Box>
        </Container>
    );
};

export default MembersDirectory;
