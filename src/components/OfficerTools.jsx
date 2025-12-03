import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button
} from '@mui/material'
import {
  EventNote,
  People,
  Assessment,
  Announcement
} from '@mui/icons-material'
import AccessControl from './AccessControl'
import { ACCESS_LEVELS } from '../hooks/useUserRole'
import ManageEventsDialog from './ManageEventsDialog'
import ManageMembersDialog from './ManageMembersDialog'
import ManageAnnouncementsDialog from './ManageAnnouncementsDialog'

const OfficerTools = () => {
  const [manageEventsOpen, setManageEventsOpen] = useState(false)
  const [manageMembersOpen, setManageMembersOpen] = useState(false)
  const [manageAnnouncementsOpen, setManageAnnouncementsOpen] = useState(false)

  return (
    <AccessControl requiredLevel={ACCESS_LEVELS.OFFICER}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Officer Tools
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage club events, announcements, and member activities.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EventNote color="primary" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    Event Management
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create, edit, and manage club birding events and field trips.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setManageEventsOpen(true)}
                >
                  Manage Events
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Announcement color="secondary" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    Announcements
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Post important news and updates for club members.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setManageAnnouncementsOpen(true)}
                >
                  Manage Announcements
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <People color="success" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    Member Management
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  View and manage club membership roster.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => setManageMembersOpen(true)}
                >
                  Manage Members
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Assessment color="info" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    Reports
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Generate reports on club activities and participation.
                </Typography>
                <Button variant="contained" color="info" fullWidth>
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <ManageEventsDialog
          open={manageEventsOpen}
          onClose={() => setManageEventsOpen(false)}
        />

        <ManageMembersDialog
          open={manageMembersOpen}
          onClose={() => setManageMembersOpen(false)}
        />

        <ManageAnnouncementsDialog
          open={manageAnnouncementsOpen}
          onClose={() => setManageAnnouncementsOpen(false)}
        />
      </Container>
    </AccessControl>
  )
}

export default OfficerTools