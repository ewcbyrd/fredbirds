import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Button,
  Typography,
  Chip,
  Stack,
  Divider,
  Link
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'

const EventDetailsDialog = ({ open, onClose, event }) => {
  if (!event) return null

  const formatDateRange = (start, end) => {
    const utcStart = new Date(start)
    const startDate = new Date(utcStart.getUTCFullYear(), utcStart.getUTCMonth(), utcStart.getUTCDate())

    if (!end) {
      return format(startDate, 'EEEE, MMMM d, yyyy')
    }

    const utcEnd = new Date(end)
    const endDate = new Date(utcEnd.getUTCFullYear(), utcEnd.getUTCMonth(), utcEnd.getUTCDate())

    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, 'EEEE, MMMM d, yyyy')
    }
    return `${format(startDate, 'EEEE, MMMM d, yyyy')} - ${format(endDate, 'EEEE, MMMM d, yyyy')}`
  }

  const isPastEvent = (event) => {
    const utcStart = new Date(event.start)
    const startDate = new Date(utcStart.getUTCFullYear(), utcStart.getUTCMonth(), utcStart.getUTCDate())
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return startDate < today
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography variant="h5" component="div" sx={{ mb: 1 }}>
              {event.event}
            </Typography>
            <Stack direction="row" spacing={1}>
              {event.cancelled && (
                <Chip label="Cancelled" color="error" size="small" />
              )}
              {isPastEvent(event) && !event.cancelled && (
                <Chip label="Past Event" color="default" size="small" />
              )}
            </Stack>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Date Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarTodayIcon color="action" />
            <Typography variant="subtitle2" color="text.secondary">
              Date
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ ml: 4 }}>
            {formatDateRange(event.start, event.end)}
          </Typography>
        </Box>

        {/* Trip Leader Section */}
        {event.tripLeader && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="subtitle2" color="text.secondary">
                Trip Leader
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 4 }}>
              {event.tripLeader.name || `${event.tripLeader.firstName} ${event.tripLeader.lastName}`.trim()}
            </Typography>
          </Box>
        )}

        {/* Location Section */}
        {event.locations && event.locations.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon color="action" />
              <Typography variant="subtitle2" color="text.secondary">
                {event.locations.length === 1 ? 'Location' : 'Locations'}
              </Typography>
            </Box>
            <Stack spacing={0.5} sx={{ ml: 4 }}>
              {event.locations.map((location, index) => (
                <Typography key={index} variant="body1">
                  {location.name || 'Unnamed location'}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}

        {/* eBird Trip Report Link */}
        {(event.ebirdTripUrl || event.eBirdTripUrl || event.ebird_trip_url) && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                component="img"
                src="/eBird+Logo.webp"
                alt="eBird Logo"
                sx={{ width: 20, height: 20, objectFit: 'contain' }}
              />
              <Typography variant="subtitle2" color="text.secondary">
                eBird Trip Report
              </Typography>
            </Box>
            <Link
              href={event.ebirdTripUrl || event.eBirdTripUrl || event.ebird_trip_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                ml: 4,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Typography variant="body1" color="primary" sx={{ fontWeight: 500 }}>
                View Report
              </Typography>
              <OpenInNewIcon fontSize="small" />
            </Link>
          </Box>
        )}

        {/* Attendee Count */}
        {event.attendeeCount > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'} registered
            </Typography>
          </Box>
        )}

        {/* Event Details with Markdown */}
        {event.details && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Details
              </Typography>
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
                <ReactMarkdown>{event.details}</ReactMarkdown>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventDetailsDialog