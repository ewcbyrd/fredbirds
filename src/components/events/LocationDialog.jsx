import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    IconButton,
    Alert,
    CircularProgress,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateEvent } from '../../services/restdbService';

const LocationDialog = ({
    open,
    onClose,
    event,
    locationIndex,
    onEventUpdated
}) => {
    const isEditMode = locationIndex !== null && locationIndex !== undefined;

    const [formData, setFormData] = useState({
        name: '',
        lat: '',
        lon: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            if (
                isEditMode &&
                event.locations &&
                event.locations[locationIndex]
            ) {
                const loc = event.locations[locationIndex];
                setFormData({
                    name: loc.name || '',
                    lat: loc.lat || '',
                    lon: loc.lon || '',
                    address: loc.address || ''
                });
            } else {
                // Reset for add mode
                setFormData({
                    name: '',
                    lat: '',
                    lon: '',
                    address: ''
                });
            }
            setError(null);
        }
    }, [open, isEditMode, event, locationIndex]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const newLocation = {
                name: formData.name || '',
                lat: formData.lat ? parseFloat(formData.lat) : '',
                lon: formData.lon ? parseFloat(formData.lon) : '',
                address: formData.address || ''
            };

            // Validation: If lat/lon provided, must be numbers
            if (
                (formData.lat && isNaN(newLocation.lat)) ||
                (formData.lon && isNaN(newLocation.lon))
            ) {
                throw new Error('Latitude and Longitude must be valid numbers');
            }

            // If we are strictly validating like EventForm, we might want to ensure ONE of the fields is filled?
            // But let's assume if they click save they want to save whatever they wrote.

            const currentLocations = event.locations
                ? [...event.locations]
                : [];

            if (isEditMode) {
                currentLocations[locationIndex] = newLocation;
            } else {
                currentLocations.push(newLocation);
            }

            // Clean the list generically (though our new one is already clean-ish)
            // This is to match the previous fix logic just in case
            const cleanedLocations = currentLocations.map((loc) => ({
                name: loc.name || '',
                lat:
                    loc.lat !== '' && !isNaN(parseFloat(loc.lat))
                        ? parseFloat(loc.lat)
                        : '',
                lon:
                    loc.lon !== '' && !isNaN(parseFloat(loc.lon))
                        ? parseFloat(loc.lon)
                        : '',
                address: loc.address || ''
            }));

            const eventId = event._id || event.id;
            await updateEvent(eventId, { locations: cleanedLocations });

            if (onEventUpdated) onEventUpdated(cleanedLocations);
            onClose();
        } catch (err) {
            console.error('Error saving location:', err);
            setError(
                err.message || 'Failed to save location. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                {isEditMode ? 'Edit Location' : 'Add Location'}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Location Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    margin="normal"
                    placeholder="e.g., Belle Isle State Park"
                    autoFocus
                />

                <Grid container spacing={2} sx={{ mt: 0 }}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Latitude"
                            value={formData.lat}
                            onChange={(e) =>
                                handleChange('lat', e.target.value)
                            }
                            margin="normal"
                            placeholder="37.7889"
                            type="number"
                            inputProps={{ step: 'any' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Longitude"
                            value={formData.lon}
                            onChange={(e) =>
                                handleChange('lon', e.target.value)
                            }
                            margin="normal"
                            placeholder="-77.1234"
                            type="number"
                            inputProps={{ step: 'any' }}
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    margin="normal"
                    placeholder="123 Park Ave, City, State"
                    multiline
                    rows={2}
                />

                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        * Latitude and Longitude are required for the map to
                        appear.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={
                        loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : null
                    }
                >
                    {loading ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationDialog;
