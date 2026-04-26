import React, { useMemo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WcIcon from '@mui/icons-material/Wc';
import HikingIcon from '@mui/icons-material/Hiking';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import AccessibleIcon from '@mui/icons-material/Accessible';
import NearMeIcon from '@mui/icons-material/NearMe';

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

const LocationCard = ({ location, userLocation, onClick }) => {
    const {
        name,
        type,
        county,
        state,
        description,
        amenities = [],
        lat,
        lon
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

    // Truncate description to 2 lines
    const truncatedDescription = description
        ? description.length > 150
            ? description.substring(0, 150) + '...'
            : description
        : 'No description available';

    // Show max 6 amenity icons
    const displayedAmenities = amenities.slice(0, 6);
    const remainingCount = amenities.length - 6;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
            }}
            onClick={() => onClick(location)}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Header: Type Badge & Distance */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
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
                    {distance && (
                        <Chip
                            icon={<NearMeIcon sx={{ fontSize: 16 }} />}
                            label={`${distance} mi`}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main'
                            }}
                        />
                    )}
                </Box>

                {/* Location Name */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 0.5,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {name}
                </Typography>

                {/* County, State */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    {county}, {state}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5
                    }}
                >
                    {truncatedDescription}
                </Typography>

                {/* Amenities Icons */}
                {displayedAmenities.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}
                    >
                        {displayedAmenities.map((amenity, index) => {
                            const amenityConfig =
                                amenityIcons[amenity.toLowerCase()];
                            if (!amenityConfig) return null;

                            const IconComponent = amenityConfig.icon;
                            return (
                                <Tooltip
                                    key={index}
                                    title={amenityConfig.label}
                                    arrow
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            bgcolor: 'grey.100',
                                            color: 'primary.main'
                                        }}
                                    >
                                        <IconComponent sx={{ fontSize: 18 }} />
                                    </Box>
                                </Tooltip>
                            );
                        })}
                        {remainingCount > 0 && (
                            <Tooltip title={`+${remainingCount} more`} arrow>
                                <Chip
                                    label={`+${remainingCount}`}
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem'
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(location);
                    }}
                    sx={{
                        bgcolor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.dark'
                        }
                    }}
                >
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default LocationCard;
