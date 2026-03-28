import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

/**
 * EnhancedCard - A sophisticated card component with primary and secondary variants
 * 
 * @param {string} variant - 'primary' or 'secondary' (default: 'primary')
 * @param {node} icon - Icon component to display
 * @param {string} title - Card title
 * @param {string} subtitle - Optional subtitle/description
 * @param {function} onClick - Click handler
 * @param {string} gradient - Custom gradient (overrides variant default)
 * @param {object} sx - Additional MUI sx props
 */
const EnhancedCard = ({
  variant = 'primary',
  icon: Icon,
  title,
  subtitle,
  onClick,
  gradient,
  sx = {},
  children,
  ...props
}) => {
  const theme = useTheme()
  
  const isPrimary = variant === 'primary'
  
  // Default gradients for variants (can be overridden)
  const defaultGradient = isPrimary
    ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
    : `linear-gradient(135deg, ${theme.palette.accent.brown} 0%, #9d8159 100%)`
  
  const cardGradient = gradient || defaultGradient
  
  return (
    <Card
      onClick={onClick}
      sx={{
        background: cardGradient,
        textAlign: 'center',
        py: isPrimary ? 4 : 3.5,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: isPrimary ? 4 : 3,
        boxShadow: isPrimary 
          ? '0 12px 35px rgba(0, 0, 0, 0.25)' 
          : '0 8px 25px rgba(0, 0, 0, 0.2)',
        transition: isPrimary
          ? 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isPrimary 
          ? '2px solid rgba(255,255,255,0.15)' 
          : '1px solid rgba(255,255,255,0.12)',
        position: 'relative',
        overflow: 'hidden',
        opacity: isPrimary ? 1 : 0.95,
        ...(isPrimary && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 70%)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }
        }),
        '&:hover': onClick ? {
          transform: isPrimary ? 'translateY(-14px) scale(1.06)' : 'translateY(-8px)',
          boxShadow: isPrimary 
            ? '0 24px 50px rgba(0, 0, 0, 0.35)' 
            : '0 16px 35px rgba(0, 0, 0, 0.28)',
          border: isPrimary 
            ? '2px solid rgba(255,255,255,0.25)' 
            : '1px solid rgba(255,255,255,0.18)',
          opacity: 1,
          ...(isPrimary && {
            '&::before': {
              opacity: 1,
            }
          })
        } : {},
        ...sx
      }}
      {...props}
    >
      <CardContent>
        {Icon && (
          <Box
            sx={{
              mb: isPrimary ? 2 : 1.5,
              transition: 'transform 0.4s ease',
              '.MuiCard-root:hover &': isPrimary ? {
                transform: 'scale(1.1) rotate(5deg)',
              } : {}
            }}
          >
            <Icon 
              sx={{ 
                fontSize: isPrimary ? 60 : 52, 
                color: 'white', 
                filter: `drop-shadow(0 ${isPrimary ? 4 : 2}px ${isPrimary ? 12 : 8}px rgba(0,0,0,${isPrimary ? 0.3 : 0.25}))`,
                opacity: isPrimary ? 1 : 0.95,
              }} 
            />
          </Box>
        )}
        
        {title && (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: isPrimary ? 700 : 600, 
              color: 'white', 
              textShadow: `0 2px ${isPrimary ? 8 : 6}px rgba(0,0,0,${isPrimary ? 0.25 : 0.2})`,
              letterSpacing: isPrimary ? '0.5px' : 'normal',
              fontSize: isPrimary ? '1.25rem' : '1.05rem'
            }}
          >
            {title}
          </Typography>
        )}
        
        {subtitle && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: isPrimary ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.85)', 
              display: 'block',
              mt: 0.5,
              fontSize: isPrimary ? '0.75rem' : '0.7rem',
              textShadow: `0 1px 4px rgba(0,0,0,0.2)`
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {children}
      </CardContent>
    </Card>
  )
}

export default EnhancedCard
