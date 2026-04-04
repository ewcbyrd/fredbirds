import React, { useMemo, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    useTheme
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default Leaflet markers in React
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
})

L.Marker.prototype.options.icon = DefaultIcon

// Helper component to update map view bounds when locations change
const MapBounds = ({ locations }) => {
    const map = useMap()

    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lon]))
            // Add padding so markers aren't on the very edge
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        }
    }, [map, locations])

    return null
}

const EventMap = ({ event, onEditLocation, canEdit }) => {
    const locations = event?.locations || []

    // Only valid locations with lat/lon
    // Include original index to allow editing correct item
    const validLocations = useMemo(() =>
        locations.map((loc, index) => ({ ...loc, originalIndex: index }))
            .filter(loc =>
                loc.lat !== undefined && loc.lat !== '' && !isNaN(parseFloat(loc.lat)) &&
                loc.lon !== undefined && loc.lon !== '' && !isNaN(parseFloat(loc.lon))
            ).map(loc => ({
                ...loc,
                lat: parseFloat(loc.lat),
                lon: parseFloat(loc.lon)
            })),
        [locations])

    // Center on Fredericksburg if no locations, or the first location
    const center = validLocations.length > 0
        ? [validLocations[0].lat, validLocations[0].lon]
        : [38.3032, -77.4605]

    return (
        <Box sx={{
            height: 400,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1 // Ensure clean stacking
        }}>
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

                {validLocations.map((loc, idx) => (
                    <Marker
                        key={idx}
                        position={[loc.lat, loc.lon]}
                    >
                        <Popup>
                            <Box sx={{ p: 0.5, maxWidth: 220 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {idx + 1}. {loc.name || 'Location'}
                                </Typography>
                                {loc.address && (
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {loc.address}
                                    </Typography>
                                )}
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'primary.main' }}>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lon}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                        Open in Google Maps
                                    </a>
                                </Typography>

                                {canEdit && (
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                        onClick={() => onEditLocation(loc.originalIndex)}
                                        sx={{
                                            mt: 1.5,
                                            fontSize: '0.75rem',
                                            textTransform: 'none',
                                            py: 0.5,
                                            width: '100%',
                                            variant: 'outlined'
                                        }}
                                        variant="outlined"
                                    >
                                        Edit Location
                                    </Button>
                                )}
                            </Box>
                        </Popup>
                    </Marker>
                ))}

                <MapBounds locations={validLocations} />
            </MapContainer>
        </Box>
    )
}

export default EventMap
