import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Box, Button, Chip, IconButton, Tooltip } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { getNearbyNotableObservations } from '../services/ebirdService'

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
          mb: 3, 
          fontWeight: 700,
          color: '#1a1a1a'
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
              
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={s.obsId}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      position: 'relative',
                      transition: 'all 0.2s',
                      borderLeft: `4px solid ${recency.border}`,
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {/* Recency Badge */}
                    <Chip 
                      label={recency.label}
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        bgcolor: recency.bg,
                        color: recency.text,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 18,
                        zIndex: 1
                      }}
                    />

                    <CardContent sx={{ p: 1.5, pb: 1.25, '&:last-child': { pb: 1.25 } }}>
                      {/* Bird Name */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          mb: 0.75,
                          pr: 6, // Space for badge
                          lineHeight: 1.2
                        }}
                      >
                        {s.comName}
                      </Typography>

                      {/* Scientific Name */}
                      {s.sciName && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block',
                            fontStyle: 'italic',
                            color: 'text.secondary',
                            mb: 0.75,
                            fontSize: '0.7rem'
                          }}
                        >
                          {s.sciName}
                        </Typography>
                      )}

                      {/* Location */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 14, color: recency.border, mt: 0.25, flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500, 
                              lineHeight: 1.3,
                              fontSize: '0.8rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {s.locName || s.subnational2Name}
                          </Typography>
                          {s.locName && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ fontSize: '0.7rem' }}
                            >
                              {s.subnational2Name}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Observer */}
                      {s.userDisplayName && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            fontSize: '0.7rem',
                            mb: 0.5
                          }}
                        >
                          Observer: {s.userDisplayName}
                        </Typography>
                      )}

                      {/* eBird Link - Always Visible */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                        <Tooltip title="View on eBird">
                          <IconButton
                            size="small"
                            component="a"
                            href={`https://ebird.org/checklist/${s.subId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={{ 
                              p: 0.5,
                              color: recency.border,
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)'
                              }
                            }}
                          >
                            <OpenInNewIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          <Button 
            variant="contained"
            fullWidth
            size="large"
            sx={{ 
              mt: 4,
              bgcolor: '#2c5f2d',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(44, 95, 45, 0.3)',
              '&:hover': {
                bgcolor: '#1e4620',
                boxShadow: '0 6px 16px rgba(44, 95, 45, 0.4)'
              }
            }}
            onClick={() => onViewAll && onViewAll('resources')}
          >
            View All Sightings
          </Button>
        </>
      )}
    </Box>
  )
}
