const api = 'https://fredbirds-api.azurewebsites.net/';

const get = async (url) => {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return res.json();
    }
    throw new Error(`Expected JSON response, got ${contentType || 'unknown'}`);
};

const post = async (url, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error('POST request failed:', {
            url,
            status: res.status,
            body: errorText
        });
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
    }
    return res.json ? res.json() : res;
};

const patch = async (url, body) => {
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

export const getEventsByYear = async (year) => {
    const url = `${api}events/${year}`;
    return get(url);
};

export const getFutureEvents = async (currentDate, months = 3) => {
    const url = `${api}events/future/${months}`;
    return get(url);
};

export const getAnnouncements = async () => {
    const url = `${api}announcements`;
    return get(url);
};

export const getNewsletters = async () => {
    const url = `${api}newsletters`;
    return get(url);
};

export const getOfficers = async () => {
    const url = `${api}members/officers`;
    return get(url);
};

export const saveMember = async (memberJson) => {
    const url = `${api}members`;
    return post(url, memberJson);
};

/**
 * Send an email via Azure Communication Services.
 * @param {{ to: string|string[], subject: string, html: string, text?: string, replyTo?: string }} emailData
 * @returns {Promise<{ success: boolean, message: string, messageId?: string }>}
 */
export const sendEmail = async (emailData) => {
    const url = `${api}mailertogo`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: JSON.stringify(emailData)
    });
    if (!res.ok) {
        throw new Error(`Email failed: HTTP ${res.status}`);
    }
    return res.json();
};

export const getPhotos = async () => {
    const url = `${api}photos`;
    return get(url);
};

export const savePhoto = async (photoData) => {
    const url = `${api}photos`;
    return post(
        url,
        JSON.stringify({
            cloudinary_public_id: photoData.publicId,
            header: photoData.title,
            description: photoData.description,
            location: photoData.location,
            contributor: photoData.contributor,
            photoDate: photoData.photoDate,
            category: photoData.category
        })
    );
};

export const getMember = async (member) => {
    const url = `${api}members/filter?first=${member.first}&last=${member.last}&email=${member.email}`;
    return get(url);
};

export const getFaqs = async () => {
    const url = `${api}faqs`;
    return get(url);
};

export const getMembers = async () => {
    const url = `${api}members/active`;
    return get(url);
};

export const getActiveMembers = async () => {
    const url = `${api}members/active`;
    return get(url);
};

export const getAllMembers = async () => {
    const url = `${api}members`;
    return get(url);
};

export const getUserRole = async (email, auth0Id) => {
    const url = `${api}members/role`;
    return post(url, JSON.stringify({ email, auth0Id }));
};

export const getMemberByEmail = async (email) => {
    const url = `${api}members/email?email=${encodeURIComponent(email)}`;
    return get(url);
};

export const updateMember = async (memberId, memberData) => {
    const url = `${api}members/${memberId}`;
    return post(url, JSON.stringify(memberData));
};

export const patchMember = async (memberId, updates) => {
    const url = `${api}members/${memberId}`;
    return patch(url, updates);
};

