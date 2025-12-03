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
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Stack
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close
} from '@mui/icons-material'
import { getAnnouncements, deleteAnnouncement } from '../services/restdbService'
import AnnouncementFormModal from './AnnouncementFormModal'

const ManageAnnouncementsDialog = ({ open, onClose }) => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(null)

  useEffect(() => {
    if (open) {
      fetchAnnouncements()
    }
  }, [open, refreshTrigger])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAnnouncements()
      
      if (Array.isArray(data)) {
        // Filter out expired announcements and sort by date (newest first)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const nonExpiredAnnouncements = data.filter(announcement => {
          if (!announcement.expires) return true
          const expiresDate = new Date(announcement.expires)
          expiresDate.setHours(0, 0, 0, 0)
          return expiresDate >= today
        })
        
        const sortedAnnouncements = nonExpiredAnnouncements.sort((a, b) => {
          const dateA = new Date(a.date || 0)
          const dateB = new Date(b.date || 0)
          return dateB - dateA
        })
        
        setAnnouncements(sortedAnnouncements)
      }
    } catch (err) {
      console.error('Error fetching announcements:', err)
      setError('Unable to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCreateClick = () => {
    setSelectedAnnouncement(null)
    setFormModalOpen(true)
  }

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement)
    setFormModalOpen(true)
  }

  const handleDeleteAnnouncement = async (announcement) => {
    if (!window.confirm(`Are you sure you want to delete the announcement "${announcement.headline}"?`)) {
      return
    }

    try {
      setDeleteLoading(announcement._id)
      await deleteAnnouncement(announcement._id)
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error('Error deleting announcement:', err)
      setError('Failed to delete announcement')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleFormModalClose = () => {
    setFormModalOpen(false)
    setSelectedAnnouncement(null)
  }

  const handleAnnouncementSaved = () => {
    setRefreshTrigger(prev => prev + 1)
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
            Manage Announcements
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
            Add New Announcement
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : announcements.length === 0 ? (
            <Alert severity="info">
              No active announcements found. Create your first announcement!
            </Alert>
          ) : (
            <Stack spacing={2}>
              {announcements.map((announcement) => (
                <Card key={announcement._id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" component="div">
                            {announcement.headline}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Created: {formatDate(announcement.date)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 1
                          }}
                        >
                          {announcement.details}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {announcement.expires && (
                            <Chip
                              label={`Expires: ${formatDate(announcement.expires)}`}
                              size="small"
                              variant="outlined"
                              color="warning"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditAnnouncement(announcement)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={deleteLoading === announcement._id ? <CircularProgress size={16} /> : <DeleteIcon />}
                      color="error"
                      onClick={() => handleDeleteAnnouncement(announcement)}
                      disabled={deleteLoading === announcement._id}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <AnnouncementFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        announcement={selectedAnnouncement}
        onSuccess={handleAnnouncementSaved}
      />
    </>
  )
}

export default ManageAnnouncementsDialog
