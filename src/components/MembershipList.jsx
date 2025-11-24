import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Chip
} from '@mui/material'
import { getMembers } from '../services/restdbService'

export default function MembershipList() {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMembers()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMembers(members)
      return
    }
    const term = searchTerm.toLowerCase()
    const filtered = members.filter(
      (m) =>
        (m.first && m.first.toLowerCase().includes(term)) ||
        (m.last && m.last.toLowerCase().includes(term)) ||
        (m.email && m.email.toLowerCase().includes(term)) ||
        (m.type && m.type.toLowerCase().includes(term))
    )
    setFilteredMembers(filtered)
  }, [searchTerm, members])

  async function loadMembers() {
    setLoading(true)
    try {
      const data = await getMembers()
      const arr = Array.isArray(data) ? data : []
      setMembers(arr)
      setFilteredMembers(arr)
    } catch (e) {
      console.error('getMembers error', e)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Membership List</Typography>
            <Button variant="outlined" onClick={loadMembers}>
              Refresh
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Search members"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Search by name, email, or type"
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredMembers.length === 0 ? (
            <Typography>No members found.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.map((member, idx) => (
                    <TableRow key={member._id || member.id || idx} hover>
                      <TableCell>
                        {member.first} {member.last}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone || '—'}</TableCell>
                      <TableCell>
                        {member.type ? (
                          <Chip
                            label={member.type}
                            color={member.type === 'Full' ? 'primary' : 'default'}
                            size="small"
                          />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>{formatDate(member.createdAt || member.joinDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Total members: {filteredMembers.length}
            {searchTerm && ` (filtered from ${members.length})`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
