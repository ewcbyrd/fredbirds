import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { getNewsletters } from '../services/restdbService'

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem('newsletters')
    if (cached) {
      try {
        setNewsletters(JSON.parse(cached))
        return
      } catch (e) {
        // ignore parse error and fetch
      }
    }
    setLoading(true)
    getNewsletters()
      .then((res) => {
        const items = Array.isArray(res) ? res : res || []
        setNewsletters(items)
        sessionStorage.setItem('newsletters', JSON.stringify(items))
        sessionStorage.setItem('newslettersRetrieved', new Date().getTime())
      })
      .catch((err) => console.error('getNewsletters', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Typography>Loading newsletters...</Typography>

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ bgcolor: 'white', p:2, borderRadius:1 }}>
        <Typography variant="h5" sx={{ mb:1 }}>Newsletters</Typography>

        {newsletters.length === 0 ? (
          <Typography>No newsletters available.</Typography>
        ) : (
          <List>
            {newsletters.map((n) => (
              <React.Fragment key={n._id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setSelected(n)}>
                    <ListItemText primary={n.title || n.name || 'Untitled'} secondary={n.date || ''} />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.title || selected?.name}</DialogTitle>
        <DialogContent>
          {selected?.pdfFile ? (
            <Box>
              <Typography sx={{ mb: 2 }}>
                Click the button below to view the newsletter PDF.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                sx={{ 
                  bgcolor: '#2c5f2d',
                  '&:hover': { bgcolor: '#234d24' }
                }}
                href={`https://drive.google.com/file/d/${selected.pdfFile}/view`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Newsletter PDF
              </Button>
            </Box>
          ) : (
            <Typography>No PDF available for this newsletter.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
