import React, { useEffect, useState } from 'react'
import { Box, Card, CardHeader, CardContent, Typography, Menu, MenuItem, IconButton, Button, CircularProgress, Container, Grid } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  getNearbyNotableObservations,
  getNotableSightingsByLocation,
  getNearbyObservations
} from '../services/ebirdService'
import { getStates, getCounties, getRareBirds } from '../services/restdbService'
import MySightings from './MySightings'

export default function Resources() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [stateAnchorEl, setStateAnchorEl] = useState(null)
  const stateMenuOpen = Boolean(stateAnchorEl)
  const [countyAnchorEl, setCountyAnchorEl] = useState(null)
  const countyMenuOpen = Boolean(countyAnchorEl)
  const [setting, setSetting] = useState({ view: 'local', back: 7, state: 'US-VA', county: null })
  const [dropdown, setDropdown] = useState('Local')
  const [stateDropdown, setStateDropdown] = useState('Virginia')
  const [countyDropdown, setCountyDropdown] = useState('All')
  const [sightings, setSightings] = useState([])
  const [rawSightings, setRawSightings] = useState([])
  const [lastUpdated, setLastUpdated] = useState({})
  const [stateOptions, setStateOptions] = useState([])
  const [countyOptions, setCountyOptions] = useState([])
  const [filteredCountyOptions, setFilteredCountyOptions] = useState([])
  const [rarebirds, setRarebirds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRareBirds()
    loadSightings()
    fetchStates()
    fetchCounties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchRareBirds() {
    // First, check for cached rare birds
    const cached = sessionStorage.getItem('rareBirds')
    if (cached) {
      try {
        const rarebirdsArray = JSON.parse(cached)
        const rarebirdsSet = new Set(rarebirdsArray.map((item) => item['Scientific Name']?.toLowerCase()))
        setRarebirds(rarebirdsSet)
      } catch (e) {
        console.error('Error parsing cached rare birds:', e)
      }
    }

    // Then fetch fresh data
    try {
      const res = await getRareBirds()
      if (res && Array.isArray(res)) {
        const rarebirdsSet = new Set(res.map((item) => item['Scientific Name']?.toLowerCase()))
        setRarebirds(rarebirdsSet)
        sessionStorage.setItem('rareBirds', JSON.stringify(res))
      }
    } catch (e) {
      console.error('Error fetching rare birds:', e)
    }
  }

  useEffect(() => {
    // when view changes, reload appropriate sightings
    loadSightings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting.view, setting.state, setting.county])

  useEffect(() => {
    // Process raw sightings data when it changes
    processSightings()
    setLoading(false) // Set loading to false after processing is complete
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSightings, rarebirds])

  const processSightings = () => {
    if (!rawSightings || rawSightings.length === 0) {
      setSightings([])
      return
    }

    const speciesSet = new Set(rawSightings.map((item) => item.comName))
    const processed = []

    speciesSet.forEach((species) => {
      const matches = rawSightings.filter((item) => item.comName === species)
      const locations =
        setting.view === 'state'
          ? [
            ...new Set(
              matches.map(
                (item) =>
                  `${item.subnational2Name || ''}, ${item.subnational1Name || ''}`
              )
            )
          ].sort()
          : new Set(matches.map((item) => item.subnational2Name))

      const sciName = matches[0].sciName
      const isRare = sciName && rarebirds.has(sciName.toLowerCase())
      // All birds in this list are notable by definition of the endpoint, 
      // but we flag "Rare" specifically against the club list.

      // Show all sightings (no filtering needed since rare birds are now automatically marked)
      // Create individual sighting records
      const individualSightings = []
      matches.forEach((item) => {
        if (individualSightings.findIndex((temp) => temp.id === item.obsId) < 0) {
          individualSightings.push({
            id: item.obsId,
            location: item.locName,
            locality:
              item.subnational2Name === undefined
                ? ''
                : `${item.subnational2Name}, ${item.subnational1Name}`,
            quantity: item.howMany,
            by: item.userDisplayName,
            date: item.obsDt,
            lat: item.lat,
            lng: item.lng
          })
        }
      })

      processed.push({
        id: matches[0].speciesCode,
        name: species,
        locations:
          setting.view === 'state'
            ? Array.from(locations).join('; ')
            : Array.from(locations).join(', '),
        mostRecent: Math.max(...matches.map((e) => new Date(e.obsDt))),
        scientific: matches[0].sciName,
        isRare,
        individualSightings
      })
    })

    // Sort by name
    processed.sort((a, b) => (a.name > b.name ? 1 : -1))
    setSightings(processed)
  }

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleStateMenuClick = (e) => setStateAnchorEl(e.currentTarget)
  const handleStateMenuClose = () => setStateAnchorEl(null)
  const handleCountyMenuClick = (e) => setCountyAnchorEl(e.currentTarget)
  const handleCountyMenuClose = () => setCountyAnchorEl(null)

  const handleSelectView = (view) => {
    handleMenuClose()
    const map = { nearby: 'Nearby', local: 'Local', state: 'State' }
    setSetting((s) => ({ ...s, view }))
    setDropdown(map[view])
  }

  const handleSelectState = (stateCode, stateLabel) => {
    handleStateMenuClose()
    setSetting((s) => ({ ...s, state: stateCode, county: null }))
    setStateDropdown(stateLabel)
    setCountyDropdown('All')
    // Filter counties by selected state
    const filtered = countyOptions.filter(c => c.value.startsWith(stateCode))
    filtered.sort((a, b) => a.label.localeCompare(b.label))
    setFilteredCountyOptions(filtered)
  }

  const handleSelectCounty = (countyCode, countyLabel) => {
    handleCountyMenuClose()
    setSetting((s) => ({ ...s, county: countyCode }))
    setCountyDropdown(countyLabel)
  }


  async function fetchStates() {
    // First, check for cached states and load them immediately
    const cached = sessionStorage.getItem('states')
    if (cached) {
      try {
        const opts = JSON.parse(cached)
        opts.sort((a, b) => a.label.localeCompare(b.label))
        setStateOptions(opts)
      } catch (e) {
        console.error('Error parsing cached states:', e)
      }
    }

    // Then fetch fresh data in the background to update cache
    try {
      const res = await getStates()
      const opts = Array.isArray(res) ? res.map((i) => ({ label: i.state, value: i.code })) : []
      opts.sort((a, b) => a.label.localeCompare(b.label))
      setStateOptions(opts)
      sessionStorage.setItem('states', JSON.stringify(opts))
    } catch (e) {
      console.error('Error fetching states:', e)
      // If we don't have cached data and fetch fails, states will remain empty
    }
  }

  async function fetchCounties() {
    // First, check for cached counties and load them immediately
    const cached = sessionStorage.getItem('counties')
    if (cached) {
      try {
        const opts = JSON.parse(cached)
        opts.sort((a, b) => a.label.localeCompare(b.label))
        setCountyOptions(opts)
        // Filter for Virginia by default
        const vaCounties = opts.filter(c => c.value.startsWith('US-VA'))
        vaCounties.sort((a, b) => a.label.localeCompare(b.label))
        setFilteredCountyOptions(vaCounties)
      } catch (e) {
        console.error('Error parsing cached counties:', e)
      }
    }

    // Then fetch fresh data in the background to update cache
    try {
      const res = await getCounties()
      const opts = Array.isArray(res) ? res.map((i) => ({ label: i.county, value: i.code })) : []
      opts.sort((a, b) => a.label.localeCompare(b.label))
      setCountyOptions(opts)
      // Filter for Virginia by default
      const vaCounties = opts.filter(c => c.value.startsWith('US-VA'))
      vaCounties.sort((a, b) => a.label.localeCompare(b.label))
      setFilteredCountyOptions(vaCounties)
      sessionStorage.setItem('counties', JSON.stringify(opts))
    } catch (e) {
      console.error('Error fetching counties:', e)
      // If we don't have cached data and fetch fails, counties will remain empty
    }
  }

  async function loadSightings() {
    setLoading(true)
    try {
      if (setting.view === 'local') {
        // use fixed coords for Fredericksburg region
        const res = await getNearbyNotableObservations({ lat: 38.31, long: -77.46, daysBack: setting.back })
        setRawSightings(res || [])
        setLastUpdated((s) => ({ ...s, local: new Date() }))
      } else if (setting.view === 'state') {
        // Use county if selected, otherwise use state
        const regionCode = setting.county || setting.state
        const res = await getNotableSightingsByLocation({ regionCode, daysBack: 3 })
        setRawSightings(res || [])
        setLastUpdated((s) => ({ ...s, state: new Date() }))
      } else if (setting.view === 'nearby') {
        if (!navigator.geolocation) {
          setRawSightings([])
          return
        }
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(async (position) => {
            try {
              const res = await getNearbyObservations({ lat: position.coords.latitude, long: position.coords.longitude })
              setRawSightings(res || [])
              setLastUpdated((s) => ({ ...s, nearby: new Date() }))
              resolve()
            } catch (e) {
              console.error('Error loading nearby sightings:', e)
              setRawSightings([])
              reject(e)
            }
          }, reject)
        })
      }
    } catch (e) {
      console.error('Error loading sightings:', e)
      setRawSightings([])
      setLoading(false) // Only set loading false on error
    }
  }

  const numSightings = sightings ? sightings.length : 0
  const totalIndividuals = sightings ? sightings.reduce((acc, curr) => acc + ((curr.individualSightings && Array.isArray(curr.individualSightings)) ? curr.individualSightings.length : 1), 0) : 0
  const rareCount = sightings ? sightings.filter(s => s.isRare).length : 0

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{
        position: 'relative',
        bgcolor: '#2c5f2d',
        color: 'white',
        py: { xs: 6, md: 8 },
        mb: 6,
        background: 'linear-gradient(135deg, #1b4d24 0%, #3a7a3b 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Recent Sightings
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 800, opacity: 0.9, fontWeight: 400 }}>
            Discover what's being seen in the Fredericksburg area and beyond.
            Browse recent checklists, find rare birds, and explore local hotspots.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderLeft: '6px solid #2c5f2d',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c5f2d', mr: 2 }}>
                  {numSightings}
                </Typography>
                <Typography variant="overline" sx={{ lineHeight: 1.2, color: 'text.secondary' }}>
                  Species<br />Observed
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Unique species reported in this view
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderLeft: '6px solid #e65100',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#e65100', mr: 2 }}>
                  {rareCount}
                </Typography>
                <Typography variant="overline" sx={{ lineHeight: 1.2, color: 'text.secondary' }}>
                  Rare<br />Sightings
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Notable or rare birds for the region
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderLeft: '6px solid #1976d2',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2', mr: 2 }}>
                  {totalIndividuals}
                </Typography>
                <Typography variant="overline" sx={{ lineHeight: 1.2, color: 'text.secondary' }}>
                  Total<br />Reports
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Individual sighting reports from birders
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Area */}
        <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'visible' }}>
          <Box sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                Sighting Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updated {lastUpdated[setting.view] ? new Date(lastUpdated[setting.view]).toLocaleString() : '—'}
              </Typography>
            </Box>

            <Button
              startIcon={<RefreshIcon />}
              onClick={loadSightings}
              variant="contained"
              sx={{
                bgcolor: '#2c5f2d',
                color: 'white',
                boxShadow: '0 4px 8px rgba(44, 95, 45, 0.2)',
                '&:hover': {
                  bgcolor: '#1b4d24',
                  boxShadow: '0 6px 12px rgba(44, 95, 45, 0.3)'
                }
              }}
            >
              Refresh Data
            </Button>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Filters Section */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              mb: 4,
              p: 2,
              bgcolor: '#f8f9fa',
              borderRadius: 2
            }}>
              {/* View Type */}
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#2c5f2d' }}>
                  DATA SOURCE
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleMenuClick}
                  sx={{
                    justifyContent: 'space-between',
                    bgcolor: 'white',
                    borderColor: '#e0e0e0',
                    color: '#333',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'white',
                      borderColor: '#2c5f2d'
                    }
                  }}
                >
                  {dropdown}
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={() => handleSelectView('nearby')}>Nearby (Using Location)</MenuItem>
                  <MenuItem onClick={() => handleSelectView('local')}>Local (Fredericksburg)</MenuItem>
                  <MenuItem onClick={() => handleSelectView('state')}>State / County Lookup</MenuItem>
                </Menu>
              </Box>

              {/* State, County Filter - only show when view is 'state' */}
              {setting.view === 'state' && (
                <>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#2c5f2d' }}>
                      STATE
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<ExpandMoreIcon />}
                      onClick={handleStateMenuClick}
                      sx={{
                        justifyContent: 'space-between',
                        bgcolor: 'white',
                        borderColor: '#e0e0e0',
                        color: '#333',
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'white',
                          borderColor: '#2c5f2d'
                        }
                      }}
                    >
                      {stateDropdown}
                    </Button>
                    <Menu
                      anchorEl={stateAnchorEl}
                      open={stateMenuOpen}
                      onClose={handleStateMenuClose}
                      PaperProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
                    >
                      {stateOptions.map((state) => (
                        <MenuItem key={state.value} onClick={() => handleSelectState(state.value, state.label)} dense>
                          {state.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#2c5f2d' }}>
                      COUNTY
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<ExpandMoreIcon />}
                      onClick={handleCountyMenuClick}
                      sx={{
                        justifyContent: 'space-between',
                        bgcolor: 'white',
                        borderColor: '#e0e0e0',
                        color: '#333',
                        py: 1.5,
                        '&:hover': {
                          bgcolor: 'white',
                          borderColor: '#2c5f2d'
                        }
                      }}
                    >
                      {countyDropdown}
                    </Button>
                    <Menu
                      anchorEl={countyAnchorEl}
                      open={countyMenuOpen}
                      onClose={handleCountyMenuClose}
                      PaperProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
                    >
                      <MenuItem onClick={() => handleSelectCounty(null, 'All')} dense>All Counties</MenuItem>
                      {filteredCountyOptions.map((county) => (
                        <MenuItem key={county.value} onClick={() => handleSelectCounty(county.value, county.label)} dense>
                          {county.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </>
              )}
            </Box>

            {loading ? (
              <Box sx={{ py: 12, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: '#2c5f2d', mb: 3 }} />
                <Typography variant="h6" color="text.secondary">Fetching latest bird sightings...</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                  Connecting to eBird API
                </Typography>
              </Box>
            ) : (
              <MySightings sightings={sightings} header={dropdown} viewtype={setting.view} />
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
