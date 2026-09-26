const api = 'https://fredbirds-api.azurewebsites.net/';

const callout = async (url) => {
    try {
        const res = await fetch(url, { method: 'GET' });
        return res.json();
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
};

export const getNearbyNotableObservations = async ({
    lat,
    long,
    dist = 50,
    daysBack = 7
}) => {
    const url = `${api}sightings/nearby/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
    return callout(url);
};

export const getNearbyObservations = async ({
    lat,
    long,
    dist = 5,
    daysBack = 7
}) => {
    const url = `${api}sightings/nearby?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
    return callout(url);
};

export const getNotableSightingsByLocation = async ({
    regionCode,
    daysBack = 14
}) => {
    const url = `${api}sightings/location/${regionCode}/notable?days=${daysBack}&detail=full`;
    return callout(url);
};

export const getRecentObservationsByLocation = async (
    locationId,
    daysBack = 14
) => {
    const url = `${api}sightings/location/${locationId}?days=${daysBack}`;
    return callout(url);
};

export default {
    getNearbyNotableObservations,
    getNearbyObservations,
    getNotableSightingsByLocation,
    getRecentObservationsByLocation
};
