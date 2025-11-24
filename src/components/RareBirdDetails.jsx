import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'

export default function RareBirdDetails({ bird, imageUrl, onClose }) {
  if (!bird) return null

  return (
    <Dialog open={!!bird} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{bird.commonName || bird.name || bird.title}</DialogTitle>
      <DialogContent>
        {imageUrl ? (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={imageUrl} alt={bird.commonName || bird.name} style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        ) : null}
        <Typography variant="subtitle2">Scientific Name</Typography>
        <Typography sx={{ mb: 1 }}>{bird.scientific || bird.sciName || ''}</Typography>
        <Typography variant="subtitle2">Details</Typography>
        <Typography>{bird.notes || bird.description || ''}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
