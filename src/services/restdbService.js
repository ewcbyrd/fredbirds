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
    lastName: memberData.lastName
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

export const checkInToEvent = async (eventId, memberId) => {
  const url = `${api}events/${eventId}/attendees/${memberId}`;
  const body = JSON.stringify({
    attended: true,
    checkedInAt: new Date().toISOString()
  });
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'cache-control': 'no-cache', 'content-type': 'application/json' },
    body
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export const getMemberEvents = async (memberId) => {
  const url = `${api}members/${memberId}/events`;
  return get(url);
};

export const getEventAttendees = async (eventId) => {
  const url = `${api}events/${eventId}/attendees`;
  return get(url);
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
  getStates,
  getCounties,
  getNewsFeeds,
  getRareBirds,
  getFeed,
  registerForEvent,
  unregisterFromEvent,
  checkInToEvent,
  getMemberEvents,
  getEventAttendees,
};
