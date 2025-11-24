const root = 'https://fredbirds-api.herokuapp.com/';

const callout = async (url) => {
  const res = await fetch(url, { method: 'GET' });
  return res.json();
};

export const getRegions = async () => {
  const url = `${root}regions/US`;
  return callout(url);
};

export const getNearbyNotableObservations = async ({ lat, long, dist = 50, daysBack = 7 }) => {
  const url = `${root}sightings/nearby/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
  return callout(url);
};

export const getHotspotDetails = async (locId) => {
  const url = `${root}hotspots/${locId}/details`;
  return callout(url);
};

export const getSpeciesDetailsByLocation = async (locId) => {
  const url = `${root}taxonomy/location/${locId}`;
  return callout(url);
};

export const getNearbyObservations = async ({ lat, long, dist = 5, daysBack = 7 }) => {
  const url = `${root}sightings/nearby?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
  return callout(url);
};

export const getNotableSightingsByLocation = async ({ regionCode, daysBack = 14 }) => {
  const url = `${root}sightings/location/${regionCode}/notable?days=${daysBack}&detail=full`;
  return callout(url);
};

export const getNearbyHotspots = async ({ lat, long, dist = 50 }) => {
  const url = `${root}hotspots/nearby?lat=${lat}&long=${long}&dist=${dist}`;
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
