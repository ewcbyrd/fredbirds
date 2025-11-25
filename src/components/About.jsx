import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import vsoLogo from '../resources/photos/vso.png'

export default function About() {
  const navigate = useNavigate()

  const handleViewEventsClick = (e) => {
    e.preventDefault()
    navigate('/events')
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
        About Us
      </Typography>
      
      <Card sx={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: 2,
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flexShrink: 0 }}>
              <img 
                src={vsoLogo} 
                alt="Virginia Society of Ornithology"
                style={{ maxWidth: '200px' }}
              />
            </Box>
            <Box sx={{ 
              flex: 1, 
              minWidth: '300px',
              '& a': {
                color: '#2c5f2d',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }
            }}>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                The Fredericksburg Birding Club (FBC) is made up of about 30 active members from the greater Fredericksburg area. 
                We are a local chapter of the Virginia Society of Ornithology (<a href="https://www.virginiabirds.org/" target="_blank" rel="noopener noreferrer">VSO</a>) with several of our members active in the organization. 
                In May of 2009 the FBC organized and hosted the annual meeting of the VSO.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                Many opportunities are provided for members to enjoy birds locally and across the state. 
                Club Coordinator, Mike Lott, and other FBC members lead numerous field trips throughout the year (see our <a href="#" onClick={handleViewEventsClick}>Calendar of Events</a>). 
                In addition to these, the FBC participates with fellow VSO chapters in birding activities. 
                Our trip leaders and members are always happy to help beginning birders develop their love of birding and grow more familiar with our local birds. 
                Speaking engagements on bird research and conservation are also offered.
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                The FBC supports the mission of the VSO and its <a href="https://www.virginiabirds.org/publications/birding-ethics" target="_blank" rel="noopener noreferrer">Principles of Birding Ethics</a>. 
                We also support environmental education and the conservation of birds and their habitats through financial donations and volunteering time to various organizations.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                As a member of the FBC, your benefits include numerous birding and educational activities and the opportunity to share your interest with other bird enthusiasts in the area.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
