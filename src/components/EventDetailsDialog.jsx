import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Button,
  Typography,
  Chip,
  Stack,
  Divider,
  Link,
  Avatar,
  AvatarGroup,
  useTheme,
  useMediaQuery,
  Tooltip,
  Paper
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MapIcon from '@mui/icons-material/Map'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import EventPhotoSection from './EventPhotoSection'
import { getEventPhotos, getEventAttendees, registerForEvent, unregisterFromEvent, getMembers } from '../services/restdbService'
import { useAuth0 } from '@auth0/auth0-react'

const EventDetailsDialog = ({ open, onClose, event }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated } = useAuth0()

  // State
  const [attendees, setAttendees] = useState([])
  const [currentUserAttending, setCurrentUserAttending] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)
  const [memberProfile, setMemberProfile] = useState(null)

  const eventId = event ? (event._id || event.id) : null

  // Effects
  useEffect(() => {
    if (open && eventId) {
      loadEventData()
    }
  }, [open, eventId])

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      getMembers().then(members => {
        const member = members.find(m => m.email === user.email)
        setMemberProfile(member)
      }).catch(err => console.error('Error loading member profile:', err))
    }
  }, [isAuthenticated, user])

  if (!event) return null

  const loadEventData = async () => {
    try {
      const attendeeData = await getEventAttendees(eventId)
      const attendeeList = attendeeData.attendees || []
      setAttendees(attendeeList)

      if (user?.email) {
        const isAttending = attendeeList.some(a => a.email === user.email)
        setCurrentUserAttending(isAttending)
      }
    } catch (error) {
      console.error('Error loading event data:', error)
    }
  }

  const handleAttendanceToggle = async () => {
    if (!memberProfile) return

    setLoadingAction(true)
    try {
      if (currentUserAttending) {
        await unregisterFromEvent(eventId, memberProfile._id)
      } else {
        await registerForEvent(eventId, {
          memberId: memberProfile._id,
          email: memberProfile.email,
          firstName: memberProfile.first,
          lastName: memberProfile.last,
          eventTitle: event.event,
          eventStart: event.start,
          eventEnd: event.end
        })
      }
      await loadEventData()
    } catch (error) {
      console.error('Error toggling attendance:', error)
      alert('Failed to update attendance. Please try again.')
    } finally {
      setLoadingAction(false)
    }
  }

  // Formatting Helpers
  const formatDateRange = (start, end) => {
    const utcStart = new Date(start)
    const startDate = new Date(utcStart.getUTCFullYear(), utcStart.getUTCMonth(), utcStart.getUTCDate())

    if (!end) return format(startDate, 'EEEE, MMMM d, yyyy')

    const utcEnd = new Date(end)
    // End date is exclusive (midnight of next day), so subtract 1 day to get the inclusive end date
    utcEnd.setUTCDate(utcEnd.getUTCDate() - 1)

    const endDate = new Date(utcEnd.getUTCFullYear(), utcEnd.getUTCMonth(), utcEnd.getUTCDate())

    // If start and end are same day (or end is before start due to data weirdness), show single date
    if (startDate.getTime() >= endDate.getTime()) {
      return format(startDate, 'EEEE, MMMM d, yyyy')
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
  }

  const isPastEvent = (evt) => {
    const start = new Date(evt.start)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return start < today
  }

  const isFutureEvent = (evt) => {
    const start = new Date(evt.start)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    return start > today
  }

  const locations = event.locations || (event.lat && event.lon ? [{ name: 'Event Location', lat: event.lat, lon: event.lon }] : [])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 4,
          overflow: 'hidden',
          maxHeight: fullScreen ? '100%' : '92vh',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
        }
      }}
    >
      {/* Premium Header */}
      <DialogTitle sx={{
        p: 4,
        pb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        bgcolor: '#fff'
      }}>
        <Box sx={{ pr: 6 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {event.cancelled && (
              <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
            )}
            {isPastEvent(event) && (
              <Chip label="Past Event" variant="outlined" size="small" sx={{ borderColor: 'text.disabled', color: 'text.disabled' }} />
            )}
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={formatDateRange(event.start, event.end)}
              size="small"
              sx={{
                bgcolor: 'rgba(44, 95, 45, 0.08)',
                color: '#2c5f2d',
                fontWeight: 700,
                borderRadius: 1.5,
                border: '1px solid rgba(44, 95, 45, 0.1)'
              }}
            />
          </Stack>
          <Typography variant="h3" component="h1" sx={{
            fontWeight: 800,
            fontFamily: '"Outfit", sans-serif',
            color: '#1a1a1a',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            lineHeight: 1.2
          }}>
            {event.event}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            mt: -1,
            mr: -1,
            bgcolor: 'rgba(0,0,0,0.03)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', color: 'error.main' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 400 }}>

          {/* LEFT COLUMN: Main Content (60%) */}
          <Box sx={{
            flex: '6',
            p: { xs: 3, md: 4 },
            pt: { xs: 3, md: 3 },
            borderRight: { md: '1px solid rgba(0,0,0,0.06)' },
            bgcolor: '#ffffff'
          }}>


            <Box
              sx={{
                '& > *:first-of-type': { mt: 0 },
                '& p': {
                  mt: 0,
                  mb: 3,
                  lineHeight: 1.75,
                  fontSize: '1.05rem',
                  color: '#4a4a4a',
                  fontFamily: '"Inter", sans-serif'
                },
                '& h1, & h2, & h3': {
                  mt: 4,
                  mb: 2,
                  fontWeight: 700,
                  fontFamily: '"Outfit", sans-serif',
                  color: '#1a1a1a'
                },
                '& ul': { pl: 3, mb: 3 },
                '& li': { mb: 1, color: '#4a4a4a' },
                '& a': {
                  color: '#2c5f2d',
                  textDecoration: 'none',
                  fontWeight: 600,
                  borderBottom: '2px solid rgba(44, 95, 45, 0.2)',
                  transition: 'all 0.2s',
                  '&:hover': { borderBottomColor: '#2c5f2d', bgcolor: 'rgba(44, 95, 45, 0.05)' }
                },
              }}
            >
              <ReactMarkdown>{event.details || 'No details provided.'}</ReactMarkdown>
            </Box>

            {/* Trip Reports Link Card */}
            {(event.ebirdTripUrl || event.eBirdTripUrl || event.ebird_trip_url) && (
              <Paper
                elevation={0}
                sx={{
                  mt: 6,
                  p: 3,
                  bgcolor: '#f0f9ff',
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  gap: 3,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(14, 165, 233, 0.1)' }
                }}
              >
                <Box sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  flexShrink: 0
                }}>
                  <img src="/eBird+Logo.webp" alt="eBird" style={{ height: 28 }} />
                </Box>
                <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" fontWeight="700" color="#0c4a6e" mb={0.5} sx={{ fontFamily: '"Outfit", sans-serif' }}>eBird Trip Report</Typography>
                  <Typography variant="body2" color="#0369a1" sx={{ fontFamily: '"Inter", sans-serif' }}>Species list and photos from this outing are available.</Typography>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<OpenInNewIcon />}
                  href={event.ebirdTripUrl || event.eBirdTripUrl || event.ebird_trip_url}
                  target="_blank"
                  sx={{
                    bgcolor: '#0284c7',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#0369a1', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }
                  }}
                >
                  View Report
                </Button>
              </Paper>
            )}
          </Box>

          {/* RIGHT COLUMN: Sidebar (40%) */}
          <Box sx={{
            flex: '4',
            bgcolor: '#fcfcfc',
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>

            {/* 1. Key Info (Trip Leader) - Swapped to top */}
            {event.tripLeader && (
              <Box>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: 'white',
                    p: 0,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2.5, p: 2.5, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" fontWeight="600" color="text.secondary" textTransform="uppercase" sx={{ fontFamily: '"Inter", sans-serif' }}>Trip Leader</Typography>
                      <Typography variant="subtitle1" fontWeight="600" color="text.primary" sx={{ fontFamily: '"Inter", sans-serif' }}>
                        {event.tripLeader.name || `${event.tripLeader.firstName} ${event.tripLeader.lastName}`}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* 2. Registration Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" letterSpacing={1} color="text.secondary" sx={{ fontFamily: '"Inter", sans-serif' }}>
                  Attendance
                </Typography>
                <Chip
                  label={attendees.length > 0 ? `${attendees.length} Going` : 'Be the first'}
                  size="small"
                  color={attendees.length > 0 ? "success" : "default"}
                  variant="soft"
                  sx={{ fontWeight: 600, bgcolor: attendees.length > 0 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(0,0,0,0.05)', fontFamily: '"Inter", sans-serif' }}
                />
              </Stack>

              {isAuthenticated ? (
                <Button
                  fullWidth
                  variant={currentUserAttending ? "outlined" : "contained"}
                  color={currentUserAttending ? "error" : "primary"}
                  onClick={handleAttendanceToggle}
                  disabled={loadingAction || (!currentUserAttending && isFutureEvent(event))}
                  startIcon={currentUserAttending ? <CloseIcon /> : <CheckCircleIcon />}
                  size="large"
                  sx={{
                    mb: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: currentUserAttending ? 'none' : '0 8px 20px rgba(44, 95, 45, 0.25)',
                    '&:hover': {
                      boxShadow: currentUserAttending ? 'none' : '0 12px 24px rgba(44, 95, 45, 0.35)',
                    }
                  }}
                >
                  {loadingAction ? 'Updating...' : (currentUserAttending ? "Remove me from this event" : "I attended this event")}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  disabled
                  sx={{ mb: 3, borderRadius: 2, py: 1.5, textTransform: 'none' }}
                >
                  Sign in to mark attendance
                </Button>
              )}

              {/* Avatars */}
              {attendees.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <AvatarGroup
                    max={7}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 36,
                        height: 36,
                        fontSize: '0.85rem',
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {attendees.map((attendee, i) => (
                      <Tooltip key={i} title={attendee.name || `${attendee.firstName} ${attendee.lastName}` || attendee.email}>
                        <Avatar alt={attendee.firstName} src={attendee.picture || `https://ui-avatars.com/api/?name=${attendee.firstName}+${attendee.lastName}&background=random`} />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Box>
              )}
            </Paper>

            {/* 3. Locations (Map List) */}
            {locations.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" letterSpacing={0.5} color="text.secondary" gutterBottom sx={{ pl: 1, fontFamily: '"Inter", sans-serif' }}>
                  Locations {locations.length > 1 && `(${locations.length})`}
                </Typography>
                <Stack spacing={2}>
                  {locations.map((loc, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        bgcolor: 'white',
                        borderRadius: 3,
                        borderColor: 'rgba(0,0,0,0.08)',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(44, 95, 45, 0.1)' }
                      }}
                    >
                      <Avatar sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.85rem',
                        bgcolor: '#2c5f2d',
                        fontWeight: 700
                      }}>
                        {idx + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.3, mb: 0.5, color: '#1a1a1a', fontFamily: '"Inter", sans-serif' }}>
                          {loc.name || 'Event Location'}
                        </Typography>
                        {loc.address && (
                          <Typography variant="body2" display="block" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.4, fontFamily: '"Inter", sans-serif' }}>
                            {loc.address}
                          </Typography>
                        )}
                        <Link
                          href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lon}`}
                          target="_blank"
                          rel="noopener"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontFamily: '"Inter", sans-serif',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          <MapIcon sx={{ fontSize: 16 }} /> Open in Google Maps
                        </Link>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {/* 4. Photos (Thumbnail Grid) */}
            <Box>
              <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" letterSpacing={0.5} color="text.secondary" gutterBottom sx={{ pl: 1, fontFamily: '"Inter", sans-serif' }}>
                Photos
              </Typography>
              <EventPhotoSection eventId={eventId} />
            </Box>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EventDetailsDialog