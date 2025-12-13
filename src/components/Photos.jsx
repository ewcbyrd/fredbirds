import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardMedia, Tabs, Tab, Button } from '@mui/material'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { getPhotos } from '../services/restdbService'
import { getCloudinaryUrl, transformations } from '../services/cloudinaryService'
import { useAuth0 } from '@auth0/auth0-react'
import PhotoUploadForm from './PhotoUploadForm'

export default function Photos() {
  const { isAuthenticated } = useAuth0()
  const [index, setIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState(0)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString
    }
  }

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const data = await getPhotos()
      
      // Transform API data to match component format
      const transformedPhotos = data
        .filter(photo => photo.cloudinary_public_id)
        .map(photo => {
          // Build caption from available metadata
          const captionParts = []
          
          if (photo.header) {
            captionParts.push(photo.header)
          }
          
          if (photo.description) {
            captionParts.push(photo.description)
          }
          
          if (photo.location) {
            captionParts.push(photo.location)
          }
          
          if (photo.photoDate) {
            const formattedDate = formatDate(photo.photoDate)
            if (formattedDate) {
              captionParts.push(formattedDate)
            }
          }
          
          if (photo.contributor) {
            captionParts.push(`Contributor: ${photo.contributor}`)
          }
          
          return {
            src: getCloudinaryUrl(photo.cloudinary_public_id, transformations.optimized),
            category: (photo.category || 'people').toLowerCase(),
            title: photo.header || 'Photo',
            description: captionParts.length > 0 ? captionParts.join(' • ') : undefined
          }
        })
      
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Photo Gallery
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            sx={{ backgroundColor: '#2c5f2d', '&:hover': { backgroundColor: '#1e4620' } }}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Photo
          </Button>
        )}
      </Box>
      
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
        plugins={[Captions]}
      />

      <PhotoUploadForm
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadSuccess={loadPhotos}
      />
    </Box>
  )
}
