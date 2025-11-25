import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
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

  if (!items.length) return (<Typography variant="body1" color="text.secondary">There is no current club news</Typography>)

  return (
    <Grid container spacing={2}>
      {items.map(item=> (
        <Grid item xs={12} key={item._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>{item.headline}</Typography>
              <Box>{formatText(item.details)}</Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
