import React, { useEffect, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PersonIcon from '@mui/icons-material/Person'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import ReactMarkdown from 'react-markdown'
import { getEventsByYear, getFutureEvents, getEventAttendees, registerForEvent, unregisterFromEvent, getMembers } from '../services/restdbService'
import AccessControl from './AccessControl'
import EventPhotoSection from './EventPhotoSection'
import EventDetailsDialog from './EventDetailsDialog'
import { ACCESS_LEVELS } from '../hooks/useUserRole'
import WeatherForecast from './WeatherForecast'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Function to render event details as markdown
const formatEventDetails = (details) => {
  if (!details) return null;

  return (
    <Box
      sx={{
        '& p': { mt: 0, mb: 2 },
        '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 2, mb: 1 },
        '& ul, & ol': { mt: 0, mb: 2, pl: 3 },
        '& li': { mb: 0.5 },
        '& blockquote': {
          borderLeft: '4px solid #ddd',
          pl: 2,
          ml: 0,
          color: 'text.secondary'
        },
        '& code': {
          backgroundColor: 'action.hover',
          padding: '2px 6px',
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.9em'
        },
        '& pre': {
          backgroundColor: 'action.hover',
          padding: 2,
          borderRadius: 1,
          overflow: 'auto'
        },
        '& a': {
          color: 'primary.main',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }
      }}
    >
      <ReactMarkdown>{details}</ReactMarkdown>
    </Box>
  );
};

// Component to render event location map(s)
const EventMap = ({ lat, lon, title, locations }) => {
  // Support both old single location format (lat/lon) and new multiple locations format
  const eventLocations = locations && locations.length > 0
    ? locations
    : (lat && lon ? [{ lat, lon, name: '', address: '' }] : []);

  if (eventLocations.length === 0) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LocationOnIcon color="primary" fontSize="small" />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {eventLocations.length === 1 ? 'Event Location' : `Event Locations (${eventLocations.length})`}
        </Typography>
      </Box>

      {eventLocations.map((location, idx) => {
        const mapSrc = apiKey
          ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${location.lat},${location.lon}&zoom=15`
          : `https://www.google.com/maps?q=${location.lat},${location.lon}&output=embed&z=15`;

        return (
          <Box key={idx} sx={{
            bgcolor: 'info.50',
            p: 2,
            borderRadius: 2,
            border: 1,
            borderColor: 'info.200',
            mb: eventLocations.length > 1 && idx < eventLocations.length - 1 ? 2 : 3
          }}>
            {eventLocations.length > 1 && (
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Location {idx + 1}{location.name ? `: ${location.name}` : ''}
              </Typography>
            )}
            {eventLocations.length === 1 && location.name && (
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {location.name}
              </Typography>
            )}
            {location.address && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {location.address}
              </Typography>
            )}
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: 250,
              borderRadius: 2,
              overflow: 'hidden',
              border: 1,
              borderColor: 'grey.300'
            }}>
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map for ${location.name || title} - Location ${idx + 1}`}
              />
            </Box>
            <Typography variant="caption" sx={{
              display: 'block',
              mt: 1,
              color: 'text.secondary',
              textAlign: 'center'
            }}>
              {apiKey ? 'Interactive Google Maps • Click and drag to explore' : 'Basic map view • Click to open in Google Maps'}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default function Events({ home = false, singleEvent = false, maxEvents = 5, onViewAll }) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [yearEvents, setYearEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Attendee management state
  const [attendees, setAttendees] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [loadingAttendees, setLoadingAttendees] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (home) {
      getFutureEvents(new Date(), 3).then(res => {
        setYearEvents(transformEvents(res))
        setLoading(false)
      }).catch(() => setLoading(false))
    } else {
      // Load events for multiple years to cover past and future
      const currentYear = new Date().getFullYear()
      // Load from 2015 to next year to show full history
      const years = []
      for (let y = 2015; y <= currentYear + 1; y++) {
        years.push(y)
      }

      Promise.all(years.map(y => getEventsByYear(y)))
        .then(results => {
          const combined = results.flat()
          const transformed = transformEvents(combined)
          setAllEvents(transformed)
          setYearEvents(transformed)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [home])

  // Load all members for attendee selection
  useEffect(() => {
    console.log('Loading members...')
    getMembers().then(members => {
      console.log('Members loaded:', members)
      setAllMembers(members || [])
    }).catch(err => {
      console.error('Error loading members:', err)
    })
  }, [])

  // Debug: Log selected event
  useEffect(() => {
    if (selected) {
      console.log('Selected event:', selected)
      console.log('Selected resource:', selected.resource)
    }
  }, [selected])

  function transformEvents(result) {
    if (!result || result.length === 0) return []
    // Map to React Big Calendar format
    return result.map(item => {
      // Parse date strings and adjust for timezone to avoid off-by-one day issues
      const startDate = new Date(item.start)
      const endDate = item.end ? new Date(item.end) : new Date(item.start)

      // Create date in local timezone by using year, month, day components from UTC
      const localStart = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
      const localEnd = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())

      // React Big Calendar treats end date as exclusive, so add 1 day to include the final day
      // Since we're displaying the actual last day of the event, we need to set end to the day after
      localEnd.setDate(localEnd.getDate() + 1)

      return {
        id: item._id,
        title: item.event,
        start: localStart,
        end: localEnd,
        allDay: true,
        resource: {
          details: item.details,
          cancelled: item.cancelled,
          participants: item.participants || [],
          species_sighted: item.species_sighted || [],
          pdfFile: item.pdfFile,
          ebirdTripUrl: item.ebirdTripUrl,
          lat: item.lat,
          lon: item.lon,
          tripLeader: item.tripLeader || null,
          locations: item.locations || (item.lat && item.lon ? [{ lat: item.lat, lon: item.lon, name: '', address: '' }] : [])
        }
      }
    })
  }

  function formatEventDate(start, end) {
    if (!start) return ''
    const s = new Date(start)
    if (!end) return s.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
    // Subtract 1 day from end since we added 1 day for calendar display (exclusive end date)
    const e = new Date(end)
    e.setDate(e.getDate() - 1)
    const opts = { month: 'long', day: 'numeric' }
    if (s.getMonth() === e.getMonth()) return `${s.toLocaleDateString(undefined, opts)} - ${e.getDate()}`
    return `${s.toLocaleDateString(undefined, opts)} - ${e.toLocaleDateString(undefined, opts)}`
  }

  function handleSelectEvent(event) {
    setSelected(event)
    // Load attendees for this event
    if (event && event.id) {
      setLoadingAttendees(true)
      getEventAttendees(event.id)
        .then(data => {
          setAttendees(data.attendees || [])
          setLoadingAttendees(false)
        })
        .catch(err => {
          console.error('Error loading attendees:', err)
          setAttendees([])
          setLoadingAttendees(false)
        })
    }
  }

  function closeEvent() {
    setSelected(null)
    setAttendees([])
    setSelectedMember(null)
  }

  async function handleAddAttendee() {
    if (!selectedMember || !selected) return

    try {
      await registerForEvent(selected.id, {
        memberId: selectedMember._id,
        email: selectedMember.email,
        firstName: selectedMember.first,
        lastName: selectedMember.last,
        eventTitle: selected.title,
        eventStart: selected.resource.start,
        eventEnd: selected.resource.end
      })

      // Reload attendees
      const data = await getEventAttendees(selected.id)
      setAttendees(data.attendees || [])
      setSelectedMember(null)
    } catch (err) {
      console.error('Error adding attendee:', err)
      alert(err.message || 'Failed to add attendee')
    }
  }

  async function handleRemoveAttendee(memberId) {
    if (!selected) return

    if (!confirm('Remove this attendee from the event?')) return

    try {
      await unregisterFromEvent(selected.id, memberId)

      // Reload attendees
      const data = await getEventAttendees(selected.id)
      setAttendees(data.attendees || [])
    } catch (err) {
      console.error('Error removing attendee:', err)
      alert('Failed to remove attendee')
    }
  }

  if (loading) return <Typography>Loading...</Typography>

  if (singleEvent) {
    const upcomingEvents = yearEvents.slice(0, maxEvents)
    if (upcomingEvents.length === 0) return <Typography>No upcoming events</Typography>

    const showInGrid = maxEvents === 3 && upcomingEvents.length >= 3

    return (
      <Box>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 800,
            color: '#2c3e50',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Upcoming Events
        </Typography>

        {showInGrid ? (
          <Grid container spacing={3}>
            {upcomingEvents.map((event, idx) => {
              // Calculate actual end date for display
              const actualEnd = event.end ? new Date(event.end) : null
              if (actualEnd) actualEnd.setDate(actualEnd.getDate() - 1)
              const isMultiDay = actualEnd && actualEnd.toDateString() !== event.start.toDateString()

              return (
                <Grid item xs={12} md={4} key={event.id || idx}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <CardContent sx={{ py: 2, height: '100%', display: 'flex', flexDirection: 'column', '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                        {/* Date box */}
                        <Box
                          sx={{
                            minWidth: 60,
                            textAlign: 'center',
                            bgcolor: event.resource?.cancelled ? '#d32f2f' : '#2c5f2d',
                            color: 'white',
                            borderRadius: 1,
                            p: 1,
                            flexShrink: 0
                          }}
                        >
                          <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                            {event.start.getDate()}
                          </Typography>
                          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                            {event.start.toLocaleDateString('en-US', { month: 'short' })}
                          </Typography>
                        </Box>

                        {/* Event details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {event.title}
                            </Typography>
                          </Box>
                          {isMultiDay && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              {event.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {actualEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Typography>
                          )}
                          {event.resource?.cancelled && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                bgcolor: '#ffebee',
                                color: '#d32f2f',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontWeight: 500,
                                display: 'inline-block'
                              }}
                            >
                              Cancelled
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {event.resource?.details && (
                        <Typography
                          variant="body2"
                          component="div"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            '& > div': {
                              margin: 0,
                              fontSize: '0.875rem',
                              color: 'text.secondary'
                            }
                          }}
                        >
                          {formatEventDetails(event.resource.details)}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        ) : (
          // Original vertical list layout
          upcomingEvents.map((event, idx) => {
            // Calculate actual end date for display
            const actualEnd = event.end ? new Date(event.end) : null
            if (actualEnd) actualEnd.setDate(actualEnd.getDate() - 1)
            const isMultiDay = actualEnd && actualEnd.toDateString() !== event.start.toDateString()

            return (
              <Card
                key={event.id || idx}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleSelectEvent(event)}
              >
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {/* Date box */}
                    <Box
                      sx={{
                        minWidth: 70,
                        textAlign: 'center',
                        bgcolor: event.resource?.cancelled ? '#d32f2f' : '#2c5f2d',
                        color: 'white',
                        borderRadius: 1,
                        p: 1,
                        flexShrink: 0
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                        {event.start.getDate()}
                      </Typography>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        {event.start.toLocaleDateString('en-US', { month: 'short' })}
                      </Typography>
                    </Box>

                    {/* Event details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {event.title}
                        </Typography>
                        {isMultiDay && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              bgcolor: '#e3f2fd',
                              color: '#1976d2',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              fontWeight: 500
                            }}
                          >
                            Multi-day
                          </Typography>
                        )}
                        {event.resource?.cancelled && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              bgcolor: '#ffebee',
                              color: '#d32f2f',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              fontWeight: 500
                            }}
                          >
                            Cancelled
                          </Typography>
                        )}
                      </Box>

                      {isMultiDay && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {event.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {actualEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      )}

                      {event.resource?.details && (
                        <Typography
                          variant="body2"
                          component="div"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            '& > div': {
                              margin: 0,
                              fontSize: '0.875rem',
                              color: 'text.secondary'
                            }
                          }}
                        >
                          {formatEventDetails(event.resource.details)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )
          })
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              color: '#2c5f2d',
              borderColor: '#2c5f2d',
              borderWidth: 2,
              borderRadius: 50,
              '&:hover': {
                bgcolor: '#2c5f2d',
                color: 'white',
                borderColor: '#2c5f2d',
                borderWidth: 2
              }
            }}
            onClick={() => onViewAll && onViewAll('events')}
          >
            View Full Calendar
          </Button>
        </Box>

      </Box>
    )
  }

  const CustomToolbar = ({ label, onNavigate }) => {
    const goToYear = (targetYear) => {
      const newDate = new Date(targetYear, 0, 1)
      setCurrentDate(newDate)
      onNavigate('DATE', newDate)
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button size="small" variant="outlined" onClick={() => onNavigate('PREV')}>
            &lt;
          </Button>
          <Button size="small" variant="outlined" onClick={() => onNavigate('TODAY')}>
            Today
          </Button>
          <Button size="small" variant="outlined" onClick={() => onNavigate('NEXT')}>
            &gt;
          </Button>
        </Box>

        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {label}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Year:</Typography>
          <Select
            size="small"
            value={currentDate.getFullYear()}
            onChange={(e) => goToYear(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    )
  }

  // Full calendar view
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
        Events Calendar
      </Typography>

      <Box sx={{
        height: 650,
        bgcolor: 'white',
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
      }}>
        <Calendar
          localizer={localizer}
          events={yearEvents}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onSelectEvent={handleSelectEvent}
          views={['month']}
          defaultView="month"
          style={{ height: '100%' }}
          components={{
            toolbar: CustomToolbar
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.resource?.cancelled ? '#d32f2f' : '#2c5f2d',
              borderRadius: '4px',
              opacity: 0.9,
              color: 'white',
              border: '0px',
              display: 'block'
            }
          })}
        />
      </Box>

      <EventDetailsDialog
        open={!!selected}
        onClose={closeEvent}
        event={selected ? { ...selected, ...selected.resource } : null}
      />
    </Box >
  )
}
