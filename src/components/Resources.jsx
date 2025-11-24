import React, { useEffect, useState } from 'react'
import { Box, Card, CardHeader, CardContent, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material'
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
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const filterMenuOpen = Boolean(filterAnchorEl)
  const [setting, setSetting] = useState({ view: 'local', filter: 'notable', back: 7, state: 'US-VA', county: null })
  const [dropdown, setDropdown] = useState('Local')
  const [stateDropdown, setStateDropdown] = useState('Virginia')
  const [countyDropdown, setCountyDropdown] = useState('All')
  const [filterDropdown, setFilterDropdown] = useState('Notable')
  const [sightings, setSightings] = useState([])
  const [rawSightings, setRawSightings] = useState([])
  const [lastUpdated, setLastUpdated] = useState({})
  const [stateOptions, setStateOptions] = useState([])
  const [countyOptions, setCountyOptions] = useState([])
  const [filteredCountyOptions, setFilteredCountyOptions] = useState([])
  const [rarebirds, setRarebirds] = useState(new Set())

  useEffect(() => {
    // Load rare birds from session storage
    const rareBirdData = sessionStorage.getItem('rarebirds')
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
    // Process raw sightings data when it changes or filter changes
    processSightings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSightings, setting.filter, rarebirds])

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

      // Apply filter
      if (
        (setting.filter === 'rare' && isRare) ||
        setting.filter === 'notable' ||
        setting.filter === 'all'
      ) {
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
      }
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
  const handleFilterMenuClick = (e) => setFilterAnchorEl(e.currentTarget)
  const handleFilterMenuClose = () => setFilterAnchorEl(null)

  const handleSelectView = (view) => {
    handleMenuClose()
    const map = { nearby: 'Nearby', local: 'Local', state: 'State' }
    setSetting((s) => ({ ...s, view, filter: { nearby: 'all', local: 'notable', state: 'notable' }[view] }))
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

  const handleSelectFilter = (filterValue, filterLabel) => {
    handleFilterMenuClose()
    setSetting((s) => ({ ...s, filter: filterValue }))
    setFilterDropdown(filterLabel)
  }

  async function fetchStates() {
    try {
      const res = await getStates()
      const opts = Array.isArray(res) ? res.map((i) => ({ label: i.state, value: i.code })) : []
      opts.sort((a, b) => a.label.localeCompare(b.label))
      setStateOptions(opts)
      sessionStorage.setItem('states', JSON.stringify(opts))
    } catch (e) {
      const cached = sessionStorage.getItem('states')
      if (cached) {
        const opts = JSON.parse(cached)
        opts.sort((a, b) => a.label.localeCompare(b.label))
        setStateOptions(opts)
      }
    }
  }

  async function fetchCounties() {
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
      const cached = sessionStorage.getItem('counties')
      if (cached) {
        const opts = JSON.parse(cached)
        opts.sort((a, b) => a.label.localeCompare(b.label))
        setCountyOptions(opts)
        const vaCounties = opts.filter(c => c.value.startsWith('US-VA'))
        vaCounties.sort((a, b) => a.label.localeCompare(b.label))
        setFilteredCountyOptions(vaCounties)
      }
    }
  }

  async function loadSightings() {
    if (setting.view === 'local') {
      // use fixed coords for Fredericksburg region
      try {
        const res = await getNearbyNotableObservations({ lat: 38.31, long: -77.46, daysBack: setting.back })
        setRawSightings(res || [])
        setLastUpdated((s) => ({ ...s, local: new Date() }))
      } catch (e) {
        console.error('Error loading local sightings:', e)
        setRawSightings([])
      }
    } else if (setting.view === 'state') {
      try {
        // Use county if selected, otherwise use state
        const regionCode = setting.county || setting.state
        const res = await getNotableSightingsByLocation({ regionCode, daysBack: 3 })
        setRawSightings(res || [])
        setLastUpdated((s) => ({ ...s, state: new Date() }))
      } catch (e) {
        console.error('Error loading state sightings:', e)
        setRawSightings([])
      }
    } else if (setting.view === 'nearby') {
      if (!navigator.geolocation) return setRawSightings([])
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await getNearbyObservations({ lat: position.coords.latitude, long: position.coords.longitude })
          setRawSightings(res || [])
          setLastUpdated((s) => ({ ...s, nearby: new Date() }))
        } catch (e) {
          console.error('Error loading nearby sightings:', e)
          setRawSightings([])
        }
      })
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
                  <Menu anchorEl={stateAnchorEl} open={stateMenuOpen} onClose={handleStateMenuClose}>
                    {stateOptions.map((state) => (
                      <MenuItem key={state.value} onClick={() => handleSelectState(state.value, state.label)}>
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
                  <Menu anchorEl={countyAnchorEl} open={countyMenuOpen} onClose={handleCountyMenuClose}>
                    <MenuItem onClick={() => handleSelectCounty(null, 'All')}>All</MenuItem>
                    {filteredCountyOptions.map((county) => (
                      <MenuItem key={county.value} onClick={() => handleSelectCounty(county.value, county.label)}>
                        {county.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                <Box sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                    Type
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleFilterMenuClick}
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
                    {filterDropdown}
                  </Button>
                  <Menu anchorEl={filterAnchorEl} open={filterMenuOpen} onClose={handleFilterMenuClose}>
                    <MenuItem onClick={() => handleSelectFilter('notable', 'Notable')}>Notable</MenuItem>
                    <MenuItem onClick={() => handleSelectFilter('rare', 'Rare')}>Rare</MenuItem>
                  </Menu>
                </Box>
              </>
            )}
          </Box>

          <MySightings sightings={sightings} header={dropdown} viewtype={setting.view} filter={setting.filter} />
        </CardContent>
      </Card>
    </Box>
  )
}
