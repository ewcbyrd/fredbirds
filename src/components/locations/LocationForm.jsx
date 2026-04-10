import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import {
    createLocation,
    updateLocation,
    getStates,
    getCounties
} from '../../services/restdbService';

const LOCATION_TYPES = [
    'refuge',
    'preserve',
    'park',
    'trail',
    'monument',
    'road'
];
const AMENITIES = [
    'parking',
    'restrooms',
    'trails',
    'observation towers',
    'auto tour',
    'visitor center',
    'accessible'
];

const LocationForm = ({ location, onSuccess, onCancel }) => {
    const editMode = Boolean(location);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        state: '',
        county: '',
        lat: '',
        lon: '',
        website: '',
        ebirdHotspotIds: '',
        amenities: [],
        isActive: true
    });

    const [stateOptions, setStateOptions] = useState([]);
    const [countyOptions, setCountyOptions] = useState([]);
    const [filteredCountyOptions, setFilteredCountyOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);

    // Load states and counties on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [states, counties] = await Promise.all([
                    getStates(),
                    getCounties()
                ]);

                const stateOpts = Array.isArray(states)
                    ? states.map((i) => ({ label: i.state, value: i.code }))
                    : [];
                stateOpts.sort((a, b) => a.label.localeCompare(b.label));
                setStateOptions(stateOpts);

                const countyOpts = Array.isArray(counties)
                    ? counties.map((i) => ({ label: i.county, value: i.code }))
                    : [];
                countyOpts.sort((a, b) => a.label.localeCompare(b.label));
                setCountyOptions(countyOpts);
            } catch (err) {
                console.error('Error loading states/counties:', err);
            }
        };

        loadData();
    }, []);

    // Populate form if editing
    useEffect(() => {
        if (location) {
            setFormData({
                name: location.name || '',
                type: location.type || '',
                description: location.description || '',
                state: location.state || '',
                county: location.county || '',
                lat: location.lat?.toString() || '',
                lon: location.lon?.toString() || '',
                website: location.website || '',
                ebirdHotspotIds: location.ebirdHotspotIds?.join(', ') || '',
                amenities: location.amenities || [],
                isActive: location.isActive !== false
            });
        }
    }, [location]);

    // Filter counties when state changes
    useEffect(() => {
        if (formData.state) {
            const filtered = countyOptions.filter((c) =>
                c.value.startsWith(formData.state)
            );
            setFilteredCountyOptions(filtered);
        } else {
            setFilteredCountyOptions([]);
        }
    }, [formData.state, countyOptions]);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData((prev) => {
            const updated = {
                ...prev,
                [field]: value
            };

            // Clear county if state changes
            if (field === 'state' && prev.state !== value) {
                updated.county = '';
            }

            return updated;
        });

        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors((prev) => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleAmenityChange = (amenity) => (event) => {
        const checked = event.target.checked;
        setFormData((prev) => ({
            ...prev,
            amenities: checked
                ? [...prev.amenities, amenity]
                : prev.amenities.filter((a) => a !== amenity)
        }));
    };

    const handleActiveChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            isActive: event.target.checked
        }));
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(6),
                    lon: position.coords.longitude.toFixed(6)
                }));
                setFetchingLocation(false);
            },
            (err) => {
                console.error('Geolocation error:', err);
                setError(
                    'Unable to get your location. Please enter coordinates manually.'
                );
                setFetchingLocation(false);
            }
        );
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Name is required';
        }

        if (!formData.type) {
            errors.type = 'Type is required';
        }

        if (!formData.description || formData.description.length < 100) {
            errors.description = 'Description must be at least 100 characters';
        }

        if (!formData.state) {
            errors.state = 'State is required';
        }

        if (!formData.county) {
            errors.county = 'County is required';
        }

        const lat = parseFloat(formData.lat);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            errors.lat = 'Latitude must be between -90 and 90';
        }

        const lon = parseFloat(formData.lon);
        if (isNaN(lon) || lon < -180 || lon > 180) {
            errors.lon = 'Longitude must be between -180 and 180';
        }

        if (formData.website && !isValidUrl(formData.website)) {
            errors.website = 'Please enter a valid URL';
        }

        return errors;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                type: formData.type,
                state: formData.state,
                county: formData.county,
                lat: parseFloat(formData.lat),
                lon: parseFloat(formData.lon),
                geometry: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(formData.lon),
                        parseFloat(formData.lat)
                    ]
                },
                website: formData.website || null,
                ebirdHotspotIds: formData.ebirdHotspotIds
                    ? formData.ebirdHotspotIds
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                    : [],
                amenities: formData.amenities,
                isActive: formData.isActive
            };

            if (editMode) {
                await updateLocation(location._id, payload);
            } else {
                await createLocation(payload);
            }

            onSuccess();
        } catch (err) {
            console.error('Error saving location:', err);
            setError(err.message || 'Failed to save location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* Basic Information */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Basic Information
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Location Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={Boolean(formErrors.name)}
                        helperText={formErrors.name}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl
                        fullWidth
                        required
                        error={Boolean(formErrors.type)}
                    >
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={formData.type}
                            label="Type"
                            onChange={handleChange('type')}
                        >
                            {LOCATION_TYPES.map((type) => (
                                <MenuItem
                                    key={type}
                                    value={type}
                                    sx={{ textTransform: 'capitalize' }}
                                >
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.type && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 1.75 }}
                            >
                                {formErrors.type}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={handleActiveChange}
                                color="primary"
                            />
                        }
                        label="Active"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        multiline
                        rows={6}
                        label="Description"
                        value={formData.description}
                        onChange={handleChange('description')}
                        error={Boolean(formErrors.description)}
                        helperText={
                            formErrors.description ||
                            `${formData.description.length} characters (minimum 100)`
                        }
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Location Details */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Location Details
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    <FormControl
                        fullWidth
                        required
                        error={Boolean(formErrors.state)}
                    >
                        <InputLabel>State</InputLabel>
                        <Select
                            value={formData.state}
                            label="State"
                            onChange={handleChange('state')}
                        >
                            {stateOptions.map((state) => (
                                <MenuItem key={state.value} value={state.value}>
                                    {state.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.state && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 1.75 }}
                            >
                                {formErrors.state}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl
                        fullWidth
                        required
                        error={Boolean(formErrors.county)}
                        disabled={!formData.state}
                    >
                        <InputLabel>County</InputLabel>
                        <Select
                            value={formData.county}
                            label="County"
                            onChange={handleChange('county')}
                        >
                            {filteredCountyOptions.map((county) => (
                                <MenuItem
                                    key={county.value}
                                    value={county.label}
                                >
                                    {county.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.county && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, ml: 1.75 }}
                            >
                                {formErrors.county}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={5}>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Latitude"
                        value={formData.lat}
                        onChange={handleChange('lat')}
                        error={Boolean(formErrors.lat)}
                        helperText={formErrors.lat || '-90 to 90'}
                        inputProps={{ step: 'any', min: -90, max: 90 }}
                    />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Longitude"
                        value={formData.lon}
                        onChange={handleChange('lon')}
                        error={Boolean(formErrors.lon)}
                        helperText={formErrors.lon || '-180 to 180'}
                        inputProps={{ step: 'any', min: -180, max: 180 }}
                    />
                </Grid>

                <Grid item xs={12} sm={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={
                            fetchingLocation ? (
                                <CircularProgress size={16} />
                            ) : (
                                <MyLocationIcon />
                            )
                        }
                        onClick={handleUseMyLocation}
                        disabled={fetchingLocation}
                        sx={{ height: 56 }}
                    >
                        {fetchingLocation ? 'Getting...' : 'My Location'}
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Additional Information */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Additional Information
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Website"
                        value={formData.website}
                        onChange={handleChange('website')}
                        error={Boolean(formErrors.website)}
                        helperText={
                            formErrors.website ||
                            'Official website URL (optional)'
                        }
                        placeholder="https://example.com"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="eBird Hotspot IDs"
                        value={formData.ebirdHotspotIds}
                        onChange={handleChange('ebirdHotspotIds')}
                        helperText="Comma-separated list of eBird hotspot IDs (optional)"
                        placeholder="L123456, L789012"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle2"
                        sx={{ mb: 1, fontWeight: 600 }}
                    >
                        Amenities
                    </Typography>
                    <FormGroup>
                        <Grid container>
                            {AMENITIES.map((amenity) => (
                                <Grid item xs={12} sm={6} md={4} key={amenity}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.amenities.includes(
                                                    amenity
                                                )}
                                                onChange={handleAmenityChange(
                                                    amenity
                                                )}
                                            />
                                        }
                                        label={
                                            amenity.charAt(0).toUpperCase() +
                                            amenity.slice(1)
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormGroup>
                </Grid>
            </Grid>

            {/* Actions */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    mt: 4
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={16} />}
                >
                    {loading
                        ? 'Saving...'
                        : editMode
                          ? 'Update Location'
                          : 'Create Location'}
                </Button>
            </Box>
        </Box>
    );
};

export default LocationForm;
