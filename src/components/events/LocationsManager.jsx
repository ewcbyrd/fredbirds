import React from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const LocationsManager = ({ locations, onChange }) => {
  const handleLocationChange = (index, field, value) => {
    const updatedLocations = [...locations]
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value
    }
    onChange(updatedLocations)
  }

  const addLocation = () => {
    onChange([...locations, { name: '', lat: '', lon: '', address: '' }])
  }

  const removeLocation = (index) => {
    if (locations.length > 1) {
      const updatedLocations = locations.filter((_, i) => i !== index)
      onChange(updatedLocations)
    }
  }

  const hasValidCoords = (location) => {
    return location.lat && location.lon &&
      !isNaN(parseFloat(location.lat)) &&
      !isNaN(parseFloat(location.lon))
  }

  return (
    <Box>
      {locations.map((location, index) => (
        <Accordion
          key={index}
          defaultExpanded={locations.length === 1 || index === locations.length - 1}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`location-${index}-content`}
            id={`location-${index}-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <LocationOnIcon color="action" />
              <Typography>
                {location.name || `Location ${index + 1}`}
              </Typography>
              {hasValidCoords(location) && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', mr: 2 }}>
                  {parseFloat(location.lat).toFixed(4)}, {parseFloat(location.lon).toFixed(4)}
                </Typography>
              )}
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Box>
              <TextField
                fullWidth
                label="Location Name"
                value={location.name}
                onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                margin="normal"
                placeholder="e.g., Belle Isle State Park"
                helperText="A descriptive name for this location"
              />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Latitude (Optional)"
                    type="number"
                    value={location.lat}
                    onChange={(e) => handleLocationChange(index, 'lat', e.target.value)}
                    inputProps={{
                      step: 'any',
                      min: -90,
                      max: 90
                    }}
                    placeholder="37.7889"
                    helperText="Latitude (-90 to 90)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Longitude (Optional)"
                    type="number"
                    value={location.lon}
                    onChange={(e) => handleLocationChange(index, 'lon', e.target.value)}
                    inputProps={{
                      step: 'any',
                      min: -180,
                      max: 180
                    }}
                    placeholder="-76.6447"
                    helperText="Longitude (-180 to 180)"
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Address (Optional)"
                value={location.address}
                onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                margin="normal"
                placeholder="1632 Belle Isle Rd, Lancaster, VA 22503"
                helperText="Full address for this location"
              />

              {hasValidCoords(location) && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Map Preview
                  </Typography>
                  <Box
                    component="iframe"
                    src={`https://www.google.com/maps?q=${location.lat},${location.lon}&output=embed&z=15`}
                    sx={{
                      width: '100%',
                      height: 200,
                      border: 0,
                      borderRadius: 1,
                      mt: 1
                    }}
                    title={`Map preview for ${location.name || `Location ${index + 1}`}`}
                  />
                </Box>
              )}

              {locations.length > 1 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeLocation(index)}
                    size="small"
                  >
                    Remove Location
                  </Button>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddLocationIcon />}
        onClick={addLocation}
        sx={{ mt: 2 }}
        fullWidth
      >
        Add Another Location
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Tip: If you add location information, include coordinates (lat/lon) for map display
      </Typography>
    </Box>
  )
}

export default LocationsManager
