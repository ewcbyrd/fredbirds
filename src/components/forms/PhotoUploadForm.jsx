import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Box,
    Typography,
    IconButton
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useAuth0 } from '@auth0/auth0-react'
import {
    uploadPhoto,
    updatePhotoMetadata
} from '../../services/imageService'
import { getMemberByEmail } from '../../services/restdbService'

const AUTH_ERROR_MESSAGE =
    'You must be logged in to manage photos. Please log in to continue.'

export default function PhotoUploadForm({
    open,
    onClose,
    onUploadSuccess,
    photo = null,
    showCategory = true
}) {
    const { isAuthenticated, user, getIdTokenClaims } = useAuth0()
    const isEditMode = Boolean(photo?.imageId)

    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [contributor, setContributor] = useState('')
    const [photoDate, setPhotoDate] = useState('')
    const [category, setCategory] = useState('people')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!open) return

        if (isEditMode && photo) {
            setFile(null)
            setTitle(photo.title || photo.header || '')
            setDescription(photo.description || '')
            setLocation(photo.location || '')
            setContributor(photo.contributor || '')
            setPhotoDate(photo.photoDate || photo.photodate || '')
            setCategory((photo.category || 'people').toLowerCase())
            setError(null)
            setSuccess(false)
            return
        }

        // Prefill contributor on create
        const fetchMemberName = async () => {
            if (!isAuthenticated || !user?.email) return
            try {
                const memberData = await getMemberByEmail(user.email)
                if (memberData) {
                    const fullName =
                        `${memberData.first || ''} ${memberData.last || ''}`.trim()
                    if (fullName) {
                        setContributor(fullName)
                    } else if (user.name) {
                        setContributor(user.name)
                    }
                } else if (user.name) {
                    setContributor(user.name)
                }
            } catch (err) {
                console.error('Error fetching member data:', err)
                if (user.name) {
                    setContributor(user.name)
                }
            }
        }

        fetchMemberName()
    }, [open, isEditMode, photo, isAuthenticated, user])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            if (!title) {
                setTitle(selectedFile.name.split('.')[0])
            }
        }
    }

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            setError(AUTH_ERROR_MESSAGE)
            return
        }

        if (!isEditMode && !file) {
            setError('Please select a file')
            return
        }

        setUploading(true)
        setError(null)
        setSuccess(false)

        try {
            const claims = await getIdTokenClaims()
            const accessToken = claims?.__raw
            if (!accessToken) {
                throw new Error(AUTH_ERROR_MESSAGE)
            }

            if (isEditMode) {
                const fields = {
                    title: title || photo.title || photo.header || 'Photo',
                    description,
                    location,
                    contributor,
                    photoDate
                }
                if (showCategory) {
                    fields.category = category
                }
                await updatePhotoMetadata(photo.imageId, fields, {
                    accessToken
                })
            } else {
                await uploadPhoto(file, {
                    accessToken,
                    title: title || file.name.split('.')[0],
                    description,
                    location,
                    contributor,
                    photoDate,
                    category
                })
            }

            setSuccess(true)

            setTimeout(() => {
                resetForm()
                onClose()
                onUploadSuccess && onUploadSuccess()
            }, 1500)
        } catch (err) {
            setError(
                err.message ||
                    (isEditMode ? 'Update failed' : 'Upload failed')
            )
        } finally {
            setUploading(false)
        }
    }

    const resetForm = () => {
        setFile(null)
        setTitle('')
        setDescription('')
        setLocation('')
        setContributor('')
        setPhotoDate('')
        setCategory('people')
        setError(null)
        setSuccess(false)
    }

    const handleClose = () => {
        if (!uploading) {
            resetForm()
            onClose()
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                {isEditMode ? 'Edit Photo' : 'Upload Photo'}
                <IconButton
                    aria-label="Close dialog"
                    onClick={handleClose}
                    disabled={uploading}
                    size="small"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {!isAuthenticated && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {AUTH_ERROR_MESSAGE}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {isEditMode
                            ? 'Photo updated successfully!'
                            : 'Photo uploaded successfully!'}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {!isEditMode && (
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{ mb: 1, fontWeight: 500 }}
                            >
                                Select Image *
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading || !isAuthenticated}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontFamily: 'inherit'
                                }}
                            />
                            {file && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 1 }}
                                >
                                    Selected: {file.name} (
                                    {(file.size / 1024 / 1024).toFixed(2)} MB)
                                </Typography>
                            )}
                        </Box>
                    )}

                    <TextField
                        label="Photo Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        disabled={uploading || !isAuthenticated}
                        placeholder="Enter photo title (optional)"
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        disabled={uploading || !isAuthenticated}
                        multiline
                        rows={3}
                        placeholder="Add a description (optional)"
                    />

                    <TextField
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        fullWidth
                        disabled={uploading || !isAuthenticated}
                        placeholder="Where was this photo taken? (optional)"
                    />

                    <TextField
                        label="Contributor"
                        value={contributor}
                        onChange={(e) => setContributor(e.target.value)}
                        fullWidth
                        disabled={uploading || !isAuthenticated}
                        placeholder="Who contributed this photo? (optional)"
                    />

                    <TextField
                        label="Photo Date"
                        value={photoDate}
                        onChange={(e) => setPhotoDate(e.target.value)}
                        fullWidth
                        disabled={uploading || !isAuthenticated}
                        type="date"
                        InputLabelProps={{
                            shrink: true
                        }}
                        helperText="When was this photo taken? (optional)"
                    />

                    {showCategory && (
                        <FormControl
                            fullWidth
                            disabled={uploading || !isAuthenticated}
                        >
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label="Category"
                            >
                                <MenuItem value="people">People</MenuItem>
                                <MenuItem value="places">Places</MenuItem>
                                <MenuItem value="birds">Birds</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={handleClose} disabled={uploading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={
                        uploading ||
                        !isAuthenticated ||
                        (!isEditMode && !file)
                    }
                    sx={{ position: 'relative', minWidth: 120 }}
                >
                    {uploading ? (
                        <>
                            <CircularProgress
                                size={24}
                                sx={{ position: 'absolute' }}
                            />
                            <span style={{ visibility: 'hidden' }}>
                                {isEditMode ? 'Save' : 'Upload'}
                            </span>
                        </>
                    ) : isEditMode ? (
                        'Save'
                    ) : (
                        'Upload'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
