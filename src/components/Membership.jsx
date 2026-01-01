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
        mb: 4,
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
            Whether you're just starting to notice the birds in your backyard or you're
            a seasoned birder with a long life list, the Fredericksburg Birding Club
            welcomes you. We are a community dedicated to the appreciation, conservation,
            and study of birds in our region. Join us to explore local hotspots, learn
            from experienced leaders, and connect with fellow nature enthusiasts.
          </Typography>
          <Typography variant="body1">
            While not required to participate in events and meetings,
            we encourage you to join as a supporting member to help fund our mission and
            gain voting rights. We welcome everyone to come birding with us!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', fontSize: '0.95rem' }}>
            Note: Membership is for the calendar year and serves as a donation to the club. Dues are not prorated.
          </Typography>
        </CardContent>
      </Card>

      {/* Membership Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            bgcolor: '#e8f5e9',
            border: '3px solid #2c5f2d',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(44, 95, 45, 0.2)',
            borderRadius: 2,
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: '0 6px 20px rgba(44, 95, 45, 0.3)' }
          }}
        >
          <Box sx={{ bgcolor: '#2c5f2d', color: 'white', p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Membership
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
              $20 Individual / $25 Family
            </Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Support the club and gain full voting rights by becoming a member.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Membership Benefits:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Voting rights at club meetings and officer elections
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Eligibility to hold club officer positions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Direct support for the club's conservation and education mission
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#2c5f2d', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Participation in all club activities and web resources
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                color: '#2c5f2d',
                borderColor: '#2c5f2d',
                borderWidth: 2,
                borderRadius: 50,
                '&:hover': {
                  bgcolor: '#2c5f2d',
                  color: 'white',
                  borderColor: '#2c5f2d',
                  borderWidth: 2
                }
              }}
              onClick={handleOpenJoinDialog}
            >
              Become a Member
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Join Dialog */}
      <Dialog open={openJoinDialog} onClose={handleCloseJoinDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          How to Join
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph sx={{ mt: 1 }}>
            Our club is open to anyone who would like to join. To become a paid Member,
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
            <EmailIcon sx={{ color: 'primary.main' }} />
            <Typography variant="body2">
              <strong>Questions?</strong> Email us at{' '}
              <a href="mailto:admin@fredbirds.com" style={{ color: '#2d5016', fontWeight: 600, textDecoration: 'none' }}>
                admin@fredbirds.com
              </a>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseJoinDialog} variant="outlined" color="primary">
            Close
          </Button>
          <Button
            href="mailto:admin@fredbirds.com?subject=Membership Inquiry"
            variant="contained"
            color="primary"
          >
            Email Us
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
