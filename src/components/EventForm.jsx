import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Avatar,
  Stack
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import LocationsManager from './LocationsManager'
import { createEvent, updateEvent } from '../services/restdbService'
import { getActiveMembers } from '../services/restdbService'

const EventForm = ({ event, onSuccess, onCancel }) => {
  const isEditMode = !!event

  // Form state
  const [formData, setFormData] = useState({
    event: '',
    start: null,
    end: null,
    details: '',
    cancelled: false,
    pdfFile: '',
    tripLeader: null,
    locations: [{ name: '', lat: '', lon: '', address: '' }]
  })

  const [activeMembers, setActiveMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [membersLoading, setMembersLoading] = useState(true)

  // Load active members for trip leader selection
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setMembersLoading(true)
        const members = await getActiveMembers()
        console.log('Loaded members for trip leader:', members?.length || 0)
        setActiveMembers(members || [])
      } catch (err) {
        console.error('Failed to load members:', err)
        // Don't show error in main form, just log it
        // User can still create event without trip leader
      } finally {
        setMembersLoading(false)
      }
    }
    fetchMembers()
  }, [])

  // Load event data for edit mode
  useEffect(() => {
    if (event) {
      setFormData({
        event: event.event || '',
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null,
        details: event.details || '',
        cancelled: event.cancelled || false,
        pdfFile: event.pdfFile || '',
        tripLeader: event.tripLeader || null,
        locations: event.locations && event.locations.length > 0
          ? event.locations
          : [{ name: '', lat: '', lon: '', address: '' }]
      })
    }
  }, [event])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleLocationsChange = (locations) => {
    setFormData(prev => ({ ...prev, locations }))
  }

  const validateForm = () => {
    if (!formData.event.trim()) {
      setError('Event title is required')
      return false
    }
    if (!formData.start) {
      setError('Start date is required')
      return false
    }
    if (formData.end && formData.end < formData.start) {
      setError('End date must be after start date')
      return false
    }

    // Validate that if locations are provided, at least one has valid coordinates
    const hasLocations = formData.locations.some(loc => loc.lat || loc.lon || loc.name || loc.address)
    if (hasLocations) {
      const hasValidLocation = formData.locations.some(loc =>
        loc.lat && loc.lon && !isNaN(parseFloat(loc.lat)) && !isNaN(parseFloat(loc.lon))
      )
      if (!hasValidLocation) {
        setError('If you provide location information, at least one location must have valid coordinates (latitude and longitude)')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Filter out empty locations and convert lat/lon to numbers
      const validLocations = formData.locations
        .filter(loc => loc.lat && loc.lon)
        .map(loc => ({
          name: loc.name || '',
          lat: parseFloat(loc.lat),
          lon: parseFloat(loc.lon),
          address: loc.address || ''
        }))

      // Helper function to convert date to UTC midnight
      const toUTCMidnight = (date) => {
        const utcDate = new Date(Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0, 0, 0, 0
        ))
        return utcDate.toISOString()
      }

      const eventData = {
        event: formData.event.trim(),
        start: toUTCMidnight(formData.start),
        end: formData.end ? toUTCMidnight(formData.end) : null,
        details: formData.details.trim(),
        cancelled: formData.cancelled,
        pdfFile: formData.pdfFile.trim(),
        tripLeader: formData.tripLeader ? {
          memberId: formData.tripLeader._id,
          email: formData.tripLeader.email,
          firstName: formData.tripLeader.firstName || formData.tripLeader.first || '',
          lastName: formData.tripLeader.lastName || formData.tripLeader.last || '',
          name: formData.tripLeader.name || `${formData.tripLeader.firstName || formData.tripLeader.first || ''} ${formData.tripLeader.lastName || formData.tripLeader.last || ''}`.trim()
        } : null,
        locations: validLocations
      }

      if (isEditMode) {
        await updateEvent(event._id, eventData)
        setSuccess(true)
        // Notify parent - they control modal close timing
        onSuccess()
      } else {
        await createEvent(eventData)
        setSuccess(true)
        // Reset form after successful creation
        setFormData({
          event: '',
          start: null,
          end: null,
          details: '',
          cancelled: false,
          pdfFile: '',
          tripLeader: null,
          locations: [{ name: '', lat: '', lon: '', address: '' }]
        })
        // Notify parent - they control modal close timing
        onSuccess()
      }
    } catch (err) {
      console.error('Error saving event:', err)
      setError(err.message || 'Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Event {isEditMode ? 'updated' : 'created'} successfully!
          </Alert>
        )}

        {/* Event Title */}
        <TextField
          fullWidth
          required
          label="Event Title"
          value={formData.event}
          onChange={(e) => handleChange('event', e.target.value)}
          margin="normal"
          placeholder="e.g., Spring Migration Bird Walk"
        />

        {/* Date Range */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <DatePicker
            label="Start Date *"
            value={formData.start}
            onChange={(date) => handleChange('start', date)}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true
              }
            }}
          />
          <DatePicker
            label="End Date (Optional)"
            value={formData.end}
            onChange={(date) => handleChange('end', date)}
            minDate={formData.start}
            slotProps={{
              textField: {
                fullWidth: true
              }
            }}
          />
        </Stack>

        {/* Event Details */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Event Details"
          value={formData.details}
          onChange={(e) => handleChange('details', e.target.value)}
          margin="normal"
          placeholder="Describe the event, meeting location, what to bring, etc."
          helperText="URLs will be automatically converted to clickable links"
        />

        {/* Trip Leader */}
        <Autocomplete
          options={activeMembers}
          value={formData.tripLeader}
          onChange={(event, newValue) => handleChange('tripLeader', newValue)}
          getOptionLabel={(member) => {
            if (member.name) return member.name;
            if (member.firstName || member.first || member.lastName || member.last) {
              const first = member.firstName || member.first || '';
              const last = member.lastName || member.last || '';
              return `${first} ${last}`.trim();
            }
            return member.email || '';
          }}
          noOptionsText={membersLoading ? "Loading members..." : "No members found"}
          renderOption={(props, member) => {
            const first = member.firstName || member.first || '';
            const last = member.lastName || member.last || '';
            const displayName = member.name || `${first} ${last}`.trim();

            return (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={member.picture}
                  sx={{ width: 32, height: 32 }}
                >
                  {first?.[0]}{last?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2">
                    {displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Trip Leader (Optional)"
              margin="normal"
              helperText={
                membersLoading
                  ? "Loading members..."
                  : activeMembers.length === 0
                    ? "No members available. Trip leader is optional."
                    : "Select a club member to lead this event"
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {membersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          loading={membersLoading}
          disabled={membersLoading}
        />

        {/* Locations */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Locations (Optional)
          </Typography>
          <LocationsManager
            locations={formData.locations}
            onChange={handleLocationsChange}
          />
        </Box>

        {/* PDF File URL */}
        <TextField
          fullWidth
          label="PDF File URL (Optional)"
          value={formData.pdfFile}
          onChange={(e) => handleChange('pdfFile', e.target.value)}
          margin="normal"
          placeholder="https://example.com/event-details.pdf"
          helperText="Link to a PDF with additional event information"
        />

        {/* Cancelled Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.cancelled}
              onChange={(e) => handleChange('cancelled', e.target.checked)}
            />
          }
          label="Mark as Cancelled"
          sx={{ mt: 2 }}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              isEditMode ? 'Update Event' : 'Create Event'
            )}
          </Button>

          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  )
}

export default EventForm
