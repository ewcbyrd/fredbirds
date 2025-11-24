import React, { useState } from 'react'
import { Stack, TextField, Button } from '@mui/material'
import { getMember, saveMember, sendEmail } from '../services/restdbService'

export default function MembershipForm({ onMemberEvent }) {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const clearForm = () => {
    setFirst('')
    setLast('')
    setEmail('')
    setPhone('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // basic validation
    if (!first.trim() || !last.trim() || !email.trim()) return
    setLoading(true)
    try {
      const fn = first.trim()
      const ln = last.trim()
      const em = email.trim().toLowerCase()
      const ph = phone.trim()

      const memberQuery = { first: fn, last: ln, email: em, phone: ph }
      const existing = await getMember(memberQuery)
      if (Array.isArray(existing) && existing.length === 0) {
        // create member
        await saveMember(JSON.stringify({ first: fn, last: ln, email: em, phone: ph }))
      } else {
        throw new Error('Existing Member')
      }

      const body = JSON.stringify({
        to: [
          {
            email: em,
            name: `${fn} ${ln}`
          }
        ],
        from: { email: 'admin@fredbirds.com', name: 'Fredericksburg Birding Club' },
        cc: [
          { email: 'membership@fredbirds.com', name: 'FBC Membership' }
        ],
        templateId: 'd-41856bbce48b405e9455299a6a239ccb',
        dynamic_template_data: { first: fn, subject: 'Welcome to the Fredericksburg Birding Club' }
      })

      await sendEmail(body)

      clearForm()
      if (onMemberEvent) {
        onMemberEvent({ header: 'Welcome!', message: 'Your membership record has been created. You will be receiving a welcome email shortly with membership information.' })
      }
    } catch (err) {
      clearForm()
      if (err && err.message === 'Existing Member' && onMemberEvent) {
        onMemberEvent({ header: 'Existing Member', message: 'Our records indicate that you already have a membership record. An email has been sent to our membership committee. Someone should be following up with you soon.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="First Name" name="first" value={first} onChange={(e) => setFirst(e.target.value)} required />
        <TextField label="Last Name" name="last" value={last} onChange={(e) => setLast(e.target.value)} required />
        <TextField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button type="submit" variant="contained" disabled={loading}>
          Join
        </Button>
      </Stack>
    </form>
  )
}
