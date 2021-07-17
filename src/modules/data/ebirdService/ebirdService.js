const root = 'https://fredbirds-api.herokuapp.com/';

const callout = function(url) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET'
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
    const url = `${root}sightings/location/${regionCode}?back=${daysBack}`;
    return callout(url);
};

export const getTaxonomy = () => {
    const url = `${root}taxonomy`;
    return callout(url);
};

export const getNearbyNotableObservations = ({
    lat,
    long,
    dist = 50,
    daysBack = 7
}) => {
    const url = `${root}sightings/nearby/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
    return callout(url);
};

export const getNearbyObservations = ({
    lat,
    long,
    dist = 5,
    daysBack = 7
}) => {
    const url = `${root}sightings/nearby?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
    return callout(url);
};

export const getNotableSightingsByLocation = ({
    regionCode,
    daysBack = 14
}) => {
    const url = `${root}sightings/location/${regionCode}/notable?days=${daysBack}&detail=full`;
    return callout(url);
};

export const getNearbyHotspots = ({
    lat,
    long,
    dist = 50
}) => {
    const url = `${root}hotspots/nearby?lat=${lat}&long=${long}&dist=${dist}`;
    return callout(url);
};

export const getRegions = ({region = 'US'}) => {
    const url = `${root}regions/${region}`;
    return callout(url);
};

export const getHotspotDetails = ({locId}) => {
    const url = `${root}hotspots/${locId}/details`;
    return callout(url);
};

export const getSpeciesList = ({locId}) => {
    const url = `${root}hotspots/${locId}/species`;
    return callout(url);
};

export const getSpeciesDetailsByLocation = ({locId}) => {
    const url = `${root}taxonomy/location/${locId}`;
    return callout(url);
}

