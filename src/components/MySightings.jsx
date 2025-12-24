import React, { useState, useEffect } from 'react'
import { Box, Card, CardHeader, CardContent, IconButton, Typography, Collapse, Divider, Grid, Button, Chip } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import NumbersIcon from '@mui/icons-material/Numbers'
import PersonIcon from '@mui/icons-material/Person'
import MapIcon from '@mui/icons-material/Map'
import StarIcon from '@mui/icons-material/Star'
import MapModal from './MapModal'
import { isRareBird } from '../utils/rareBirdsUtils'

export default function MySightings({ sightings = [], header = 'Sightings', viewtype, filter }) {
  const [openIds, setOpenIds] = useState(new Set())
  const [mapOpen, setMapOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [displayLimit, setDisplayLimit] = useState(20)

  // Reset display limit when sightings change
  useEffect(() => {
    setDisplayLimit(20)
  }, [sightings])

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

  const displayedSightings = sightings.slice(0, displayLimit)
  const hasMore = sightings.length > displayLimit

  return (
    <Box>
      {sightings && sightings.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedSightings.map((s) => {
              const groupedSightings = groupByLocality(s.individualSightings || [])
              const isRare = s.isRare || isRareBird(s.scientific)

              return (
                <Grid item xs={12} md={6} lg={4} key={s.id || s.name}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <CardHeader
                      title={
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '1.1rem' }}>
                            {s.name}
                          </Typography>
                          {isRare && (
                            <Chip
                              label="Rare"
                              size="small"
                              icon={<StarIcon sx={{ fontSize: '1rem !important' }} />}
                              sx={{
                                bgcolor: '#fff3e0',
                                color: '#e65100',
                                fontWeight: 700,
                                border: '1px solid #ffe0b2',
                                height: 24
                              }}
                            />
                          )}
                        </Box>
                      }
                      subheader={
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 0.5 }}>
                          {s.scientific}
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />

                    <CardContent sx={{ pt: 1, flexGrow: 1 }}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c5f2d' }}>
                            Locations:
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {s.locations || s.primaryLocation || 'Various'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c5f2d' }}>
                            Most Recent:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {s.mostRecent ? new Date(s.mostRecent).toLocaleDateString() : 'Unknown'}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={openIds.has(s.id || s.name) ? <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} /> : <ExpandMoreIcon />}
                        onClick={() => toggleId(s.id || s.name)}
                        sx={{
                          color: '#2c5f2d',
                          borderColor: 'rgba(44, 95, 45, 0.3)',
                          '&:hover': {
                            borderColor: '#2c5f2d',
                            bgcolor: 'rgba(44, 95, 45, 0.04)'
                          }
                        }}
                      >
                        {openIds.has(s.id || s.name) ? 'Hide Details' : 'View Reports'}
                      </Button>

                      <Collapse in={openIds.has(s.id || s.name)}>
                        <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto', pr: 0.5 }}>
                          {Object.entries(groupedSightings).map(([locality, records]) => {
                            const localityId = `${s.id || s.name}-${locality}`

                            return (
                              <Box key={locality} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                                <Box sx={{
                                  bgcolor: '#f8f9fa',
                                  p: 1.5,
                                  borderRadius: 2,
                                  border: '1px solid #eee'
                                }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                                    {locality}
                                  </Typography>

                                  {records.map((record, idx) => (
                                    <Box key={idx} sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      mb: 1,
                                      pb: 1,
                                      borderBottom: idx < records.length - 1 ? '1px dashed #e0e0e0' : 'none',
                                      '&:last-child': { mb: 0, pb: 0 }
                                    }}>
                                      <Box>
                                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#555' }}>
                                          {new Date(record.date).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Qty: {record.quantity || '?'} • {record.by}
                                        </Typography>
                                      </Box>
                                      <IconButton
                                        size="small"
                                        onClick={(e) => handleIndividualClick(record, e)}
                                        sx={{
                                          color: '#2c5f2d',
                                          bgcolor: 'white',
                                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                          '&:hover': { bgcolor: '#f1f8f4' }
                                        }}
                                      >
                                        <MapIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => setDisplayLimit(prev => prev + 20)}
                sx={{
                  bgcolor: '#2c5f2d',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                  boxShadow: '0 4px 12px rgba(44, 95, 45, 0.2)',
                  '&:hover': {
                    bgcolor: '#1b4d24',
                    boxShadow: '0 6px 16px rgba(44, 95, 45, 0.3)'
                  }
                }}
              >
                Load More Sightings ({sightings.length - displayLimit} remaining)
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8f9fa', borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No sightings found for this view.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting availability settings or checking back later.
          </Typography>
        </Box>
      )}

      <MapModal open={mapOpen} onClose={handleCloseMap} record={selectedRecord} />
    </Box>
  )
}
