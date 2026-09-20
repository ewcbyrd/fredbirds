import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useIdleTimeout } from './hooks/useIdleTimeout';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from './components/layout/Header';
import Events from './components/events/Events';
import Announcements from './components/news/Announcements';
import NearbySightings from './components/sightings/NearbySightings';
import Home from './components/pages/Home';
import MemberDashboard from './components/members/MemberDashboard';
import About from './components/pages/About';
import News from './components/news/News';
import NewsFeed from './components/news/NewsFeed';
import Newsletters from './components/news/Newsletters';
import Contact from './components/pages/Contact';
import FAQs from './components/pages/FAQs';
import Membership from './components/members/Membership';
import MembershipList from './components/members/MembershipList';
import Resources from './components/pages/Resources';
import Officers from './components/pages/Officers';
import Photos from './components/pages/Photos';
import Locations from './components/locations/Locations';

import Profile from './components/pages/Profile';
import MembersDirectory from './components/members/MembersDirectory';
import MemberProfile from './components/members/MemberProfile';
import OfficerTools from './components/admin/OfficerTools';
import AdminPanel from './components/admin/AdminPanel';
import MemberAccessControl from './components/auth/MemberAccessControl';
import { ACCESS_LEVELS } from './hooks/useUserRole';
import { Routes, Route, Navigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2d5016', // Deep Forest Green
            light: '#4a7c59',
            dark: '#1e3910',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#c17817', // Golden Amber
            light: '#d4a574',
            dark: '#8f570f',
            contrastText: '#ffffff'
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff'
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#5c5c5c'
        },
        accent: {
            blue: '#5b9bd5',
            brown: '#8b6f47',
            teal: '#2c7873',
            sage: '#6b8e6f'
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 16, // Increased from default 14px for better readability
        body1: {
            fontSize: '1rem', // 16px
            lineHeight: 1.75, // Improved readability
            letterSpacing: '0.00938em'
        },
        body2: {
            fontSize: '0.875rem', // 14px
            lineHeight: 1.7,
            letterSpacing: '0.01071em'
        },
        h1: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem', // 40px
            lineHeight: 1.2,
            letterSpacing: '-0.01562em',
            marginBottom: '0.5em'
        },
        h2: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '2rem', // 32px
            lineHeight: 1.25,
            letterSpacing: '-0.00833em',
            marginBottom: '0.5em'
        },
        h3: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '1.75rem', // 28px
            lineHeight: 1.3,
            letterSpacing: '0em',
            marginBottom: '0.5em'
        },
        h4: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem', // 24px
            lineHeight: 1.35,
            letterSpacing: '0.00735em',
            marginBottom: '0.5em'
        },
        h5: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem', // 20px
            lineHeight: 1.4,
            letterSpacing: '0em',
            marginBottom: '0.5em'
        },
        h6: {
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 600,
            fontSize: '1.125rem', // 18px
            lineHeight: 1.45,
            letterSpacing: '0.0075em',
            marginBottom: '0.5em'
        },
        button: {
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9375rem', // 15px
            letterSpacing: '0.02857em'
        },
        caption: {
            fontSize: '0.75rem', // 12px
            lineHeight: 1.5,
            letterSpacing: '0.03333em'
        },
        overline: {
            fontSize: '0.75rem', // 12px
            lineHeight: 2,
            letterSpacing: '0.08333em',
            fontWeight: 600,
            textTransform: 'uppercase'
        }
    },
    shape: {
        borderRadius: 16
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50, // Pill shape for buttons
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                },
                containedPrimary: {
                    background:
                        'linear-gradient(135deg, #2d5016 0%, #4a7c59 100%)'
                },
                containedSecondary: {
                    background:
                        'linear-gradient(135deg, #c17817 0%, #d4a574 100%)'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 24
                }
            }
        }
    }
});

export default function App() {
    const { logout, isAuthenticated } = useAuth0();

    // Handle idle timeout - auto logout after 30 minutes of inactivity
    useIdleTimeout({
        onIdle: () => {
            if (isAuthenticated) {
                console.log('User inactive for 30 minutes, logging out...');
                // Clear local storage auth items just to be safe
                const authKeys = Object.keys(localStorage).filter((key) =>
                    key.startsWith('auth0')
                );
                authKeys.forEach((key) => localStorage.removeItem(key));

                logout({
                    logoutParams: {
                        returnTo: window.location.origin
                    }
                });
            }
        },
        idleTime: 1000 * 60 * 30 // 30 minutes
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh' }}>
                <Header />
                <Container sx={{ py: 0, px: 0 }} maxWidth={false}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <MemberAccessControl
                                        requiredLevel={ACCESS_LEVELS.MEMBER}
                                        fallback={<Home />}
                                        showMessage={false}
                                    >
                                        <MemberDashboard />
                                    </MemberAccessControl>
                                ) : (
                                    <Home />
                                )
                            }
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faqs" element={<FAQs />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/locations" element={<Locations />} />

                        {/* All features public except Members Directory */}
                        <Route
                            path="/announcements"
                            element={<Announcements />}
                        />
                        <Route path="/sightings" element={<Resources />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/newsfeed" element={<NewsFeed />} />
                        <Route path="/newsletters" element={<Newsletters />} />
                        <Route path="/join" element={<Membership />} />
                        <Route
                            path="/membership"
                            element={<Navigate to="/join" replace />}
                        />
                        <Route
                            path="/membership/list"
                            element={<MembershipList />}
                        />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/officers" element={<Officers />} />
                        <Route path="/photos" element={<Photos />} />

                        {/* User Profile */}
                        <Route
                            path="/profile"
                            element={
                                <MemberAccessControl
                                    requiredLevel={ACCESS_LEVELS.MEMBER}
                                >
                                    <Profile />
                                </MemberAccessControl>
                            }
                        />

                        {/* Members Directory - member access required */}
                        <Route
                            path="/members-directory"
                            element={
                                <MemberAccessControl
                                    requiredLevel={ACCESS_LEVELS.MEMBER}
                                >
                                    <MembersDirectory />
                                </MemberAccessControl>
                            }
                        />

                        {/* Individual Member Profile */}
                        <Route
                            path="/members/:email"
                            element={
                                <MemberAccessControl
                                    requiredLevel={ACCESS_LEVELS.MEMBER}
                                >
                                    <MemberProfile />
                                </MemberAccessControl>
                            }
                        />

                        {/* Officer Tools */}
                        <Route
                            path="/officer-tools"
                            element={
                                <MemberAccessControl
                                    requiredLevel={ACCESS_LEVELS.OFFICER}
                                >
                                    <OfficerTools />
                                </MemberAccessControl>
                            }
                        />

                        {/* Admin Panel */}
                        <Route
                            path="/admin"
                            element={
                                <MemberAccessControl
                                    requiredLevel={ACCESS_LEVELS.ADMIN}
                                >
                                    <AdminPanel />
                                </MemberAccessControl>
                            }
                        />

                        {/* fallback route */}
                        <Route path="*" element={<Home />} />
                    </Routes>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
