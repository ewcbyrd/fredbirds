import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { getNearbyObservations } from '../../services/ebirdService';
import { format } from 'date-fns';

const RecentSightingsSection = ({ location }) => {
    const [sightings, setSightings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!location || !location.lat || !location.lon) {
            setLoading(false);
            return;
        }

        const fetchSightings = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch nearby sightings using location coordinates
                const result = await getNearbyObservations({
                    lat: location.lat,
                    long: location.lon,
                    dist: 3, // 3 km radius to focus on this specific location
                    daysBack: 14
                });

                const allSightings = result || [];

                // Deduplicate by species and sort by date
                const speciesMap = new Map();
                allSightings.forEach((sighting) => {
                    const speciesCode =
                        sighting.speciesCode || sighting.comName;
                    const existing = speciesMap.get(speciesCode);

                    if (
                        !existing ||
                        new Date(sighting.obsDt) > new Date(existing.obsDt)
                    ) {
                        speciesMap.set(speciesCode, {
                            speciesCode,
                            comName: sighting.comName,
                            sciName: sighting.sciName,
                            howMany: sighting.howMany || 'X',
                            obsDt: sighting.obsDt,
                            locName: sighting.locName
                        });
                    }
                });

                // Convert to array and sort by date (most recent first)
                const sortedSightings = Array.from(speciesMap.values())
                    .sort((a, b) => new Date(b.obsDt) - new Date(a.obsDt))
                    .slice(0, 20); // Limit to top 20 most recent

                setSightings(sortedSightings);
            } catch (err) {
                console.error('Error fetching eBird sightings:', err);
                setError(err.message || 'Failed to load recent sightings');
            } finally {
                setLoading(false);
            }
        };

        fetchSightings();
    }, [location._id, location.lat, location.lon]);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Recent Bird Sightings
            </Typography>

            {loading ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                    <CircularProgress
                        size={40}
                        sx={{ color: 'primary.main', mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        Loading recent sightings from eBird...
                    </Typography>
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            ) : sightings.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No recent sightings found for this location in the past 14
                    days.
                </Alert>
            ) : (
                <>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        {sightings.length} species observed in the past 14 days
                        (showing most recent)
                    </Typography>
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            maxHeight: 400,
                            overflow: 'auto'
                        }}
                    >
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        Species
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: 'grey.50',
                                            width: 100
                                        }}
                                    >
                                        Count
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            fontWeight: 700,
                                            bgcolor: 'grey.50',
                                            width: 120
                                        }}
                                    >
                                        Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sightings.map((sighting, index) => {
                                    const date = new Date(sighting.obsDt);
                                    const isRecent =
                                        (new Date() - date) /
                                            (1000 * 60 * 60 * 24) <=
                                        2;

                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:nth-of-type(odd)': {
                                                    bgcolor: 'grey.25'
                                                },
                                                '&:hover': {
                                                    bgcolor:
                                                        'rgba(45, 80, 22, 0.04)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 600 }}
                                                    >
                                                        {sighting.comName}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            fontStyle: 'italic'
                                                        }}
                                                    >
                                                        {sighting.sciName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={sighting.howMany}
                                                    size="small"
                                                    sx={{
                                                        minWidth: 40,
                                                        height: 24,
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: isRecent
                                                            ? 'success.main'
                                                            : 'text.secondary',
                                                        fontWeight: isRecent
                                                            ? 600
                                                            : 400
                                                    }}
                                                >
                                                    {format(
                                                        date,
                                                        'MMM d, yyyy'
                                                    )}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                    >
                        Recent sightings within 3 km of this location. Data
                        provided by{' '}
                        <a
                            href="https://ebird.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'inherit',
                                textDecoration: 'underline'
                            }}
                        >
                            eBird
                        </a>
                        .
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default RecentSightingsSection;
