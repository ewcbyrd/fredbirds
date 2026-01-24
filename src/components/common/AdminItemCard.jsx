import React from 'react'
import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Stack
} from '@mui/material'

const AdminItemCard = ({
    icon,
    title,
    subtitle,
    children,
    actions,
    contentSx = {},
    variant = "outlined",
    ...props
}) => {
    return (
        <Card variant={variant} {...props}>
            <CardContent sx={contentSx}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    {icon && (
                        <Box sx={{ flexShrink: 0 }}>
                            {icon}
                        </Box>
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                {title}
                            </Typography>
                        </Box>

                        {subtitle && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {subtitle}
                            </Typography>
                        )}

                        {children}
                    </Box>
                </Box>
            </CardContent>
            {actions && (
                <CardActions>
                    {actions}
                </CardActions>
            )}
        </Card>
    )
}

export default AdminItemCard
