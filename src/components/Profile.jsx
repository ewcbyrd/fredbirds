import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole } from '../hooks/useUserRole'
import { getMemberByEmail, patchMember, getMemberEvents } from '../services/restdbService'
import { getPictureUrl } from '../services/cloudinaryService'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  Paper,
  TextField,
  Button,
  IconButton,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  Person,
  Email,
  CalendarToday,
  Verified,
  LocationOn,
  Home,
  Nature,
  Public,
  Flag,
  Badge,
  AccountCircle,
  Link as LinkIcon,
  Phone,
  Facebook,
  LinkedIn,
  Launch,
  Edit,
  Save,
  Cancel,
  Event as EventIcon
} from '@mui/icons-material'
import RoleBadge from './RoleBadge'

const Profile = () => {
  const { user } = useAuth0()
  const { userRole } = useUserRole()
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingCounts, setEditingCounts] = useState(false)
  const [editUsCount, setEditUsCount] = useState('')
  const [editWorldCount, setEditWorldCount] = useState('')
  const [editingSocialLinks, setEditingSocialLinks] = useState(false)
  const [editEbirdUrl, setEditEbirdUrl] = useState('')
  const [editFacebookUrl, setEditFacebookUrl] = useState('')
  const [editLinkedInUrl, setEditLinkedInUrl] = useState('')
  const [editingPhone, setEditingPhone] = useState(false)
  const [editPhone, setEditPhone] = useState('')
  const [memberEvents, setMemberEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [eventsPage, setEventsPage] = useState(1)
  const eventsPerPage = 5

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('Fetching member data for:', user.email)
        
        let data = await getMemberByEmail(user.email)
        console.log('Member data received:', data)
        
        console.log('US Count:', data?.usCount)
        console.log('World Count:', data?.worldCount)
        console.log('Picture URL:', data?.picture)
        setMemberData(data)
        setShowEmail(data?.showEmail ?? false)
        setShowPhone(data?.showPhone ?? false)
      } catch (err) {
        console.error('Error fetching member data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMemberData()
  }, [user?.email])

  // Fetch member events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!memberData?._id) return

      try {
        setLoadingEvents(true)
        const events = await getMemberEvents(memberData._id)
        // Sort events by start date in descending order (most recent first)
        const sortedEvents = (events || []).sort((a, b) => {
          return new Date(b.eventStart) - new Date(a.eventStart)
        })
        setMemberEvents(sortedEvents)
      } catch (err) {
        console.error('Error fetching member events:', err)
        setMemberEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [memberData?._id])

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4">Profile not found</Typography>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading profile...
          </Typography>
        </Box>
      </Container>
    )
  }

  const handleToggle = async (field, value) => {
    if (!memberData?._id) return;
    setSaving(true);
    try {
      await patchMember(memberData._id, { [field]: value });
      setMemberData({ ...memberData, [field]: value });
      if (field === 'showEmail') setShowEmail(value);
      if (field === 'showPhone') setShowPhone(value);
    } catch (err) {
      console.error('Error updating settings:', err);
      alert('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCounts = () => {
    setEditUsCount(memberData?.usCount?.toString() || '0');
    setEditWorldCount(memberData?.worldCount?.toString() || '0');
    setEditingCounts(true);
  };

  const handleSaveCounts = async () => {
    if (!memberData?._id) return;
    setSaving(true);
    try {
      const updates = {
        usCount: parseInt(editUsCount) || 0,
        worldCount: parseInt(editWorldCount) || 0
      };
      await patchMember(memberData._id, updates);
      setMemberData({ ...memberData, ...updates });
      setEditingCounts(false);
    } catch (err) {
      console.error('Error updating counts:', err);
      alert('Failed to update species counts.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCounts(false);
    setEditUsCount('');
    setEditWorldCount('');
  };

  const handleEditSocialLinks = () => {
    setEditEbirdUrl(memberData?.ebirdProfileUrl || '');
    setEditFacebookUrl(memberData?.facebook || '');
    setEditLinkedInUrl(memberData?.linkedin || '');
    setEditingSocialLinks(true);
  };

  const handleSaveSocialLinks = async () => {
    if (!memberData?._id) return;
    setSaving(true);
    try {
      const updates = {
        ebirdProfileUrl: editEbirdUrl.trim(),
        facebook: editFacebookUrl.trim(),
        linkedin: editLinkedInUrl.trim()
      };
      await patchMember(memberData._id, updates);
      setMemberData({ ...memberData, ...updates });
      setEditingSocialLinks(false);
    } catch (err) {
      console.error('Error updating social links:', err);
      alert('Failed to update social links.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSocialEdit = () => {
    setEditingSocialLinks(false);
    setEditEbirdUrl('');
    setEditFacebookUrl('');
    setEditLinkedInUrl('');
  };

  const handleEditPhone = () => {
    setEditPhone(memberData?.phone || '');
    setEditingPhone(true);
  };

  const handleSavePhone = async () => {
    if (!memberData?._id) return;
    setSaving(true);
    try {
      const updates = {
        phone: editPhone.trim()
      };
      await patchMember(memberData._id, updates);
      setMemberData({ ...memberData, ...updates });
      setEditingPhone(false);
    } catch (err) {
      console.error('Error updating phone:', err);
      alert('Failed to update phone number.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPhoneEdit = () => {
    setEditingPhone(false);
    setEditPhone('');
  };

  const formatEventDate = (startDateString, endDateString) => {
    if (!startDateString) return 'Date not available'

    // Parse dates in UTC to avoid timezone issues
    const startDate = new Date(startDateString)
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    const startDay = startDate.getUTCDate()
    const startYear = startDate.getUTCFullYear()

    // No end date - single day event
    if (!endDateString) {
      return `${startMonth} ${startDay}, ${startYear}`
    }

    const endDate = new Date(endDateString)
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    const endDay = endDate.getUTCDate()
    const endYear = endDate.getUTCFullYear()

    // Same month - format: September 7-10, 2010
    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} ${startDay}-${endDay}, ${startYear}`
    }

    // Different months - format: September 29 - October 1, 2010
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`
  }

  const handleEventsPageChange = (event, value) => {
    setEventsPage(value)
  }

  // Calculate pagination
  const totalEventsPages = Math.ceil(memberEvents.length / eventsPerPage)
  const paginatedEvents = memberEvents.slice(
    (eventsPage - 1) * eventsPerPage,
    eventsPage * eventsPerPage
  )

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Profile data unavailable:</strong> {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Showing basic information from your login account.
          </Typography>
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              src={getPictureUrl(memberData?.picture) || user.picture}
              alt={memberData?.first && memberData?.last ? `${memberData.first} ${memberData.last}` : user.name}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5" gutterBottom>
                {memberData?.first && memberData?.last 
                  ? `${memberData.first} ${memberData.last}` 
                  : user.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  {memberData?.position || 'Member'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <RoleBadge showIcon={true} variant="filled" />
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" color="primary">
                  Contact Information
                </Typography>
                {!editingPhone && (
                  <IconButton
                    onClick={handleEditPhone}
                    size="small"
                    color="primary"
                    disabled={saving}
                    title="Edit phone number"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {editingPhone ? (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    disabled={saving}
                    helperText="Enter your phone number"
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancelPhoneEdit}
                      disabled={saving}
                      startIcon={<Cancel />}
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSavePhone}
                      disabled={saving}
                      startIcon={<Save />}
                      size="small"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {memberData?.email || user.email}
                          {user.email_verified && (
                            <Chip
                              size="small"
                              icon={<Verified />}
                              label="Verified"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>

                  {memberData?.address && (
                    <ListItem>
                      <ListItemIcon>
                        <Home color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={memberData.address}
                      />
                    </ListItem>
                  )}

                  {memberData?.city && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="City"
                        secondary={`${memberData.city}${memberData.state ? `, ${memberData.state}` : ''}${memberData.zip ? ` ${memberData.zip}` : ''}`}
                      />
                    </ListItem>
                  )}

                  <ListItem>
                    <ListItemIcon>
                      <Phone color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={memberData?.phone || 'Not set'}
                    />
                  </ListItem>
                </List>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Membership Information
              </Typography>
              
              <List dense>
                {memberData?.memberSince && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Member Since"
                      secondary={new Date(memberData.memberSince).toLocaleDateString()}
                    />
                  </ListItem>
                )}
                
                {memberData?.yearJoined && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Member Since"
                      secondary={memberData.yearJoined}
                    />
                  </ListItem>
                )}
                
                {memberData?.status && (
                  <ListItem>
                    <ListItemIcon>
                      <Badge color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Status"
                      secondary={
                        <Chip 
                          size="small"
                          label={memberData.status}
                          color={memberData.status === 'active' ? 'success' : 'default'}
                          variant="outlined"
                        />
                      }
                    />
                  </ListItem>
                )}
                
                {memberData?.nickname && (
                  <ListItem>
                    <ListItemIcon>
                      <AccountCircle color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Nickname"
                      secondary={memberData.nickname}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
          
        {/* Account Settings Section */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom color="primary">
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose what information is visible to other members in the directory and profiles.
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showEmail}
                    onChange={e => handleToggle('showEmail', e.target.checked)}
                    color="primary"
                    disabled={saving}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Show Email Address</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Allow other members to see your email in the directory
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showPhone}
                    onChange={e => handleToggle('showPhone', e.target.checked)}
                    color="primary"
                    disabled={saving || !memberData?.phone?.trim()}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" color={!memberData?.phone?.trim() ? 'text.disabled' : 'text.primary'}>
                      Show Phone Number
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Allow other members to see your phone in the directory
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </Paper>
        {/* End Account Settings Section */}

          {/* Social Links */}
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" color="primary">
                Social Links
              </Typography>
              {!editingSocialLinks && (
                <IconButton
                  onClick={handleEditSocialLinks}
                  size="small"
                  color="primary"
                  disabled={saving}
                  title="Edit social links"
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Box>

            {editingSocialLinks ? (
              <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="eBird Profile URL"
                      type="url"
                      value={editEbirdUrl}
                      onChange={(e) => setEditEbirdUrl(e.target.value)}
                      placeholder="https://ebird.org/profile/..."
                      disabled={saving}
                      helperText="Enter your complete eBird profile URL"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Facebook URL"
                      type="url"
                      value={editFacebookUrl}
                      onChange={(e) => setEditFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/..."
                      disabled={saving}
                      helperText="Enter your Facebook profile or page URL"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="LinkedIn URL"
                      type="url"
                      value={editLinkedInUrl}
                      onChange={(e) => setEditLinkedInUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      disabled={saving}
                      helperText="Enter your LinkedIn profile URL"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancelSocialEdit}
                    disabled={saving}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveSocialLinks}
                    disabled={saving}
                    startIcon={<Save />}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {(memberData?.ebirdProfileUrl || editingSocialLinks) && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Nature color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            eBird Profile
                          </Typography>
                          {memberData?.ebirdProfileUrl ? (
                            <a
                              href={memberData.ebirdProfileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '14px'
                              }}
                            >
                              View Profile
                              <Launch fontSize="small" />
                            </a>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not set
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                )}

                {(memberData?.facebook || editingSocialLinks) && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Facebook color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Facebook
                          </Typography>
                          {memberData?.facebook ? (
                            <a
                              href={memberData.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '14px'
                              }}
                            >
                              View Profile
                              <Launch fontSize="small" />
                            </a>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not set
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                )}

                {(memberData?.linkedin || editingSocialLinks) && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinkedIn color="primary" sx={{ fontSize: 32 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            LinkedIn
                          </Typography>
                          {memberData?.linkedin ? (
                            <a
                              href={memberData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#1976d2',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '14px'
                              }}
                            >
                              View Profile
                              <Launch fontSize="small" />
                            </a>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Not set
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                )}

                {!memberData?.ebirdProfileUrl && !memberData?.facebook && !memberData?.linkedin && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No social links added yet. Click the edit button to add your eBird, Facebook, or LinkedIn profile.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </>
          
          {/* Birding Statistics */}
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" color="primary">
                Birding Activity
              </Typography>
              {!editingCounts && (
                <IconButton
                  onClick={handleEditCounts}
                  size="small"
                  color="primary"
                  disabled={saving}
                  title="Edit species counts"
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Box>

            {editingCounts ? (
              <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="US Species Count"
                      type="number"
                      value={editUsCount}
                      onChange={(e) => setEditUsCount(e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                      disabled={saving}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="World Species Count"
                      type="number"
                      value={editWorldCount}
                      onChange={(e) => setEditWorldCount(e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                      disabled={saving}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveCounts}
                    disabled={saving}
                    startIcon={<Save />}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                    <Flag color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" color="primary">
                      {memberData?.usCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Species Sighted in US
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ textAlign: 'center', p: 2 }}>
                    <Public color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" color="secondary">
                      {memberData?.worldCount || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Species Sighted Worldwide
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            )}
          </>

          {/* Event Attendance History */}
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <EventIcon color="primary" />
              <Typography variant="h6" color="primary">
                Event Attendance History
              </Typography>
              {!loadingEvents && memberEvents.length > 0 && (
                <Chip
                  label={`${memberEvents.length} ${memberEvents.length === 1 ? 'Event' : 'Events'}`}
                  color="primary"
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 32
                  }}
                />
              )}
            </Box>

            {loadingEvents ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading events...
                </Typography>
              </Box>
            ) : memberEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No event attendance history yet.
              </Typography>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '60%' }}><strong>Event</strong></TableCell>
                        <TableCell sx={{ width: '40%' }}><strong>Date</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedEvents.map((event, index) => (
                        <TableRow key={event._id || index}>
                          <TableCell sx={{ width: '60%' }}>
                            <Typography variant="body2">
                              {event.eventTitle || 'Untitled Event'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ width: '40%' }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatEventDate(event.eventStart, event.eventEnd)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {totalEventsPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                      count={totalEventsPages}
                      page={eventsPage}
                      onChange={handleEventsPageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Profile