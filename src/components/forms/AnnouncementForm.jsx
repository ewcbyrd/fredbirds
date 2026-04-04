import React, { useState, useEffect } from 'react'
import {
    TextField,
    Button,
    Box,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { createAnnouncement, updateAnnouncement } from '../../services/restdbService'
import { parseUTCDate } from '../../utils/dateUtils'

const AnnouncementForm = ({ announcement, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        headline: '',
        details: '',
        date: new Date(),
        expires: null
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (announcement) {
            // Editing existing announcement
            setFormData({
                headline: announcement.headline || '',
                details: announcement.details || '',
                date: parseUTCDate(announcement.date) || new Date(),
                expires: parseUTCDate(announcement.expires)
            })
        } else {
            // Creating new announcement
            setFormData({
                headline: '',
                details: '',
                date: new Date(),
                expires: null
            })
        }
        setError(null)
        setSuccess(false)
    }, [announcement])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setError(null)
    }

    const validateForm = () => {
        if (!formData.headline.trim()) {
            setError('Headline is required')
            return false
        }
        if (!formData.details.trim()) {
            setError('Details are required')
            return false
        }
        if (!formData.date) {
            setError('Date is required')
            return false
        }
        if (formData.expires && formData.expires < formData.date) {
            setError('Expiration date must be after creation date')
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Helper function to convert date to UTC midnight
            const toUTCMidnight = (date) => {
                if (!date) return null
                const utcDate = new Date(Date.UTC(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    0, 0, 0, 0
                ))
                return utcDate.toISOString()
            }

            const announcementData = {
                headline: formData.headline.trim(),
                details: formData.details.trim(),
                date: toUTCMidnight(formData.date),
                expires: formData.expires ? toUTCMidnight(formData.expires) : null
            }

            if (announcement && announcement._id) {
                // Update existing announcement
                await updateAnnouncement(announcement._id, announcementData)
                setSuccess(true)
            } else {
                // Create new announcement
                await createAnnouncement(announcementData)
                setSuccess(true)
            }

            setTimeout(() => {
                onSuccess()
            }, 2000)
        } catch (err) {
            console.error('Error saving announcement:', err)
            setError(err.message || 'Failed to save announcement')
        } finally {
            setLoading(false)
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ pt: 1 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Announcement {announcement ? 'updated' : 'created'} successfully!
                    </Alert>
                )}

                <Stack spacing={2}>
                    <TextField
                        label="Headline"
                        name="headline"
                        value={formData.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                        fullWidth
                        disabled={loading}
                        required
                    />

                    <TextField
                        label="Details"
                        name="details"
                        value={formData.details}
                        onChange={(e) => handleChange('details', e.target.value)}
                        fullWidth
                        multiline
                        rows={6}
                        disabled={loading}
                        required
                        helperText="URLs will be automatically converted to clickable links"
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <DatePicker
                            label="Date *"
                            value={formData.date}
                            onChange={(date) => handleChange('date', date)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    disabled: loading
                                }
                            }}
                        />
                        <DatePicker
                            label="Expires (Optional)"
                            value={formData.expires}
                            onChange={(date) => handleChange('expires', date)}
                            minDate={formData.date}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    disabled: loading,
                                    helperText: 'Announcement will be hidden after this date'
                                }
                            }}
                        />
                    </Stack>

                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
                        <Button onClick={onCancel} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            sx={{ position: 'relative' }}
                        >
                            {loading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
                            {announcement ? 'Update Announcement' : 'Create Announcement'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </LocalizationProvider>
    )
}

export default AnnouncementForm
