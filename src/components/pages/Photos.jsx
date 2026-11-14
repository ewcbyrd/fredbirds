import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { useAuth0 } from '@auth0/auth0-react'
import { getPhotos } from '../../services/restdbService'
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

const CATEGORIES = ['people', 'places', 'birds']
const CATEGORY_LABELS = ['People', 'Places', 'Birds']
const EAGER_LOAD_COUNT = 3

const PhotoTile = ({ photo, index, onOpen, canManage, onEdit, onDelete }) => {
    const [loaded, setLoaded] = useState(false)
    const eager = index < EAGER_LOAD_COUNT
    const subtitle = [photo.location, photo.contributor]
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
    const [activeTab, setActiveTab] = useState(0)
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [editingPhoto, setEditingPhoto] = useState(null)
    const [photoToDelete, setPhotoToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        loadPhotos()
    }, [])

    const loadPhotos = async () => {
        try {
            setLoading(true)
            const data = await getPhotos()

            const transformedPhotos = data
                .filter(
                    (photo) => photo.imageId || photo.cloudinary_public_id
                )
                .map((photo) => {
                    const imageId =
                        photo.imageId || photo.cloudinary_public_id
                    const captionParts = []

                    if (photo.header) {
                        captionParts.push(photo.header)
                    }

                    if (photo.description) {
                        captionParts.push(photo.description)
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

                    return {
                        imageId,
                        src: getImageUrl(
                            imageId,
                            transformations.optimized
                        ),
                        thumbSrc: getImageUrl(
                            imageId,
                            transformations.medium
                        ),
                        category: (photo.category || 'people').toLowerCase(),
                        title: photo.header || 'Photo',
                        header: photo.header || '',
                        description: photo.description || '',
                        location: photo.location || '',
                        contributor: photo.contributor || '',
                        photoDate: photo.photoDate || photo.photodate || '',
                        uploadedBy: photo.uploadedBy || null,
                        uploadedByEmail: photo.uploadedByEmail || null,
                        caption:
                            captionParts.length > 0
                                ? captionParts.join(' • ')
                                : undefined
                    }
                })

            setPhotos(transformedPhotos)
        } catch (err) {
            console.error('Error loading photos:', err)
            setError(err.message || 'Failed to load photos')
            setPhotos([])
        } finally {
            setLoading(false)
        }
    }

    const filteredPhotos = photos.filter(
        (photo) => photo.category === CATEGORIES[activeTab]
    )

    const categoryLabel = CATEGORY_LABELS[activeTab]

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
            await deletePhoto(photoToDelete.imageId, { accessToken })
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

            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    mb: 3
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => {
                        setActiveTab(newValue)
                        setIndex(-1)
                    }}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            minWidth: { xs: 96, sm: 120 },
                            '&.Mui-selected': {
                                color: 'primary.main'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'primary.main',
                            height: 3
                        }
                    }}
                >
                    {CATEGORY_LABELS.map((label) => (
                        <Tab key={label} label={label} />
                    ))}
                </Tabs>
            </Box>

            {filteredPhotos.length === 0 ? (
                <Box
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        color: 'text.secondary'
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        No {categoryLabel.toLowerCase()} photos yet
                    </Typography>
                    <Typography variant="body2">
                        Check back soon, or upload a photo if you are signed in.
                    </Typography>
                </Box>
            ) : (
                <Box
                    key={activeTab}
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
                    {filteredPhotos.map((photo, idx) => (
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
                slides={filteredPhotos.map((photo) => ({
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
                            : ' this photo'}{' '}
                        from the gallery. This cannot be undone.
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
