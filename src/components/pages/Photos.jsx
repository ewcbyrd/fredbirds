import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    InputAdornment,
    Chip,
    Stack
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { useAuth0 } from '@auth0/auth0-react'
import {
    getPhotos,
    getEvents,
    getEventPhotosForEvents
} from '../../services/restdbService'
import {
    getImageUrl,
    transformations,
    deletePhoto
} from '../../services/imageService'
import { formatPhotoDate } from '../../utils/dateUtils'
import { canManagePhoto } from '../../utils/photoPermissions'
import { useUserRole } from '../../hooks/useUserRole'
import PhotoUploadForm from '../forms/PhotoUploadForm'
import PageContainer from '../common/PageContainer'

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'birds', label: 'Birds' },
    { id: 'people', label: 'People' },
    { id: 'places', label: 'Places' },
    { id: 'events', label: 'Events' }
]

const EAGER_LOAD_COUNT = 3

const buildCaption = (photo) => {
    const captionParts = []

    if (photo.header) {
        captionParts.push(photo.header)
    }
    if (photo.description) {
        captionParts.push(photo.description)
    }
    if (photo.eventName) {
        captionParts.push(`Event: ${photo.eventName}`)
    }
    if (photo.location) {
        captionParts.push(photo.location)
    }
    if (photo.photoDate || photo.photodate) {
        const formattedDate = formatPhotoDate(
            photo.photoDate || photo.photodate
        )
        if (formattedDate) {
            captionParts.push(formattedDate)
        }
    }
    if (photo.contributor) {
        captionParts.push(`Contributor: ${photo.contributor}`)
    }

    return captionParts.length > 0 ? captionParts.join(' • ') : undefined
}

const normalizePhoto = (photo, { source, eventId = null, eventName = '' }) => {
    const imageId = photo.imageId || photo.cloudinary_public_id
    if (!imageId) return null

    const header = photo.header || ''
    const description = photo.description || ''
    const location = photo.location || ''
    const contributor = photo.contributor || ''
    const photoDate = photo.photoDate || photo.photodate || ''
    const resolvedEventName = eventName || photo.eventName || ''

    return {
        imageId,
        src: getImageUrl(imageId, transformations.optimized),
        thumbSrc: getImageUrl(imageId, transformations.medium),
        category:
            source === 'club'
                ? (photo.category || 'people').toLowerCase()
                : null,
        source,
        eventId: eventId || photo.eventId || null,
        eventName: resolvedEventName,
        title: header || 'Photo',
        header,
        description,
        location,
        contributor,
        photoDate,
        uploadedBy: photo.uploadedBy || null,
        uploadedByEmail: photo.uploadedByEmail || null,
        caption: buildCaption({
            header,
            description,
            location,
            contributor,
            photoDate,
            eventName: resolvedEventName
        })
    }
}

const matchesSearch = (photo, searchTerm) => {
    if (!searchTerm) return true
    const haystack = [
        photo.header,
        photo.title,
        photo.description,
        photo.location,
        photo.contributor,
        photo.eventName,
        photo.photoDate
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

    return haystack.includes(searchTerm)
}

const matchesFilter = (photo, activeFilter) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'events') return photo.source === 'event'
    return photo.source === 'club' && photo.category === activeFilter
}

