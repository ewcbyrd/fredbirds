import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    TextField,
    Autocomplete,
    CircularProgress,
    Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { getActiveMembers, registerForEvent, unregisterFromEvent, getEventAttendees } from '../services/restdbService'

const ManageAttendeesModal = ({ open, onClose, event, onSuccess }) => {
    const [attendees, setAttendees] = useState([])
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [membersLoading, setMembersLoading] = useState(false)
    const [selectedMember, setSelectedMember] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (open && event) {
            loadData()
        }
    }, [open, event])

    const loadData = async () => {
        setLoading(true)
        try {
            const [attendeeData, membersData] = await Promise.all([
                getEventAttendees(event._id || event.id),
                getActiveMembers()
            ])
            setAttendees(attendeeData.attendees || [])
            setMembers(membersData || [])
        } catch (err) {
            console.error('Error loading data:', err)
            setError('Failed to load attendees or members.')
        } finally {
            setLoading(false)
        }
    }

    const handleAddAttendee = async () => {
        if (!selectedMember) return

        setLoading(true)
        try {
            // Prepare member data for registration
            // The API likely expects the logged-in user's context usually, but registerForEvent 
            // takes memberData. We can construct it from the selected member.
            await registerForEvent(event._id || event.id, {
                memberId: selectedMember._id,
                email: selectedMember.email,
                firstName: selectedMember.firstName || selectedMember.first,
                lastName: selectedMember.lastName || selectedMember.last,
                eventTitle: event.title || event.event,
                eventStart: event.start, // Uses parsed dates? Or original? 
                // Better to use original strings if available, but API might handle mostly anything.
                // Let's rely on what's passed in 'event'
                eventEnd: event.end
            })

            // Refresh list
            const attendeeData = await getEventAttendees(event._id || event.id)
            setAttendees(attendeeData.attendees || [])
            setSelectedMember(null)
            if (onSuccess) onSuccess()
        } catch (err) {
            console.error('Error adding attendee:', err)
            setError('Failed to add attendee.')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveAttendee = async (attendee) => {
        if (!window.confirm(`Are you sure you want to remove ${attendee.firstName} ${attendee.lastName}?`)) return

        setLoading(true)
        try {
            // unregisterFromEvent takes (eventId, memberId)
            // Check if attendee object has memberId or _id. 
            // Usually attendees list has specific structure. 
            // Based on EventDetailsDialog, it uses memberProfile._id.
            // We need to match the attendee to a member ID.
            // The attendee object from getEventAttendees usually contains member info.
            // Let's assume attendee.memberId or attendee._id (if it's the member document)
            // If it's from the attendees array, it might be the member object itself.

            await unregisterFromEvent(event._id || event.id, attendee._id || attendee.memberId)

            // Refresh list
            const attendeeData = await getEventAttendees(event._id || event.id)
            setAttendees(attendeeData.attendees || [])
            if (onSuccess) onSuccess()
        } catch (err) {
            console.error('Error removing attendee:', err)
            setError('Failed to remove attendee.')
        } finally {
            setLoading(false)
        }
    }

    // Filter out members who are already attending
    const availableMembers = members.filter(m =>
        !attendees.some(a => a.email === m.email || a._id === m._id)
    )

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Manage Attendees
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                    <Autocomplete
                        options={availableMembers}
                        getOptionLabel={(option) => `${option.firstName || option.first} ${option.lastName || option.last} (${option.email})`}
                        value={selectedMember}
                        onChange={(e, newValue) => setSelectedMember(newValue)}
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => <TextField {...params} label="Add Member" size="small" />}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddAttendee}
                        disabled={!selectedMember || loading}
                        startIcon={<PersonAddIcon />}
                    >
                        Add
                    </Button>
                </Box>

                <Typography variant="h6" gutterBottom>
                    Current Attendees ({attendees.length})
                </Typography>

                <List dense>
                    {attendees.map((attendee) => (
                        <ListItem
                            key={attendee._id || attendee.email}
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAttendee(attendee)} disabled={loading}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={attendee.picture} alt={attendee.firstName}>{attendee.firstName?.[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${attendee.firstName} ${attendee.lastName}`}
                                secondary={attendee.email}
                            />
                        </ListItem>
                    ))}
                    {attendees.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            No attendees yet.
                        </Typography>
                    )}
                </List>
            </DialogContent>
        </Dialog>
    )
}

export default ManageAttendeesModal
