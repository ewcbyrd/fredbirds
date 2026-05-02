import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserRole, ACCESS_LEVELS } from '../../hooks/useUserRole';
import { useMember } from '../../hooks/useMember';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Box,
    Divider,
    ListSubheader,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import BadgeIcon from '@mui/icons-material/Badge'; // For Membership/Card
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Events
import AnnouncementIcon from '@mui/icons-material/Announcement'; // News
import AutoStoriesIcon from '@mui/icons-material/AutoStories'; // Newsletters
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'; // Photos
import VisibilityIcon from '@mui/icons-material/Visibility'; // Sightings
import RssFeedIcon from '@mui/icons-material/RssFeed'; // Birding News
import ContactSupportIcon from '@mui/icons-material/ContactSupport'; // FAQs
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Locations
import { PersonAdd, Close } from '@mui/icons-material';
import UserProfile from './UserProfile';

// Component to handle scroll transparency effect
function ScrollHandler(props) {
    const { children } = props;

    return React.cloneElement(children, {
        elevation: 4,
        sx: {
            ...children.props.sx,
            bgcolor: 'rgba(45, 80, 22, 0.85)', // Deep Forest Green with transparency
            backdropFilter: 'blur(16px) saturate(180%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease-in-out',
            py: 0.5 // Consistent comfortable height
        }
    });
}

