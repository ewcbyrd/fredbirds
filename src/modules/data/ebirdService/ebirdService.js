const root = 'https://ebird.org/ws2.0/';
const key = 'cjsr36ksmnsn';

const callout = function(url) {
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
}

export const getSightingsByLocation = ({ regionCode, daysBack = 14 }) => {
    const url = root + 'data/obs/' + regionCode + '/recent?back=' + daysBack;
    return callout(url);
};

export const getTaxonomy = () => {
    const url = root + 'ref/taxonomy/ebird?fmt=json';
    return callout(url);
};

export const getNearbyNotableObservations = ({
    lat,
    long,
    dist = 50,
    daysBack = 7
}) => {
    const url = `${root}data/obs/geo/recent/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
    return callout(url);
};

export const getNotableSightingsByLocation = ({
    regionCode,
    daysBack = 14
}) => {
    const url = `${root}data/obs/${regionCode}/recent/notable?back=${daysBack}&detail=full`;
    return callout(url);
};

export const getNearbyHotspots = ({
    lat,
    long,
    dist = 50
}) => {
    const url = `${root}ref/hotspot/geo?lat=${lat}&lng=${long}&dist=${dist}&fmt=json`;
    return callout(url);
};

export const getRegions = ({region = 'US'}) => {
    const url = `${root}ref/region/list/subnational2/${region}`;
    return callout(url);
};

export const getHotspotDetails = ({locId}) => {
    const url = `${root}ref/hotspot/info/${locId}`;
    return callout(url);
};

export const getSpeciesList = ({locId}) => {
    const url = `${root}product/spplist/${locId}`;
    return callout(url);
};

