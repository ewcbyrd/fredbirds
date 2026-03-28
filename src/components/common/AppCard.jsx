import React from 'react'
import {
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Typography,
    useTheme
} from '@mui/material'

const AppCard = ({
    title,
    subtitle,
    image,
    customMedia,
    imageHeight = 200,
    children,
    onClick,
    sx = {},
    contentSx = {},
    variant = "elevation",
    ...props
}) => {
    const theme = useTheme()

    const cardContent = (
        <>
            {image ? (
                <CardMedia
                    component="img"
                    height={imageHeight}
                    image={image}
                    alt={title || 'Card image'}
                />
            ) : customMedia}
            <CardContent sx={{ flexGrow: 1, ...contentSx }}>
                {title && (
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                )}
                {subtitle && (
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {subtitle}
                    </Typography>
                )}
                {children}
            </CardContent>
        </>
    )

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1.5px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': onClick ? {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                    borderColor: 'rgba(0, 0, 0, 0.12)'
                } : {},
                ...sx
            }}
            variant={variant}
            {...props}
        >
            {onClick ? (
                <CardActionArea
                    onClick={onClick}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start'
                    }}
                >
                    {cardContent}
                </CardActionArea>
            ) : (
                cardContent
            )}
        </Card>
    )
}

export default AppCard
