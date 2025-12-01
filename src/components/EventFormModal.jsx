import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EventForm from './EventForm'

const EventFormModal = ({ open, onClose, event, onSuccess }) => {
  const isEditMode = !!event

  const handleSuccess = () => {
    // Call parent success handler
    onSuccess()
    // Close modal after a short delay to show success message
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
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
          {isEditMode ? 'Edit Event' : 'Create New Event'}
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <EventForm
          event={event}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EventFormModal
