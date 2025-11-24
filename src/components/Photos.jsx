import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardMedia, Tabs, Tab } from '@mui/material'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getPhotos } from '../services/restdbService'

// Import images so Vite bundles them correctly
import imgCBBT from '../resources/photos/CBBT.jpeg?url'
import imgGroup from '../resources/photos/Group.jpg?url'
import imgGroup1 from '../resources/photos/Group1.jpg?url'
import img5 from '../resources/photos/image5.jpeg?url'
import img0552 from '../resources/photos/IMG_0552.JPG?url'
import img0844 from '../resources/photos/IMG_0844.JPG?url'
import img3301 from '../resources/photos/IMG_3301.JPG?url'
import imgLees from '../resources/photos/Leesylvania-Group.jpeg?url'
import imgP1010796 from '../resources/photos/P1010796.jpeg?url'
import imgP1010808 from '../resources/photos/P1010808.jpeg?url'
import imgP1010820 from '../resources/photos/P1010820.jpeg?url'
import imgP1020092 from '../resources/photos/P1020092.jpeg?url'
import imgPhotoOp from '../resources/photos/Photo-Op.jpg?url'

// Map filenames to imported URLs
const imageMap = {
  'CBBT.jpeg': imgCBBT,
  'Group.jpg': imgGroup,
  'Group1.jpg': imgGroup1,
  'image5.jpeg': img5,
  'IMG_0552.JPG': img0552,
  'IMG_0844.JPG': img0844,
  'IMG_3301.JPG': img3301,
  'Leesylvania-Group.jpeg': imgLees,
  'P1010796.jpeg': imgP1010796,
  'P1010808.jpeg': imgP1010808,
  'P1010820.jpeg': imgP1010820,
  'P1020092.jpeg': imgP1020092,
  'Photo-Op.jpg': imgPhotoOp
}

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
        .filter(photo => photo.filename && imageMap[photo.filename])
        .map(photo => ({
          src: imageMap[photo.filename],
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
