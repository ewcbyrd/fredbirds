import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import GroupsIcon from '@mui/icons-material/Groups'
import BadgeIcon from '@mui/icons-material/Badge'
import Events from './Events'
import NearbySightings from './NearbySightings'
import { getAnnouncements } from '../services/restdbService'
import { getCloudinaryUrl, transformations } from '../services/cloudinaryService'

export default function Home({ onNavigate }) {
  const { isAuthenticated } = useAuth0()
  const { hasAccess } = useUserRole()
  const location = useLocation()
  // Default announcements data to ensure immediate render
  const defaultAnnouncements = [
    {
      "_id": "69303967e8f64c30e9c9fe0b",
      "headline": "It's Time for the Annual Christmas Bird Count Events",
      "details": "It’s that special time of year again—the Christmas Bird Count is here! Join fellow birders..."
    },
    {
      "_id": "6925ca524fdde50b85357238",
      "headline": "Caledon State Park Expands - New Birding Opportunities Ahead!",
      "details": "Exciting news for birders in our region! Caledon State Park has expanded..."
    },
    {
      "_id": "6925a2254fdde50b85357237",
      "headline": "New Birding 101 Series at Widewater State Park - Winter 2025/2026",
      "details": "Join experienced birders for guided walks at Widewater State Park this winter!..."
    }
  ]
  const [announcements, setAnnouncements] = useState(defaultAnnouncements)
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  // Scroll animations
  const announcementsAnimation = useScrollAnimation({ threshold: 0.2 })
  const eventsAnimation = useScrollAnimation({ threshold: 0.2 })
  const quickLinksAnimation = useScrollAnimation({ threshold: 0.2 })
  const sightingsAnimation = useScrollAnimation({ threshold: 0.2 })

  // Load announcements on component mount and when location changes
  useEffect(() => {
    getAnnouncements()
      .then(data => {
        if (data && data.length > 0) {
          setAnnouncements(data)
        }
      })
      .catch(err => {
        console.error('Error fetching announcements:', err)
      })
  }, [location.pathname])

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
            py: { xs: 3, md: 0 },
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
        </Box>
      </Box>

      {/* Quick Links Section - Nature Theme */}
      <Box
        ref={quickLinksAnimation.ref}
        sx={{
          background: 'linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)',
          py: 8,
          opacity: quickLinksAnimation.isVisible ? 1 : 0,
          transform: quickLinksAnimation.isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 5,
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              letterSpacing: '-0.5px'
            }}
          >
            Explore Our Community
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {/* Upcoming Events - Forest Green */}
            <Grid item xs={6} sm={4} md={2}>
              <Card
                onClick={() => onNavigate('events')}
                sx={{
                  background: 'linear-gradient(135deg, #4a7c59 0%, #5d9c6c 100%)',
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <CardContent>
                  <CalendarTodayIcon sx={{ fontSize: 56, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Sightings - Sky Blue */}
            <Grid item xs={6} sm={4} md={2}>
              <Card
                onClick={() => onNavigate('sightings')}
                sx={{
                  background: 'linear-gradient(135deg, #5b9bd5 0%, #70b5e8 100%)',
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <CardContent>
                  <VisibilityIcon sx={{ fontSize: 56, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Sightings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Photo Gallery - Sunset Orange */}
            <Grid item xs={6} sm={4} md={2}>
              <Card
                onClick={() => onNavigate('photos')}
                sx={{
                  background: 'linear-gradient(135deg, #d4895c 0%, #e69f6f 100%)',
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <CardContent>
                  <PhotoLibraryIcon sx={{ fontSize: 56, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Photos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Membership - Earthy Brown */}
            <Grid item xs={6} sm={4} md={2}>
              <Card
                onClick={() => onNavigate('membership')}
                sx={{
                  background: 'linear-gradient(135deg, #8b6f47 0%, #a08968 100%)',
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <CardContent>
                  <BadgeIcon sx={{ fontSize: 56, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Membership
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Officers - Deep Teal */}
            <Grid item xs={6} sm={4} md={2}>
              <Card
                onClick={() => onNavigate('officers')}
                sx={{
                  background: 'linear-gradient(135deg, #2c7873 0%, #3d9891 100%)',
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.05)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  }
                }}
              >
                <CardContent>
                  <BadgeIcon sx={{ fontSize: 56, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    Officers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Members Directory - Sage Green */}
            {hasAccess(ACCESS_LEVELS.MEMBER) && (
              <Grid item xs={6} sm={4} md={2}>
                <Card
                  onClick={() => onNavigate('members-directory')}
                  sx={{
                    background: 'linear-gradient(135deg, #6b8e6f 0%, #7fa883 100%)',
                    textAlign: 'center',
                    py: 4,
                    cursor: 'pointer',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: 'none',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <CardContent>
                    <GroupsIcon sx={{ fontSize: 56, color: 'white', mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      Members
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Announcements Headlines Section - Nature Theme */}
      {announcements.length > 0 && (
        <Box
          ref={announcementsAnimation.ref}
          sx={{
            background: 'linear-gradient(135deg, #c17817 0%, #d4a574 100%)',
            py: 5,
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 120, md: 140 },
            opacity: announcementsAnimation.isVisible ? 1 : 0,
            transform: announcementsAnimation.isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              height: { xs: 72, md: 92 }
            }}>
              <AnnouncementIcon sx={{ fontSize: { xs: 32, md: 40 }, color: 'white', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
              <Box sx={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
                <Box sx={{
                  height: { xs: 72, md: 92 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  opacity: fadeIn ? 1 : 0,
                  transition: 'opacity 0.6s ease-in-out'
                }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: 'white',
                      transition: 'transform 0.3s ease',
                      lineHeight: { xs: 1.3, md: 1.2 },
                      fontSize: { xs: '1.1rem', md: '1.5rem' },
                      overflow: 'hidden',
                      textAlign: 'center',
                      width: '100%',
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        textShadow: '0 4px 20px rgba(0,0,0,0.4)'
                      }
                    }}
                    onClick={() => onNavigate('announcements')}
                  >
                    {announcements[currentAnnouncementIndex]?.headline || "Club Announcements"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box >
      )
      }

      {/* Events Section - Modern Design */}
      <Box
        ref={eventsAnimation.ref}
        sx={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
          py: 8,
          opacity: eventsAnimation.isVisible ? 1 : 0,
          transform: eventsAnimation.isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out 0.2s',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #4A7C59 0%, #87CEEB 50%, #8B5A2B 100%)', // Forest -> Sky -> Earth
          }
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Events home={true} singleEvent={true} maxEvents={3} onViewAll={onNavigate} />
        </Box>
      </Box>

      {/* Sightings Section - Modern Design */}
      <Box
        ref={sightingsAnimation.ref}
        sx={{
          background: 'linear-gradient(135deg, #2D5A27 0%, #5D9C6C 100%)', // Deep Forest Green
          py: 8,
          opacity: sightingsAnimation.isVisible ? 1 : 0,
          transform: sightingsAnimation.isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease-out 0.2s',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
          <NearbySightings onViewAll={onNavigate} />
        </Box>
      </Box>

    </Box >
  )
}
