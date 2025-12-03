import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import Events from './Events'
import NearbySightings from './NearbySightings'
import { getAnnouncements } from '../services/restdbService'
import { getCloudinaryUrl, transformations } from '../services/cloudinaryService'

const items = [
  getCloudinaryUrl('image5.jpeg', transformations.hero),
  getCloudinaryUrl('CBBT.jpeg', transformations.hero),
  getCloudinaryUrl('Group.jpg', transformations.hero),
  getCloudinaryUrl('IMG_0844.JPG', transformations.hero),
  getCloudinaryUrl('IMG_0552.JPG', transformations.hero),
  getCloudinaryUrl('Photo-Op.jpg', transformations.hero),
  getCloudinaryUrl('IMG_3301.JPG', transformations.hero),
  getCloudinaryUrl('P1020092.jpeg', transformations.hero),
  getCloudinaryUrl('Leesylvania-Group.jpeg', transformations.hero)
]

export default function Home({ onNavigate }){
  const { isAuthenticated } = useAuth0()
  const { hasAccess } = useUserRole()
  const [announcements, setAnnouncements] = useState([])
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  // Load announcements on component mount
  useEffect(() => {
    getAnnouncements().then(data => {
      if (data && data.length > 0) {
        setAnnouncements(data)
      }
    })
  }, [])

  // Rotate announcements every 5 seconds
  useEffect(() => {
    if (announcements.length <= 1) return

    const interval = setInterval(() => {
      setFadeIn(false)
      
      setTimeout(() => {
        setCurrentAnnouncementIndex(prev => 
          (prev + 1) % announcements.length
        )
        setFadeIn(true)
      }, 300) // Half of the fade transition duration
    }, 5000)

    return () => clearInterval(interval)
  }, [announcements.length])

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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${getCloudinaryUrl('Group.jpg', transformations.hero)})`,
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
            pt: { xs: 3, md: 0 },
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

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            pb: { xs: 3, md: 0 }
          }}>            
            {hasAccess(ACCESS_LEVELS.MEMBER) && (
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
            )}
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
            {hasAccess(ACCESS_LEVELS.MEMBER) && (
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
            )}
          </Box>
        </Box>
      </Box>

      {/* Announcements Headlines Section */}
      {announcements.length > 0 && (
        <Box sx={{ 
          bgcolor: '#f8f9fa', 
          borderTop: '1px solid #e9ecef',
          borderBottom: '1px solid #e9ecef',
          py: 3,
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 96, md: 120 }
        }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 2,
              height: { xs: 48, md: 72 }
            }}>
              
              <Box sx={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
                <Fade in={fadeIn} timeout={600}>
                  <Box sx={{ 
                    height: { xs: 48, md: 72 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2
                  }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: 'text.primary',
                        transition: 'color 0.3s ease',
                        lineHeight: { xs: 1.3, md: 1.2 },
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        overflow: 'hidden',
                        textAlign: 'center',
                        width: '100%',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                      onClick={() => onNavigate('announcements')}
                    >
                      {announcements[currentAnnouncementIndex]?.headline}
                    </Typography>
                  </Box>
                </Fade>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

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
