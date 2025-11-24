import React, { useEffect, useState, useMemo } from 'react'
import { Box, Grid, Card, CardContent, CardHeader, Typography, CardActionArea, CardMedia } from '@mui/material'
import { getRareBirds } from '../services/restdbService'
import RareBirdDetails from './RareBirdDetails'

export default function RareBirds() {
  const [birds, setBirds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await getRareBirds()
        const data = typeof res.json === 'function' ? await res.json() : res
        if (!cancelled) setBirds(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('getRareBirds error', e)
        if (!cancelled) setBirds([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Build a filename -> url map for images in src/resources/photos
  const images = useMemo(() => {
    try {
      const modules = import.meta.glob('../resources/photos/*.{jpg,jpeg,png,svg}', { query: '?url', import: 'default', eager: true })
      const map = {}
      Object.entries(modules).forEach(([p, url]) => {
        const fname = p.split('/').pop().toLowerCase()
        map[fname] = url
      })
      return map
    } catch (e) {
      return {}
    }
  }, [])

  function resolveImage(bird) {
    if (!bird) return null
    const cand = bird.photo || bird.image || bird.photoFile || bird.photoUrl || bird.filename || bird.file
    if (!cand) return null
    // if it's already a full URL, use it
    if (typeof cand === 'string' && (cand.startsWith('http://') || cand.startsWith('https://') || cand.startsWith('data:'))) return cand
    // normalize to filename
    const parts = String(cand).split('/')
    const fname = parts[parts.length - 1].toLowerCase()
    return images[fname] || null
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Rare Birds</Typography>
      {loading ? <Typography>Loading...</Typography> : null}
      <Grid container spacing={2}>
        {birds.map((b) => {
          const imgUrl = resolveImage(b)
          return (
            <Grid item xs={12} sm={6} md={4} key={b._id || b.id || b.name}>
              <Card>
                <CardActionArea onClick={() => setSelected(b)}>
                  {imgUrl ? <CardMedia component="img" image={imgUrl} alt={b.commonName || b.name} sx={{ height: 180, objectFit: 'cover' }} /> : null}
                  <CardHeader title={b.commonName || b.name || b.title} subheader={b.scientific || b.sciName || ''} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 80, overflow: 'hidden' }}>
                      {b.notes || b.description || ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <RareBirdDetails bird={selected} imageUrl={resolveImage(selected)} onClose={() => setSelected(null)} />
    </Box>
  )
}
