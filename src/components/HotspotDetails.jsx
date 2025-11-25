import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, CircularProgress, List, ListItem, ListItemText, Divider, Link } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { getHotspotDetails, getSpeciesDetailsByLocation } from '../services/ebirdService'

export default function HotspotDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotspot, setHotspot] = useState(null)
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const details = await getHotspotDetails(id)
        if (!cancelled) setHotspot(details)

        const speciesData = await getSpeciesDetailsByLocation(id)
        if (!cancelled) {
          const sorted = Array.isArray(speciesData)
            ? speciesData.sort((a, b) => (a.comName > b.comName ? 1 : -1))
            : []
          setSpecies(sorted)
        }
      } catch (e) {
        console.error('hotspot details error', e)
        if (!cancelled) setError(e.message || String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Card>
          <CardContent>
            <Typography color="error">Error loading hotspot: {error}</Typography>
            <Link component="button" onClick={() => navigate('/hotspots')} sx={{ mt: 1 }}>
              ← Back to Hotspots
            </Link>
          </CardContent>
        </Card>
      </Box>
    )
  }

  if (!hotspot) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Card>
          <CardContent>
            <Typography>No hotspot data available.</Typography>
            <Link component="button" onClick={() => navigate('/hotspots')} sx={{ mt: 1 }}>
              ← Back to Hotspots
            </Link>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const mapUrl = hotspot.lat && hotspot.lng
    ? apiKey 
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${hotspot.lat},${hotspot.lng}&zoom=14`
      : `https://www.google.com/maps?q=${hotspot.lat},${hotspot.lng}&output=embed&z=14`
    : null

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Link component="button" onClick={() => navigate('/hotspots')} sx={{ mb: 2, display: 'inline-block' }}>
        ← Back to Hotspots
      </Link>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>{hotspot.name || hotspot.locName || id}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Location ID: {hotspot.locId || id}
          </Typography>
          {hotspot.lat && hotspot.lng ? (
            <Typography variant="body2" color="text.secondary">
              Coordinates: {hotspot.lat}, {hotspot.lng}
            </Typography>
          ) : null}
          {hotspot.countryCode || hotspot.subnational1Code ? (
            <Typography variant="body2" color="text.secondary">
              Region: {hotspot.subnational1Code || hotspot.countryCode}
            </Typography>
          ) : null}
          {hotspot.numSpeciesAllTime ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              All-time species count: {hotspot.numSpeciesAllTime}
            </Typography>
          ) : null}
        </CardContent>
      </Card>

      {mapUrl ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>Map</Typography>
            <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
              <iframe
                src={mapUrl}
                title="Hotspot Map"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
              />
            </Box>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Species Observed ({species.length})</Typography>
          {species.length === 0 ? (
            <Typography>No species data available.</Typography>
          ) : (
            <List sx={{ maxHeight: 500, overflow: 'auto' }}>
              {species.map((s, idx) => (
                <React.Fragment key={s.speciesCode || idx}>
                  <ListItem>
                    <ListItemText
                      primary={s.comName || s.name}
                      secondary={s.sciName || s.scientific || ''}
                    />
                  </ListItem>
                  {idx < species.length - 1 ? <Divider component="li" /> : null}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
