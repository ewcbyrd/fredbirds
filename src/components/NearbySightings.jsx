import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Box, Button, Chip, IconButton, Tooltip } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StarIcon from '@mui/icons-material/Star'
import { getNearbyNotableObservations } from '../services/ebirdService'
import { isRareBird } from '../utils/rareBirdsUtils'

export default function NearbySightings({ onViewAll }) {
  const [sightings, setSightings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const opts = { lat: 38.31, long: -77.46, daysBack: 7, dist: 30 }
    setLoading(true)
    getNearbyNotableObservations(opts)
      .then((result) => {
        const sightingsMap = new Map()
        result.forEach((item) => {
          item.obsDt = new Date(item.obsDt)
          const key = item.speciesCode + item.subnational2Name
          const existing = sightingsMap.get(key)
          if (!existing || item.obsDt > existing.obsDt) sightingsMap.set(key, item)
        })
        setSightings(Array.from(sightingsMap.values()).slice(0, 8)) // Limit to 8 for cleaner display
      })
      .catch(() => setSightings([]))
      .finally(() => setLoading(false))
  }, [])

  const getRecencyColor = (date) => {
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Green for today, yellow for yesterday, red for anything else
    if (diffDays === 0) return {
      bg: '#e8f5e9',
      text: '#2e7d32',
      label: 'Today',
      border: '#2e7d32',
      cardBg: '#f1f8f4'
    }
    if (diffDays === 1) return {
      bg: '#fff9c4',
      text: '#f57f17',
      label: 'Yesterday',
      border: '#f57f17',
      cardBg: '#fffef0'
    }
    return {
      bg: '#ffebee',
      text: '#c62828',
      label: `${diffDays} days ago`,
      border: '#c62828',
      cardBg: '#fef5f5'
    }
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        Notable Regional Sightings
      </Typography>

      {loading ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">Loading sightings...</Typography>
        </Card>
      ) : sightings.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography variant="body1" color="text.secondary">
            No notable sightings in the past week
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back soon for rare bird alerts in the Fredericksburg area
          </Typography>
        </Card>
      ) : (
        <>
          <Grid container spacing={2}>
            {sightings.map((s, index) => {
              const recency = getRecencyColor(s.obsDt)
              const isRare = isRareBird(s.sciName)

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={s.obsId}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      bgcolor: 'rgba(255, 255, 255, 0.95)', // Slightly translucent
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                        bgcolor: 'white'
                      }
                    }}
                  >
                    {/* Top colored bar based on recency */}
                    <Box sx={{ height: 6, bgcolor: recency.border, width: '100%' }} />

                    {/* Recency Badge */}
                    <Chip
                      label={recency.label}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 14,
                        right: 12,
                        bgcolor: recency.bg,
                        color: recency.text,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 22,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    />

                    <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Bird Name & Rare Star */}
                      <Box sx={{ pr: isRare ? 4 : 0, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {isRare && (
                            <Tooltip title="Rare Bird Alert!" arrow>
                              <StarIcon
                                sx={{
                                  fontSize: 20,
                                  color: '#ff9800', // Amber
                                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                                  animation: 'pulse 2s infinite'
                                }}
                              />
                            </Tooltip>
                          )}
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              lineHeight: 1.2,
                              color: '#2c3e50'
                            }}
                          >
                            {s.comName}
                          </Typography>
                        </Box>

                        {s.sciName && (
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontStyle: 'italic',
                              color: '#7f8c8d',
                              fontSize: '0.85rem',
                              mt: 0.5
                            }}
                          >
                            {s.sciName}
                          </Typography>
                        )}
                      </Box>

                      {/* Location with Icon - Vertically Centered */}
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        py: 1
                      }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: '#95a5a6', mt: 0.2 }} />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: '#34495e',
                                lineHeight: 1.4
                              }}
                            >
                              {s.locName || s.subnational2Name}
                            </Typography>
                            {s.locName && (
                              <Typography variant="caption" color="text.secondary">
                                {s.subnational2Name}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>



                      {/* Footer: Observer & eBird Link */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#95a5a6',
                            fontWeight: 500,
                            maxWidth: '80%'
                          }}
                          noWrap
                        >
                          {s.userDisplayName || 'Anonymous'}
                        </Typography>

                        <Tooltip title="View Checklist">
                          <IconButton
                            size="small"
                            component="a"
                            href={`https://ebird.org/checklist/${s.subId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: '#3498db',
                              bgcolor: '#e3f2fd',
                              '&:hover': { bgcolor: '#bbdefb' }
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                borderWidth: 2,
                borderRadius: 50,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderWidth: 2
                }
              }}
              onClick={() => onViewAll && onViewAll('sightings')}
            >
              View More Sightings
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
