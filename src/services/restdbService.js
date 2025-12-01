const api = 'https://fredbirds-api.herokuapp.com/';

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
    headers: { 'cache-control': 'no-cache', 'content-type': 'application/json' },
    body
  });
  return res.json ? res.json() : res;
};

const patch = async (url, body) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'cache-control': 'no-cache', 'content-type': 'application/json' },
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

export const sendEmail = async (emailJson) => {
  const url = `${api}sendgrid`;
  // some endpoints return the fetch promise directly
  return fetch(url, {
    method: 'POST',
    headers: { 'cache-control': 'no-cache', 'content-type': 'application/json' },
    body: emailJson
  });
};

export const getPhotos = async () => {
  const url = `${api}photos`;
  return get(url);
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

export const getUserRole = async (email, auth0Id) => {
  const url = `${api}members/role`;
  return post(url, JSON.stringify({ email, auth0Id }));
};

export const getMemberByEmail = async (email) => {
  const url = `${api}members/email?email=${encodeURIComponent(email)}`;
  return get(url);
};

export const autoRegisterMember = async (auth0User) => {
  const parseName = (fullName, email, directFirstName, directLastName) => {
    // If we have direct name inputs from form, use those
    if (directFirstName !== undefined || directLastName !== undefined) {
      return {
        firstName: directFirstName || '',
        lastName: directLastName || ''
      };
    }
    
    // If no name provided, try to extract from email
    if (!fullName || fullName === email) {
      const emailLocal = email.split('@')[0];
      // Handle common email formats like first.last@domain.com
      if (emailLocal.includes('.')) {
        const parts = emailLocal.split('.');
        return {
          firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
          lastName: parts.slice(1).map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
          ).join(' ')
        };
      } else {
        // Use email local part as first name if no dots
        return {
          firstName: emailLocal.charAt(0).toUpperCase() + emailLocal.slice(1),
          lastName: ''
        };
      }
    }
    
    // Parse actual name
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || ''
    };
  };
  
  const { firstName, lastName } = parseName(
    auth0User.name, 
    auth0User.email,
    auth0User.firstName,
    auth0User.lastName
  );
  
  const url = `${api}members/auto-register`;
  return post(url, JSON.stringify({
    email: auth0User.email,
    name: auth0User.name,           // Keep full name
    firstName: firstName,           // Parsed first name
    lastName: lastName,             // Parsed last name
    phone: auth0User.phone || '',   // Optional phone from form
    showEmail: auth0User.showEmail !== undefined ? auth0User.showEmail : true,  // Privacy setting
    showPhone: auth0User.showPhone !== undefined ? auth0User.showPhone : false, // Privacy setting
    auth0Id: auth0User.sub,
    emailVerified: auth0User.email_verified,
    picture: auth0User.picture
  }));
};

export const updateMember = async (memberId, memberData) => {
  const url = `${api}members/${memberId}`;
  return post(url, JSON.stringify(memberData));
};

export const patchMember = async (memberId, updates) => {
  const url = `${api}members/${memberId}`;
  return patch(url, updates);
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
        throw new Error('RSS feed format not supported by conversion service');
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
      return htmlString
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + (htmlString.length > 200 ? '...' : '');
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
  return events.map(event => ({
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
  autoRegisterMember,
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
};
