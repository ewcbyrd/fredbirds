import React from 'react'
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material'

// Format phone number as (###) ###-####
const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if we have 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  // Return original if not 10 digits
  return phone
}

export default function ContactTile({ contact }) {
  if (!contact) return <Typography>No contact data available.</Typography>

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={contact.Picture} 
            alt={contact.Name} 
            sx={{ width: 80, height: 80 }}
            imgProps={{ crossOrigin: 'anonymous' }}
          />
          <Box>
            <Typography variant="h6">{contact.Name}</Typography>
            <Typography variant="body2" color="text.secondary">{contact.Title}</Typography>
            {contact.Email && <Typography variant="body2">{contact.Email}</Typography>}
            {contact.Phone && <Typography variant="body2">{formatPhoneNumber(contact.Phone)}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
