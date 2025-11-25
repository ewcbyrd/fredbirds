import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import { getAnnouncements } from '../services/restdbService'

export default function Announcements(){
  const [items, setItems] = useState([])

  useEffect(()=>{
    getAnnouncements().then(data=> setItems(data || []))
  },[])

  // Function to format text content for display
  const formatText = (text) => {
    if (!text) return text;
    
    // Split by double newlines to get paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => (
      <Box key={index} component="div" sx={{ mb: paragraph.includes('•') ? 1 : 2 }}>
        {paragraph.split('\n').map((line, lineIndex) => {
          // Handle bullet points
          if (line.trim().startsWith('•')) {
            return (
              <Box key={lineIndex} component="div" sx={{ ml: 2, mb: 0.5 }}>
                {renderTextWithLinks(line)}
              </Box>
            );
          }
          // Handle section headers (lines with emojis at start)
          else if (/^[\u{1F300}-\u{1F9FF}]/u.test(line.trim())) {
            return (
              <Typography key={lineIndex} variant="body2" sx={{ fontWeight: 'bold', mt: 1, mb: 0.5 }}>
                {renderTextWithLinks(line)}
              </Typography>
            );
          }
          // Regular text
          else if (line.trim()) {
            return (
              <Typography key={lineIndex} variant="body2" sx={{ mb: 0.5 }}>
                {renderTextWithLinks(line)}
              </Typography>
            );
          }
          return null;
        })}
      </Box>
    ));
  };

  // Function to detect URLs and render them as clickable links
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Link 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ color: 'primary.main', textDecoration: 'underline' }}
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  if (!items.length) return (
    <Box sx={{ bgcolor: '#f7faf7', minHeight: '50vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Club Announcements
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Stay updated with the latest news and important information from the Fredericksburg Birding Club
          </Typography>
        </Box>

        {/* No Announcements Message */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <AnnouncementIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            There is no current club news
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Check back soon for updates and announcements
          </Typography>
        </Box>
      </Container>
    </Box>
  )

  return (
    <Box sx={{ bgcolor: '#f7faf7', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Club Announcements
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Stay updated with the latest news and important information from the Fredericksburg Birding Club
          </Typography>
        </Box>

        {/* Announcements Grid */}
        <Grid container spacing={3}>
          {items.map(item=> (
            <Grid item xs={12} key={item._id}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Announcement Header */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <AnnouncementIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                      <Chip 
                        label="Announcement" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.50',
                          color: 'primary.700',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: 'text.primary',
                        lineHeight: 1.3,
                        mb: 2
                      }}
                    >
                      {item.headline}
                    </Typography>
                    
                    {item.date && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}
                      >
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Announcement Content */}
                  <Box sx={{ 
                    '& p': { mb: 1 },
                    '& .MuiTypography-root': { 
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }
                  }}>
                    {formatText(item.details)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