const PhotoTile = ({ photo, index, onOpen, canManage, onEdit, onDelete }) => {
    const [loaded, setLoaded] = useState(false)
    const eager = index < EAGER_LOAD_COUNT
    const subtitle = [photo.eventName, photo.location, photo.contributor]
        .filter(Boolean)
        .join(' · ')

    return (
        <Box
            sx={{
                position: 'relative',
                mb: 2,
                breakInside: 'avoid',
                WebkitColumnBreakInside: 'avoid',
                pageBreakInside: 'avoid',
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: 'grey.100',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                transition:
                    'transform 0.25s ease, box-shadow 0.25s ease, opacity 0.4s ease',
                opacity: 0,
                animation: 'photoTileIn 0.45s ease forwards',
                animationDelay: `${Math.min(index, 12) * 40}ms`,
                '@keyframes photoTileIn': {
                    from: {
                        opacity: 0,
                        transform: 'translateY(10px)'
                    },
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                },
                '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                    opacity: 1,
                    transition: 'none'
                },
                '@media (hover: hover)': {
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                        transform: 'translateY(-3px)'
                    },
                    '&:hover .photo-overlay': {
                        opacity: 1
                    },
                    '&:hover .photo-actions': {
                        opacity: 1
                    }
                }
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={() => onOpen(index)}
                aria-label={`View ${photo.title}`}
                sx={{
                    display: 'block',
                    width: '100%',
                    p: 0,
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: 2
                    }
                }}
            >
                <Box sx={{ position: 'relative', lineHeight: 0 }}>
                    <Box
                        component="img"
                        src={photo.thumbSrc}
                        alt={photo.title}
                        loading={eager ? 'eager' : 'lazy'}
                        decoding="async"
                        onLoad={() => setLoaded(true)}
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: { xs: 520, md: 640 },
                            objectFit: 'cover',
                            display: 'block',
                            opacity: loaded ? 1 : 0,
                            transition: 'opacity 0.35s ease',
                            '@media (prefers-reduced-motion: reduce)': {
                                opacity: 1,
                                transition: 'none'
                            }
                        }}
                    />

                    <Box
                        className="photo-overlay"
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            p: 1.5,
                            background:
                                'linear-gradient(transparent, rgba(0,0,0,0.72))',
                            color: 'common.white',
                            opacity: 0,
                            transition: 'opacity 0.25s ease',
                            '@media (prefers-reduced-motion: reduce)': {
                                transition: 'none'
                            }
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.3,
                                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                            }}
                        >
                            {photo.title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="caption"
                                sx={{
                                    opacity: 0.9,
                                    mt: 0.25,
                                    display: 'block'
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        px: 1.5,
                        py: 1.25,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.3
                        }}
                    >
                        {photo.title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.25 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {canManage && (
                <Box
                    className="photo-actions"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5,
                        opacity: { xs: 1, md: 0 },
                        transition: 'opacity 0.2s ease',
                        zIndex: 2
                    }}
                >
                    <IconButton
                        size="small"
                        aria-label={`Edit ${photo.title}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(photo)
                        }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.92)',
                            '&:hover': { bgcolor: 'common.white' }
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        aria-label={`Delete ${photo.title}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(photo)
                        }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.92)',
                            color: 'error.main',
                            '&:hover': { bgcolor: 'common.white' }
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Box>
    )
}

