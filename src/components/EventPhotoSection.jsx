import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Alert,
  Stack,
  CardMedia,
  Divider
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material'
import { useAuth0 } from '@auth0/auth0-react'
import { getCloudinaryUrl, uploadToCloudinary } from '../services/cloudinaryService'
import { getMemberByEmail, getEventPhotos, addEventPhoto } from '../services/restdbService'

const EventPhotoSection = ({ eventId }) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth0()
  const [photos, setPhotos] = useState([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    file: null,
    header: '',
    description: '',
    location: '',
    contributor: '',
    photoDate: ''
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [eventId])

  useEffect(() => {
    const fetchMemberName = async () => {
      if (uploadDialogOpen && isAuthenticated && user?.email && !uploadForm.contributor) {
        try {
          const memberData = await getMemberByEmail(user.email)
          if (memberData) {
            const fullName = `${memberData.first || ''} ${memberData.last || ''}`.trim()
            if (fullName) {
              setUploadForm(prev => ({ ...prev, contributor: fullName }))
            } else if (user.name) {
              setUploadForm(prev => ({ ...prev, contributor: user.name }))
            }
          } else if (user.name) {
            setUploadForm(prev => ({ ...prev, contributor: user.name }))
          }
        } catch (error) {
          console.error('Error fetching member data:', error)
          if (user.name) {
            setUploadForm(prev => ({ ...prev, contributor: user.name }))
          }
        }
      }
    }
    fetchMemberName()
  }, [uploadDialogOpen, isAuthenticated, user])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const data = await getEventPhotos(eventId)
      setPhotos(data.photos || [])
      setCurrentPhotoIndex(0)
    } catch (error) {
      console.error('Error loading event photos:', error)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const handleUploadClick = () => {
    setUploadDialogOpen(true)
    setUploadError(null)
    setUploadSuccess(false)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setUploadForm(prev => ({
        ...prev,
        file: selectedFile,
        header: prev.header || selectedFile.name.split('.')[0]
      }))
    }
  }

  const handleUploadSubmit = async () => {
    if (!isAuthenticated) {
      setUploadError('You must be logged in to upload photos')
      return
    }
    if (!uploadForm.file) {
      setUploadError('Please select a file')
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      const uploadResult = await uploadToCloudinary(uploadForm.file, 'event_photos')
      await addEventPhoto(eventId, {
        cloudinary_public_id: uploadResult.publicId,
        header: uploadForm.header || uploadForm.file.name.split('.')[0],
        description: uploadForm.description,
        location: uploadForm.location,
        contributor: uploadForm.contributor,
        photoDate: uploadForm.photoDate
      })
      setUploadSuccess(true)
      setTimeout(() => {
        resetUploadForm()
        setUploadDialogOpen(false)
        loadPhotos()
      }, 1500)
    } catch (error) {
      setUploadError(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadForm({
      file: null,
      header: '',
      description: '',
      location: '',
      contributor: '',
      photoDate: ''
    })
  }

  const handleCloseUploadDialog = () => {
    if (!uploading) {
      resetUploadForm()
      setUploadDialogOpen(false)
      setUploadError(null)
      setUploadSuccess(false)
    }
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const currentPhoto = photos.length > 0 ? photos[currentPhotoIndex] : null

  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (dateMatch) {
        const [, year, month, day] = dateMatch
        const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Event Photos
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={40} />
        </Box>
      </Box>
    )
  }

  // Empty state - no photos
  if (photos.length === 0) {
    // Not authenticated - hide the section completely
    if (!isAuthenticated) {
      return null
    }
    
    // Authenticated - show upload option
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PhotoCameraIcon color="primary" fontSize="small" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Event Photos
          </Typography>
        </Box>
        <Box sx={{ mb: 3, textAlign: 'center', py: 3, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No photos yet. Be the first to add one!
          </Typography>
          <Button
            variant="contained"
            startIcon={<PhotoCameraIcon />}
            onClick={handleUploadClick}
            sx={{ backgroundColor: '#2c5f2d', '&:hover': { backgroundColor: '#1e4620' } }}
          >
          Add Photo
        </Button>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Add Event Photo
          <IconButton onClick={handleCloseUploadDialog} disabled={uploading} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}
          {uploadSuccess && <Alert severity="success" sx={{ mb: 2 }}>Photo uploaded successfully!</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Select Image *</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              {uploadForm.file && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Selected: {uploadForm.file.name}</Typography>}
            </Box>

            <TextField label="Photo Title" value={uploadForm.header} onChange={(e) => setUploadForm(prev => ({ ...prev, header: e.target.value }))} fullWidth disabled={uploading} />
            <TextField label="Description" value={uploadForm.description} onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))} fullWidth disabled={uploading} multiline rows={3} />
            <TextField label="Location" value={uploadForm.location} onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))} fullWidth disabled={uploading} />
            <TextField label="Contributor" value={uploadForm.contributor} onChange={(e) => setUploadForm(prev => ({ ...prev, contributor: e.target.value }))} fullWidth disabled={uploading} />
            <TextField label="Photo Date" value={uploadForm.photoDate} onChange={(e) => setUploadForm(prev => ({ ...prev, photoDate: e.target.value }))} fullWidth disabled={uploading} type="date" InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseUploadDialog} disabled={uploading}>Cancel</Button>
          <Button onClick={handleUploadSubmit} variant="contained" disabled={!uploadForm.file || uploading} sx={{ minWidth: 120 }}>
            {uploading ? <><CircularProgress size={24} sx={{ position: 'absolute' }} /><span style={{ visibility: 'hidden' }}>Upload</span></> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}  // Photos display
  if (photos.length > 0) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoCameraIcon color="primary" fontSize="small" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Event Photos ({photos.length})
            </Typography>
          </Box>
          {isAuthenticated && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              onClick={handleUploadClick}
            >
              Add Photo
            </Button>
          )}
        </Box>

        {/* Photo Viewer */}
        <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden', backgroundColor: '#f5f5f5', mb: 2 }}>
          {currentPhoto && (
            <>
              <CardMedia
                component="img"
                image={getCloudinaryUrl(currentPhoto.cloudinary_public_id, 'w_800,h_600,c_fill')}
                alt={currentPhoto.header || 'Event photo'}
                sx={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
              />

              {photos.length > 1 && (
                <>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                    <IconButton onClick={handlePreviousPhoto} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }} size="small">
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={handleNextPhoto} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }} size="small">
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', padding: '6px 12px', borderRadius: 1, fontSize: '0.875rem' }}>
                    {currentPhotoIndex + 1} / {photos.length}
                  </Box>
                </>
              )}
            </>
          )}
        </Box>

        {/* Photo Details */}
        {currentPhoto && (
          <Box>
            {currentPhoto.header && <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{currentPhoto.header}</Typography>}
            {currentPhoto.description && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{currentPhoto.description}</Typography>}
            <Stack direction="row" spacing={2} sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              {currentPhoto.location && <Typography variant="caption">📍 {currentPhoto.location}</Typography>}
              {currentPhoto.photoDate && <Typography variant="caption">📅 {formatDate(currentPhoto.photoDate)}</Typography>}
              {currentPhoto.contributor && <Typography variant="caption">👤 {currentPhoto.contributor}</Typography>}
          </Stack>
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Add Event Photo
          <IconButton onClick={handleCloseUploadDialog} disabled={uploading} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}
          {uploadSuccess && <Alert severity="success" sx={{ mb: 2 }}>Photo uploaded successfully!</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Select Image *</Typography>
              <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              {uploadForm.file && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Selected: {uploadForm.file.name}</Typography>}
            </Box>

            <TextField label="Photo Title" value={uploadForm.header} onChange={(e) => setUploadForm(prev => ({ ...prev, header: e.target.value }))} fullWidth disabled={uploading} />
            <TextField label="Description" value={uploadForm.description} onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))} fullWidth disabled={uploading} multiline rows={3} />
            <TextField label="Location" value={uploadForm.location} onChange={(e) => setUploadForm(prev => ({ ...prev, location: e.target.value }))} fullWidth disabled={uploading} />
            <TextField label="Contributor" value={uploadForm.contributor} onChange={(e) => setUploadForm(prev => ({ ...prev, contributor: e.target.value }))} fullWidth disabled={uploading} />
            <TextField label="Photo Date" value={uploadForm.photoDate} onChange={(e) => setUploadForm(prev => ({ ...prev, photoDate: e.target.value }))} fullWidth disabled={uploading} type="date" InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseUploadDialog} disabled={uploading}>Cancel</Button>
          <Button onClick={handleUploadSubmit} variant="contained" disabled={!uploadForm.file || uploading} sx={{ minWidth: 120 }}>
            {uploading ? <><CircularProgress size={24} sx={{ position: 'absolute' }} /><span style={{ visibility: 'hidden' }}>Upload</span></> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}  return null
}

export default EventPhotoSection
