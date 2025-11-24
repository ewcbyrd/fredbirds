import React, { useState } from 'react'
import { Box, Card, CardHeader, CardContent, IconButton, Typography, Collapse, Divider, Grid, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import NumbersIcon from '@mui/icons-material/Numbers'
import PersonIcon from '@mui/icons-material/Person'
import MapIcon from '@mui/icons-material/Map'
import MapModal from './MapModal'

export default function MySightings({ sightings = [], header = 'Sightings', viewtype, filter }) {
  const [openIds, setOpenIds] = useState(new Set())
  const [mapOpen, setMapOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const toggleId = (id) => {
    const s = new Set(openIds)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setOpenIds(s)
  }

  const handleIndividualClick = (record, event) => {
    event.stopPropagation()
    setSelectedRecord(record)
    setMapOpen(true)
  }

  const handleCloseMap = () => {
    setMapOpen(false)
    setSelectedRecord(null)
  }

  const groupByLocality = (records) => {
    const groups = {}
    records.forEach((record) => {
      const locality = record.locality || 'Unknown'
      if (!groups[locality]) {
        groups[locality] = []
      }
      groups[locality].push(record)
    })
    return groups
  }

  return (
    <Box>
      {sightings && sightings.length > 0 ? (
        sightings.map((s) => {
          const groupedSightings = groupByLocality(s.individualSightings || [])
          
          return (
            <Box key={s.id || s.name} sx={{ mb: 2 }}>
              <Card sx={{ 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                borderRadius: 2,
                transition: 'box-shadow 0.3s ease',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
              }}>
                <CardHeader
                  title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{s.name}</Typography>}
                  subheader={s.locations || s.primaryLocation || ''}
                  action={
                    <IconButton onClick={() => toggleId(s.id || s.name)}>
                      <ExpandMoreIcon />
                    </IconButton>
                  }
                  sx={{ pb: 1 }}
                />
                <CardContent>
                  {s.isRare || s.rare ? (
                    <Box sx={{ 
                      mb: 2, 
                      p: 1.5, 
                      bgcolor: '#e8f5e9', 
                      borderRadius: 1.5,
                      borderLeft: '4px solid #2e7d32',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1b5e20' }}>
                        This is considered a rare species in this region.
                      </Typography>
                    </Box>
                  ) : null}

                  <Collapse in={openIds.has(s.id || s.name)}>
                    <Box sx={{ mt: 1 }}>
                      {Object.entries(groupedSightings).map(([locality, records]) => {
                        const localityId = `${s.id || s.name}-${locality}`
                        const mostRecentDate = records.reduce((latest, record) => {
                          const recordDate = new Date(record.date)
                          return recordDate > latest ? recordDate : latest
                        }, new Date(0))
                        const formattedDate = mostRecentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        
                        return (
                          <Box key={locality} sx={{ mb: 1.5 }}>
                            <Card sx={{ 
                              bgcolor: '#f7faf7',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                              borderRadius: 1.5
                            }}>
                              <CardHeader
                                title={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="subtitle1">{locality}</Typography>
                                    <Typography variant="body2" color="text.secondary">• {formattedDate}</Typography>
                                  </Box>
                                }
                                subheader={`${records.length} sighting${records.length !== 1 ? 's' : ''}`}
                                action={
                                  <IconButton onClick={() => toggleId(localityId)} size="small">
                                    <ExpandMoreIcon />
                                  </IconButton>
                                }
                                sx={{ py: 1 }}
                              />
                              <Collapse in={openIds.has(localityId)}>
                                <CardContent sx={{ pt: 0 }}>
                                  {records.map((record) => (
                                    <Card 
                                      key={record.id || record.date} 
                                      sx={{ 
                                        mb: 1,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                        borderRadius: 1,
                                        transition: 'all 0.2s ease',
                                        '&:hover': { 
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                        }
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
                                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                                                {record.location}
                                              </Typography>
                                              <Box sx={{ mt: 'auto' }}>
                                                <Button 
                                                  variant="contained" 
                                                  size="medium"
                                                  startIcon={<MapIcon />}
                                                  onClick={(e) => handleIndividualClick(record, e)}
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
                                                    {new Date(record.date).toLocaleString('en-US', { 
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
                                                    {record.quantity || 'Unknown'}
                                                  </Typography>
                                                </Box>
                                              </Box>

                                              {/* Observer */}
                                              {viewtype !== 'nearby' && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                  <PersonIcon sx={{ fontSize: 20, color: '#2c5f2d' }} />
                                                  <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                                                      Observer
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                      {record.by}
                                                    </Typography>
                                                  </Box>
                                                </Box>
                                              )}
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </CardContent>
                              </Collapse>
                            </Card>
                          </Box>
                        )
                      })}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Box>
          )
        })
      ) : (
        <Typography color="text.secondary">No sightings.</Typography>
      )}
      
      <MapModal open={mapOpen} onClose={handleCloseMap} record={selectedRecord} />
    </Box>
  )
}
