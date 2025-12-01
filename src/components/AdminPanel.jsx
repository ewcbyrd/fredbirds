import React from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Grid,
  Button,
  Alert
} from '@mui/material'
import { 
  Settings, 
  Security, 
  Storage, 
  SupervisorAccount 
} from '@mui/icons-material'
import AccessControl from './AccessControl'
import { ACCESS_LEVELS } from '../hooks/useUserRole'

const AdminPanel = () => {
  return (
    <AccessControl requiredLevel={ACCESS_LEVELS.ADMIN}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Administrative Access:</strong> These tools can affect the entire system. 
            Use with caution and ensure you have proper backups.
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <SupervisorAccount color="primary" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    User Management
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Manage user roles, permissions, and access levels.
                </Typography>
                <Button variant="contained" fullWidth>
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Settings color="secondary" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    System Settings
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure application settings and preferences.
                </Typography>
                <Button variant="contained" color="secondary" fullWidth>
                  System Config
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Storage color="success" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    Database Management
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Backup, restore, and maintain database integrity.
                </Typography>
                <Button variant="contained" color="success" fullWidth>
                  Database Tools
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Security color="error" sx={{ fontSize: 32 }} />
                  <Typography variant="h6">
                    Security & Audit
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Monitor security events and system audit logs.
                </Typography>
                <Button variant="contained" color="error" fullWidth>
                  Security Center
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AccessControl>
  )
}

export default AdminPanel