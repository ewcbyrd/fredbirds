import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
  IconButton
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useAuth0 } from '@auth0/auth0-react'
import { uploadToCloudinary } from '../services/cloudinaryService'
import { savePhoto } from '../services/restdbService'

const AUTH_ERROR_MESSAGE = 'You must be logged in to upload photos. Please log in to continue.'

export default function PhotoUploadForm({ open, onClose, onUploadSuccess }) {
  const { isAuthenticated } = useAuth0()
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [contributor, setContributor] = useState('')
  const [category, setCategory] = useState('people')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      // Auto-fill title from filename if not already set
      if (!title) {
        setTitle(selectedFile.name.split('.')[0])
      }
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError(AUTH_ERROR_MESSAGE)
      return
    }

    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(file, 'club_photos')
      
      // Try to save metadata to database
      try {
        await savePhoto({
          publicId: uploadResult.publicId,
          title: title || file.name.split('.')[0],
          description: description,
          location: location,
          contributor: contributor,
          category: category
        })
        console.log('Photo metadata saved to database')
      } catch (dbError) {
        console.warn('Note: Photo uploaded to Cloudinary but metadata could not be saved to database:', dbError.message)
        // Continue even if database save fails - the photo is still uploaded
      }

      setSuccess(true)
      
      // Reset form after 2 seconds and close
      setTimeout(() => {
        resetForm()
        onClose()
        onUploadSuccess && onUploadSuccess()
      }, 2000)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setTitle('')
    setDescription('')
    setLocation('')
    setContributor('')
    setCategory('people')
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    if (!uploading) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Upload Photo
        <IconButton onClick={handleClose} disabled={uploading} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!isAuthenticated && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {AUTH_ERROR_MESSAGE}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Photo uploaded successfully!
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* File Input */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Select Image *
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading || !isAuthenticated}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'inherit'
              }}
            />
            {file && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
          </Box>

          {/* Title */}
          <TextField
            label="Photo Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            disabled={uploading || !isAuthenticated}
            placeholder="Enter photo title (optional)"
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            disabled={uploading || !isAuthenticated}
            multiline
            rows={3}
            placeholder="Add a description (optional)"
          />

          {/* Location */}
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            disabled={uploading || !isAuthenticated}
            placeholder="Where was this photo taken? (optional)"
          />

          {/* Contributor */}
          <TextField
            label="Contributor"
            value={contributor}
            onChange={(e) => setContributor(e.target.value)}
            fullWidth
            disabled={uploading || !isAuthenticated}
            placeholder="Who contributed this photo? (optional)"
          />

          {/* Category */}
          <FormControl fullWidth disabled={uploading || !isAuthenticated}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="people">People</MenuItem>
              <MenuItem value="places">Places</MenuItem>
              <MenuItem value="birds">Birds</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!file || uploading || !isAuthenticated}
          sx={{ position: 'relative', minWidth: 120 }}
        >
          {uploading ? (
            <>
              <CircularProgress size={24} sx={{ position: 'absolute' }} />
              <span style={{ visibility: 'hidden' }}>Upload</span>
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