export default function Header(props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, isAuthenticated } = useAuth0();
    const { hasAccess } = useUserRole();
    const { member: memberRecord, error: memberError } = useMember();

    const handleNavigate = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    // Only Members Directory is restricted
    const memberOnlyPaths = ['/members-directory'];

    // Filter function to check if menu item should be shown
    const shouldShowMenuItem = (path) => {
        if (memberOnlyPaths.includes(path)) {
            return hasAccess(ACCESS_LEVELS.MEMBER);
        }
        return true; // All other pages are public
    };

    const getIconForPath = (path) => {
        switch (path) {
            case '/':
                return <HomeIcon />;
            case '/about':
                return <InfoIcon />;
            case '/officers':
                return <GroupsIcon />;
            case '/members-directory':
                return <GroupsIcon />;
            case '/membership':
                return <BadgeIcon />;
            case '/faqs':
                return <ContactSupportIcon />;
            case '/events':
                return <CalendarTodayIcon />;
            case '/locations':
                return <LocationOnIcon />;
            case '/announcements':
                return <AnnouncementIcon />;
            case '/newsletters':
                return <AutoStoriesIcon />;
            case '/photos':
                return <PhotoLibraryIcon />;
            case '/sightings':
                return <VisibilityIcon />;
            case '/newsfeed':
                return <RssFeedIcon />;
            default:
                return <HomeIcon />;
        }
    };

    const menuSections = [
        {
            title: 'Club Information',
            items: [
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
                { label: 'Officers', path: '/officers' },
                { label: 'Members Directory', path: '/members-directory' },
                { label: 'About Membership', path: '/join' },
                { label: "FAQ's", path: '/faqs' }
            ]
        },
        {
            title: 'Club Activities',
            items: [
                { label: 'Events', path: '/events' },
                { label: 'Club News', path: '/announcements' },
                { label: 'Newsletters', path: '/newsletters' },
                { label: 'Photos', path: '/photos' }
            ]
        },
        {
            title: 'Birding Resources',
            items: [
                { label: 'Locations', path: '/locations' },
                { label: 'Sightings', path: '/sightings' },
                { label: 'Birding News', path: '/newsfeed' }
            ]
        }
    ];

    const primaryNav = [
        { label: 'Events', path: '/events' },
        { label: 'Sightings', path: '/sightings' },
        { label: 'Photos', path: '/photos' },
        { label: 'News', path: '/announcements' },
        { label: 'Members', path: '/members-directory' }
    ];

    // Filter menu sections based on authentication
    const filteredMenuSections = menuSections
        .map((section) => ({
            ...section,
            items: section.items.filter((item) => shouldShowMenuItem(item.path))
        }))
        .filter((section) => section.items.length > 0);

    // Filter primary nav items
    const filteredPrimaryNav = primaryNav.filter((item) =>
        shouldShowMenuItem(item.path)
    );

    return (
        <>
            <ScrollHandler {...props}>
                <AppBar
                    position="fixed"
                    sx={{ bgcolor: 'transparent', boxShadow: 0 }}
                >
                    <Toolbar
                        sx={{
                            width: '100%',
                            mx: 'auto',
                            px: { xs: 2, md: 6, lg: 10 }
                        }}
                    >
                        {/* Logo/Home Button */}
                        <IconButton
                            aria-label="Return to home page"
                            edge="start"
                            color="inherit"
                            onClick={() => handleNavigate('/')}
                            sx={{
                                mr: 1,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(4px)',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            <HomeIcon sx={{ fontSize: 24 }} />
                        </IconButton>

                        {/* Club Name - with subtle text shadow for readability on hero */}
                        <Typography
                            variant={isMobile ? 'subtitle1' : 'h6'}
                            component="div"
                            sx={{
                                fontWeight: 800,
                                fontFamily: 'Outfit, sans-serif',
                                cursor: 'pointer',
                                letterSpacing: 0.5,
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                '&:hover': {
                                    opacity: 0.9
                                }
                            }}
                            onClick={() => handleNavigate('/')}
                        >
                            {isMobile ? 'FBC' : 'Fredericksburg Birding Club'}
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Desktop Navigation */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                                {filteredPrimaryNav.map((item) => (
                                    <Button
                                        key={item.path}
                                        color="inherit"
                                        onClick={() =>
                                            handleNavigate(item.path)
                                        }
                                        sx={{
                                            textTransform: 'none',
                                            px: 2,
                                            py: 0.8,
                                            fontSize: '0.95rem',
                                            fontWeight:
                                                location.pathname === item.path
                                                    ? 700
                                                    : 600,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: '50px',
                                            bgcolor:
                                                location.pathname === item.path
                                                    ? 'rgba(255, 255, 255, 0.15)'
                                                    : 'transparent',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                width:
                                                    location.pathname ===
                                                    item.path
                                                        ? '100%'
                                                        : '0%',
                                                height: '3px',
                                                bgcolor:
                                                    theme.palette.secondary
                                                        .main, // Dynamic theme usage
                                                transition:
                                                    'width 0.3s ease-in-out'
                                            },
                                            '&:hover': {
                                                bgcolor:
                                                    'rgba(255, 255, 255, 0.15)',
                                                '&::after': {
                                                    width: '80%',
                                                    opacity: 0.7
                                                }
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>
                        )}

                        {/* Menu Icon */}
                        <IconButton
                            aria-label="Open navigation menu"
                            edge="end"
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            sx={{
                                mr: 2,
                                bgcolor: 'rgba(255,255,255,0.1)', // Glass background
                                backdropFilter: 'blur(4px)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                                }
                            }}
                        >
                            <MenuIcon sx={{ fontSize: 26 }} />
                        </IconButton>

                        {/* User Profile / Login */}
                        <Box>
                            <UserProfile />
                        </Box>
                    </Toolbar>
                </AppBar>
            </ScrollHandler>

            {/* Spacer for fixed header */}
            <Box sx={{ pt: 10 }} />

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 300,
                        bgcolor: theme.palette.background.default,
                        borderLeft: `1px solid ${theme.palette.divider}`
                    },
                    zIndex: (theme) => theme.zIndex.drawer + 2
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        color: 'white',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Menu
                    </Typography>
                    <IconButton
                        aria-label="Close menu"
                        onClick={() => setDrawerOpen(false)}
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List sx={{ pb: 4 }}>
                    {filteredMenuSections.map((section, idx) => (
                        <React.Fragment key={section.title}>
                            <ListSubheader
                                sx={{
                                    bgcolor: 'transparent',
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: 1,
                                    mt: idx === 0 ? 0 : 2
                                }}
                            >
                                {section.title}
                            </ListSubheader>
                            {section.items.map((item) => (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        onClick={() =>
                                            handleNavigate(item.path)
                                        }
                                        selected={
                                            location.pathname === item.path
                                        }
                                        sx={{
                                            mx: 1,
                                            borderRadius: 2,
                                            mb: 0.5,
                                            '&.Mui-selected': {
                                                bgcolor: `${theme.palette.primary.light}20`, // 20% opacity using hex
                                                color: theme.palette.primary
                                                    .main,
                                                '& .MuiListItemIcon-root': {
                                                    color: theme.palette.primary
                                                        .main
                                                }
                                            },
                                            '&:hover': {
                                                bgcolor: `${theme.palette.primary.light}10`
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 40,
                                                color: '#757575'
                                            }}
                                        >
                                            {getIconForPath(item.path)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight:
                                                    location.pathname ===
                                                    item.path
                                                        ? 700
                                                        : 500
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                            {idx < filteredMenuSections.length - 1 && (
                                <Divider
                                    variant="middle"
                                    sx={{ my: 1, borderColor: '#eee' }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>
        </>
    );
}
