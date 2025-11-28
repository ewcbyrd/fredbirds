const api = 'https://fredbirds-api.herokuapp.com/';




const callout = async (url) => {
  try {
    const res = await fetch(url, { method: 'GET' });
    return res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

export const getRegions = async () => {
  const url = `${api}regions/US`;
  return callout(url);
};

export const getNearbyNotableObservations = async ({ lat, long, dist = 50, daysBack = 7 }) => {
  const url = `${api}sightings/nearby/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
  return callout(url);
};

export const getHotspotDetails = async (locId) => {
  const url = `${api}hotspots/${locId}/details`;
  return callout(url);
};

export const getSpeciesDetailsByLocation = async (locId) => {
  const url = `${api}hotspots/${locId}/species`;
  return callout(url);
};

export const getNearbyObservations = async ({ lat, long, dist = 5, daysBack = 7 }) => {
  const url = `${api}sightings/nearby?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
  return callout(url);
};

export const getNotableSightingsByLocation = async ({ regionCode, daysBack = 14 }) => {
  const url = `${api}sightings/location/${regionCode}/notable?days=${daysBack}&detail=full`;
  return callout(url);
};

export const getNearbyHotspots = async ({ lat, long, dist = 50 }) => {
  const url = `${api}hotspots/nearby?lat=${lat}&long=${long}&dist=${dist}`;
  return callout(url);
};

export default {
  getRegions,
  getNearbyNotableObservations,
  getHotspotDetails,
  getSpeciesDetailsByLocation,
  getNearbyObservations,
  getNotableSightingsByLocation,
  getNearbyHotspots
};
