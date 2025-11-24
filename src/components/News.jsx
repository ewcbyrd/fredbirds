import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { getNewsletters } from '../services/restdbService'

export default function News() {
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
        // fallthrough to fetch
      }
    }
    setLoading(true)
    getNewsletters()
      .then((res) => {
        // service returns parsed JSON already
        const items = Array.isArray(res) ? res : res || []
        setNewsletters(items)
        sessionStorage.setItem('newsletters', JSON.stringify(items))
      })
      .catch((err) => console.error('newsletters load', err))
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
              <ListItem key={n._id} secondaryAction={
                <Button onClick={() => setSelected(n)} variant="outlined">Open</Button>
              }>
                <ListItemText primary={n.title || n.name || 'Untitled'} secondary={n.date || ''} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="lg">
        <DialogTitle>{selected?.title || selected?.name}</DialogTitle>
        <DialogContent>
          {selected?.pdfFile ? (
            <iframe src={selected.pdfFile} title={selected?.title} width="100%" height="600px" />
          ) : (
            <Typography>No preview available for this newsletter.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
