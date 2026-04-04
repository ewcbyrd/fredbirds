import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { getMemberByEmail } from '../services/restdbService'

/**
 * Fetch the current authenticated user's member record from the database.
 * Returns { member, loading, error } — components destructure what they need.
 *
 * @param {Object} [options]
 * @param {boolean} [options.enabled=true] - Set to false to skip fetching (useful for conditional loads)
 * @param {Array} [options.deps=[]] - Additional dependency array items that trigger a refetch
 * @returns {{ member: Object|null, loading: boolean, error: string|null }}
 */
export const useMember = (options = {}) => {
    const { enabled = true, deps = [] } = options
    const { user, isAuthenticated, isLoading: authLoading } = useAuth0()
    const [member, setMember] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Skip if disabled or auth is still loading
        if (!enabled || authLoading) {
            if (!enabled) setLoading(false)
            return
        }

        // Not authenticated — nothing to fetch
        if (!isAuthenticated || !user?.email) {
            setMember(null)
            setLoading(false)
            return
        }

        const fetchMember = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getMemberByEmail(user.email)
                setMember(data)
            } catch (err) {
                console.error('Error fetching member data:', err)
                setError(err.message || 'Failed to load member data')
                setMember(null)
            } finally {
                setLoading(false)
            }
        }

        fetchMember()
    }, [isAuthenticated, user?.email, authLoading, enabled, ...deps])

    return { member, loading, error }
}

export default useMember
