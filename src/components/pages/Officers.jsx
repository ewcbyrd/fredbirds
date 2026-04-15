import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ContactTile from '../layout/ContactTile';
import { getOfficers } from '../../services/restdbService';
import { getPictureUrl } from '../../services/cloudinaryService';
import PageContainer from '../common/PageContainer';

export default function Officers() {
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOfficers()
            .then((data) => {
                // Map API response to ContactTile format
                const mappedOfficers = (data || []).map((officer) => ({
                    Name: `${officer.first} ${officer.last}`,
                    Title: officer.position,
                    // Only include email if member has explicitly allowed it to be shown
                    Email: officer.showEmail === true ? officer.email : null,
                    // Only include phone if member has explicitly allowed it to be shown
                    Phone: officer.showPhone === true ? officer.phone : null,
                    Picture: getPictureUrl(officer.picture)
                }));

                // Sort officers in specified order
                const positionOrder = [
                    'President',
                    'Treasurer',
                    'Trip Coordinator',
                    'Web Master'
                ];
                const sortedOfficers = mappedOfficers.sort((a, b) => {
                    const aIndex = positionOrder.indexOf(a.Title);
                    const bIndex = positionOrder.indexOf(b.Title);

                    // If position not found in order, put at end
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;

                    return aIndex - bIndex;
                });

                setOfficers(sortedOfficers);
                setLoading(false);
            })
            .catch(() => {
                // Fallback to empty list if API fails - no hardcoded personal data
                setOfficers([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <PageContainer>
                <Typography>Loading officers...</Typography>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
            >
                Club Officers
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                Meet the dedicated volunteers who help lead the Fredericksburg
                Birding Club
            </Typography>

            {/* Officers Grid */}
            <Grid container spacing={3} justifyContent="center">
                {officers.map((officer, index) => (
                    <Grid item xs={12} key={index}>
                        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                            <ContactTile contact={officer} />
                        </Box>
                    </Grid>
                ))}
                {officers.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No officers information available at this time.
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </PageContainer>
    );
}
