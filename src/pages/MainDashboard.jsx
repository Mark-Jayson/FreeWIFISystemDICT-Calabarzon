// MainDashboard.jsx
import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapToolbar from '../components/MapToolbar2';
import InfoPanel from '../components/infopanels/InfoPanel';
import CityInfoPanel from '../components/infopanels/CityInfoPanel';
import LocationInfoPanel from '../components/infopanels/LocationInfoPanel';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { select } from 'framer-motion/client';

// Constants for map initialization
const INITIAL_CENTER = [121.2, 14.1];
const INITIAL_ZOOM = 8.8;
const PHILIPPINES_BOUNDS = [
  [114.0952145, 4.5873032],
  [126.8039607, 21.1217806],
];
 
const MainDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  // UI state - Navigation stack to track panel hierarchy
  const [navigationStack, setNavigationStack] = useState([]);
  const [activeTab, setActiveTab] = useState(currentPath || 'map');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState([]);
  const [panelData, setPanelData] = useState(null);
<<<<<<< HEAD
  const [selectedFilters, setSelectedFilters] = useState({
    district: null,
    Province: null,
    contractStatus: null,
    category: null
  });
=======
>>>>>>> 16aebd70dbd3af0ef3c383feedc8243d5b49fb97

  // Map state
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(currentPath || 'map');
  }, [currentPath]);

  // Navigation helper functions
  const pushToNavigationStack = (panel) => {
    setNavigationStack(prev => [...prev, panel]);
  };

  const popFromNavigationStack = () => {
    setNavigationStack(prev => prev.slice(0, -1));
  };

  const clearNavigationStack = () => {
    setNavigationStack([]);
  };

  // NEW: Reset function to restore initial state
  const handleReset = () => {
    // Clear all UI state
    setNavigationStack([]);
    setSelectedCity(null);
    setSelectedLocation(null);
    setSearchQuery('');
    setPanelData(null);

    // Clear all markers from the map
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    // Reset map position to initial values
    setCenter(INITIAL_CENTER);
    setZoom(INITIAL_ZOOM);

    // If map instance exists, fly back to initial position
    if (map) {
      map.flyTo({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
        essential: true
      });

      // Re-add all the FWS markers after reset
      setTimeout(() => {
        addFWSMarkers(map, selectedFilters);
      }, 500); // Small delay to ensure map animation completes
    }
  };

  const handleApplyFilters = (filters) => {
  setSelectedFilters(filters);
  // Call your marker query here, passing filters as input
  //fetchMarkersWithFilters(filters);
  console.log('Applied Filters:', filters);
  addFWSMarkers(map, filters); // Re-add markers with new filters
};

  // Fixed clearMarkers function
  const clearMarkers = (query) => {
    setSearchQuery(query);
    setSelectedCity(null);
    setSelectedLocation(null);
    clearNavigationStack();

    markers.forEach(marker => marker.remove());
    setMarkers([]);
  }; 

  // Handle search from MapToolbar - MODIFIED
  // This function now expects an object that might contain specific location data
  // or a general search query.
  const handleSearch = async (searchParams) => {
    // If searchParams is an object with a loc_id, it means a specific location was selected from search results
    if (searchParams && searchParams.loc_id) {
      
        console.log('Fetching location with sites for loc_id:', searchParams.loc_id);
        const response = await fetch(`http://localhost:5000/api/location-with-sites/${searchParams.loc_id}`);
        
        const fullData = await response.json();

<<<<<<< HEAD
             
              const siteOfCity = await fetch(`http://localhost:5000/api/sitesByLocality/${fullData.locality}`);
              const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${fullData.locality}`);
               const province = await fetch(`http://localhost:5000/api/getProvince/${fullData.locality}`);
              const getprovince = await province.json();
              console.log('Province Data:', getprovince);
               if (!locOfCity.ok) {
                // Handle HTTP errors, e.g., 404 from your backend
                const errorData = await locOfCity.json();
=======
        const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${fullData.province}`);
        const locationsOfCity = await locOfCity.json();
        console.log('Locations of province:', locationsOfCity);
>>>>>>> 16aebd70dbd3af0ef3c383feedc8243d5b49fb97

                throw new Error(errorData.error || `HTTP error! Status: ${locOfCity.status}`);
              }
              console.log('Fetched siteOfCity:', siteOfCity);
              console.log('Fetched siteOfCity:', locOfCity);
              const siteOfCityData = await siteOfCity.json();
              console.log('Fetched siteOfCity:', siteOfCityData);
              const locationsOfCity = await locOfCity.json();
              console.log('Locations', locationsOfCity);
              console.log('Site', siteOfCityData.totalSitesCount);

             
              const cityData = {
                name: fullData.locality || 'Unknown City',
                provinceName: fullData.province || 'Unknown Province',
                totalSites: siteOfCityData.totalSitesCount, // This logic depends on where fullData.apSites comes from
                mayor: 'Unknown', // You would typically fetch mayor info separately or include it in location data
                // totalAPSites should be the count of locations returned by the endpoint
                totalAPSites: locationsOfCity.length,
                digitizationRate: 0, // This would require more specific data to calculate accurately
                siteTypes: [], // You would populate this by iterating through locationsOfCity
                // freeWifiLocations should be an array of location objects that have free WiFi
                freeWifiLocations: locationsOfCity
              };

              const provinceData = {
                provinceName: getprovince.province || 'Unknown Province',
          
                freeWiFiSites: getprovince.numberOfSites,
                governor: 'Unknown Governor',
                totalAPSites: getprovince.numberOfLocations,
                digitizationRate: 0,
                siteTypes: [
                  { type: "Municipal", count: 34 },
                  { type: "Hospitals", count: 12 },
                  { type: "Fire Stations", count: 8 },
                  { type: "Public Market", 15: "" },
                  { type: "Schools", count: 45 },
                  { type: "Parks", count: 36 }
                ],
                cities: getprovince.cities
              };

        handleLocationMarkerClick(fullData, cityData, provinceData);
        setSearchQuery(fullData.location_name); // Set search query to the selected location name
       setPanelData(provinceData);
    } else {
      // Original behavior for general search (e.g., typing in a province name)
      const query = typeof searchParams === 'string' ? searchParams : '';
      setSearchQuery(query);
      setSelectedCity(null);
      setSelectedLocation(null);
      clearNavigationStack();

      // Create sample panelData for the search - in real app this would come from API
      // This is a placeholder for province-level data
      const samplePanelData = {
        provinceName: 'Batangas',
        provincialID: 'P-04',
        freeWiFiSites: 150,
        governor: 'Hermilando I. Mandanas',
        totalAPSites: 900,
        digitizationRate: 75,
        siteTypes: [
          { type: "Municipal", count: 34 },
          { type: "Hospitals", count: 12 },
          { type: "Fire Stations", count: 8 },
          { type: "Public Market", count: 15 },
          { type: "Schools", count: 45 },
          { type: "Parks", count: 36 }
        ],
        cities: [
          {
            name: 'Sto. Tomas City',
            provinceName: 'Batangas',
            totalSites: 41,
            mayor: 'Art Jun Maligalig',
            totalAPSites: 125,
            digitizationRate: 25,
            siteTypes: [
              { type: "School", count: 20 },
              { type: "Hospital", count: 12 },
              { type: "Fire Station", count: 3 },
              { type: "Public Market", count: 7 },
              { type: "Barangay", count: 15 },
              { type: "Park", count: 6 }
            ],
            freeWifiLocations: [
              {
                name: "BatState - College of Science Building",
                type: "School",
                sites: 11,
                location: "Batangas State University - Alangilan",
                locID: "L3-4335",
                category: "SUCs",
                address: "0234 Mababang Parang, Batangas City, Batangas",
                congressional: "IV",
                latitude: "12.8797",
                longitude: "16.8797",
                technology: "LEO",
                procurement: "Central",
                cmsProvider: "HTECH Inc.",
                linkProvider: "Converge Technologies",
                bandwidth: "30 MB/S",
                project: "DICT Calabarzon",
                contractStatus: "Active",
                activationDate: "January 3, 2022",
                endOfContract: "March 30, 2028",
                apSites: [
                  { name: "BatStateU Building 1", technology: "LEO", status: "Active", site_id: "S001" },
                  { name: "BatStateU Building 2", technology: "LEO", status: "Active", site_id: "S002" },
                  { name: "BatStateU Building 3", technology: "LEO", status: "Active", site_id: "S003" },
                  { name: "BatStateU Building 4", technology: "LEO", status: "Active", site_id: "S004" }
                ]
              },
              {
                name: "PUP Sto. Tomas Campus",
                type: "School",
                sites: 11,
                location: "PUP Sto. Tomas",
                locID: "L3-4336",
                category: "SUCs",
                address: "National Highway, Sto. Tomas, Batangas",
                congressional: "IV",
                latitude: "14.1234",
                longitude: "121.1456",
                technology: "VSAT",
                procurement: "Regional",
                cmsProvider: "HTECH Inc.",
                linkProvider: "PLDT",
                bandwidth: "50 MB/S",
                project: "DICT Calabarzon",
                contractStatus: "Active",
                activationDate: "June 15, 2022",
                endOfContract: "June 15, 2025",
                apSites: [
                  { name: "PUP Main Building", technology: "VSAT", status: "Active", site_id: "S005" },
                  { name: "PUP Library", technology: "VSAT", status: "Active", site_id: "S006" },
                  { name: "PUP Gymnasium", technology: "VSAT", status: "Active", site_id: "S007" }
                ]
              }
            ]
          },
          {
            name: 'Batangas City',
            provinceName: 'Batangas',
            totalSites: 67,
            mayor: 'Beverley Rose A. Dimacuha',
            totalAPSites: 200,
            digitizationRate: 45,
            siteTypes: [
              { type: "School", count: 30 },
              { type: "Hospital", count: 15 },
              { type: "Fire Station", count: 5 },
              { type: "Public Market", count: 10 },
              { type: "Barangay", count: 20 },
              { type: "Park", count: 8 }
            ],
            freeWifiLocations: []
          }
        ]
      };

      setPanelData(samplePanelData);
      pushToNavigationStack('info');
    }
  };

  // Handle city click from InfoPanel
  const handleCityClickFromInfo = async (city) => {

     const siteOfCity = await fetch(`http://localhost:5000/api/sitesByLocality/${city}`);
              const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${city}`);
              const getprovince = await fetch(`http://localhost:5000/api/getProvince/${city}`);
              if (!locOfCity.ok) {
                // Handle HTTP errors, e.g., 404 from your backend
                const errorData = await locOfCity.json();

                throw new Error(errorData.error || `HTTP error! Status: ${locOfCity.status}`);
              }
              console.log('Fetched siteOfCity:', siteOfCity);
              console.log('Fetched siteOfCity:', locOfCity);
              const siteOfCityData = await siteOfCity.json();
              console.log('Fetched siteOfCity:', siteOfCityData);
              const locationsOfCity = await locOfCity.json();
              console.log('Locations', locationsOfCity);
              console.log('Site', siteOfCityData.totalSitesCount);

              // Create minimal city data for proper navigation
              const cityData = {
                name: city || 'Unknown City',
                provinceName: getprovince.province || 'Unknown Province',
                totalSites: siteOfCityData.totalSitesCount, // This logic depends on where fullData.apSites comes from
                mayor: 'Unknown', // You would typically fetch mayor info separately or include it in location data
                // totalAPSites should be the count of locations returned by the endpoint
                totalAPSites: locationsOfCity.length,
                digitizationRate: 0, // This would require more specific data to calculate accurately
                siteTypes: [], // You would populate this by iterating through locationsOfCity
                // freeWifiLocations should be an array of location objects that have free WiFi
                freeWifiLocations: locationsOfCity
              };

              const provinceData = {
                provinceName: getprovince.province ,
          
                freeWiFiSites: getprovince.numberOfSites,
                governor: 'Unknown Governor',
                totalAPSites: getprovince.numberOfLocations,
                digitizationRate: 0,
                siteTypes: [
                  { type: "Municipal", count: 34 },
                  { type: "Hospitals", count: 12 },
                  { type: "Fire Stations", count: 8 },
                  { type: "Public Market", 15: "" },
                  { type: "Schools", count: 45 },
                  { type: "Parks", count: 36 }
                ],
                cities: getprovince.cities
              };
    setSelectedCity(cityData);
    console.log('MainDashaboard CityData Nig:', cityData);
    pushToNavigationStack('city');
  }; 

  // Handle marker click to show location info (from map markers)
  const handleLocationMarkerClick = (locationData, associatedCityData, provinceData = null) => {
    setSelectedLocation(locationData);

    // Create proper navigation stack: info -> city -> location
    if (associatedCityData) {
      setSelectedCity(associatedCityData);

      // Create minimal province data for the info panel
      const minimalProvinceData = {
        provinceName: associatedCityData.provinceName,
        provincialID: 'P-04',
        freeWiFiSites: 150,
        governor: 'Hermilando I. Mandanas',
        totalAPSites: 500,
        digitizationRate: 75,
        siteTypes: [
          { type: "Municipal", count: 34 },
          { type: "Hospitals", count: 12 },
          { type: "Fire Stations", count: 8 },
          { type: "Public Market", count: 15 },
          { type: "Schools", count: 45 },
          { type: "Parks", count: 36 }
        ],
        cities: [associatedCityData]
      }; 
      console.log('Marker Click Province Data:', provinceData);

      setPanelData(provinceData);
      clearNavigationStack();
      pushToNavigationStack('info');
      pushToNavigationStack('city');
      pushToNavigationStack('location');
    } else {
      // If no city data, just show location panel
      clearNavigationStack();
      pushToNavigationStack('location');
    }
    // Fly to the location when clicked (if map is initialized)
    if (map && locationData.latitude && locationData.longitude) {
      map.flyTo({
        center: [parseFloat(locationData.longitude), parseFloat(locationData.latitude)],
        zoom: 15,
        essential: true
      });
    }
  };

  // Handle location click from CityInfoPanel - MODIFIED
  const handleLocationClickFromCity = async (locationDataFromCityPanel) => {
    console.log(locationDataFromCityPanel.locID);
    if (!locationDataFromCityPanel || !locationDataFromCityPanel.loc_id) {
      console.error("Invalid location data from CityInfoPanel:", locationDataFromCityPanel, locationDataFromCityPanel.loc_id);
      return;
    }

    try {
      // 1. Fetch detailed location data (including apSites)
      const response = await fetch(`http://localhost:5000/api/location-with-sites/${locationDataFromCityPanel.loc_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const fullData = await response.json();

             
              const siteOfCity = await fetch(`http://localhost:5000/api/sitesByLocality/${fullData.locality}`);
              const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${fullData.locality}`);
              const getprovince = await fetch(`http://localhost:5000/api/getProvince/${fullData.locality}`);
              if (!locOfCity.ok) {
                // Handle HTTP errors, e.g., 404 from your backend
                const errorData = await locOfCity.json();

                throw new Error(errorData.error || `HTTP error! Status: ${locOfCity.status}`);
              }
              console.log('Fetched siteOfCity:', siteOfCity);
              console.log('Fetched siteOfCity:', locOfCity);
              const siteOfCityData = await siteOfCity.json();
              console.log('Fetched siteOfCity:', siteOfCityData);
              const locationsOfCity = await locOfCity.json();
              console.log('Locations', locationsOfCity);
              console.log('Site', siteOfCityData.totalSitesCount);

              // Create minimal city data for proper navigation
              const cityData = {
                name: fullData.locality || 'Unknown City',
                provinceName: fullData.province || 'Unknown Province',
                totalSites: siteOfCityData.totalSitesCount, // This logic depends on where fullData.apSites comes from
                mayor: 'Unknown', // You would typically fetch mayor info separately or include it in location data
                // totalAPSites should be the count of locations returned by the endpoint
                totalAPSites: locationsOfCity.length,
                digitizationRate: 0, // This would require more specific data to calculate accurately
                siteTypes: [], // You would populate this by iterating through locationsOfCity
                // freeWifiLocations should be an array of location objects that have free WiFi
                freeWifiLocations: locationsOfCity
              };

              const provinceData = {
                provinceName: getprovince.province ,
          
                freeWiFiSites: getprovince.numberOfSites,
                governor: 'Unknown Governor',
                totalAPSites: getprovince.numberOfLocations,
                digitizationRate: 0,
                siteTypes: [
                  { type: "Municipal", count: 34 },
                  { type: "Hospitals", count: 12 },
                  { type: "Fire Stations", count: 8 },
                  { type: "Public Market", 15: "" },
                  { type: "Schools", count: 45 },
                  { type: "Parks", count: 36 }
                ],
                cities: getprovince.cities
              };

      // 4. Call handleLocationMarkerClick with the full data
       setPanelData(provinceData);
        setSelectedCity(cityData);
      handleLocationMarkerClick(fullData, cityData, provinceData);

    } catch (err) {
      console.error('Error fetching location data from CityInfoPanel click:', err);
      // Optionally, set an error state or show a user-friendly message
    }
  };

  // Generic back handler that uses the navigation stack
  const handleBack = () => {
    const currentStack = [...navigationStack];
    const currentPanel = currentStack.pop();

    if (currentStack.length === 0) {
      // If stack is empty, close all panels
      setSelectedCity(null);
      setSelectedLocation(null);
      setSearchQuery('');
      setPanelData(null);
      clearNavigationStack();
      return;
    }

    const previousPanel = currentStack[currentStack.length - 1];

    switch (previousPanel) {
      case 'info':
        setSelectedCity(null);
        setSelectedLocation(null);
        // Keep searchQuery and panelData to show InfoPanel
        break;
      case 'city':
        setSelectedLocation(null);
        // Keep selectedCity to show CityInfoPanel
        break;
      case 'location':
        // This shouldn't happen in normal flow, but handle it
        break;
    }

    setNavigationStack(currentStack);
  };

  // Handle close from InfoPanel (X button)
  const handleInfoPanelClose = () => {
    setSelectedCity(null);
    setSelectedLocation(null);
    setSearchQuery('');
    setPanelData(null); 
    clearNavigationStack();
  };
  const addFWSMarkers = async (mapInstance, filters = {
    district: null,
    Province: null,
    contractStatus: null,
    category: null
}) => {
    // Clear any existing markers on the map before adding new ones.
    // Assuming clearMarkers clears all markers when called with an empty string or similar logic.
    if (markers.length > 0) {
        clearMarkers('');
    }

    try {
        // Fetch map pin data from the server endpoint.
        // This endpoint is expected to return site data joined with location data.
        const response = await fetch('http://localhost:5000/api/map-pins');
        const data = await response.json();

        // Define a mapping for category names to their simplified/coded forms.
        // Note: If there are duplicate keys, the last definition will take precedence.
        const categ = {
            'Public High School': "PHS",
            'Tourism Sea': 'TRM-SEA',
            'Rural Health Unit': "RHU",
            'Library': "LIB",
            'Local Government Unit - Tourism': "LGU-TOUR",
            'Local Government Unit - Municipal Hall/City Hall': 'LGU-BRGY', // This will overwrite previous 'PHS' mapping for the same key
            'Integrated High School': 'Integrated HS',
            'Parks and Playground': 'PP',
            'Transport Terminals': 'Transport Terminals',
            'Public Librarie': 'Public Librarie', // Typo: 'Public Librarie' instead of 'Public Libraries'?
            'State Universities and Colleges': 'SUC',
            'Elementary School': 'Elementary School',
            'National and Local Government Offices': 'National and Local Government Offices',
            'National Government Agency': 'NGA',
            'Market': 'MKT'
        };

        // Initialize an empty array to store the new Mapbox GL JS marker objects.
        const newMarkers = [];
        // Use a Set to keep track of unique location IDs for which we've already created a marker.
        // This prevents duplicate markers if a location has multiple associated sites in the data.
        const processedLocationIds = new Set();

        // Prepare filter values by converting them to lowercase for case-insensitive comparison,
        // or getting the mapped category value, or setting to null if no filter is applied.
        const filterProvince = filters.Province ? filters.Province.toLowerCase() : null;
        const filterDistrict = filters.district ? filters.district.toLowerCase() : null;
        const filterContractStatus = filters.contractStatus; // Contract status is likely exact, no toLowerCase
        // Map the category filter name to its coded value, then convert to lowercase.
        const filterCategory = categ[filters.category] ? categ[filters.category].toLowerCase() : null;

        // Iterate through each item received from the API.
        // Each 'item' represents a site, but includes location details (latitude, longitude, location_id, isterminated, etc.).
        data.forEach(item => {
            // Check if a marker for this location_id has already been created.
            // If it has, skip this item to avoid placing multiple markers for the same location.
            if (processedLocationIds.has(item.location_id)) {
                return; // Skip to the next item in the loop
            }
<<<<<<< HEAD

            // --- Primary Filtering Logic ---
            // If a filter is provided, check if the item's corresponding property matches the filter.
            // If it doesn't match, skip this item and do not create a marker.

            // Filter by Province:
            if (filterProvince && (!item.province || item.province.toLowerCase() !== filterProvince)) {
                console.log(`Filtering out marker for province: ${item.province} (Does not match filter: ${filters.Province})`);
                return;
            }

            // Filter by District:
            if (filterDistrict && (!item.congressional_district || item.congressional_district.toLowerCase() !== filterDistrict)) {
                console.log(`Filtering out marker for district: ${item.congressional_district} (Does not match filter: ${filters.district})`);
                return;
            }

            // Filter by Contract Status:
            // This is the corrected line. It checks if a filterContractStatus is provided
            // AND if the item's contract_status does NOT match the provided filter.
            if (filterContractStatus && item.contract_status !== filterContractStatus) {
                console.log(`Filtering out marker for contract status: ${item.contract_status} (Does not match filter: ${filters.contractStatus})`);
                return;
            }

            // Filter by Category:
            if (filterCategory && (!item.category || item.category.toLowerCase() !== filterCategory)) {
                console.log(`Filtering out marker for category: ${item.category} (Does not match filter: ${filters.category})`);
                return;
            }

            // --- Fixed Filter: Handle 'isterminated' property ---
            // If the location is terminated (isterminated is true), skip creating a marker for it.
            // This acts as an always-on filter, removing terminated locations regardless of other filters.
            
            // if (item.isterminated === true) {
            //     console.log(`Filtering marker for terminated location: ${item.location_name} (ID: ${item.location_id})`);
            //     return; // Skip this item
            // }

            
            // --- End of fixed functionality ---

            // Add the current location_id to the set of processed IDs.
            // This marks it as handled, ensuring no further markers are created for this specific location.
            processedLocationIds.add(item.location_id);

            // Parse latitude and longitude from the current item.
            // Mapbox GL JS expects coordinates in [longitude, latitude] format.
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);

            // Validate latitude and longitude before creating a marker.
            // Invalid coordinates can cause errors or unexpected behavior with map rendering.
            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                console.warn(
                    `Skipping marker for location_id ${item.location_id || 'N/A'} ` +
                    `(${item.location_name || 'Unnamed Location'}) due to invalid coordinates: ` +
                    `Lat ${item.latitude}, Lng ${item.longitude}`
                );
                return; // Skip this item if coordinates are invalid
            }

            // Determine marker color based on 'isterminated' status.
            // Markers will be green for non-terminated sites and the default Mapbox blue otherwise (though isterminated=true are filtered out above).
            // The logic here for `item.isterminated === false ? '#11aa10' : '#00FF00'` implies green for non-terminated.
            const markerColor = '#11aa10'; // Since terminated ones are filtered out, all visible markers should be green.

            // Create a new Mapbox GL JS marker instance.
            const marker = new mapboxgl.Marker({ color: markerColor, scale: 1.0 })
                .setLngLat([lng, lat]) // Set coordinates (longitude, latitude)
                .addTo(mapInstance);   // Add the marker to the provided map instance.

            // Attach a click event listener to the marker's underlying DOM element.
            marker.getElement().addEventListener('click', async () => {
                try {
                    // Ensure location_id is valid before attempting to fetch detailed data.
                    if (item.location_id) {
                        // Fetch comprehensive data for the clicked location using its unique ID.
                        const response = await fetch(`http://localhost:5000/api/location-with-sites/${item.location_id}`);
                        const fullData = await response.json();

                        // Animate the map to fly to the clicked marker's location.
                        mapInstance.flyTo({
                            center: [parseFloat(fullData.longitude), parseFloat(fullData.latitude)],
                            zoom: 15,
                            essential: true // Ensures the animation happens even if the map is already at the target
                        });

                        // Fetch additional data related to the locality (city/municipality) and province.
                        const siteOfCity = await fetch(`http://localhost:5000/api/sitesByLocality/${fullData.locality}`);
                        const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${fullData.locality}`);
                        const province = await fetch(`http://localhost:5000/api/getProvince/${fullData.locality}`);

                        const getprovince = await province.json();
                        console.log('Province Data:', getprovince);

                        // Error handling for HTTP responses.
                        if (!locOfCity.ok) {
                            const errorData = await locOfCity.json();
                            throw new Error(errorData.error || `HTTP error! Status: ${locOfCity.status}`);
                        }

                        console.log('Fetched siteOfCity:', siteOfCity);
                        console.log('Fetched siteOfCity:', locOfCity);

                        const siteOfCityData = await siteOfCity.json();
                        console.log('Fetched siteOfCity:', siteOfCityData);

                        const locationsOfCity = await locOfCity.json();
                        console.log('Locations', locationsOfCity);
                        console.log('Site', siteOfCityData.totalSitesCount);

                        // Construct minimal city data for navigation and display.
                        const cityData = {
                            name: fullData.locality || 'Unknown City',
                            provinceName: fullData.province || 'Unknown Province',
                            totalSites: siteOfCityData.totalSitesCount,
                            mayor: 'Unknown', // Placeholder, ideally fetched from API
                            totalAPSites: locationsOfCity.length, // Total access point sites in the city
                            digitizationRate: 0, // Placeholder, requires calculation
                            siteTypes: [], // Placeholder, populate by iterating locationsOfCity
                            freeWifiLocations: locationsOfCity // List of locations with free WiFi
                        };

                        // Construct province data for higher-level navigation.
                        const provinceData = {
                            provinceName: getprovince.province,
                            freeWiFiSites: getprovince.numberOfSites,
                            governor: 'Unknown Governor', // Placeholder
                            totalAPSites: getprovince.numberOfLocations, // Total AP sites in the province
                            digitizationRate: 0, // Placeholder
                            siteTypes: [ // Example site types, ideally dynamic from API
                                { type: "Municipal", count: 34 },
                                { type: "Hospitals", count: 12 },
                                { type: "Fire Stations", count: 8 },
                                { type: "Public Market", count: 15 }, // Corrected key from '15: ""'
                                { type: "Schools", count: 45 },
                                { type: "Parks", count: 36 }
                            ],
                            cities: getprovince.cities // List of cities within the province
                        };
                        console.log('Constructed Province Data:', provinceData);

                        // Update state variables (assuming these are defined in a higher scope, e.g., React context or component state).
                        // These functions would typically trigger UI updates.
                        setSearchQuery(fullData.location_name);
                        setPanelData(provinceData);
                        setSelectedCity(cityData);

                        // Call a handler function to manage the navigation stack and display relevant details.
                        handleLocationMarkerClick(fullData, cityData, provinceData);

                    } else {
                        console.warn(
                            `Cannot fetch location-with-sites: location_id is undefined for location ` +
                            `${item.location_name || 'N/A'}`
                        );
                    }
                } catch (err) {
                    console.error('Error fetching location with sites or processing click:', err);
                }
            });

            // Add the newly created valid marker object to our array.
            newMarkers.push(marker);
        });

        // Update the state variable that holds all currently displayed markers.
        // This is crucial for managing markers (e.g., clearing them later).
        setMarkers(newMarkers);
        console.log(`Added ${newMarkers.length} unique location markers from database`);
=======
          } catch (err) {
            console.error('Error fetching location with sites:', err);
          }
        });

        // Add the newly created valid marker to our array.
        newMarkers.push(marker);
      });

      // Update the state variable that holds all current markers.
      setMarkers(newMarkers);
      console.log(`Added ${newMarkers.length} unique location markers from database`);
