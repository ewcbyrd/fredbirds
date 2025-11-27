import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardMedia, Tabs, Tab } from '@mui/material'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getPhotos } from '../services/restdbService'
import { getCloudinaryUrl, transformations } from '../services/cloudinaryService'

export default function Photos() {
  const [index, setIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState(0)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const data = await getPhotos()
      
      // Transform API data to match component format
      const transformedPhotos = data
        .filter(photo => photo.cloudinary_public_id)
        .map(photo => ({
          src: getCloudinaryUrl(photo.cloudinary_public_id, transformations.optimized),
          category: (photo.category || 'people').toLowerCase(),
          title: photo.header || 'Photo',
          description: photo.description || ''
        }))
      
      setPhotos(transformedPhotos)
    } catch (error) {
      console.error('Error loading photos:', error)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }
  
  const categories = ['people', 'places', 'birds']
  const filteredPhotos = photos.filter(photo => photo.category === categories[activeTab])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
          Photo Gallery
        </Typography>
        <Typography color="text.secondary">Loading photos...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
        Photo Gallery
      </Typography>
      
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        mb: 3,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => {
            setActiveTab(newValue)
            setIndex(-1) // Reset lightbox when switching tabs
          }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: 120,
              '&.Mui-selected': {
                color: '#2c5f2d'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2c5f2d',
              height: 3
            }
          }}
        >
          <Tab label="People" />
          <Tab label="Places" />
          <Tab label="Birds" />
        </Tabs>
      </Box>
      
      <Grid container spacing={2}>
        {filteredPhotos.map((photo, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)'
                }
              }}
              onClick={() => {
                // Find the index in the filtered photos array for lightbox
                const allPhotosIndex = photos.findIndex(p => p.src === photo.src)
                setIndex(allPhotosIndex)
              }}
            >
              <CardMedia
                component="img"
                image={photo.src}
                alt={photo.title}
                sx={{ 
                  height: 250,
                  objectFit: 'cover'
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos}
      />
    </Box>
  )
}
