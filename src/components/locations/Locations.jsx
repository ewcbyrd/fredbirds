import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Collapse from '@mui/material/Collapse';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ClearIcon from '@mui/icons-material/Clear';
import { getLocations } from '../../services/restdbService';
import LocationMap from './LocationMap';
import LocationList from './LocationList';
import LocationDetailsDialog from './LocationDetailsDialog';
import LocationFormModal from './LocationFormModal';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [viewMode, setViewMode] = useState('map');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        types: [],
        states: [],
        amenities: [],
        maxDistance: null
    });
    const [showFilters, setShowFilters] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const { isOfficer, isAdmin } = useUserRole();
    const navigate = useNavigate();

    // Request geolocation permission on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    console.log(
                        'Geolocation permission denied or unavailable:',
                        err
                    );
                }
            );
        }
    }, []);

    // Fetch locations on mount
    const loadLocations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLocations();
            // Filter to only active locations for public view
            const activeLocations = data.filter(
                (loc) => loc.isActive !== false
            );
            setLocations(activeLocations);
        } catch (err) {
            console.error('Error loading locations:', err);
            setError(err.message || 'Failed to load locations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLocations();
    }, [loadLocations]);

    // Filter locations based on search query and filters
    const filteredLocations = useMemo(() => {
        let results = locations;

        // Text search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter((loc) => {
                const name = (loc.name || '').toLowerCase();
                const description = (loc.description || '').toLowerCase();
                const county = (loc.county || '').toLowerCase();
                const state = (loc.state || '').toLowerCase();
                const type = (loc.type || '').toLowerCase();

                return (
                    name.includes(query) ||
                    description.includes(query) ||
                    county.includes(query) ||
                    state.includes(query) ||
                    type.includes(query)
                );
            });
        }

        // Type filter
        if (filters.types.length > 0) {
            results = results.filter((loc) => filters.types.includes(loc.type));
        }

        // State filter
        if (filters.states.length > 0) {
            results = results.filter((loc) =>
                filters.states.includes(loc.state)
            );
        }

        // Amenities filter (location must have ALL selected amenities)
        if (filters.amenities.length > 0) {
            results = results.filter((loc) => {
                const locAmenities = loc.amenities || [];
                return filters.amenities.every((amenity) =>
                    locAmenities.includes(amenity)
                );
            });
        }

        // Distance filter (only if user location is available)
        if (filters.maxDistance && userLocation) {
            results = results.filter((loc) => {
                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    loc.lat,
                    loc.lon
                );
                return distance <= filters.maxDistance;
            });
        }

        return results;
    }, [locations, searchQuery, filters, userLocation]);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            types: [],
            states: [],
            amenities: [],
            maxDistance: null
        });
    };

    const activeFilterCount =
        filters.types.length +
        filters.states.length +
        filters.amenities.length +
        (filters.maxDistance ? 1 : 0);

    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setShowDetailsDialog(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsDialog(false);
        setSelectedLocation(null);
    };

    const handleAddLocation = () => {
        setEditingLocation(null);
        setShowFormModal(true);
    };

    const handleEditLocation = (location) => {
        setEditingLocation(location);
        setShowFormModal(true);
        setShowDetailsDialog(false);
    };

    const handleDeleteLocation = async (locationId) => {
        // Will implement in Phase 6
        console.log('Delete location:', locationId);
    };

    const handleFormSuccess = () => {
        setShowFormModal(false);
        setEditingLocation(null);
        loadLocations();
    };

    const handleFormClose = () => {
        setShowFormModal(false);
        setEditingLocation(null);
    };

    // Stats for header cards
    const totalLocations = locations.length;
    const statesCount = [...new Set(locations.map((loc) => loc.state))].length;
    const typesCount = [...new Set(locations.map((loc) => loc.type))].length;

    const canManageLocations = isOfficer || isAdmin;

    return (
        <Box>
            {/* Header Section */}
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: { xs: 6, md: 8 },
                    mb: 6,
                    background: (theme) =>
                        `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        Birding Locations
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ maxWidth: 800, opacity: 0.9, fontWeight: 400 }}
                    >
                        Discover premier birding destinations in the region and
                        beyond. Explore parks, preserves, refuges, and trails
                        where you can observe hundreds of species throughout the
                        year.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 8 }}>
                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} sm={4}>
                        <Card
                            sx={{
                                p: 3,
                                height: '100%',
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderLeft: '6px solid',
                                borderLeftColor: 'primary.main',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'primary.main',
                                        mr: 2
                                    }}
                                >
                                    {totalLocations}
                                </Typography>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        lineHeight: 1.2,
                                        color: 'text.secondary'
                                    }}
                                >
                                    Total
                                    <br />
                                    Locations
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Premier birding destinations
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card
                            sx={{
                                p: 3,
                                height: '100%',
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderLeft: '6px solid',
                                borderLeftColor: 'info.main',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'info.main',
                                        mr: 2
                                    }}
                                >
                                    {statesCount}
                                </Typography>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        lineHeight: 1.2,
                                        color: 'text.secondary'
                                    }}
                                >
                                    States
                                    <br />
                                    Covered
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Locations across the region
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card
                            sx={{
                                p: 3,
                                height: '100%',
                                background:
                                    'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderLeft: '6px solid',
                                borderLeftColor: 'secondary.main',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1
                                }}
                            >
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'secondary.main',
                                        mr: 2
                                    }}
                                >
                                    {typesCount}
                                </Typography>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        lineHeight: 1.2,
                                        color: 'text.secondary'
                                    }}
                                >
                                    Location
                                    <br />
                                    Types
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Parks, preserves, refuges & more
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>

                {/* Controls Bar */}
                <Card
                    sx={{
                        p: 3,
                        mb: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                            alignItems: { xs: 'stretch', md: 'center' },
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* Search Bar */}
                        <TextField
                            placeholder="Search locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ flex: 1, maxWidth: { md: 400 } }}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'stretch'
                            }}
                        >
                            {/* Filter Toggle Button */}
                            <Button
                                variant={showFilters ? 'contained' : 'outlined'}
                                startIcon={<FilterListIcon />}
                                onClick={() => setShowFilters(!showFilters)}
                                sx={{ minWidth: 120 }}
                            >
                                Filters
                                {activeFilterCount > 0 && (
                                    <Chip
                                        label={activeFilterCount}
                                        size="small"
                                        sx={{
                                            ml: 1,
                                            height: 20,
                                            bgcolor: 'white',
                                            color: 'primary.main'
                                        }}
                                    />
                                )}
                            </Button>

                            {/* View Mode Toggle */}
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={handleViewModeChange}
                                aria-label="view mode"
                            >
                                <ToggleButton value="map" aria-label="map view">
                                    <MapIcon sx={{ mr: 1 }} />
                                    Map
                                </ToggleButton>
                                <ToggleButton
                                    value="list"
                                    aria-label="list view"
                                >
                                    <ViewListIcon sx={{ mr: 1 }} />
                                    List
                                </ToggleButton>
                            </ToggleButtonGroup>

                            {/* Add Location Button (Officer/Admin only) */}
                            {canManageLocations && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddLocationIcon />}
                                    onClick={handleAddLocation}
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        '&:hover': {
                                            bgcolor: 'secondary.dark'
                                        }
                                    }}
                                >
                                    Add Location
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Collapsible Filter Panel */}
                    <Collapse in={showFilters}>
                        <Box
                            sx={{
                                mt: 3,
                                pt: 3,
                                borderTop: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Grid container spacing={2}>
                                {/* Type Filter */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            multiple
                                            value={filters.types}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'types',
                                                    e.target.value
                                                )
                                            }
                                            input={
                                                <OutlinedInput label="Type" />
                                            }
                                            renderValue={(selected) =>
                                                selected
                                                    .map(
                                                        (t) =>
                                                            t
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            t.slice(1)
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            <MenuItem value="monument">
                                                Monument
                                            </MenuItem>
                                            <MenuItem value="park">
                                                Park
                                            </MenuItem>
                                            <MenuItem value="preserve">
                                                Preserve
                                            </MenuItem>
                                            <MenuItem value="refuge">
                                                Refuge
                                            </MenuItem>
                                            <MenuItem value="road">
                                                Road
                                            </MenuItem>
                                            <MenuItem value="trail">
                                                Trail
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* State Filter */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            multiple
                                            value={filters.states}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'states',
                                                    e.target.value
                                                )
                                            }
                                            input={
                                                <OutlinedInput label="State" />
                                            }
                                            renderValue={(selected) =>
                                                selected.join(', ')
                                            }
                                        >
                                            <MenuItem value="VA">
                                                Virginia
                                            </MenuItem>
                                            <MenuItem value="DE">
                                                Delaware
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Amenities Filter */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Amenities</InputLabel>
                                        <Select
                                            multiple
                                            value={filters.amenities}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'amenities',
                                                    e.target.value
                                                )
                                            }
                                            input={
                                                <OutlinedInput label="Amenities" />
                                            }
                                            renderValue={(selected) =>
                                                `${selected.length} selected`
                                            }
                                        >
                                            <MenuItem value="parking">
                                                Parking
                                            </MenuItem>
                                            <MenuItem value="restrooms">
                                                Restrooms
                                            </MenuItem>
                                            <MenuItem value="trails">
                                                Trails
                                            </MenuItem>
                                            <MenuItem value="observation towers">
                                                Observation Towers
                                            </MenuItem>
                                            <MenuItem value="auto tour">
                                                Auto Tour
                                            </MenuItem>
                                            <MenuItem value="visitor center">
                                                Visitor Center
                                            </MenuItem>
                                            <MenuItem value="accessible">
                                                Accessible
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Distance Filter */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Max Distance</InputLabel>
                                        <Select
                                            value={filters.maxDistance || ''}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'maxDistance',
                                                    e.target.value || null
                                                )
                                            }
                                            label="Max Distance"
                                            disabled={!userLocation}
                                        >
                                            <MenuItem value="">
                                                <em>Any</em>
                                            </MenuItem>
                                            <MenuItem value={25}>
                                                25 km (~15 mi)
                                            </MenuItem>
                                            <MenuItem value={50}>
                                                50 km (~30 mi)
                                            </MenuItem>
                                            <MenuItem value={100}>
                                                100 km (~60 mi)
                                            </MenuItem>
                                            <MenuItem value={200}>
                                                200 km (~125 mi)
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    {!userLocation && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ mt: 0.5, display: 'block' }}
                                        >
                                            Enable location to filter by
                                            distance
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            {/* Clear Filters Button */}
                            {activeFilterCount > 0 && (
                                <Box sx={{ mt: 2, textAlign: 'right' }}>
                                    <Button
                                        size="small"
                                        startIcon={<ClearIcon />}
                                        onClick={handleClearFilters}
                                    >
                                        Clear All Filters
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Collapse>

                    {/* Search Results Count */}
                    {searchQuery && (
                        <Box sx={{ mt: 2 }}>
                            <Chip
                                label={`${filteredLocations.length} location${filteredLocations.length !== 1 ? 's' : ''} found`}
                                color="primary"
                                size="small"
                            />
                        </Box>
                    )}
                </Card>

                {/* Main Content Area */}
                {loading ? (
                    <Box sx={{ py: 12, textAlign: 'center' }}>
                        <CircularProgress
                            size={60}
                            sx={{ color: 'primary.main', mb: 3 }}
                        />
                        <Typography variant="h6" color="text.secondary">
                            Loading birding locations...
                        </Typography>
                    </Box>
                ) : filteredLocations.length === 0 ? (
                    <Card
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            gutterBottom
                        >
                            No locations found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery
                                ? 'Try adjusting your search terms'
                                : 'No birding locations are currently available'}
                        </Typography>
                    </Card>
                ) : viewMode === 'map' ? (
                    <LocationMap
                        locations={filteredLocations}
                        userLocation={userLocation}
                        onLocationClick={handleLocationClick}
                    />
                ) : (
                    <LocationList
                        locations={filteredLocations}
                        userLocation={userLocation}
                        onLocationClick={handleLocationClick}
                    />
                )}
            </Container>

            {/* Location Details Dialog */}
            {selectedLocation && (
                <LocationDetailsDialog
                    location={selectedLocation}
                    open={showDetailsDialog}
                    onClose={handleCloseDetails}
                    userLocation={userLocation}
                    onEdit={canManageLocations ? handleEditLocation : null}
                    onDelete={canManageLocations ? handleDeleteLocation : null}
                    onRefresh={loadLocations}
                />
            )}

            {/* Location Form Modal */}
            {canManageLocations && (
                <LocationFormModal
                    open={showFormModal}
                    onClose={handleFormClose}
                    location={editingLocation}
                    onSuccess={handleFormSuccess}
                />
            )}
        </Box>
    );
};

export default Locations;