export default function Photos() {
    const { isAuthenticated, user, getIdTokenClaims } = useAuth0()
    const { isOfficer } = useUserRole()
    const [index, setIndex] = useState(-1)
    const [activeFilter, setActiveFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingEventPhotos, setLoadingEventPhotos] = useState(false)
    const [error, setError] = useState(null)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [editingPhoto, setEditingPhoto] = useState(null)
    const [photoToDelete, setPhotoToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        loadPhotos()
    }, [])

    useEffect(() => {
        setIndex(-1)
    }, [activeFilter, searchTerm])

    const loadPhotos = async () => {
        try {
            setLoading(true)
            setError(null)

            const clubData = await getPhotos()
            const clubPhotos = (clubData || [])
                .map((photo) => normalizePhoto(photo, { source: 'club' }))
                .filter(Boolean)

            setPhotos(clubPhotos)
            setLoading(false)

            setLoadingEventPhotos(true)
            try {
                const events = await getEvents()
                const eventPhotoData = await getEventPhotosForEvents(
                    events || []
                )
                const eventPhotos = eventPhotoData
                    .map((photo) =>
                        normalizePhoto(photo, {
                            source: 'event',
                            eventId: photo.eventId,
                            eventName: photo.eventName
                        })
                    )
                    .filter(Boolean)

                setPhotos((prev) => {
                    const clubOnly = prev.filter((p) => p.source === 'club')
                    return [...clubOnly, ...eventPhotos]
                })
            } catch (eventErr) {
                console.error('Error loading event photos:', eventErr)
                setError(
                    (prev) =>
                        prev ||
                        'Club photos loaded, but event photos could not be loaded.'
                )
            } finally {
                setLoadingEventPhotos(false)
            }
        } catch (err) {
            console.error('Error loading photos:', err)
            setError(err.message || 'Failed to load photos')
            setPhotos([])
            setLoading(false)
            setLoadingEventPhotos(false)
        }
    }

    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filteredByChip = photos.filter((photo) =>
        matchesFilter(photo, activeFilter)
    )
    const visiblePhotos = filteredByChip.filter((photo) =>
        matchesSearch(photo, normalizedSearch)
    )

    const activeFilterLabel =
        FILTERS.find((filter) => filter.id === activeFilter)?.label || 'All'

    const photoCanManage = (photo) =>
        canManagePhoto({
            isOfficer,
            userSub: user?.sub,
            userEmail: user?.email,
            photo
        })

    const handleEditPhoto = (photo) => {
        setIndex(-1)
        setEditingPhoto({
            ...photo,
            title: photo.title || photo.header || ''
        })
    }

    const handleDeleteRequest = (photo) => {
        setIndex(-1)
        setPhotoToDelete(photo)
    }

    const handleConfirmDelete = async () => {
        if (!photoToDelete?.imageId) return

        setDeleting(true)
        setError(null)
        try {
            const claims = await getIdTokenClaims()
            const accessToken = claims?.__raw
            if (!accessToken) {
                throw new Error('You must be logged in to delete photos')
            }
            await deletePhoto(photoToDelete.imageId, {
                accessToken,
                eventId: photoToDelete.eventId || undefined
            })
            setPhotoToDelete(null)
            await loadPhotos()
        } catch (err) {
            console.error('Error deleting photo:', err)
            setError(err.message || 'Failed to delete photo')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <PageContainer maxWidth={1400}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="200px"
                >
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        Loading photos...
                    </Typography>
                </Box>
            </PageContainer>
        )
    }

    const emptyTitle = (() => {
        if (normalizedSearch) {
            return 'No photos match your search'
        }
        if (activeFilter === 'all') {
            return 'No photos yet'
        }
        return `No ${activeFilterLabel.toLowerCase()} photos yet`
    })()

    const emptyBody = normalizedSearch
        ? 'Try a different search term or clear filters.'
        : 'Check back soon, or upload a photo if you are signed in.'

    return (
        <PageContainer maxWidth={1400}>
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 3
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: { xs: 0, sm: 0 }
                    }}
                >
                    Photo Gallery
                </Typography>
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setUploadDialogOpen(true)}
                        sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
                    >
                        Upload Photo
                    </Button>
                )}
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title, description, location, contributor, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Clear search"
                                onClick={() => setSearchTerm('')}
                                edge="end"
                                size="small"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }}
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'grey.50'
                    }
                }}
            />

            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 1.5 }}
            >
                {FILTERS.map((filter) => (
                    <Chip
                        key={filter.id}
                        label={filter.label}
                        clickable
                        color={
                            activeFilter === filter.id ? 'primary' : 'default'
                        }
                        variant={
                            activeFilter === filter.id ? 'filled' : 'outlined'
                        }
                        onClick={() => setActiveFilter(filter.id)}
                        sx={{ fontWeight: 600 }}
                    />
                ))}
            </Stack>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 3,
                    minHeight: 24
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Showing {visiblePhotos.length} of {photos.length} photos
                </Typography>
                {loadingEventPhotos && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={14} />
                        <Typography variant="caption" color="text.secondary">
                            Loading event photos…
                        </Typography>
                    </Box>
                )}
            </Box>

            {visiblePhotos.length === 0 ? (
                <Box
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        color: 'text.secondary'
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {emptyTitle}
                    </Typography>
                    <Typography variant="body2">{emptyBody}</Typography>
                </Box>
            ) : (
                <Box
                    key={`${activeFilter}-${normalizedSearch}`}
                    sx={{
                        columnCount: { xs: 1, sm: 2, md: 3 },
                        columnGap: { xs: 2, md: 2.5 },
                        animation: 'galleryFade 0.35s ease',
                        '@keyframes galleryFade': {
                            from: { opacity: 0.4 },
                            to: { opacity: 1 }
                        },
                        '@media (prefers-reduced-motion: reduce)': {
                            animation: 'none'
                        }
                    }}
                >
                    {visiblePhotos.map((photo, idx) => (
                        <PhotoTile
                            key={photo.imageId || `${photo.src}-${idx}`}
                            photo={photo}
                            index={idx}
                            onOpen={setIndex}
                            canManage={photoCanManage(photo)}
                            onEdit={handleEditPhoto}
                            onDelete={handleDeleteRequest}
                        />
                    ))}
                </Box>
            )}

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={visiblePhotos.map((photo) => ({
                    src: photo.src,
                    title: photo.title,
                    description: photo.caption
                }))}
                plugins={[Captions]}
            />

            <PhotoUploadForm
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUploadSuccess={loadPhotos}
            />

            <PhotoUploadForm
                open={Boolean(editingPhoto)}
                photo={editingPhoto}
                showCategory={editingPhoto?.source !== 'event'}
                onClose={() => setEditingPhoto(null)}
                onUploadSuccess={loadPhotos}
            />

            <Dialog
                open={Boolean(photoToDelete)}
                onClose={() => !deleting && setPhotoToDelete(null)}
            >
                <DialogTitle>Delete photo?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This permanently removes
                        {photoToDelete?.title
                            ? ` "${photoToDelete.title}"`
                            : ' this photo'}
                        {photoToDelete?.source === 'event'
                            ? ' from this event and the gallery'
                            : ' from the gallery'}
                        . This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setPhotoToDelete(null)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    )
}
