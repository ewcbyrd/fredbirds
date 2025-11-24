const api = 'https://fredbirds-api.herokuapp.com/';

const get = async (url) => {
  const res = await fetch(url, { method: 'GET' });
  return res.json();
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
  const url = `${api}members`;
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

export const getFeed = async (feedUrl) => {
  const url = `${api}rss?url=${encodeURIComponent(feedUrl)}`;
  return get(url);
};

export const getRareBirds = async () => {
  const url = `${api}rarebirds`;
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
  getFeed,
  getRareBirds
};
