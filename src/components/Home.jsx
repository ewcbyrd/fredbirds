import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserRole, ACCESS_LEVELS } from '../hooks/useUserRole'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useTheme } from '@mui/material/styles'
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

export default function Home() {
  const { isAuthenticated } = useAuth0()
  const { hasAccess } = useUserRole()
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()

  const [announcements, setAnnouncements] = useState([])
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
        } else {
          setAnnouncements([])
        }
      })
      .catch(err => {
        console.error('Error fetching announcements:', err)
        setAnnouncements([])
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url(${getCloudinaryUrl('Group.jpg', transformations.hero)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' }, // Parallax effect on desktop
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(45, 80, 22, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }
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
              textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
              animation: 'fadeInUp 0.8s ease-out',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                }
              }
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
              textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                }
              }
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
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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
            {/* PRIMARY ACTION CARDS - Events, Sightings, Photos */}
            {/* Upcoming Events - Forest Green - PRIMARY */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                onClick={() => navigate('/events')}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 4,
                  boxShadow: '0 12px 35px rgba(45, 80, 22, 0.25)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-14px) scale(1.06)',
                    boxShadow: '0 24px 50px rgba(45, 80, 22, 0.35)',
                    border: '2px solid rgba(255,255,255,0.25)',
                    '&::before': {
                      opacity: 1,
                    }
                  }
                }}
              >
                <CardContent>
                  <CalendarTodayIcon sx={{ 
                    fontSize: 60, 
                    color: 'white', 
                    mb: 2, 
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                    transition: 'transform 0.4s ease',
                    '.MuiCard-root:hover &': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'white', 
                    textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    letterSpacing: '0.5px'
                  }}>
                    Events
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.75rem',
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }}>
                    Field Trips & Meetings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Sightings - Sky Blue (Info) - PRIMARY */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                onClick={() => navigate('/sightings')}
                sx={{
                  background: `linear-gradient(135deg, #6ba8e0 0%, ${theme.palette.accent.blue} 100%)`,
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 4,
                  boxShadow: '0 12px 35px rgba(91, 155, 213, 0.25)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-14px) scale(1.06)',
                    boxShadow: '0 24px 50px rgba(91, 155, 213, 0.35)',
                    border: '2px solid rgba(255,255,255,0.25)',
                    '&::before': {
                      opacity: 1,
                    }
                  }
                }}
              >
                <CardContent>
                  <VisibilityIcon sx={{ 
                    fontSize: 60, 
                    color: 'white', 
                    mb: 2, 
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                    transition: 'transform 0.4s ease',
                    '.MuiCard-root:hover &': {
                      transform: 'scale(1.1) rotate(-5deg)',
                    }
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'white', 
                    textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    letterSpacing: '0.5px'
                  }}>
                    Sightings
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.75rem',
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }}>
                    Recent Bird Reports
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Photo Gallery - Sunset Orange (Secondary) - PRIMARY */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                onClick={() => navigate('/photos')}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                  textAlign: 'center',
                  py: 4,
                  cursor: 'pointer',
                  borderRadius: 4,
                  boxShadow: '0 12px 35px rgba(193, 120, 23, 0.25)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-14px) scale(1.06)',
                    boxShadow: '0 24px 50px rgba(193, 120, 23, 0.35)',
                    border: '2px solid rgba(255,255,255,0.25)',
                    '&::before': {
                      opacity: 1,
                    }
                  }
                }}
              >
                <CardContent>
                  <PhotoLibraryIcon sx={{ 
                    fontSize: 60, 
                    color: 'white', 
                    mb: 2, 
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
                    transition: 'transform 0.4s ease',
                    '.MuiCard-root:hover &': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: 'white', 
                    textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    letterSpacing: '0.5px'
                  }}>
                    Photos
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.75rem',
                    textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }}>
                    Member Gallery
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* SECONDARY INFO CARDS - Membership, Officers, Members */}
            {/* Membership - Earthy Brown - SECONDARY */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                onClick={() => navigate('/membership')}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.accent.brown} 0%, #9d8159 100%)`,
                  textAlign: 'center',
                  py: 3.5,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(139, 111, 71, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  opacity: 0.95,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 35px rgba(139, 111, 71, 0.28)',
                    opacity: 1,
                    border: '1px solid rgba(255,255,255,0.18)',
                  }
                }}
              >
                <CardContent>
                  <BadgeIcon sx={{ 
                    fontSize: 52, 
                    color: 'white', 
                    mb: 1.5, 
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))',
                    opacity: 0.95
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: 'white', 
                    textShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    fontSize: '1.05rem'
                  }}>
                    Membership
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.85)', 
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.7rem'
                  }}>
                    Join Our Community
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Officers - Deep Teal - SECONDARY */}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <Card
                onClick={() => navigate('/officers')}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.accent.teal} 0%, #3a9288 100%)`,
                  textAlign: 'center',
                  py: 3.5,
                  cursor: 'pointer',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(44, 120, 115, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  opacity: 0.95,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 35px rgba(44, 120, 115, 0.28)',
                    opacity: 1,
                    border: '1px solid rgba(255,255,255,0.18)',
                  }
                }}
              >
                <CardContent>
                  <BadgeIcon sx={{ 
                    fontSize: 52, 
                    color: 'white', 
                    mb: 1.5, 
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))',
                    opacity: 0.95
                  }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: 'white', 
                    textShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    fontSize: '1.05rem'
                  }}>
                    Officers
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(255,255,255,0.85)', 
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.7rem'
                  }}>
                    Club Leadership
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Members Directory - Sage Green - SECONDARY */}
            {hasAccess(ACCESS_LEVELS.MEMBER) && (
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card
                  onClick={() => navigate('/members-directory')}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.accent.sage} 0%, #7fa383 100%)`,
                    textAlign: 'center',
                    py: 3.5,
                    cursor: 'pointer',
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(107, 142, 111, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    opacity: 0.95,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 35px rgba(107, 142, 111, 0.28)',
                      opacity: 1,
                      border: '1px solid rgba(255,255,255,0.18)',
                    }
                  }}
                >
                  <CardContent>
                    <GroupsIcon sx={{ 
                      fontSize: 52, 
                      color: 'white', 
                      mb: 1.5, 
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))',
                      opacity: 0.95
                    }} />
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: 'white', 
                      textShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      fontSize: '1.05rem'
                    }}>
                      Members
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255,255,255,0.85)', 
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.7rem'
                    }}>
                      Member Directory
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>

      {/* Announcements Headlines Section - Nature Theme */}
      <Box
        ref={announcementsAnimation.ref}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
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
                {announcements.length > 0 ? (
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
                    onClick={() => navigate('/announcements')}
                  >
                    {announcements[currentAnnouncementIndex]?.headline}
                  </Typography>
                ) : (
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      opacity: 0.9,
                      fontStyle: 'italic',
                      textShadow: '0 1px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    No current club announcements
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box >

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
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Events home={true} singleEvent={true} maxEvents={3} />
        </Box>
      </Box>

      {/* Sightings Section - Modern Design */}
      <Box
        ref={sightingsAnimation.ref}
        sx={{
          background: `linear-gradient(135deg, #1e3910 0%, ${theme.palette.primary.dark} 100%)`, // Deepest Forest Green
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
          <NearbySightings />
        </Box>
      </Box>

    </Box >
  )
}
