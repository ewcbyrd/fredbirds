import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { getPictureUrl } from '../services/cloudinaryService'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Search,
  Group,
  EmojiEvents,
  Star,
  Diamond,
  Whatshot,
  WorkspacePremium
} from '@mui/icons-material'
import { getActiveMembers } from '../services/restdbService'

const MembersDirectory = () => {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth0()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getActiveMembers()
        console.log('Members data received:', data)
        
        if (data && Array.isArray(data)) {
          // Sort members alphabetically by last name, then first name
          const sortedMembers = data.sort((a, b) => {
            // Helper function to extract last and first names
            const getNameParts = (member) => {
              if (member.Name) {
                // Handle "First Last" format
                const parts = member.Name.split(' ')
                return {
                  last: parts.length > 1 ? parts[parts.length - 1] : '',
                  first: parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || ''
                }
              }
              
              return {
                last: member.lastName || member.last || '',
                first: member.firstName || member.first || member.name || ''
              }
            }
            
            const nameA = getNameParts(a)
            const nameB = getNameParts(b)
            
            // First compare last names
            const lastNameComparison = nameA.last.localeCompare(nameB.last)
            if (lastNameComparison !== 0) {
              return lastNameComparison
            }
            
            // If last names are equal, compare first names
            return nameA.first.localeCompare(nameB.first)
          })
          
          setMembers(sortedMembers)
          setFilteredMembers(sortedMembers)
        } else {
          setMembers([])
          setFilteredMembers([])
        }
      } catch (err) {
        console.error('Error fetching members:', err)
        setError('Unable to load members directory')
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMembers(members)
      return
    }

    const filtered = members.filter(member => {
      const fullName = formatName(member).toLowerCase()
      const email = (member.email || '').toLowerCase()
      const search = searchTerm.toLowerCase()
      
      return fullName.includes(search) || email.includes(search)
    })
    
    setFilteredMembers(filtered)
  }, [searchTerm, members])

  const handleMemberClick = (member) => {
    // Navigate to member profile using email as identifier
    navigate(`/members/${encodeURIComponent(member.email)}`)
  }

  const isOwnProfile = (member) => {
    if (!user || !member) return false
    return user.email === member.email
  }

  const formatName = (member) => {
    // Try different field name conventions
    if (member.Name) {
      return member.Name  // Capital N (officers data format)
    }
    
    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const fullName = `${firstName} ${lastName}`.trim()
    
    if (fullName) {
      return fullName
    }
    
    // Try single name field
    if (member.name) {
      return member.name
    }
    
    return 'Name not provided'
  }

  const formatPhone = (phone) => {
    if (!phone) return null
    // Basic phone formatting
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  const getInitials = (member) => {
    // Try different field name conventions
    if (member.Name) {
      const nameParts = member.Name.split(' ')
      return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
    }
    
    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    
    if (initials.length > 0) {
      return initials
    }
    
    // Try single name field
    if (member.name) {
      const nameParts = member.name.split(' ')
      return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
    }
    
    return 'M'
  }

  const getMilestoneInfo = (member) => {
    const worldCount = member.worldCount || 0
    
    if (worldCount >= 1000) {
      return {
        icon: Diamond,
        color: '#9c27b0', // Purple
        text: '1000+',
        tooltip: '1000+ World Species',
        level: 'master'
      }
    } else if (worldCount >= 500) {
      return {
        icon: EmojiEvents,
        color: '#ff9800', // Gold
        text: '500+',
        tooltip: '500+ World Species',
        level: 'expert'
      }
    } else if (worldCount >= 250) {
      return {
        icon: WorkspacePremium,
        color: '#4caf50', // Green
        text: '250+',
        tooltip: '250+ World Species',
        level: 'advanced'
      }
    } else if (worldCount >= 100) {
      return {
        icon: Star,
        color: '#2196f3', // Blue
        text: '100+',
        tooltip: '100+ World Species',
        level: 'accomplished'
      }
    }
    
    return null
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading members directory...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Group sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Members Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect with fellow birding enthusiasts in our club
        </Typography>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Chip 
          icon={<Group />}
          label={`${filteredMembers.length} ${filteredMembers.length === 1 ? 'Member' : 'Members'}`}
          color="primary"
          variant="outlined"
          size="medium"
        />
      </Box>

      {/* Members List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {filteredMembers.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {searchTerm ? 'No members found matching your search.' : 'No members found.'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredMembers.map((member, index) => (
                <React.Fragment key={member._id || member.email || index}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMemberClick(member)}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          backgroundColor: 'grey.50'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={getPictureUrl(member.picture)}
                          sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 600
                          }}
                        >
                          {getInitials(member)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {formatName(member)}
                            </Typography>
                            {(() => {
                              const milestone = getMilestoneInfo(member)
                              if (milestone) {
                                const IconComponent = milestone.icon
                                return (
                                  <IconComponent 
                                    sx={{ 
                                      color: milestone.color,
                                      fontSize: 20
                                    }}
                                    titleAccess={milestone.tooltip}
                                  />
                                )
                              }
                              return null
                            })()} 
                          </Box>
                        }
                        secondary={
                          <Box>
                            {(member.showEmail === true || isOwnProfile(member)) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {member.email || 'Email not provided'}
                                </Typography>
                              </Box>
                            )}
                            {member.phone && (member.showPhone === true || isOwnProfile(member)) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {formatPhone(member.phone)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < filteredMembers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Footer note */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Click on any member to view their profile and birding activity
        </Typography>
      </Box>
    </Container>
  )
}

export default MembersDirectory