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
  Link,
  Avatar,
  AvatarGroup,
  useTheme,
  useMediaQuery,
  Tooltip,
  Paper
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MapIcon from '@mui/icons-material/Map'
import EditIcon from '@mui/icons-material/Edit'
import PeopleIcon from '@mui/icons-material/People'
import { useUserRole } from '../hooks/useUserRole'
import EventFormModal from './EventFormModal'
import ManageAttendeesModal from './ManageAttendeesModal'
// turbo
import LocationDialog from './LocationDialog'
import EventMap from './EventMap'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import EventPhotoSection from './EventPhotoSection'
import { getEventAttendees, registerForEvent, unregisterFromEvent, getMembers } from '../services/restdbService'
import { useAuth0 } from '@auth0/auth0-react'

const EventDetailsDialog = ({ open, onClose, event, onEventUpdated }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated } = useAuth0()
  const { isOfficer, isAdmin } = useUserRole()

  // State
  const [attendees, setAttendees] = useState([])
  const [currentUserAttending, setCurrentUserAttending] = useState(false)
  const [loadingAction, setLoadingAction] = useState(false)
  const [memberProfile, setMemberProfile] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false)
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [editingLocationIndex, setEditingLocationIndex] = useState(null)
  const [currentEvent, setCurrentEvent] = useState(event)

  const eventId = currentEvent ? (currentEvent._id || currentEvent.id) : null

  // Effects
  useEffect(() => {
    setCurrentEvent(event)
  }, [event])

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

  if (!currentEvent) return null

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
          eventTitle: currentEvent.title || currentEvent.event,
          eventStart: currentEvent.start,
          eventEnd: currentEvent.end
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

  const locations = currentEvent.locations || (currentEvent.lat && currentEvent.lon ? [{ name: 'Event Location', lat: currentEvent.lat, lon: currentEvent.lon }] : [])

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
        p: { xs: 2.5, md: 4 }, // slightly more padding on mobile
        pb: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        bgcolor: '#fff',
        position: 'relative' // For absolute close button
      }}>
        {/* Close Button - Pinned Top Right on Mobile */}
        <IconButton
          onClick={onClose}
          size={fullScreen ? "small" : "medium"}
          sx={{
            position: { xs: 'absolute', md: 'static' },
            top: { xs: 8 },
            right: { xs: 8 },
            ml: { md: 1 },
            bgcolor: 'rgba(0,0,0,0.03)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', color: 'error.main' },
            zIndex: 10
          }}
        >
          <CloseIcon fontSize={fullScreen ? "small" : "medium"} />
        </IconButton>

        <Box sx={{ pr: { xs: 4, md: 2 }, width: '100%' }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {currentEvent.cancelled && (
              <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 1.5 }} />
            )}
            {isPastEvent(currentEvent) && (
              <Chip label="Past Event" variant="outlined" size="small" sx={{ borderColor: 'text.disabled', color: 'text.disabled' }} />
            )}
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: '0.9rem !important' }} />}
              label={formatDateRange(currentEvent.start, currentEvent.end)}
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
            {currentEvent.title || currentEvent.event}
          </Typography>

          {/* Action Buttons - Below title on mobile, right aligned on desktop */}
          {(isOfficer || isAdmin) && (
            <Box sx={{
              display: 'flex',
              gap: 1,
              mt: { xs: 2, md: 0 },
              ...(fullScreen ? {} : { float: 'right' }) // On desktop, float them or use flex order? Flex is better.
            }}>
              {/* Wrap in a Box that we can position */}
            </Box>
          )}
        </Box>

        {/* Desktop Action Buttons Container */}
        {(isOfficer || isAdmin) && (
          <Box sx={{
            display: 'flex',
            gap: 1,
            mt: { xs: 2, md: 0 },
            alignSelf: { xs: 'flex-start', md: 'flex-start' },
            flexShrink: 0
          }}>
            <Tooltip title="Add Location">
              <IconButton
                onClick={() => {
                  setEditingLocationIndex(null)
                  setLocationModalOpen(true)
                }}
                size="small" // force small on all sizes for better fit
                sx={{
                  bgcolor: 'rgba(0,0,0,0.03)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', color: 'primary.main' }
                }}
              >
                <AddLocationIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manage Attendees">
              <IconButton
                onClick={() => setAttendeesModalOpen(true)}
                size="small"
                sx={{
                  bgcolor: 'rgba(0,0,0,0.03)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', color: 'primary.main' }
                }}
              >
                <PeopleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Event">
              <IconButton
                onClick={() => setEditModalOpen(true)}
                size="small"
                sx={{
                  bgcolor: 'rgba(0,0,0,0.03)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.08)', color: 'primary.main' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

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
              <ReactMarkdown>{currentEvent.details || 'No details provided.'}</ReactMarkdown>
            </Box>

            {/* Trip Reports Link Card */}
            {(currentEvent.ebirdTripUrl || currentEvent.eBirdTripUrl || currentEvent.ebird_trip_url) && (
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
                  href={currentEvent.ebirdTripUrl || currentEvent.eBirdTripUrl || currentEvent.ebird_trip_url}
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
            {currentEvent.tripLeader && (
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
                        {currentEvent.tripLeader.name || `${currentEvent.tripLeader.firstName} ${currentEvent.tripLeader.lastName}`}
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
                {!isFutureEvent(currentEvent) && (
                  <Chip
                    label={attendees.length > 0 ? `${attendees.length} Attended` : 'Be the first'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontFamily: '"Inter", sans-serif',
                      bgcolor: attendees.length > 0 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(0,0,0,0.05)',
                      color: attendees.length > 0 ? '#1b5e20' : 'text.secondary',
                      border: attendees.length > 0 ? '1px solid rgba(46, 125, 50, 0.2)' : '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                )}
              </Stack>

              {isAuthenticated ? (
                <Button
                  fullWidth
                  variant={currentUserAttending ? "outlined" : "contained"}
                  color={currentUserAttending ? "error" : "primary"}
                  onClick={handleAttendanceToggle}
                  disabled={loadingAction || (!currentUserAttending && isFutureEvent(currentEvent))}
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
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="700" textTransform="uppercase" letterSpacing={0.5} color="text.secondary" sx={{ pl: 1, fontFamily: '"Inter", sans-serif' }}>
                  Locations {locations.length > 0 && `(${locations.length})`}
                </Typography>
              </Box>

              {locations.length > 0 ? (
                <EventMap
                  key={locations.length} // Force re-render when locations count changes
                  event={currentEvent}
                  onEditLocation={(index) => {
                    setEditingLocationIndex(index)
                    setLocationModalOpen(true)
                  }}
                  canEdit={isOfficer || isAdmin}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 1, fontStyle: 'italic' }}>
                  No location specified
                </Typography>
              )}
            </Box>

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
      {editModalOpen && (
        <EventFormModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          event={{
            ...currentEvent,
            start: currentEvent.originalStart || currentEvent.start,
            end: currentEvent.originalEnd !== undefined ? currentEvent.originalEnd : currentEvent.end
          }}
          onSuccess={() => {
            setEditModalOpen(false)
            if (onEventUpdated) onEventUpdated()
          }}
        />
      )}
      {attendeesModalOpen && (
        <ManageAttendeesModal
          open={attendeesModalOpen}
          onClose={() => setAttendeesModalOpen(false)}
          event={currentEvent}
          onSuccess={() => {
            // Reload local event data to update attendee count/list in the dialog
            loadEventData()
          }}
        />
      )}
      {locationModalOpen && (
        <LocationDialog
          open={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          event={currentEvent}
          locationIndex={editingLocationIndex}
          onEventUpdated={(updatedLocations) => {
            if (updatedLocations) {
              const updatedEvent = { ...currentEvent, locations: updatedLocations }
              setCurrentEvent(updatedEvent)
              // Optionally propagate up if parent needs to know (which it does for calendar view)
              if (onEventUpdated) onEventUpdated(updatedEvent)
            }
          }}
        />
      )}

    </Dialog>
  )
}

export default EventDetailsDialog