export const deleteMember = async (memberId) => {
    const url = `${api}members/${memberId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

export const getStates = async () => {
    const url = `${api}locations/states`;
    return get(url);
};

export const getCounties = async () => {
    const url = `${api}locations/counties`;
    return get(url);
};

export const getNewsFeeds = async () => {
    const url = `${api}newsfeeds`;
    return get(url);
};

export const getRareBirds = async () => {
    const url = `${api}rarebirds`;
    return get(url);
};

export const getFeed = async (feedUrl) => {
    try {
        // Use rss2json.com service to convert RSS to JSON
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            if (response.status === 422) {
                throw new Error(
                    'RSS feed format not supported by conversion service'
                );
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error(data.message || 'RSS fetch failed');
        }

        // Helper function to extract first image from HTML
        const extractImage = (htmlString) => {
            if (!htmlString) return null;
            const imgMatch = htmlString.match(/<img[^>]+src="([^">]+)"/);
            return imgMatch ? imgMatch[1] : null;
        };

        // Helper function to strip HTML tags
        const stripHtml = (htmlString) => {
            if (!htmlString) return '';
            return (
                htmlString
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .substring(0, 200) + (htmlString.length > 200 ? '...' : '')
            );
        };

        // Convert rss2json format to our expected format
        const items = (data.items || []).map((item, idx) => {
            const description = item.description || '';
            const content = item.content || description;
            const imageUrl = extractImage(content) || item.thumbnail || null;

            return {
                id: idx,
                title: item.title || '',
                description: stripHtml(description),
                link: item.link || '',
                pubDate: item.pubDate || '',
                content: content,
                thumbnail: imageUrl,
                enclosure: imageUrl ? { url: imageUrl } : {}
            };
        });

        return { items };
    } catch (error) {
        console.warn(`RSS feed unavailable: ${feedUrl}`, error.message);
        // Return empty feed structure with error info instead of throwing
        return {
            items: [],
            error: error.message,
            feedUrl
        };
    }
};

// Event Attendance Functions

export const registerForEvent = async (eventId, memberData) => {
    const url = `${api}events/${eventId}/attendees`;
    const body = JSON.stringify({
        memberId: memberData.memberId,
        email: memberData.email,
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        eventTitle: memberData.eventTitle,
        eventStart: memberData.eventStart,
        eventEnd: memberData.eventEnd
    });
    return post(url, body);
};

export const unregisterFromEvent = async (eventId, memberId) => {
    const url = `${api}events/${eventId}/attendees/${memberId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

export const getMemberEvents = async (memberId) => {
    const url = `${api}members/${memberId}/events`;
    const events = await get(url);

    // Handle edge case where API might return empty or null
    if (!events || !Array.isArray(events)) {
        console.warn('getMemberEvents: Unexpected response format', events);
        return [];
    }

    // Normalize the event data to ensure consistent field names
    // Backend should return eventTitle, eventStart, eventEnd
    // But may return event, start, end (legacy format)
    return events.map((event) => ({
        _id: event._id,
        eventTitle: event.eventTitle || event.event,
        eventStart: event.eventStart || event.start,
        eventEnd: event.eventEnd || event.end
    }));
};

export const getEventAttendees = async (eventId) => {
    const url = `${api}events/${eventId}/attendees`;
    return get(url);
};

// Event Management Functions

export const createEvent = async (eventData) => {
    const url = `${api}events`;
    return post(url, JSON.stringify(eventData));
};

export const updateEvent = async (eventId, eventData) => {
    const url = `${api}events/${eventId}`;
    return patch(url, eventData);
};

export const deleteEvent = async (eventId) => {
    const url = `${api}events/${eventId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

// Event Photos Management Functions

export const getEventPhotos = async (eventId) => {
    const url = `${api}events/${eventId}/photos`;
    return get(url);
};

export const addEventPhoto = async (eventId, photoData) => {
    const url = `${api}events/${eventId}/photos`;
    return post(url, JSON.stringify(photoData));
};

export const removeEventPhoto = async (eventId, photoId) => {
    const url = `${api}events/${eventId}/photos`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: JSON.stringify({ _id: photoId })
    });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

// Member Registration Functions

export const registerMember = async (registrationData) => {
    const url = `${api}members/register`;
    return post(
        url,
        JSON.stringify({
            first: registrationData.first,
            last: registrationData.last,
            email: registrationData.email,
            phone: registrationData.phone,
            website: registrationData.website // honeypot — hidden field, must be empty
        })
    );
};

export const getPendingMembers = async () => {
    const url = `${api}members/pending`;
    return get(url);
};

// Announcement Management Functions

export const createAnnouncement = async (announcementData) => {
    const url = `${api}announcements`;
    return post(url, JSON.stringify(announcementData));
};

export const updateAnnouncement = async (announcementId, announcementData) => {
    const url = `${api}announcements/${announcementId}`;
    return patch(url, announcementData);
};

export const deleteAnnouncement = async (announcementId) => {
    const url = `${api}announcements/${announcementId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
};

export default {
    getEventsByYear,
    getFutureEvents,
    getAnnouncements,
    getNewsletters,
    saveMember,
    sendEmail,
    getMember,
    getFaqs,
    getMembers,
    getActiveMembers,
    getUserRole,
    getMemberByEmail,
    updateMember,
    patchMember,
    getStates,
    getCounties,
    getNewsFeeds,
    getRareBirds,
    getFeed,
    registerForEvent,
    unregisterFromEvent,
    getMemberEvents,
    getEventAttendees,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventPhotos,
    addEventPhoto,
    removeEventPhoto,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    registerMember,
    getPendingMembers,
    deleteMember
};
