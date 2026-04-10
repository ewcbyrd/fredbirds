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
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { getLocations } from '../../services/restdbService';
import LocationMap from './LocationMap';
import LocationList from './LocationList';
import LocationDetailsDialog from './LocationDetailsDialog';
import LocationFormModal from './LocationFormModal';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [viewMode, setViewMode] = useState('map');
    const [searchQuery, setSearchQuery] = useState('');
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

    // Filter locations based on search query
    const filteredLocations = useMemo(() => {
        if (!searchQuery.trim()) {
            return locations;
        }

        const query = searchQuery.toLowerCase();
        return locations.filter((loc) => {
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
    }, [locations, searchQuery]);

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
