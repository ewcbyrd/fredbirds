import React, { useState } from 'react'
import { Card, CardContent, Typography, Box, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EmailIcon from '@mui/icons-material/Email'

export default function Membership() {
  const [openJoinDialog, setOpenJoinDialog] = useState(false)

  const handleOpenJoinDialog = () => setOpenJoinDialog(true)
  const handleCloseJoinDialog = () => setOpenJoinDialog(false)

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
        Membership
      </Typography>
      
      {/* Introduction */}
      <Card sx={{ 
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: 2,
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Join the Fredericksburg Birding Club
          </Typography>
          <Typography variant="body1" paragraph>
            Are you a new birder looking to gain experience? Are you a veteran
            birder looking for a group to share your love of birding with? Or, are
            you just looking to get outdoors with nice people? We have some great
            news! The Fredericksburg Birding Club delivers all of this and more.
          </Typography>
          <Typography variant="body1">
            There are two levels of membership in the club, Basic and Full. Both
            allow full participation in field trips and access to the club web site.
          </Typography>
        </CardContent>
      </Card>

      {/* Membership Comparison Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Basic Membership */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              bgcolor: '#f5f5f5',
              border: '2px solid #e0e0e0',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 2,
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }
            }}
          >
            <Box sx={{ bgcolor: '#757575', color: 'white', p: 2, textAlign: 'center' }}>
              <Chip 
                label="FREE" 
                size="small"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#757575',
                  fontWeight: 'bold',
                  mb: 1
                }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Basic Membership
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Perfect for individuals who will occasionally participate in club events.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  What's Included:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Participation in regular club field trips
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Access to club website and resources
                  </Typography>
                </Box>
              </Box>

              <Button 
                variant="outlined" 
                fullWidth
                size="large"
                href="mailto:admin@fredbirds.com?subject=Basic Membership"
                sx={{ 
                  borderColor: '#757575',
                  color: '#757575',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#616161',
                    bgcolor: 'rgba(117, 117, 117, 0.04)'
                  }
                }}
              >
                Join for Free
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Full Membership */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              bgcolor: '#e8f5e9',
              border: '3px solid #2c5f2d',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(44, 95, 45, 0.2)',
              borderRadius: 2,
              transition: 'box-shadow 0.3s ease',
              '&:hover': { boxShadow: '0 6px 20px rgba(44, 95, 45, 0.3)' }
            }}
          >
            <Box sx={{ bgcolor: '#2c5f2d', color: 'white', p: 2, textAlign: 'center' }}>
              <Chip 
                label="RECOMMENDED" 
                size="small"
                sx={{ 
                  bgcolor: '#66bb6a', 
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Full Membership
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                $20 Individual / $25 Family
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                For regular participants who want full access and voting rights in the club.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Everything in Basic, plus:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Voting rights at club meetings
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Eligibility for club officer positions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Support the club's activities and mission
                  </Typography>
                </Box>
              </Box>

              <Button 
                variant="contained" 
                fullWidth
                size="large"
                sx={{ 
                  bgcolor: '#2c5f2d',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(44, 95, 45, 0.3)',
                  '&:hover': {
                    bgcolor: '#1e4620',
                    boxShadow: '0 4px 8px rgba(44, 95, 45, 0.4)'
                  }
                }}
                onClick={handleOpenJoinDialog}
              >
                Become a Full Member
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Join Dialog */}
      <Dialog open={openJoinDialog} onClose={handleCloseJoinDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2c5f2d', color: 'white' }}>
          How to Join as a Full Member
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph sx={{ mt: 1 }}>
            Our club is open to anyone who would like to join. To become a paid Full Member, 
            send a check made out to <strong>Fredericksburg Birding Club</strong> to:
          </Typography>
          
          <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 1, mb: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ lineHeight: 2, fontWeight: 500 }}>
              Jeannie Hartzell<br />
              Fredericksburg Birding Club<br />
              383 Brenthem Farm Dr<br />
              Fredericksburg, VA 22401
            </Typography>
          </Box>

          <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Membership Dues:
            </Typography>
            <Typography variant="body2">
              • Individual: $20 per year<br />
              • Family: $25 per year
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <EmailIcon sx={{ color: '#2c5f2d' }} />
            <Typography variant="body2">
              <strong>Questions?</strong> Email us at{' '}
              <a href="mailto:admin@fredbirds.com" style={{ color: '#2c5f2d', fontWeight: 600, textDecoration: 'none' }}>
                admin@fredbirds.com
              </a>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseJoinDialog} variant="outlined">
            Close
          </Button>
          <Button 
            href="mailto:admin@fredbirds.com?subject=Full Membership Inquiry"
            variant="contained"
            sx={{ 
              bgcolor: '#2c5f2d',
              '&:hover': {
                bgcolor: '#1e4620'
              }
            }}
          >
            Email Us
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
