import React from 'react'
import { Button, Typography, Box } from '@mui/material'
import AppDialog from './common/AppDialog'

function buildMapSrc(lat, lon) {
  if (!lat || !lon) return null
  const ll = `${lat},${lon}`
  return `https://maps.google.com/maps?q=${encodeURIComponent(ll)}&z=15&output=embed`
}

export default function MapModal({ open, onClose, record }) {
  if (!record) return null
  const lat = record.lat || record.latitude || record.latitud || record.latLng || record.latLon || record.latitude_decimal
  const lon = record.lon || record.longitude || record.longitud || record.lng || record.lonLon || record.longitude_decimal
  const src = buildMapSrc(lat, lon)

  const actions = (
    <Button onClick={onClose}>Close</Button>
  )

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title="Sighting Location"
      actions={actions}
      maxWidth="md"
    >
      {src ? (
        <Box sx={{ height: 400 }}>
          <iframe title="map" src={src} width="100%" height="100%" style={{ border: 0 }} />
        </Box>
      ) : (
        <Typography>No location data available for this sighting.</Typography>
      )}
    </AppDialog>
  )
}
