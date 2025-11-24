import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Link, CircularProgress } from '@mui/material'
import { getFeed } from '../services/restdbService'

export default function NewsFeedDetails({ item, feedUrl, index, open = !!item || !!feedUrl, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [entry, setEntry] = useState(item || null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (item) {
        setEntry(item)
        return
      }
      if (!feedUrl || typeof index !== 'number') return
      setLoading(true)
      setError(null)
      try {
        const res = await getFeed(feedUrl)
        // service returns a fetch Response object in modules version
        const data = res && typeof res.json === 'function' ? await res.json() : res
        const arr = data && data.items ? data.items : []
        const found = arr[index] || null
        if (!cancelled) setEntry(found)
      } catch (e) {
        if (!cancelled) setError(e.message || String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [feedUrl, index, item])

  if (!open) return null

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{entry?.title || 'News item'}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error">Error loading news item: {error}</Typography>
        ) : entry ? (
          <Box>
            {entry.pubDate || entry.isoDate ? (
              <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                {entry.pubDate || entry.isoDate}
              </Typography>
            ) : null}

            {entry.enclosure?.url ? (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img src={entry.enclosure.url} alt={entry.title} style={{ maxWidth: '100%', height: 'auto' }} />
              </Box>
            ) : null}

            <div dangerouslySetInnerHTML={{ __html: entry.content || entry.contentSnippet || entry.description || '' }} />

            {entry.link ? (
              <Typography sx={{ mt: 2 }}>
                Original: <Link href={entry.link} target="_blank" rel="noopener noreferrer">Open source</Link>
              </Typography>
            ) : null}
          </Box>
        ) : (
          <Typography>No content available for this news item.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
