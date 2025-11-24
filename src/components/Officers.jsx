import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import ContactTile from './ContactTile'
import imgScott from '../resources/photos/scott_byrd.jpg?url'

export default function Officers() {
  const contact = {
    Name: 'Scott Byrd',
    Title: 'Web Master',
    Phone: '5406568078',
    Picture: imgScott
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Officers</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ContactTile contact={contact} />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* placeholder for additional officers or content */}
        </Grid>
      </Grid>
    </Box>
  )
}
