import React, { useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MapIcon from '@mui/icons-material/Map';
import NearMeIcon from '@mui/icons-material/NearMe';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WcIcon from '@mui/icons-material/Wc';
import HikingIcon from '@mui/icons-material/Hiking';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import AccessibleIcon from '@mui/icons-material/Accessible';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import RecentSightingsSection from './RecentSightingsSection';

// Fix for default Leaflet markers in React
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Amenity icon mapping
const amenityIcons = {
    parking: { icon: LocalParkingIcon, label: 'Parking' },
    restrooms: { icon: WcIcon, label: 'Restrooms' },
    trails: { icon: HikingIcon, label: 'Trails' },
    'observation towers': { icon: VisibilityIcon, label: 'Observation Towers' },
    'auto tour': { icon: DirectionsCarIcon, label: 'Auto Tour' },
    'visitor center': { icon: InfoIcon, label: 'Visitor Center' },
    accessible: { icon: AccessibleIcon, label: 'Accessible' }
};

// Type badge colors
const typeBadgeColors = {
    refuge: { bg: 'primary.main', text: 'white' },
    preserve: { bg: 'primary.light', text: 'white' },
    park: { bg: 'info.main', text: 'white' },
    trail: { bg: 'secondary.main', text: 'white' },
    monument: { bg: 'error.main', text: 'white' },
    road: { bg: 'grey.500', text: 'white' }
};

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const LocationDetailsDialog = ({
    location,
    open,
    onClose,
    userLocation,
    onEdit,
    onDelete,
    onRefresh
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    if (!location) return null;

    const {
        name,
        type,
        county,
        state,
        description,
        amenities = [],
        lat,
        lon,
        website,
        ebirdHotspotIds = []
    } = location;

    // Calculate distance if user location is available
    const distance = useMemo(() => {
        if (!userLocation || !lat || !lon) return null;
        const dist = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            lat,
            lon
        );
        return dist.toFixed(1);
    }, [userLocation, lat, lon]);

    // Get type badge styling
    const typeBadge = typeBadgeColors[type] || typeBadgeColors.road;

    // Google Maps link
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 3
                }
            }}
        >
            {/* Dialog Header */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    pb: 2
                }}
            >
                <Box sx={{ flex: 1, pr: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {name}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}
                    >
                        <Chip
                            label={type}
                            size="small"
                            sx={{
                                bgcolor: typeBadge.bg,
                                color: typeBadge.text,
                                fontWeight: 600,
                                textTransform: 'capitalize'
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {county}, {state}
                        </Typography>
                        {distance && (
                            <Chip
                                icon={<NearMeIcon sx={{ fontSize: 16 }} />}
                                label={`${distance} mi away`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main'
                                }}
                            />
                        )}
                    </Box>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* Dialog Content */}
            <DialogContent sx={{ pt: 3 }}>
                {/* Embedded Map */}
                {lat && lon && (
                    <Box
                        sx={{
                            height: 300,
                            width: '100%',
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 3,
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
                    >
                        <MapContainer
                            center={[lat, lon]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[lat, lon]}>
                                <Popup>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                    >
                                        {name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        display="block"
                                    >
                                        {county}, {state}
                                    </Typography>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </Box>
                )}

                {/* About This Location */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        About This Location
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.75, whiteSpace: 'pre-line' }}
                    >
                        {description || 'No description available.'}
                    </Typography>
                </Box>

                {/* Location Details */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Location Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Coordinates
                            </Typography>
                            <Typography variant="body1">
                                {lat?.toFixed(6)}, {lon?.toFixed(6)}
                            </Typography>
                        </Grid>
                        {distance && (
                            <Grid item xs={12} sm={6}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Distance from You
                                </Typography>
                                <Typography variant="body1">
                                    {distance} miles
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* Amenities */}
                {amenities.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, mb: 2 }}
                        >
                            Amenities
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap'
                            }}
                        >
                            {amenities.map((amenity, index) => {
                                const amenityConfig =
                                    amenityIcons[amenity.toLowerCase()];
                                if (!amenityConfig) {
                                    return (
                                        <Chip
                                            key={index}
                                            label={amenity}
                                            size="medium"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    );
                                }

                                const IconComponent = amenityConfig.icon;
                                return (
                                    <Chip
                                        key={index}
                                        icon={<IconComponent />}
                                        label={amenityConfig.label}
                                        size="medium"
                                        sx={{
                                            bgcolor: 'grey.100',
                                            '& .MuiChip-icon': {
                                                color: 'primary.main'
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {/* External Links */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        External Links
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {website && (
                            <Button
                                variant="outlined"
                                startIcon={<OpenInNewIcon />}
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Official Website
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<MapIcon />}
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Google Maps
                        </Button>
                        {ebirdHotspotIds.length > 0 &&
                            ebirdHotspotIds.map((hotspotId, index) => (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    startIcon={<OpenInNewIcon />}
                                    href={`https://ebird.org/hotspot/${hotspotId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    eBird Hotspot{' '}
                                    {ebirdHotspotIds.length > 1
                                        ? `#${index + 1}`
                                        : ''}
                                </Button>
                            ))}
                    </Box>
                </Box>

                {/* Recent Sightings from eBird */}
                <RecentSightingsSection location={location} />
            </DialogContent>

            <Divider />

            {/* Dialog Actions */}
            <DialogActions
                sx={{ px: 3, py: 2, justifyContent: 'space-between' }}
            >
                <Box>
                    {onEdit && (
                        <Button
                            startIcon={<EditIcon />}
                            onClick={() => onEdit(location)}
                            sx={{ mr: 1 }}
                        >
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => onDelete(location._id)}
                            color="error"
                        >
                            Delete
                        </Button>
                    )}
                </Box>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LocationDetailsDialog;
