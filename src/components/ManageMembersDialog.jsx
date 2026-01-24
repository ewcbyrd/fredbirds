import React, { useState, useEffect } from 'react'
import {
  Button,
  Avatar,
  Typography,
  Chip,
  Stack
} from '@mui/material'
import {
  Edit as EditIcon,
  CheckCircle,
  Cancel
} from '@mui/icons-material'
import { getAllMembers, patchMember } from '../services/restdbService'
import MemberFormModal from './MemberFormModal'
import AppDialog from './common/AppDialog'
import AdminResourceList from './common/AdminResourceList'
import AdminItemCard from './common/AdminItemCard'

const ManageMembersDialog = ({ open, onClose }) => {
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (open) {
      fetchMembers()
    }
  }, [open, refreshTrigger])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllMembers()

      if (Array.isArray(data)) {
        // Sort by last name, then first name
        const sortedMembers = data.sort((a, b) => {
          const getLastName = (member) => {
            if (member.Name) {
              const parts = member.Name.split(' ')
              return parts.length > 1 ? parts[parts.length - 1] : parts[0] || ''
            }
            return member.lastName || member.last || ''
          }

          const getFirstName = (member) => {
            if (member.Name) {
              const parts = member.Name.split(' ')
              return parts.length > 1 ? parts.slice(0, -1).join(' ') : ''
            }
            return member.firstName || member.first || ''
          }

          const lastNameA = getLastName(a).toLowerCase()
          const lastNameB = getLastName(b).toLowerCase()

          if (lastNameA !== lastNameB) {
            return lastNameA.localeCompare(lastNameB)
          }

          const firstNameA = getFirstName(a).toLowerCase()
          const firstNameB = getFirstName(b).toLowerCase()
          return firstNameA.localeCompare(firstNameB)
        })

        setMembers(sortedMembers)
        setFilteredMembers(sortedMembers)
      }
    } catch (err) {
      console.error('Error fetching members:', err)
      setError('Unable to load members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMembers(members)
      return
    }

    const filtered = members.filter(member => {
      const fullName = formatName(member).toLowerCase()
      const email = (member.email || '').toLowerCase()
      const search = searchTerm.toLowerCase()

      return fullName.includes(search) || email.includes(search)
    })

    setFilteredMembers(filtered)
  }, [searchTerm, members])

  const formatName = (member) => {
    if (member.Name) {
      return member.Name
    }

    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const fullName = `${firstName} ${lastName}`.trim()

    if (fullName) {
      return fullName
    }

    if (member.name) {
      return member.name
    }

    return 'Name not provided'
  }

  const getInitials = (member) => {
    const name = formatName(member)
    const nameParts = name.split(' ')
    return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
  }

  const handleCreateClick = () => {
    setSelectedMember(null)
    setFormModalOpen(true)
  }

  const handleEditMember = (member) => {
    setSelectedMember(member)
    setFormModalOpen(true)
  }

  const handleFormModalClose = () => {
    setFormModalOpen(false)
    setSelectedMember(null)
  }

  const handleMemberSaved = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleToggleActive = async (member, e) => {
    e.stopPropagation()
    try {
      const isCurrentlyActive = member.isActive !== false
      const newActiveStatus = !isCurrentlyActive
      await patchMember(member._id, { isActive: newActiveStatus })

      // Update the member in the local state
      const updatedMembers = members.map(m =>
        m._id === member._id ? { ...m, isActive: newActiveStatus } : m
      )
      setMembers(updatedMembers)
      // Also update filtered list to reflect changes immediately
      setFilteredMembers(filteredMembers.map(m =>
        m._id === member._id ? { ...m, isActive: newActiveStatus } : m
      ))
    } catch (err) {
      console.error('Error toggling member status:', err)
      setError('Failed to update member status')
    }
  }

  const renderMember = (member) => {
    const actions = (
      <>
        <Button
          size="small"
          startIcon={(member.isActive !== false) ? <Cancel /> : <CheckCircle />}
          color={(member.isActive !== false) ? 'error' : 'success'}
          onClick={(e) => handleToggleActive(member, e)}
        >
          {(member.isActive !== false) ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEditMember(member)}
        >
          Edit
        </Button>
      </>
    )

    return (
      <AdminItemCard
        key={member._id}
        title={formatName(member)}
        subtitle={member.email}
        icon={
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            {getInitials(member)}
          </Avatar>
        }
        actions={actions}
      >
        {member.phone && (
          <Typography variant="body2" color="text.secondary">
            {member.phone}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {member.isOfficer && member.position && (
            <Chip
              label={member.position}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {member.isActive !== false ? (
            <Chip
              label="Active"
              size="small"
              color="success"
            />
          ) : (
            <Chip
              label="Inactive"
              size="small"
              color="error"
            />
          )}
        </Stack>
      </AdminItemCard>
    )
  }

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        title="Manage Members"
        maxWidth="md"
        PaperProps={{
          sx: {
            minHeight: '70vh',
            maxHeight: '90vh'
          }
        }}
      >
        <AdminResourceList
          items={filteredMembers}
          renderItem={renderMember}
          onAdd={handleCreateClick}
          onSearch={setSearchTerm}
          loading={loading}
          error={error}
          addButtonText="Add New Member"
          searchPlaceholder="Search members..."
          emptyMessage={searchTerm ? 'No members found matching your search.' : 'No members found. Create your first member!'}
        />
      </AppDialog>

      <MemberFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        member={selectedMember}
        onSuccess={handleMemberSaved}
      />
    </>
  )
}

export default ManageMembersDialog
