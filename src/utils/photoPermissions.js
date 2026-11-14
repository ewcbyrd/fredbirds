/**
 * Whether the current user can edit or delete a photo.
 * Officers/admins can manage any photo. Uploaders can manage their own.
 * Legacy photos without ownership metadata are officer/admin only.
 *
 * @param {object} params
 * @param {boolean} params.isOfficer - true for officer or admin (useUserRole isOfficer)
 * @param {string} [params.userSub] - Auth0 user.sub
 * @param {string} [params.userEmail] - Auth0 user.email
 * @param {object} [params.photo] - photo record with uploadedBy / uploadedByEmail
 * @returns {boolean}
 */
export const canManagePhoto = ({
    isOfficer = false,
    userSub = null,
    userEmail = null,
    photo = null
} = {}) => {
    if (isOfficer) return true
    if (!photo) return false

    if (photo.uploadedBy && userSub && photo.uploadedBy === userSub) {
        return true
    }

    const photoEmail = photo.uploadedByEmail
        ? String(photo.uploadedByEmail).trim().toLowerCase()
        : null
    const email = userEmail ? String(userEmail).trim().toLowerCase() : null
    if (photoEmail && email && photoEmail === email) {
        return true
    }

    return false
}

export default canManagePhoto
