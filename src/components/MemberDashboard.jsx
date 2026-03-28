import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Button,
    Avatar,
    Skeleton,
    Divider,
    Stack,
    useTheme
} from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import GroupsIcon from '@mui/icons-material/Groups'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EventIcon from '@mui/icons-material/Event'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import CampaignIcon from '@mui/icons-material/Campaign'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'

import {
    getFutureEvents,
    getAnnouncements,
    getMembers
} from '../services/restdbService'
import { getPictureUrl } from '../services/cloudinaryService'
import WeatherForecast from './WeatherForecast'
import PageContainer from './common/PageContainer'

// Helper to determine the default hotspot (could be expanded later to use user preferences)
const DEFAULT_HOTSPOT = {
    name: "Crow's Nest Natural Area Preserve",
    lat: 38.3533,
    lon: -77.3402
}

export default function MemberDashboard({ onNavigate }) {
    const { user, isAuthenticated } = useAuth0()
    const theme = useTheme()
    const navigate = useNavigate()

    const [memberProfile, setMemberProfile] = useState(null)
    const [nextEvent, setNextEvent] = useState(null)
    const [recentAnnouncements, setRecentAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated || !user?.email) {
            setLoading(false)
            return
        }

        const loadDashboardData = async () => {
            try {
                setLoading(true)

                // 1. Fetch member profile for personalized stats
                const members = await getMembers()
                const profile = members.find(m => m.email === user.email)
                setMemberProfile(profile)

                // 2. Fetch future events, take chronologically closest one
                // getFutureEvents gets 3 months out by default
                const events = await getFutureEvents(new Date(), 3)
                if (events && events.length > 0) {
                    // Find the very next event that hasn't happened yet today
                    const now = new Date()
                    const upcoming = events
                        .filter(e => !e.cancelled && e.isClubEvent !== false)
                        .sort((a, b) => new Date(a.start) - new Date(b.start))
                        .find(e => {
                            // Consider an event upcoming if its end time (or start time if no end) is in the future
                            const actualEnd = e.end ? new Date(e.end) : new Date(e.start)
                            return actualEnd >= now
                        })
                    setNextEvent(upcoming || null)
                }

                // 3. Fetch latest announcements
                const announcementsData = await getAnnouncements()
                if (announcementsData && announcementsData.length > 0) {
                    // Sort descending by date, take top 2
                    const sorted = announcementsData
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 2)
                    setRecentAnnouncements(sorted)
                }

            } catch (err) {
                console.error('Error loading dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [isAuthenticated, user])

    if (!isAuthenticated) {
        return null // Should be handled by router, but just in case
    }

    // Handle local navigation mapping if needed
    const handleNav = (path) => {
        if (onNavigate) {
            onNavigate(path)
        } else {
            navigate(`/${path}`)
        }
    }

    const renderWelcomeSkeleton = () => (
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Skeleton variant="circular" width={80} height={80} />
            <Box>
                <Skeleton variant="text" width={250} height={60} />
                <Skeleton variant="text" width={200} height={30} />
            </Box>
        </Box>
    )

    const firstName = memberProfile?.first || user?.name?.split(' ')[0] || 'Member'

    return (
        <PageContainer>

            {/* 1. WELCOME SECTION */}
            {loading ? renderWelcomeSkeleton() : (
                <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
                    <Avatar
                        src={getPictureUrl(memberProfile?.picture) || user?.picture}
                        alt={firstName}
                        sx={{
                            width: { xs: 64, sm: 80 },
                            height: { xs: 64, sm: 80 },
                            border: `3px solid ${theme.palette.primary.main}`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                            Welcome back, {firstName}!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5 }}>
                            Ready for another great day of birding?
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* 2. QUICK ACTIONS ROW */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="subtitle2" textTransform="uppercase" fontWeight="700" color="text.secondary" sx={{ mb: 2, ml: 1, letterSpacing: 1 }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            onClick={() => handleNav('profile')}
                            sx={{
                                bgcolor: '#f8fbfc',
                                border: '1.5px solid rgba(91, 155, 213, 0.15)',
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                '&:hover': { 
                                    transform: 'translateY(-6px)', 
                                    boxShadow: '0 12px 28px rgba(91, 155, 213, 0.2)', 
                                    borderColor: theme.palette.info.main,
                                    bgcolor: '#ffffff'
                                }
                            }}
                        >
                            <CardActionArea sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(91, 155, 213, 0.12)', 
                                    color: 'info.main',
                                    width: 48,
                                    height: 48,
                                    transition: 'all 0.3s ease',
                                    '.MuiCard-root:hover &': {
                                        bgcolor: 'rgba(91, 155, 213, 0.18)',
                                        transform: 'scale(1.1)'
                                    }
                                }}>
                                    <PersonIcon fontSize="medium" />
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="700" color="text.primary" sx={{ fontSize: '1.05rem' }}>View Profile</Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            onClick={() => handleNav('events')}
                            sx={{
                                bgcolor: '#f8fbfc',
                                border: '1.5px solid rgba(45, 80, 22, 0.15)',
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                '&:hover': { 
                                    transform: 'translateY(-6px)', 
                                    boxShadow: '0 12px 28px rgba(45, 80, 22, 0.2)', 
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: '#ffffff'
                                }
                            }}
                        >
                            <CardActionArea sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(45, 80, 22, 0.12)', 
                                    color: 'primary.main',
                                    width: 48,
                                    height: 48,
                                    transition: 'all 0.3s ease',
                                    '.MuiCard-root:hover &': {
                                        bgcolor: 'rgba(45, 80, 22, 0.18)',
                                        transform: 'scale(1.1)'
                                    }
                                }}>
                                    <CalendarTodayIcon fontSize="medium" />
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="700" color="text.primary" sx={{ fontSize: '1.05rem' }}>Browse Events</Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            onClick={() => handleNav('members-directory')}
                            sx={{
                                bgcolor: '#f8fbfc',
                                border: '1.5px solid rgba(193, 120, 23, 0.15)',
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                '&:hover': { 
                                    transform: 'translateY(-6px)', 
                                    boxShadow: '0 12px 28px rgba(193, 120, 23, 0.2)', 
                                    borderColor: theme.palette.secondary.main,
                                    bgcolor: '#ffffff'
                                }
                            }}
                        >
                            <CardActionArea sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(193, 120, 23, 0.12)', 
                                    color: 'secondary.main',
                                    width: 48,
                                    height: 48,
                                    transition: 'all 0.3s ease',
                                    '.MuiCard-root:hover &': {
                                        bgcolor: 'rgba(193, 120, 23, 0.18)',
                                        transform: 'scale(1.1)'
                                    }
                                }}>
                                    <GroupsIcon fontSize="medium" />
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="700" color="text.primary" sx={{ fontSize: '1.05rem' }}>Member Directory</Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            onClick={() => handleNav('photos')}
                            sx={{
                                bgcolor: '#f8fbfc',
                                border: '1.5px solid rgba(91, 155, 213, 0.15)',
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                '&:hover': { 
                                    transform: 'translateY(-6px)', 
                                    boxShadow: '0 12px 28px rgba(91, 155, 213, 0.2)', 
                                    borderColor: '#5b9bd5',
                                    bgcolor: '#ffffff'
                                }
                            }}
                        >
                            <CardActionArea sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
                                <Avatar sx={{ 
                                    bgcolor: 'rgba(91, 155, 213, 0.12)', 
                                    color: '#5b9bd5',
                                    width: 48,
                                    height: 48,
                                    transition: 'all 0.3s ease',
                                    '.MuiCard-root:hover &': {
                                        bgcolor: 'rgba(91, 155, 213, 0.18)',
                                        transform: 'scale(1.1)'
                                    }
                                }}>
                                    <PhotoLibraryIcon fontSize="medium" />
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="700" color="text.primary" sx={{ fontSize: '1.05rem' }}>Share a Photo</Typography>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* DASHBOARD GRID */}
            <Grid container spacing={4}>

                {/* LEFT COLUMN: Up Next & Weather */}
                <Grid item xs={12} md={7} lg={8}>

                    {/* UP NEXT EVENT */}
                    <Typography variant="h5" fontWeight="800" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon color="primary" /> Up Next
                    </Typography>

                    {loading ? (
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 4 }} />
                    ) : nextEvent ? (
                        <Card sx={{ mb: 4, position: 'relative', overflow: 'hidden', borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                            <Box sx={{
                                position: 'absolute', top: 0, left: 0, width: 6, height: '100%',
                                bgcolor: 'primary.main'
                            }} />
                            <CardContent sx={{ p: { xs: 3, sm: 4 }, pl: { xs: 4, sm: 5 } }}>
                                <Grid container spacing={3} alignItems="center">
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="overline" color="primary.main" fontWeight="700" letterSpacing={1}>
                                            Next Scheduled Event
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 1.5, fontFamily: '"Outfit", sans-serif' }}>
                                            {nextEvent.title || nextEvent.event}
                                        </Typography>

                                        <Stack spacing={1.5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                                <CalendarTodayIcon fontSize="small" />
                                                <Typography variant="body1" fontWeight="500">
                                                    {(() => {
                                                        const start = new Date(nextEvent.start)
                                                        // Parse as local timezone to avoid UTC shifting the day backwards
                                                        const localStart = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
                                                        return localStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                                                    })()}
                                                </Typography>
                                            </Box>

                                            {(nextEvent.locations?.length > 0 || (nextEvent.lat && nextEvent.lon)) && (
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: 'text.secondary' }}>
                                                    <LocationOnIcon fontSize="small" sx={{ mt: 0.2 }} />
                                                    <Typography variant="body2">
                                                        {nextEvent.locations?.length > 0
                                                            ? nextEvent.locations[0].name || nextEvent.locations[0].address || 'View map for location details'
                                                            : 'Location on map'}
                                                        {nextEvent.locations?.length > 1 && ` (+${nextEvent.locations.length - 1} more locations)`}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={() => handleNav('events')}
                                            sx={{ borderRadius: 50, px: 3, py: 1.5, textTransform: 'none', fontWeight: 600 }}
                                        >
                                            View Calendar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card variant="outlined" sx={{ mb: 4, bgcolor: '#f8f9fa', borderRadius: 3, borderStyle: 'dashed' }}>
                            <CardContent sx={{ textAlign: 'center', py: 5 }}>
                                <Typography variant="h6" color="text.secondary">No upcoming events scheduled right now.</Typography>
                                <Button variant="outlined" onClick={() => handleNav('events')} sx={{ mt: 2, borderRadius: 50 }}>
                                    View Event History
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* LOCAL WEATHER PREVIEW */}
                    <Typography variant="h5" fontWeight="800" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, mt: 6 }}>
                        <MapIcon color="primary" /> Birding Conditions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 1 }}>
                        Current weather at {DEFAULT_HOTSPOT.name}
                    </Typography>

                    {/* We default to today's date so WeatherForecast fetches 'getCurrentWeather' */}
                    <WeatherForecast
                        latitude={DEFAULT_HOTSPOT.lat}
                        longitude={DEFAULT_HOTSPOT.lon}
                        eventDate={new Date().toISOString()}
                        eventTitle="Dashboard"
                    />

                </Grid>


                {/* RIGHT COLUMN: Latest News/Announcements */}
                <Grid item xs={12} md={5} lg={4}>

                    <Typography variant="h5" fontWeight="800" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CampaignIcon color="secondary" /> Latest Club News
                    </Typography>

                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                        <CardContent sx={{ p: 0 }}>
                            {loading ? (
                                <Box sx={{ p: 3 }}>
                                    <Skeleton variant="text" width="60%" height={30} />
                                    <Skeleton variant="text" width="100%" height={20} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                </Box>
                            ) : recentAnnouncements.length > 0 ? (
                                recentAnnouncements.map((announcement, idx) => (
                                    <React.Fragment key={announcement._id || idx}>
                                        <Box
                                            sx={{
                                                p: 3,
                                                transition: 'bgcolor 0.2s',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', cursor: 'pointer' }
                                            }}
                                            onClick={() => handleNav('announcements')}
                                        >
                                            <Typography variant="caption" color="primary.main" fontWeight="700" sx={{ display: 'block', mb: 1 }}>
                                                {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1, lineHeight: 1.3 }}>
                                                {announcement.headline}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {announcement.content}
                                            </Typography>
                                        </Box>
                                        {idx < recentAnnouncements.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <AnnouncementIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                    <Typography color="text.secondary">No recent announcements.</Typography>
                                </Box>
                            )}
                            <Box sx={{ p: 2, bgcolor: '#f8fbfc', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <Button
                                    fullWidth
                                    onClick={() => handleNav('announcements')}
                                    sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
                                >
                                    View All Announcements
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

        </PageContainer>
    )
}
