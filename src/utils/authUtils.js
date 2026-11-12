/**
 * Build a same-origin return path for Auth0 appState.
 * Rejects absolute URLs so Auth0 cannot be used as an open redirect.
 * @param {string} [returnTo] - Explicit path (pathname + search + hash)
 * @returns {string}
 */
export const getSafeReturnTo = (returnTo) => {
    const fallback = `${window.location.pathname}${window.location.search}${window.location.hash}`
    const candidate = returnTo || fallback

    if (
        typeof candidate !== 'string' ||
        !candidate.startsWith('/') ||
        candidate.startsWith('//')
    ) {
        return '/'
    }

    return candidate
}

/**
 * Start Auth0 login/signup and return the user to the page they left.
 * @param {Function} loginWithRedirect - Auth0 loginWithRedirect from useAuth0()
 * @param {Object} [options]
 * @param {string} [options.returnTo] - Same-origin path to restore after login
 * @param {'login'|'signup'} [options.screenHint='login'] - Auth0 screen_hint
 * @param {string} [options.loginHint] - Prefill email on Auth0
 */
export const startLogin = (loginWithRedirect, options = {}) => {
    const { returnTo, screenHint = 'login', loginHint } = options
    const authorizationParams = {
        screen_hint: screenHint
    }

    if (loginHint) {
        authorizationParams.login_hint = loginHint
    }

    return loginWithRedirect({
        appState: {
            returnTo: getSafeReturnTo(returnTo)
        },
        authorizationParams
    })
}

export default {
    getSafeReturnTo,
    startLogin
}
