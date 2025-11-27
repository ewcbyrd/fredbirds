const root = 'https://api.ebird.org/v2';
const ebirdApiKey = import.meta.env.VITE_EBIRD_KEY;

const callout = async (url) => {
  const res = await fetch(url, { 
    method: 'GET',
    headers: {
      'X-eBirdApiToken': ebirdApiKey
    }
  });
  return res.json();
};

export const getRegions = async () => {
  const url = `${root}/ref/region/list/subnational2/US`;
  return callout(url);
};

export const getNearbyNotableObservations = async ({ lat, long, dist = 50, daysBack = 7 }) => {
  const url = `${root}/data/obs/geo/recent/notable?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}&detail=full`;
  return callout(url);
};

export const getHotspotDetails = async (locId) => {
  const url = `${root}/ref/hotspot/info/${locId}`;
  return callout(url);
};

export const getSpeciesDetailsByLocation = async (locId) => {
  const url = `${root}/product/spplist/${locId}`;
  return callout(url);
};

export const getNearbyObservations = async ({ lat, long, dist = 5, daysBack = 7 }) => {
  const url = `${root}/data/obs/geo/recent?lat=${lat}&lng=${long}&dist=${dist}&back=${daysBack}`;
  return callout(url);
};

export const getNotableSightingsByLocation = async ({ regionCode, daysBack = 14 }) => {
  const url = `${root}/data/obs/${regionCode}/recent/notable?back=${daysBack}&detail=full`;
  return callout(url);
};

export const getNearbyHotspots = async ({ lat, long, dist = 50 }) => {
  const url = `${root}/ref/hotspot/geo?lat=${lat}&lng=${long}&dist=${dist}&fmt=json`;
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
