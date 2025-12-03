import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Avatar,
  Typography,
  Chip,
  Stack
} from '@mui/material'
import {
  Search,
  Add as AddIcon,
  Edit as EditIcon,
  Close,
  CheckCircle,
  Cancel
} from '@mui/icons-material'
import { getAllMembers, patchMember } from '../services/restdbService'
import MemberFormModal from './MemberFormModal'

const ManageMembersDialog = ({ open, onClose }) => {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (open) {
      fetchMembers()
    }
  }, [open, refreshTrigger])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllMembers()
      
      if (Array.isArray(data)) {
        // Sort by last name, then first name
        const sortedMembers = data.sort((a, b) => {
          const getLastName = (member) => {
            if (member.Name) {
              const parts = member.Name.split(' ')
              return parts.length > 1 ? parts[parts.length - 1] : parts[0] || ''
            }
            return member.lastName || member.last || ''
          }
          
          const getFirstName = (member) => {
            if (member.Name) {
              const parts = member.Name.split(' ')
              return parts.length > 1 ? parts.slice(0, -1).join(' ') : ''
            }
            return member.firstName || member.first || ''
          }
          
          const lastNameA = getLastName(a).toLowerCase()
          const lastNameB = getLastName(b).toLowerCase()
          
          if (lastNameA !== lastNameB) {
            return lastNameA.localeCompare(lastNameB)
          }
          
          const firstNameA = getFirstName(a).toLowerCase()
          const firstNameB = getFirstName(b).toLowerCase()
          return firstNameA.localeCompare(firstNameB)
        })
        
        setMembers(sortedMembers)
        setFilteredMembers(sortedMembers)
      }
    } catch (err) {
      console.error('Error fetching members:', err)
      setError('Unable to load members')
    } finally {
      setLoading(false)
    }
  }

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

  const formatName = (member) => {
    if (member.Name) {
      return member.Name
    }
    
    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const fullName = `${firstName} ${lastName}`.trim()
    
    if (fullName) {
      return fullName
    }
    
    if (member.name) {
      return member.name
    }
    
    return 'Name not provided'
  }

  const getInitials = (member) => {
    const name = formatName(member)
    const nameParts = name.split(' ')
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
  }

  const handleCreateClick = () => {
    setSelectedMember(null)
    setFormModalOpen(true)
  }

  const handleEditMember = (member) => {
    setSelectedMember(member)
    setFormModalOpen(true)
  }

  const handleFormModalClose = () => {
    setFormModalOpen(false)
    setSelectedMember(null)
  }

  const handleMemberSaved = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleToggleActive = async (member, e) => {
    e.stopPropagation()
    try {
      const isCurrentlyActive = member.isActive !== false
      const newActiveStatus = !isCurrentlyActive
      await patchMember(member._id, { isActive: newActiveStatus })
      
      // Update the member in the local state
      const updatedMembers = members.map(m => 
        m._id === member._id ? { ...m, isActive: newActiveStatus } : m
      )
      setMembers(updatedMembers)
      setFilteredMembers(filteredMembers.map(m => 
        m._id === member._id ? { ...m, isActive: newActiveStatus } : m
      ))
    } catch (err) {
      console.error('Error toggling member status:', err)
      setError('Failed to update member status')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '70vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Manage Members
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ mb: 3 }}
          >
            Add New Member
          </Button>

          <TextField
            placeholder="Search members..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : filteredMembers.length === 0 ? (
            <Alert severity="info">
              No members found. {searchTerm ? 'Try adjusting your search.' : 'Create your first member!'}
            </Alert>
          ) : (
            <Stack spacing={2}>
              {filteredMembers.map((member) => (
                <Card key={member._id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        {getInitials(member)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" component="div">
                            {formatName(member)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {member.email}
                        </Typography>
                        {member.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {member.phone}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {member.isOfficer && member.position && (
                            <Chip
                              label={member.position}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          )}
                          {member.isActive !== false ? (
                            <Chip
                              label="Active"
                              size="small"
                              color="success"
                            />
                          ) : (
                            <Chip
                              label="Inactive"
                              size="small"
                              color="error"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={(member.isActive !== false) ? <Cancel /> : <CheckCircle />}
                      color={(member.isActive !== false) ? 'error' : 'success'}
                      onClick={(e) => handleToggleActive(member, e)}
                    >
                      {(member.isActive !== false) ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditMember(member)}
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <MemberFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        member={selectedMember}
        onSuccess={handleMemberSaved}
      />
    </>
  )
}

export default ManageMembersDialog
