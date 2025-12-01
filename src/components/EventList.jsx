import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { format } from 'date-fns'
import { getFutureEvents, getEventsByYear, deleteEvent } from '../services/restdbService'
import EventDetailsDialog from './EventDetailsDialog'

const EventList = ({ onEditEvent, refreshTrigger }) => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all, active, cancelled, past
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [eventToView, setEventToView] = useState(null)

  // Load events
  useEffect(() => {
    loadEvents()
  }, [refreshTrigger])

  // Filter events when search or filters change
  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, statusFilter])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get events from current year and future events
      const currentYear = new Date().getFullYear()
      const [currentYearEvents, futureEvents] = await Promise.all([
        getEventsByYear(currentYear),
        getFutureEvents(new Date(), 12) // Get next 12 months
      ])

      // Combine and deduplicate events
      const allEvents = [...currentYearEvents, ...futureEvents]
      const uniqueEvents = Array.from(
        new Map(allEvents.map(event => [event._id, event])).values()
      )

      // Sort by start date (most recent first)
      uniqueEvents.sort((a, b) => new Date(b.start) - new Date(a.start))

      setEvents(uniqueEvents)
    } catch (err) {
      console.error('Failed to load events:', err)
      setError('Failed to load events. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(event =>
        event.event.toLowerCase().includes(search) ||
        event.details?.toLowerCase().includes(search) ||
        event.tripLeader?.name?.toLowerCase().includes(search)
      )
    }

    // Status filter
    const now = new Date()
    if (statusFilter === 'active') {
      filtered = filtered.filter(event => !event.cancelled && new Date(event.start) >= now)
    } else if (statusFilter === 'cancelled') {
      filtered = filtered.filter(event => event.cancelled)
    } else if (statusFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.start) < now)
    }

    setFilteredEvents(filtered)
  }

  const handleDeleteClick = (event) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return

    try {
      setDeleting(true)
      await deleteEvent(eventToDelete._id)
      setDeleteDialogOpen(false)
      setEventToDelete(null)
      // Reload events
      loadEvents()
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError('Failed to delete event. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setEventToDelete(null)
  }

  const handleViewDetails = (event) => {
    setEventToView(event)
    setDetailsDialogOpen(true)
  }

  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false)
    setEventToView(null)
  }

  const formatDateRange = (start, end) => {
    // Parse UTC date and convert to local date using UTC components
    // This prevents timezone shifts (e.g., Jan 4 UTC becoming Jan 3 local)
    const utcStart = new Date(start)
    const startDate = new Date(utcStart.getUTCFullYear(), utcStart.getUTCMonth(), utcStart.getUTCDate())

    if (!end) {
      return format(startDate, 'MMM d, yyyy')
    }

    const utcEnd = new Date(end)
    const endDate = new Date(utcEnd.getUTCFullYear(), utcEnd.getUTCMonth(), utcEnd.getUTCDate())

    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, 'MMM d, yyyy')
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
  }

  const isPastEvent = (event) => {
    // Parse UTC date and convert to local date using UTC components
    const utcStart = new Date(event.start)
    const startDate = new Date(utcStart.getUTCFullYear(), utcStart.getUTCMonth(), utcStart.getUTCDate())
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return startDate < today
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Events</MenuItem>
            <MenuItem value="active">Active Only</MenuItem>
            <MenuItem value="past">Past Events</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredEvents.length} of {events.length} events
      </Typography>

      {/* Event List */}
      {filteredEvents.length === 0 ? (
        <Alert severity="info">
          No events found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Create your first event!'}
        </Alert>
      ) : (
        <Stack spacing={2}>
          {filteredEvents.map((event) => (
            <Card key={event._id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {event.event}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {event.cancelled && (
                      <Chip label="Cancelled" color="error" size="small" />
                    )}
                    {isPastEvent(event) && !event.cancelled && (
                      <Chip label="Past" color="default" size="small" />
                    )}
                  </Stack>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDateRange(event.start, event.end)}
                </Typography>

                {event.tripLeader && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Led by {event.tripLeader.name || `${event.tripLeader.firstName} ${event.tripLeader.lastName}`.trim()}
                    </Typography>
                  </Box>
                )}

                {event.locations && event.locations.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {event.locations.length === 1
                        ? event.locations[0].name || 'Location provided'
                        : `${event.locations.length} locations`}
                    </Typography>
                  </Box>
                )}

                {event.attendeeCount > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'} registered
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(event)}
                >
                  View Details
                </Button>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => onEditEvent(event)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(event)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={detailsDialogOpen}
        onClose={handleDetailsDialogClose}
        event={eventToView}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Event?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{eventToDelete?.event}"?
          </Typography>
          {eventToDelete?.attendeeCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This event has {eventToDelete.attendeeCount} registered {eventToDelete.attendeeCount === 1 ? 'attendee' : 'attendees'}.
              Deleting this event will remove all attendance records.
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EventList
