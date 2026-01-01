import { useState, useEffect, useRef } from 'react'

/**
 * Hook to detect user inactivity and trigger a callback
 * @param {Function} onIdle - Function to call when user becomes idle
 * @param {number} idleTime - Time in milliseconds before user is considered idle (default: 30 mins)
 */
export const useIdleTimeout = ({ onIdle, idleTime = 1000 * 60 * 30 }) => {
    const [isIdle, setIsIdle] = useState(false)

    // Use a ref for the timer ID to avoid re-renders
    const timerRef = useRef(null)

    // Use a ref for the onIdle callback to ensure we always have the latest version
    // without triggering re-effects when the callback reference changes
    const onIdleRef = useRef(onIdle)

    useEffect(() => {
        onIdleRef.current = onIdle
    }, [onIdle])

    useEffect(() => {
        const startTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }

            timerRef.current = setTimeout(() => {
                setIsIdle(true)
                if (onIdleRef.current) {
                    onIdleRef.current()
                }
            }, idleTime)
        }

        const resetTimer = () => {
            // If we were idle and are now active, update state
            if (isIdle) {
                setIsIdle(false)
            }
            startTimer()
        }

        // Events that constitute activity
        const events = [
            'mousemove',
            'keydown',
            'wheel',
            'DOMMouseScroll',
            'mousewheel',
            'mousedown',
            'touchstart',
            'touchmove',
            'MSPointerMove',
            'click'
        ]

        // Initial start
        startTimer()

        // Add event listeners with debounce/throttling implicitly handled by the reset
        // For high frequency events like mousemove, we might want to throttle in a production
        // library, but for this simple timeout reset, simply calling clear/set is usually fine
        // as browsers optimize this well.
        const handleActivity = () => {
            resetTimer()
        }

        events.forEach(event => {
            window.addEventListener(event, handleActivity)
        })

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity)
            })
        }
    }, [idleTime, isIdle]) // Re-run if idleTime changes

    return { isIdle }
}

export default useIdleTimeout
