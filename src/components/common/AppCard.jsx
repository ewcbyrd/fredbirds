import React from 'react'
import {
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Typography,
    Box,
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
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
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
