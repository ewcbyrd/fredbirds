import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { sendEmail } from '../services/restdbService'

const options = [
  { value: 'membership', label: 'Membership' },
  { value: 'birding', label: 'Birding' },
  { value: 'event', label: 'Event' },
  { value: 'website', label: 'Web Site' },
  { value: 'other', label: 'Other' }
]

const emailMap = new Map()
  .set('membership', 'membership@fredbirds.com')
  .set('website', 'admin@fredbirds.com')
  .set('event', 'events@fredbirds.com')
  .set('birding', 'communications@fredbirds.com')
  .set('other', 'communications@fredbirds.com')

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function validate() {
    if (!form.name || !form.email || !form.topic || !form.message) return false
    // basic email check
    if (!/.+@.+\..+/.test(form.email)) return false
    return true
  }

  async function handleSubmit() {
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please complete the form and provide a valid email.' })
      return
    }
    setSubmitting(true)
    setStatus(null)
    const to = emailMap.get(form.topic)
    const body = JSON.stringify({
      to,
      from: { email: 'admin@fredbirds.com', name: 'Contact Us Message' },
      subject: 'Contact Us Message',
      content: [{ type: 'text/plain', value: `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}` }]
    })
    try {
      await sendEmail(body)
      setStatus({ type: 'success', message: 'Message sent. Thank you.' })
      setForm({ name: '', email: '', topic: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus({ type: 'error', message: 'Failed to send message.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ bgcolor: 'white', p:2, borderRadius:1 }}>
        <Typography variant="h5">Contact Us</Typography>
        <Typography sx={{ mb:2 }}>Need to reach us? Fill out the form and submit.</Typography>
        <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} sx={{ mb:2 }} />
        <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb:2 }} />
        <TextField select fullWidth label="Topic" name="topic" value={form.topic} onChange={handleChange} sx={{ mb:2 }}>
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
        <TextField fullWidth multiline minRows={4} label="Message" name="message" value={form.message} onChange={handleChange} sx={{ mb:2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Submit</Button>
        </Box>
        {status && (
          <Typography sx={{ mt:2, color: status.type === 'error' ? 'error.main' : 'success.main' }}>{status.message}</Typography>
        )}
      </Box>
    </Box>
  )
}
