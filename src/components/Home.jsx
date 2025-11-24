import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Events from './Events'
import NearbySightings from './NearbySightings'

import img5 from '../resources/photos/image5.jpeg?url'
import imgCBBT from '../resources/photos/CBBT.jpeg?url'
import imgGroup from '../resources/photos/Group.jpg?url'
import img0844 from '../resources/photos/IMG_0844.JPG?url'
import img0552 from '../resources/photos/IMG_0552.JPG?url'
import imgPhotoOp from '../resources/photos/Photo-Op.jpg?url'
import img3301 from '../resources/photos/IMG_3301.JPG?url'
import imgP1020092 from '../resources/photos/P1020092.jpeg?url'
import imgLees from '../resources/photos/Leesylvania-Group.jpeg?url'

const items = [
  img5,
  imgCBBT,
  imgGroup,
  img0844,
  img0552,
  imgPhotoOp,
  img3301,
  imgP1020092,
  imgLees
]

export default function Home({ onNavigate }){
  return (
    <Box>
      {/* Hero Banner - Full Width */}
      <Box 
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 400, md: 500 },
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${imgGroup})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            zIndex: 1,
            color: 'white',
            maxWidth: 800,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Welcome to the Fredericksburg Birding Club
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.25rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            Join bird enthusiasts of all skill levels in the greater Fredericksburg, Virginia area. 
            From beginners to advanced birders, we share our passion for birds through field trips, 
            events, and community.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="large"
              href="/membership"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2
                }
              }}
            >
              Join the Club
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onNavigate('events')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2
                }
              }}
            >
              View Events
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => onNavigate('sightings')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2
                }
              }}
            >
              Recent Sightings
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Events Section - White Background */}
      <Box sx={{ bgcolor: 'white', py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Events home={true} singleEvent={true} onViewAll={onNavigate} />
        </Box>
      </Box>

      {/* Sightings Section - Light Green Background */}
      <Box sx={{ bgcolor: '#f7faf7', py: 6 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <NearbySightings onViewAll={onNavigate} />
        </Box>
      </Box>

    </Box>
  )
}
