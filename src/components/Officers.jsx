import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Container } from '@mui/material'
import ContactTile from './ContactTile'
import { getOfficers } from '../services/restdbService'
import imgScott from '../resources/photos/scott_byrd.jpg?url'

export default function Officers() {
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOfficers()
      .then(data => {
        // Map API response to ContactTile format
        const mappedOfficers = (data || []).map(officer => ({
          Name: `${officer.first} ${officer.last}`,
          Title: officer.position,
          Phone: officer.phone,
          Email: officer.email,
          Picture: officer.picture === 'imgScott' ? imgScott : officer.picture
        }))
        
        // Sort officers in specified order
        const positionOrder = ['President', 'Treasurer', 'Trip Coordinator', 'Web Master']
        const sortedOfficers = mappedOfficers.sort((a, b) => {
          const aIndex = positionOrder.indexOf(a.Title)
          const bIndex = positionOrder.indexOf(b.Title)
          
          // If position not found in order, put at end
          if (aIndex === -1) return 1
          if (bIndex === -1) return -1
          
          return aIndex - bIndex
        })
        
        setOfficers(sortedOfficers)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching officers:', error)
        // Fallback to hardcoded data if API fails
        setOfficers([{
          Name: 'Scott Byrd',
          Title: 'Web Master',
          Phone: '5406568078',
          Email: 'sbyrd1968@verizon.net',
          Picture: imgScott
        }])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f7faf7', minHeight: '100vh', py: 6 }}>
        <Container maxWidth="lg">
          <Typography>Loading officers...</Typography>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f7faf7', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Club Officers
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Meet the dedicated volunteers who help lead the Fredericksburg Birding Club
          </Typography>
        </Box>

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
      </Container>
    </Box>
  )
}
