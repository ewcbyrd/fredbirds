import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
  FormControlLabel,
  Switch,
  Paper
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Save,
  AccountCircle,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { autoRegisterMember } from '../services/restdbService'

const MemberOnboarding = () => {
  const { user } = useAuth0()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    showEmail: true,
    showPhone: false
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create enhanced user object with form data
      const enhancedUser = {
        ...user,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        showEmail: formData.showEmail,
        showPhone: formData.showPhone
      }

      const memberData = await autoRegisterMember(enhancedUser)
      console.log('Member registration successful:', memberData)
      
      // Force a page refresh to reload all states after successful registration
      // This ensures header banner, role checking, and profile data are all refreshed
      window.location.href = '/profile'
    } catch (err) {
      console.error('Registration failed:', err)
      setError('Failed to create member profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">
          Authentication required. Please log in first.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src={user.picture}
              sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2,
                bgcolor: 'primary.main'
              }}
            >
              {!user.picture && <AccountCircle sx={{ fontSize: 48 }} />}
            </Avatar>
            <Typography variant="h4" gutterBottom color="primary">
              Welcome to the Birding Club!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Let's set up your member profile to get you started.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Email color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Email (from your login account)
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={user.email}
                  disabled
                  variant="outlined"
                  sx={{ backgroundColor: 'grey.50' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Person color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Person color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="(555) 123-4567"
                  InputProps={{
                    startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              {/* Privacy Settings Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility color="primary" />
                  Privacy Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose what information is visible to other members in the directory and profiles.
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.showEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, showEmail: e.target.checked }))}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1">Show Email Address</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Allow other members to see your email in the directory
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.showPhone}
                            onChange={(e) => setFormData(prev => ({ ...prev, showPhone: e.target.checked }))}
                            color="primary"
                            disabled={!formData.phone.trim()}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" color={!formData.phone.trim() ? 'text.disabled' : 'text.primary'}>
                              Show Phone Number
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {!formData.phone.trim() 
                                ? 'Enter a phone number above to enable this option'
                                : 'Allow other members to see your phone in the directory'
                              }
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  >
                    {loading ? 'Creating Profile...' : 'Create Member Profile'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Your profile information will be used for club communications. 
              You can always update your privacy settings later in your profile.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default MemberOnboarding