const api = 'https://fredbirds-api.herokuapp.com/';

const get = function (url) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'cache-control': 'no-cache'
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const post = (url, body) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: body,
            json: true
        })
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getEventsByYear = (year) => {
    const url = `${api}events/${year}`;
    return get(url);
};

export const getFutureEvents = (currentDate, months = 3) => {
    const url = `${api}events/future/${months}`;
    return get(url);
};

export const getNews = () => {
    const url = `${api}news`;
    return get(url);
};

export const saveMember = (member) => {
    const url = `${api}members`;
    return post(url, member);
};

export const sendEmail = (email) => {
    const url = `${api}sendgrid`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: email,
        json: true
    });
};

export const getMember = (member) => {
    const url = `${api}members/filter?first=${member.first}&last=${member.last}&email=${member.email}`;
    return get(url);
};

export const getAnnouncements = () => {
    const url = `${api}announcements`;
    return get(url);
};

export const getFaqs = () => {
    const url = `${api}faqs`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getNewsletters = () => {
    const url = `${api}newsletters`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getCarouselPhotos = () => {
    const url = `${api}photos/carousel`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getRareBirds = () => {
    const url = `${api}rarebirds`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getStates = () => {
    const url = `${api}locations/states`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getCounties = () => {
    const url = `${api}locations/counties`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getFeed = (site) => {
    const url = `${api}feed?u=${site}`;
    return fetch(url, {
        method: 'GET'
    });
};

export const getNewsFeeds = () => {
    const url = `${api}newsfeeds`;
    return fetch(url, {
        method: 'GET'
    });
};
