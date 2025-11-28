import React, { useEffect, useState } from 'react'
import { Box, Card, CardHeader, CardContent, Typography, Menu, MenuItem, IconButton, Button, CircularProgress } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  getNearbyNotableObservations,
  getNotableSightingsByLocation,
  getNearbyObservations
} from '../services/ebirdService'
import { getStates, getCounties } from '../services/restdbService'
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
    // Load rare birds from session storage
    const rareBirdData = sessionStorage.getItem('rareBirds')
    if (rareBirdData) {
      try {
        const rarebirdsArray = JSON.parse(rareBirdData)
        const rarebirdsSet = new Set(rarebirdsArray.map((item) => item['Scientific Name']))
        setRarebirds(rarebirdsSet)
      } catch (e) {
        console.error('Error loading rare birds:', e)
      }
    }
    loadSightings()
    fetchStates()
    fetchCounties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      const isRare = matches[0].sciName && rarebirds.has(matches[0].sciName)

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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Sightings</Typography>
          }
          action={
            <IconButton 
              onClick={loadSightings} 
              title="Refresh" 
              size="medium"
              sx={{
                color: '#2c5f2d',
                '&:hover': {
                  bgcolor: 'rgba(44, 95, 45, 0.08)'
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          }
          subheader={`${numSightings} items • Updated ${lastUpdated[setting.view] ? new Date(lastUpdated[setting.view]).toLocaleString() : '—'}`}
          sx={{ pb: 1 }}
        />
        <CardContent>
          {/* Filters Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            mb: 3,
            flexWrap: 'wrap',
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            {/* View Type */}
            <Box sx={{ minWidth: { xs: '100%', sm: 120 } }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                View
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                endIcon={<ExpandMoreIcon />}
                onClick={handleMenuClick}
                sx={{ 
                  textTransform: 'none',
                  borderColor: '#2c5f2d',
                  color: '#2c5f2d',
                  justifyContent: 'space-between',
                  '&:hover': { 
                    borderColor: '#234d24',
                    bgcolor: 'rgba(44, 95, 45, 0.04)'
                  }
                }}
              >
                {dropdown}
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleSelectView('nearby')}>Nearby</MenuItem>
                <MenuItem onClick={() => handleSelectView('local')}>Local</MenuItem>
                <MenuItem onClick={() => handleSelectView('state')}>State</MenuItem>
              </Menu>
            </Box>

            {/* State, County, and Filter - only show when view is 'state' */}
            {setting.view === 'state' && (
              <>
                <Box sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                    State
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleStateMenuClick}
                    sx={{ 
                      textTransform: 'none',
                      borderColor: '#2c5f2d',
                      color: '#2c5f2d',
                      justifyContent: 'space-between',
                      '&:hover': { 
                        borderColor: '#234d24',
                        bgcolor: 'rgba(44, 95, 45, 0.04)'
                      }
                    }}
                  >
                    {stateDropdown}
                  </Button>
                  <Menu 
                    anchorEl={stateAnchorEl} 
                    open={stateMenuOpen} 
                    onClose={handleStateMenuClose}
                    PaperProps={{
                      style: {
                        maxHeight: 300,
                        overflow: 'auto'
                      }
                    }}
                    MenuListProps={{
                      dense: true
                    }}
                  >
                    {stateOptions.map((state) => (
                      <MenuItem 
                        key={state.value} 
                        onClick={() => handleSelectState(state.value, state.label)}
                        dense
                      >
                        {state.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Box sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                    County
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleCountyMenuClick}
                    sx={{ 
                      textTransform: 'none',
                      borderColor: '#2c5f2d',
                      color: '#2c5f2d',
                      justifyContent: 'space-between',
                      '&:hover': { 
                        borderColor: '#234d24',
                        bgcolor: 'rgba(44, 95, 45, 0.04)'
                      }
                    }}
                  >
                    {countyDropdown}
                  </Button>
                  <Menu 
                    anchorEl={countyAnchorEl} 
                    open={countyMenuOpen} 
                    onClose={handleCountyMenuClose}
                    PaperProps={{
                      style: {
                        maxHeight: 300,
                        overflow: 'auto'
                      }
                    }}
                    MenuListProps={{
                      dense: true
                    }}
                  >
                    <MenuItem onClick={() => handleSelectCounty(null, 'All')} dense>All</MenuItem>
                    {filteredCountyOptions.map((county) => (
                      <MenuItem 
                        key={county.value} 
                        onClick={() => handleSelectCounty(county.value, county.label)}
                        dense
                      >
                        {county.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </>
            )}
          </Box>

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={48} sx={{ color: '#2c5f2d' }} />
              <Typography variant="body1" color="text.secondary">
                Loading sightings...
              </Typography>
            </Box>
          ) : (
            <MySightings sightings={sightings} header={dropdown} viewtype={setting.view} />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
