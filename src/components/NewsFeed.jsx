import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, CardActionArea, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, CardMedia } from '@mui/material'
import { getNewsFeeds, getFeed } from '../services/restdbService'
import NewsFeedDetails from './NewsFeedDetails'

export default function NewsFeed() {
  const [feeds, setFeeds] = useState([])
  const [selectedFeed, setSelectedFeed] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function loadFeeds() {
      try {
        const res = await getNewsFeeds()
        const data = res && typeof res.json === 'function' ? await res.json() : res
        const arr = Array.isArray(data) ? data : []
        if (!cancelled) {
          setFeeds(arr)
          if (arr.length > 0) setSelectedFeed(arr[0])
        }
      } catch (e) {
        console.error('getNewsFeeds error', e)
      }
    }
    loadFeeds()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!selectedFeed) return
    let cancelled = false
    async function loadArticles() {
      setLoading(true)
      try {
        const res = await getFeed(selectedFeed.url)
        const data = res && typeof res.json === 'function' ? await res.json() : res
        const items = data && data.items ? data.items.map((item, idx) => ({ ...item, id: item.id || idx })) : []
        if (!cancelled) setArticles(items)
      } catch (e) {
        console.error('getFeed error', e)
        if (!cancelled) setArticles([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadArticles()
    return () => { cancelled = true }
  }, [selectedFeed])

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Bird News</Typography>

      {feeds.length > 0 ? (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="feed-select-label">News Source</InputLabel>
          <Select
            labelId="feed-select-label"
            value={selectedFeed?.url || ''}
            label="News Source"
            onChange={(e) => {
              const found = feeds.find(f => f.url === e.target.value)
              if (found) setSelectedFeed(found)
            }}
          >
            {feeds.map((f) => (
              <MenuItem key={f.url} value={f.url}>{f.title || f.name || f.url}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
      ) : articles.length === 0 ? (
        <Typography>No articles available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card>
                <CardActionArea onClick={() => setSelectedArticle(article)}>
                  {article.enclosure?.url ? (
                    <CardMedia component="img" image={article.enclosure.url} alt={article.title} sx={{ height: 140, objectFit: 'cover' }} />
                  ) : null}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5 }}>{article.title}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {article.pubDate || article.isoDate || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 60, overflow: 'hidden' }}>
                      {article.contentSnippet || article.description || ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <NewsFeedDetails item={selectedArticle} open={!!selectedArticle} onClose={() => setSelectedArticle(null)} />
    </Box>
  )
}
