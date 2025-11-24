import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from '@mui/material/Icon'
import { useNavigate } from 'react-router-dom'

export default function MenuButton({ onNavigate }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const navigate = useNavigate()

  const viewMap = {
    home: '/',
    about: '/about',
    announcements: '/announcements',
    events: '/events',
    membership: '/membership',
    newsletters: '/newsletters',
    faqs: '/faqs',
    contact: '/contact',
    sightings: '/sightings',
    hotspots: '/hotspots',
    news: '/news',
    newsfeed: '/newsfeed',
    rarebirds: '/rarebirds',
    resources: '/resources',
    officers: '/officers',
    photos: '/photos'
  }

  const handleSelect = (value) => {
    handleClose()
    if (onNavigate) {
      onNavigate(value)
      return
    }
    const path = viewMap[value] || '/'
    navigate(path)
  }

  return (
    <div>
      <Button
        aria-controls={open ? 'app-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        sx={{ bgcolor: 'transparent', color: 'white', textTransform: 'none', boxShadow: 'none' }}
        endIcon={<Icon>menu</Icon>}
      >
        FBC
      </Button>
      <Menu id="app-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect('home')}>Home</MenuItem>
        <MenuItem onClick={() => handleSelect('about')}>About</MenuItem>
        <MenuItem onClick={() => handleSelect('announcements')}>Club News</MenuItem>
        <MenuItem onClick={() => handleSelect('events')}>Events</MenuItem>
        <MenuItem onClick={() => handleSelect('newsletters')}>Newsletters</MenuItem>
        <MenuItem onClick={() => handleSelect('membership')}>Membership</MenuItem>
        <MenuItem onClick={() => handleSelect('officers')}>Officers</MenuItem>
        <MenuItem onClick={() => handleSelect('faqs')}>FAQ's</MenuItem>
        <MenuItem onClick={() => handleSelect('contact')}>Contact</MenuItem>
        <MenuItem onClick={() => handleSelect('sightings')}>Sightings</MenuItem>
        <MenuItem onClick={() => handleSelect('hotspots')}>Hotspots</MenuItem>
        <MenuItem onClick={() => handleSelect('rarebirds')}>Rare Birds</MenuItem>
        <MenuItem onClick={() => handleSelect('newsfeed')}>Birding News</MenuItem>
        <MenuItem onClick={() => handleSelect('resources')}>Resources</MenuItem>
        <MenuItem onClick={() => handleSelect('photos')}>Photos</MenuItem>
      </Menu>
    </div>
  )
}
