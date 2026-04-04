import {
    EmojiEvents,
    Star,
    Diamond,
    WorkspacePremium
} from '@mui/icons-material'

/**
 * Extract first/last name parts from a member record.
 * Handles both "First Last" Name field and separate first/last fields.
 * @param {Object} member - Member object
 * @returns {{ first: string, last: string }}
 */
export const getNameParts = (member) => {
    if (member.Name) {
        // Handle "First Last" format
        const parts = member.Name.split(' ')
        return {
            last: parts.length > 1 ? parts[parts.length - 1] : '',
            first: parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0] || ''
        }
    }

    return {
        last: member.lastName || member.last || '',
        first: member.firstName || member.first || member.name || ''
    }
}

/**
 * Format a member's display name from various field conventions.
 * @param {Object|null} member - Member object (null-safe)
 * @returns {string} Display name
 */
export const formatName = (member) => {
    if (!member) return 'Unknown Member'

    // Try different field name conventions
    if (member.Name) {
        return member.Name  // Capital N (officers data format)
    }

    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const fullName = `${firstName} ${lastName}`.trim()

    if (fullName) {
        return fullName
    }

    // Try single name field
    if (member.name) {
        return member.name
    }

    return 'Name not provided'
}

/**
 * Get initials from a member's name.
 * @param {Object|null} member - Member object (null-safe)
 * @returns {string} 1-2 character initials, defaults to 'M'
 */
export const getInitials = (member) => {
    if (!member) return 'M'

    // Try different field name conventions
    if (member.Name) {
        const nameParts = member.Name.split(' ')
        return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
    }

    const firstName = member.firstName || member.first || ''
    const lastName = member.lastName || member.last || ''
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

    if (initials.length > 0) {
        return initials
    }

    // Try single name field
    if (member.name) {
        const nameParts = member.name.split(' ')
        return nameParts.map(part => part.charAt(0)).join('').toUpperCase() || 'M'
    }

    return 'M'
}

/**
 * Format a phone number for display.
 * Formats 10-digit numbers as (XXX) XXX-XXXX, returns others as-is.
 * @param {string|null} phone - Raw phone string
 * @returns {string|null} Formatted phone or null if falsy
 */
export const formatPhone = (phone) => {
    if (!phone) return null
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
}

/**
 * Get milestone badge info for a member based on their world species count.
 * Always includes bgColor and borderColor for profile card styling.
 * @param {Object} member - Member object with .worldCount
 * @returns {Object|null} Milestone info with icon, color, text, tooltip, level, bgColor, borderColor — or null
 */
export const getMilestoneInfo = (member) => {
    const worldCount = member?.worldCount || 0

    if (worldCount >= 1000) {
        return {
            icon: Diamond,
            color: '#9c27b0', // Purple
            text: '1000+',
            tooltip: '1000+ World Species',
            level: 'master',
            bgColor: '#f3e5f5',
            borderColor: '#9c27b0'
        }
    } else if (worldCount >= 500) {
        return {
            icon: EmojiEvents,
            color: '#ff9800', // Gold
            text: '500+',
            tooltip: '500+ World Species',
            level: 'expert',
            bgColor: '#fff3e0',
            borderColor: '#ff9800'
        }
    } else if (worldCount >= 250) {
        return {
            icon: WorkspacePremium,
            color: '#4caf50', // Green
            text: '250+',
            tooltip: '250+ World Species',
            level: 'advanced',
            bgColor: '#e8f5e9',
            borderColor: '#4caf50'
        }
    } else if (worldCount >= 100) {
        return {
            icon: Star,
            color: '#2196f3', // Blue
            text: '100+',
            tooltip: '100+ World Species',
            level: 'accomplished',
            bgColor: '#e3f2fd',
            borderColor: '#2196f3'
        }
    }

    return null
}

/**
 * Check if the current authenticated user is viewing their own profile.
 * @param {Object} user - Auth0 user object (needs .email)
 * @param {Object} member - Member record (needs .email)
 * @returns {boolean}
 */
export const isOwnProfile = (user, member) => {
    if (!user || !member) return false
    return user.email === member.email
}

export default {
    getNameParts,
    formatName,
    getInitials,
    formatPhone,
    getMilestoneInfo,
    isOwnProfile
}
