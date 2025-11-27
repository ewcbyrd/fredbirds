import React, { useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Header from './components/Header'
import Events from './components/Events'
import Announcements from './components/Announcements'
import NearbySightings from './components/NearbySightings'
import Home from './components/Home'
import About from './components/About'
import News from './components/News'
import NewsFeed from './components/NewsFeed'
import Newsletters from './components/Newsletters'
import Contact from './components/Contact'
import FAQs from './components/FAQs'
import Membership from './components/Membership'
import MembershipList from './components/MembershipList'
import Resources from './components/Resources'
import Officers from './components/Officers'
import Photos from './components/Photos'
import { Routes, Route, useNavigate } from 'react-router-dom'

const theme = createTheme({
  palette: {
    mode: 'light'
  }
})

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // initial data loading could go here
  }, [])

  function handleNavigate(view) {
    const map = {
      home: '/',
      events: '/events',
      announcements: '/announcements',
      sightings: '/sightings',
      about: '/about',
      membership: '/membership',
      membershiplist: '/membership/list',
      newsletters: '/newsletters',
      faqs: '/faqs',
      contact: '/contact',
      news: '/news',
      newsfeed: '/newsfeed',
      resources: '/resources',
      officers: '/officers',
      photos: '/photos'
    }
    const path = map[view] || '/'
    navigate(path)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: '#f5f7f9', minHeight: '100vh' }}>
        <Header onNavigate={handleNavigate} />
        <Container sx={{ py: 0, px: 0 }} maxWidth={false}>
          <Routes>
            <Route path="/" element={<Home onNavigate={handleNavigate} />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/sightings" element={<Resources />} />
            <Route path="/news" element={<News />} />
            <Route path="/newsfeed" element={<NewsFeed />} />
            <Route path="/newsletters" element={<Newsletters />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membership/list" element={<MembershipList />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/officers" element={<Officers />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            {/* fallback route */}
            <Route path="*" element={<Home onNavigate={handleNavigate} />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
