import React, { useState, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LocationCard from './LocationCard';

const LocationList = ({ locations, userLocation, onLocationClick }) => {
    const [sortBy, setSortBy] = useState('name');

    // Calculate distance for each location if user location is available
    const locationsWithDistance = useMemo(() => {
        if (!userLocation) return locations;

        return locations.map((loc) => {
            if (!loc.lat || !loc.lon) {
                return { ...loc, distance: null };
            }

            const R = 3959; // Earth's radius in miles
            const dLat = ((loc.lat - userLocation.lat) * Math.PI) / 180;
            const dLon = ((loc.lon - userLocation.lng) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((userLocation.lat * Math.PI) / 180) *
                    Math.cos((loc.lat * Math.PI) / 180) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            return { ...loc, distance };
        });
    }, [locations, userLocation]);

    // Sort locations based on selected sort option
    const sortedLocations = useMemo(() => {
        const sorted = [...locationsWithDistance];

        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '')
                );
                break;
            case 'distance':
                if (userLocation) {
                    sorted.sort((a, b) => {
                        if (a.distance === null) return 1;
                        if (b.distance === null) return -1;
                        return a.distance - b.distance;
                    });
                }
                break;
            case 'type':
                sorted.sort((a, b) => {
                    const typeCompare = (a.type || '').localeCompare(
                        b.type || ''
                    );
                    if (typeCompare !== 0) return typeCompare;
                    return (a.name || '').localeCompare(b.name || '');
                });
                break;
            default:
                break;
        }

        return sorted;
    }, [locationsWithDistance, sortBy, userLocation]);

    return (
        <Box>
            {/* Sort Controls */}
            <Card
                sx={{ p: 2, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="sort-by-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="name">Name (A-Z)</MenuItem>
                            {userLocation && (
                                <MenuItem value="distance">
                                    Distance (Near to Far)
                                </MenuItem>
                            )}
                            <MenuItem value="type">Type</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Card>

            {/* Location Grid */}
            <Grid container spacing={3}>
                {sortedLocations.map((location) => (
                    <Grid item xs={12} md={6} lg={4} key={location._id}>
                        <LocationCard
                            location={location}
                            userLocation={userLocation}
                            onClick={onLocationClick}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default LocationList;
