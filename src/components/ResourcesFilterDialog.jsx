import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material'

export default function ResourcesFilterDialog({ open, onClose, onApply, currentSettings, stateOptions, countyOptions }) {
  const [filter, setFilter] = useState(currentSettings.filter)
  const [state, setState] = useState(currentSettings.state)
  const [county, setCounty] = useState(currentSettings.county)
  const [filteredCounties, setFilteredCounties] = useState([])
  const [back, setBack] = useState(currentSettings.back)

  useEffect(() => {
    if (countyOptions && state) {
      const filtered = countyOptions.filter((c) => c.value.startsWith(state))
      setFilteredCounties(filtered)
      // if current county doesn't match new state, pick first county in filtered list
      if (filtered.length > 0 && !filtered.find((c) => c.value === county)) {
        setCounty(filtered[0].value)
      }
    }
  }, [state, countyOptions, county])

  useEffect(() => {
    if (open) {
      setFilter(currentSettings.filter)
      setState(currentSettings.state)
      setCounty(currentSettings.county)
      setBack(currentSettings.back)
    }
  }, [open, currentSettings])

  const handleApply = () => {
    onApply({ filter, state, county, back })
  }

  const filterOptions = {
    nearby: [
      { label: 'Rare', value: 'rare' },
      { label: 'All', value: 'all' }
    ],
    local: [
      { label: 'Rare', value: 'rare' },
      { label: 'Notable', value: 'notable' }
    ],
    state: [
      { label: 'Rare', value: 'rare' },
      { label: 'Notable', value: 'notable' }
    ],
    county: [
      { label: 'Rare', value: 'rare' },
      { label: 'Notable', value: 'notable' }
    ]
  }

  const stateDisabled = currentSettings.view !== 'state' && currentSettings.view !== 'county'
  const countyDisabled = currentSettings.view !== 'county'
  const currentFilterOptions = filterOptions[currentSettings.view] || []

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Sightings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={filter} label="Category" onChange={(e) => setFilter(e.target.value)}>
              {currentFilterOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Days Back</InputLabel>
            <Select value={back} label="Days Back" onChange={(e) => setBack(e.target.value)}>
              <MenuItem value={3}>3 days</MenuItem>
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={14}>14 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={stateDisabled}>
            <InputLabel>State</InputLabel>
            <Select value={state} label="State" onChange={(e) => setState(e.target.value)}>
              {stateOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={countyDisabled}>
            <InputLabel>County</InputLabel>
            <Select value={county} label="County" onChange={(e) => setCounty(e.target.value)}>
              {filteredCounties.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