>>>>>>> 16aebd70dbd3af0ef3c383feedc8243d5b49fb97
    } catch (err) {
        console.error('Failed to fetch map pins:', err);
    }
<<<<<<< HEAD
};

=======
  };
>>>>>>> 16aebd70dbd3af0ef3c383feedc8243d5b49fb97

  // Initialize and configure the Mapbox map
  useEffect(() => {
    if (activeTab !== 'map') return;

    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!mapboxgl.accessToken) {
        throw new Error('Mapbox access token is missing');
      }
    } catch (err) {
      console.error("mapbox error", err);
      setError("Failed to set Mapbox access token");

      const container = document.getElementById('map-container');
      if (container) {
        container.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100">Map Placeholder (MapBox not configured)</div>';
      }
      return;
    }

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v12',
      maxBounds: PHILIPPINES_BOUNDS
    });

    mapRef.current = mapInstance;
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    mapInstance.on('load', () => {
      console.log("Map loaded successfully");
      addFWSMarkers(mapInstance, selectedFilters); // Add markers after map is loaded
      setMap(mapInstance);
      setMapInitialized(true);
      console.log("Map instance set in state:", mapInstance);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeTab, center, zoom]);

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return (
          <div className="flex-1 relative">
            <div id="map-container" className="w-full h-full" ref={mapContainerRef}></div>

            {/* Show InfoPanel when search is performed and it's the top panel */}
            {searchQuery && navigationStack[navigationStack.length - 1] === 'info' && (
              <InfoPanel
                searchQuery={searchQuery}
                onCityClick={handleCityClickFromInfo}
                panelData={panelData}
                onClose={handleInfoPanelClose}
              />
            )}

            {/* Show CityInfoPanel when a city is selected and it's the top panel */}
            {selectedCity && navigationStack[navigationStack.length - 1] === 'city' && (
              <CityInfoPanel
                cityData={selectedCity}
                onBack={handleBack}
                onLocationClick={handleLocationClickFromCity} // Pass the modified handler here
              />
            )}

            {/* Show LocationInfoPanel when a location is selected and it's the top panel */}
            {selectedLocation && navigationStack[navigationStack.length - 1] === 'location' && (
              <LocationInfoPanel
                locationData={selectedLocation}
                onBack={handleBack}
              />
            )}
          </div>
        );
      case 'dashboard':
        return (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">Dashboard content will appear here</div>
            </div>
          </div>
        );
      case 'wifi':
        return (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Free Wi-Fi Sites</h1>
            <div className="bg-white p-4 rounded shadow">Wi-Fi sites content will appear here</div>
          </div>
        );
      default:
        return (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p>The requested page could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex flex-col">
        {activeTab === 'map' && (
          <MapToolbar
            mapInstance={map}
            onSearch={handleSearch}
            onReset={handleReset}
            onApplyFilters={handleApplyFilters}
            selectedFilters={selectedFilters}
          />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default MainDashboard;