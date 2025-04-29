// Step 1: Create a utility file to handle FWS location searching
// Create a new file: src/utils/fwsLocations.js

import fwsLocationsData from '../data/wifisites.json';

// Function to search FWS locations by various criteria
export const searchFWSLocations = (query) => {
  if (!query || query.trim() === '') return [];
  
  query = query.toLowerCase().trim();
  
  return fwsLocationsData.fws_locations.filter(location => {
    // Search by lot_id
    if (location.lot_id.toLowerCase().includes(query)) return true;
    
    // Search by province
    if (location.province.toLowerCase().includes(query)) return true;
    
    // Search by locality
    if (location.locality.toLowerCase().includes(query)) return true;
    
    // Search by location name
    if (location.location_name.toLowerCase().includes(query)) return true;
    
    // Search in exact_location array
    if (location.exact_location.some(loc => loc.toLowerCase().includes(query))) return true;
    
    return false;
  });
};

// Function to get location by lot_id
export const getLocationById = (lotId) => {
  return fwsLocationsData.fws_locations.find(loc => loc.lot_id === lotId) || null;
};

// Function to format FWS data for the InfoPanel
export const formatFWSDataForInfoPanel = (fwsLocation) => {
  // Count the exact locations as "sites"
  const sites = fwsLocation.exact_location.length;
  
  // Format the FWS location data to match the expected InfoPanel format
  return {
    provinceName: fwsLocation.province,
    provincialID: fwsLocation.lot_id,
    governor: "Information not available", // Replace with actual data if available
    freeWiFiSites: sites,
    totalAPSites: sites,
    digitizationRate: 60, // Example value - replace with calculated value if available
    siteTypes: [
      { type: fwsLocation.site_type, count: sites }
    ],
    cities: [
      {
        name: fwsLocation.locality,
        locations: 1,
        sites: sites,
        mayor: "Information not available", // Replace with actual data if available
        totalAPSites: sites,
        digitizationRate: 60, // Example value
        freeWifiLocations: fwsLocation.exact_location.map((location, index) => ({
          name: location,
          type: fwsLocation.site_type,
          sites: 1
        }))
      }
    ],
    coordinates: [fwsLocation.longitude, fwsLocation.latitude] // Add coordinates for map positioning
  };
};

// Function to convert FWS locations to GeoJSON format for map markers
export const convertFWSToGeoJSON = () => {
  return {
    type: 'FeatureCollection',
    features: fwsLocationsData.fws_locations.map(location => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      properties: {
        lotId: location.lot_id,
        title: location.location_name,
        description: `${location.site_type} in ${location.locality}, ${location.province}`,
        province: location.province,
        locality: location.locality,
        siteType: location.site_type,
        category: location.category,
        exactLocations: location.exact_location
      }
    }))
  };
};