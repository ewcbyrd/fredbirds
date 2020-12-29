const root = 'https://ebird.org/ws2.0/';
const key = 'cjsr36ksmnsn';

export const getSightingsByLocation = ({ regionCode, daysBack = 14 }) => {
    const url = root + 'data/obs/' + regionCode + '/recent?back=' + daysBack;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'X-eBirdApiToken': key
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

export const getTaxonomy = () => {
    const url = root + 'ref/taxonomy/ebird?fmt=json';
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'X-eBirdApiToken': key
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

export const getNearbyNotableObservations = ({
    lat,
    long,
    dist = 25,
    daysBack = 7
}) => {
    const url = `${root}data/obs/geo/recent/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'X-eBirdApiToken': key
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
