import { format } from 'date-fns'

/**
 * Convert a UTC date string to a local Date with the same calendar date.
 * Prevents timezone shifts (e.g., Jan 4 UTC becoming Jan 3 EST).
 * @param {string} dateString - ISO or UTC date string
 * @returns {Date|null} Local Date with the same year/month/day, or null if falsy
 */
export const parseUTCDate = (dateString) => {
    if (!dateString) return null
    const utcDate = new Date(dateString)
    return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate())
}

/**
 * Format a date-only string (e.g., YYYY-MM-DD) for display, avoiding off-by-one errors.
 * When new Date('2025-12-09') is called, JS interprets it as UTC midnight,
 * which can shift to previous day in negative UTC offset timezones.
 * @param {string} dateString - Date string in YYYY-MM-DD or other format
 * @returns {string|null} Formatted string like "January 4, 2025", or null/original string on failure
 */
export const formatPhotoDate = (dateString) => {
    if (!dateString) return null
    try {
        const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        if (dateMatch) {
            const [, year, month, day] = dateMatch
            const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
    }
}

/**
 * Format a date range for event detail views (full weekday name for single dates).
 * Handles exclusive end dates (subtracts 1 day from end).
 * @param {string} start - Start date string
 * @param {string} end - End date string (can be falsy for single-day events)
 * @returns {string} e.g., "Saturday, January 4, 2025" or "Jan 4 - Jan 6, 2025"
 */
export const formatDateRangeDetail = (start, end) => {
    const startDate = parseUTCDate(start)

    if (!end) return format(startDate, 'EEEE, MMMM d, yyyy')

    const utcEnd = new Date(end)
    // End date is exclusive (midnight of next day), so subtract 1 day to get the inclusive end date
    utcEnd.setUTCDate(utcEnd.getUTCDate() - 1)
    const endDate = new Date(utcEnd.getUTCFullYear(), utcEnd.getUTCMonth(), utcEnd.getUTCDate())

    // If start and end are same day (or end is before start due to data weirdness), show single date
    if (startDate.getTime() >= endDate.getTime()) {
        return format(startDate, 'EEEE, MMMM d, yyyy')
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
}

/**
 * Format a date range for event list views (short format, no weekday name).
 * Does NOT subtract from end date -- treats end as inclusive.
 * @param {string} start - Start date string
 * @param {string} end - End date string (can be falsy for single-day events)
 * @returns {string} e.g., "Jan 4, 2025" or "Jan 4 - Jan 6, 2025"
 */
export const formatDateRangeShort = (start, end) => {
    const startDate = parseUTCDate(start)

    if (!end) {
        return format(startDate, 'MMM d, yyyy')
    }

    const endDate = parseUTCDate(end)

    if (startDate.toDateString() === endDate.toDateString()) {
        return format(startDate, 'MMM d, yyyy')
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`
}

/**
 * Format a member event date range for profile views.
 * Uses UTC parsing to avoid timezone issues.
 * @param {string} startDateString - Start date string
 * @param {string} endDateString - End date string (can be falsy for single-day events)
 * @returns {string} e.g., "January 4, 2025" or "September 7-10, 2010"
 */
export const formatMemberEventDate = (startDateString, endDateString) => {
    if (!startDateString) return 'Date not available'

    const startDate = new Date(startDateString)
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    const startDay = startDate.getUTCDate()
    const startYear = startDate.getUTCFullYear()

    if (!endDateString) {
        return `${startMonth} ${startDay}, ${startYear}`
    }

    const endDate = new Date(endDateString)
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
    const endDay = endDate.getUTCDate()
    const endYear = endDate.getUTCFullYear()

    // Same month - format: September 7-10, 2010
    if (startMonth === endMonth && startYear === endYear) {
        return `${startMonth} ${startDay}-${endDay}, ${startYear}`
    }

    // Different months - format: September 29 - October 1, 2010
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`
}

/**
 * Check if an event is in the past (start date is before today).
 * Applies UTC-to-local conversion to prevent timezone-related off-by-one errors.
 * @param {Object} event - Event object with a .start property
 * @returns {boolean}
 */
export const isPastEvent = (event) => {
    const startDate = parseUTCDate(event.start)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return startDate < today
}

/**
 * Check if an event is in the future (start date is after today).
 * Applies UTC-to-local conversion to prevent timezone-related off-by-one errors.
 * @param {Object} event - Event object with a .start property
 * @returns {boolean}
 */
export const isFutureEvent = (event) => {
    const startDate = parseUTCDate(event.start)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return startDate > today
}

export default {
    parseUTCDate,
    formatPhotoDate,
    formatDateRangeDetail,
    formatDateRangeShort,
    formatMemberEventDate,
    isPastEvent,
    isFutureEvent
}
