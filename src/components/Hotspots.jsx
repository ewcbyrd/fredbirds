import React, { useEffect, useState } from 'react'
import { Box, Card, CardHeader, CardContent, Typography, IconButton, Autocomplete, TextField, Button } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getCounties } from '../services/restdbService'
import { getNearbyHotspots } from '../services/ebirdService'
import { useNavigate } from 'react-router-dom'

export default function Hotspots() {
  const [selectedCounty, setSelectedCounty] = useState(null)
  const [countyOptions, setCountyOptions] = useState([])
  const [allHotspots, setAllHotspots] = useState([])
  const [filteredHotspots, setFilteredHotspots] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCounties()
    loadHotspots()
  }, [])

  useEffect(() => {
    filterHotspots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCounty, allHotspots])

  const handleCountyChange = (event, newValue) => {
    setSelectedCounty(newValue)
  }

  async function fetchCounties() {
    try {
      const res = await getCounties()
      // Filter for Virginia counties only
      const vaCounties = Array.isArray(res) 
        ? res.filter(c => c.code.startsWith('US-VA'))
            .map((i) => ({ label: i.county, code: i.code })) 
        : []
      vaCounties.sort((a, b) => a.label.localeCompare(b.label))
      setCountyOptions(vaCounties)
      sessionStorage.setItem('vaCounties', JSON.stringify(vaCounties))
      
      // Set default to Spotsylvania
      const spotsylvania = vaCounties.find(c => c.label === 'Spotsylvania')
      if (spotsylvania) {
        setSelectedCounty(spotsylvania)
      }
    } catch (e) {
      const cached = sessionStorage.getItem('vaCounties')
      if (cached) {
        const opts = JSON.parse(cached)
        opts.sort((a, b) => a.label.localeCompare(b.label))
        setCountyOptions(opts)
        
        // Set default to Spotsylvania
        const spotsylvania = opts.find(c => c.label === 'Spotsylvania')
        if (spotsylvania) {
          setSelectedCounty(spotsylvania)
        }
      }
    }
  }

  async function loadHotspots() {
    const cached = sessionStorage.getItem('hotspots')
    if (cached) {
      try {
        const hotspots = JSON.parse(cached)
        setAllHotspots(hotspots)
        return
      } catch (e) {
        // ignore parse error and fetch
      }
    }

    setLoading(true)
    try {
      // Use Fredericksburg area as center point with large radius to get VA hotspots
      const res = await getNearbyHotspots({ lat: 38.31, long: -77.46, dist: 250 })
      const items = Array.isArray(res) ? res : []
      setAllHotspots(items)
      sessionStorage.setItem('hotspots', JSON.stringify(items))
    } catch (err) {
      console.error('Error loading hotspots:', err)
      setAllHotspots([])
    } finally {
      setLoading(false)
    }
  }

  function filterHotspots() {
    if (!allHotspots || allHotspots.length === 0) {
      setFilteredHotspots([])
      return
    }

    let filtered = allHotspots
      .filter(h => h.subnational1Code === 'US-VA') // Only Virginia hotspots

    // Filter by county if selected
    if (selectedCounty && selectedCounty.code) {
      filtered = filtered.filter(h => h.subnational2Code === selectedCounty.code)
    }

    // Sort by name
    filtered.sort((a, b) => (a.locName > b.locName ? 1 : -1))
    setFilteredHotspots(filtered)
  }

  const handleRefresh = () => {
    sessionStorage.removeItem('hotspots')
    setAllHotspots([])
    loadHotspots()
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2, '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              Hotspots
            </Typography>
          }
          action={
            <IconButton 
              onClick={handleRefresh}
              sx={{ 
                color: '#2c5f2d',
                '&:hover': { bgcolor: 'rgba(44, 95, 45, 0.08)' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          }
          sx={{ pb: 1 }}
        />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              options={countyOptions}
              value={selectedCounty}
              onChange={handleCountyChange}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Virginia County"
                  placeholder="Select a county or leave blank for all"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2c5f2d',
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2c5f2d',
                    }
                  }}
                />
              )}
              sx={{ maxWidth: 400 }}
            />
          </Box>

          {/* Hotspots List */}
          {loading ? (
            <Typography>Loading hotspots...</Typography>
          ) : filteredHotspots.length === 0 ? (
            <Typography>No hotspots found for this region.</Typography>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                {filteredHotspots.length} hotspot{filteredHotspots.length !== 1 ? 's' : ''} found
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {filteredHotspots.map((hotspot) => (
                  <Card
                    key={hotspot.locId}
                    sx={{
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                      borderRadius: 1.5,
                      '&:hover': { 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => navigate(`/hotspots/${hotspot.locId}`)}
                  >
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {hotspot.locName}
                        </Typography>
                        {hotspot.numSpeciesAllTime && (
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {hotspot.numSpeciesAllTime} species recorded
                          </Typography>
                        )}
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#2c5f2d',
                          color: '#2c5f2d',
                          '&:hover': { 
                            borderColor: '#234d24',
                            bgcolor: 'rgba(44, 95, 45, 0.04)'
                          }
                        }}
                      >
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
