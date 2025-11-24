import React from 'react'
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material'

export default function ContactTile({ contact }) {
  if (!contact) return <Typography>No contact data available.</Typography>

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={contact.Picture} alt={contact.Name} sx={{ width: 80, height: 80 }} />
          <Box>
            <Typography variant="h6">{contact.Name}</Typography>
            <Typography variant="body2" color="text.secondary">{contact.Title}</Typography>
            <Typography variant="body2">{contact.Phone}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
