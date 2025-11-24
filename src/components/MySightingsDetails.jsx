import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import NumbersIcon from '@mui/icons-material/Numbers'
import PersonIcon from '@mui/icons-material/Person'
import MapIcon from '@mui/icons-material/Map'
import MapModal from './MapModal'

export default function MySightingsDetails({ sightings = [], viewtype }) {
  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const openMap = (r) => {
    setRecord(r)
    setOpen(true)
  }

  const closeMap = () => {
    setOpen(false)
    setRecord(null)
  }

  if (!sightings || sightings.length === 0) return <Typography color="text.secondary">No details selected.</Typography>

  return (
    <Box>
      {sightings.map((r, idx) => (
        <Card 
          key={r.id || idx} 
          sx={{ 
            mb: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: 2,
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
          }}
        >
          <CardContent>
            <Grid container spacing={3}>
              {/* Left Column - Location */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  pr: { md: 2 },
                  borderRight: { md: '1px solid #e0e0e0' }
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                    {r.location}
                  </Typography>
                  {r.locality && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {r.locality}
                    </Typography>
                  )}
                  <Box sx={{ mt: 'auto' }}>
                    <Button 
                      variant="contained" 
                      size="medium"
                      startIcon={<MapIcon />}
                      onClick={() => openMap(r)}
                      sx={{
                        bgcolor: '#2c5f2d',
                        py: 1,
                        px: 3,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(44, 95, 45, 0.3)',
                        '&:hover': {
                          bgcolor: '#234d24',
                          boxShadow: '0 4px 8px rgba(44, 95, 45, 0.4)'
                        }
                      }}
                    >
                      View Map
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column - Details */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 20, color: '#2c5f2d' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(r.date).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Count */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <NumbersIcon sx={{ fontSize: 20, color: '#2c5f2d' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                        Count
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {r.quantity || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Observer */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonIcon sx={{ fontSize: 20, color: '#2c5f2d' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                        Observer
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {r.by}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <MapModal open={open} onClose={closeMap} record={record} />
    </Box>
  )
}
