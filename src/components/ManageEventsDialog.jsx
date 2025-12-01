import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import EventList from './EventList'
import EventFormModal from './EventFormModal'

const ManageEventsDialog = ({ open, onClose }) => {
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateClick = () => {
    setSelectedEvent(null)
    setFormModalOpen(true)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setFormModalOpen(true)
  }

  const handleFormModalClose = () => {
    setFormModalOpen(false)
    setSelectedEvent(null)
  }

  const handleEventSaved = () => {
    // Trigger refresh of event list
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
            Manage Events
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            sx={{ mb: 3 }}
          >
            Create New Event
          </Button>

          <EventList
            onEditEvent={handleEditEvent}
            refreshTrigger={refreshTrigger}
          />
        </DialogContent>
      </Dialog>

      <EventFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        event={selectedEvent}
        onSuccess={handleEventSaved}
      />
    </>
  )
}

export default ManageEventsDialog
