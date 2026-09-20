import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet markers in React
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Marker colors by type
const markerColors = {
    refuge: '#2d5016', // primary.main (dark green)
    preserve: '#4a7c59', // primary.light (light green)
    park: '#0288d1', // info.main (blue)
    trail: '#c17817', // secondary.main (golden amber)
    monument: '#d32f2f', // error.main (red)
    road: '#757575' // text.secondary (gray)
};

// Create custom colored marker icons
const createColoredIcon = (color) => {
    const svgIcon = `
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z" 
                  fill="${color}" 
                  stroke="#fff" 
                  stroke-width="2"/>
            <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
        </svg>
    `;
    return L.divIcon({
        html: svgIcon,
        className: 'custom-marker',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
};

// Create icons for each type
const markerIcons = Object.keys(markerColors).reduce((acc, type) => {
    acc[type] = createColoredIcon(markerColors[type]);
    return acc;
}, {});

// User location marker (blue pulsing dot)
const userLocationIcon = L.divIcon({
    html: `
        <div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #0288d1;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(2, 136, 209, 0.5);
            animation: pulse 2s infinite;
        "></div>
        <style>
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(2, 136, 209, 0.7);
                }
                70% {
                    box-shadow: 0 0 0 10px rgba(2, 136, 209, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(2, 136, 209, 0);
                }
            }
        </style>
    `,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

// Helper component to update map view bounds when locations change
const MapBounds = ({ locations, userLocation }) => {
    const map = useMap();

    useEffect(() => {
        const allPoints = [];

        // Add location markers
        locations.forEach((loc) => {
            if (loc.lat && loc.lon) {
                allPoints.push([loc.lat, loc.lon]);
            }
        });

        // Add user location if available
        if (userLocation) {
            allPoints.push([userLocation.lat, userLocation.lng]);
        }

        if (allPoints.length > 0) {
            const bounds = L.latLngBounds(allPoints);
            // Add padding so markers aren't on the very edge
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    }, [map, locations, userLocation]);

    return null;
};

const LocationMap = ({ locations, userLocation, onLocationClick }) => {
    // Filter out locations without coordinates
    const validLocations = useMemo(
        () =>
            locations
                .filter(
                    (loc) =>
                        loc.lat !== undefined &&
                        loc.lat !== '' &&
                        !isNaN(parseFloat(loc.lat)) &&
                        loc.lon !== undefined &&
                        loc.lon !== '' &&
                        !isNaN(parseFloat(loc.lon))
                )
                .map((loc) => ({
                    ...loc,
                    lat: parseFloat(loc.lat),
                    lon: parseFloat(loc.lon)
                })),
        [locations]
    );

    // Center on first location if available, otherwise Fredericksburg
    const center =
        validLocations.length > 0
            ? [validLocations[0].lat, validLocations[0].lon]
            : [38.3032, -77.4605];

    return (
        <Box>
            {/* Map Legend */}
            <Card
                sx={{
                    p: 2,
                    mb: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                >
                    Map Legend
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {Object.entries(markerColors).map(([type, color]) => (
                        <Box
                            key={type}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: color,
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: 'capitalize',
                                    fontWeight: 500
                                }}
                            >
                                {type}
                            </Typography>
                        </Box>
                    ))}
                    {userLocation && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: '#0288d1',
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 500 }}
                            >
                                Your Location
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Card>

            {/* Map */}
            <Card
                sx={{
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
            >
                <Box
                    sx={{
                        height: 600,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <MapContainer
                        center={center}
                        zoom={10}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Location Markers */}
                        {validLocations.map((loc) => {
                            const markerIcon =
                                markerIcons[loc.type] || markerIcons.road;
                            return (
                                <Marker
                                    key={loc._id}
                                    position={[loc.lat, loc.lon]}
                                    icon={markerIcon}
                                    eventHandlers={{
                                        click: () => onLocationClick(loc)
                                    }}
                                >
                                    <Popup>
                                        <Box sx={{ p: 0.5, maxWidth: 220 }}>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight="bold"
                                                sx={{ mb: 0.5 }}
                                            >
                                                {loc.name}
                                            </Typography>
                                            <Chip
                                                label={loc.type}
                                                size="small"
                                                sx={{
                                                    bgcolor:
                                                        markerColors[
                                                            loc.type
                                                        ] || markerColors.road,
                                                    color: 'white',
                                                    textTransform: 'capitalize',
                                                    mb: 1,
                                                    height: 20,
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                display="block"
                                                color="text.secondary"
                                            >
                                                {loc.county}, {loc.state}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                display="block"
                                                sx={{
                                                    mt: 1,
                                                    color: 'primary.main',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                                onClick={() =>
                                                    onLocationClick(loc)
                                                }
                                            >
                                                View Details →
                                            </Typography>
                                        </Box>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {/* User Location Marker */}
                        {userLocation && (
                            <Marker
                                position={[userLocation.lat, userLocation.lng]}
                                icon={userLocationIcon}
                            >
                                <Popup>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                    >
                                        Your Location
                                    </Typography>
                                </Popup>
                            </Marker>
                        )}

                        <MapBounds
                            locations={validLocations}
                            userLocation={userLocation}
                        />
                    </MapContainer>
                </Box>
            </Card>
        </Box>
    );
};

export default LocationMap;
