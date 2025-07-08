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

  const [selectedFilters, setSelectedFilters] = useState({
    district: null,
    Province: null,
    contractStatus: null, // Default to 'All' for contract statu
    category: null
  });

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


      const siteOfCity = await fetch(`http://localhost:5000/api/sitesByLocality/${fullData.locality}`);
      const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${fullData.locality}`);
      const province = await fetch(`http://localhost:5000/api/getProvince/${fullData.locality}`);
      const getprovince = await province.json();
      console.log('Province Data:', getprovince);
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
        provinceName: getprovince.province,
        freeWiFiSites: getprovince.numberOfSites,
        governor: 'Unknown Governor',
        totalAPSites: getprovince.numberOfLocations,
        digitizationRate: 0,
        siteTypes: (getprovince.categoryCounts || []).map(item => ({
          type: item.category,
          count: item.count
        })),

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
    const province = await fetch(`http://localhost:5000/api/getProvince/${city}`);
    const getprovince = await province.json();
    console.log('Province Data:', getprovince);
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
      provinceName: getprovince.province,
      freeWiFiSites: getprovince.numberOfSites,
      governor: 'Unknown Governor',
      totalAPSites: getprovince.numberOfLocations,
      digitizationRate: 0,
      siteTypes: (getprovince.categoryCounts || []).map(item => ({
        type: item.category,
        count: item.count
      })),

      cities: getprovince.cities
    };
    setSelectedCity(cityData);
    setPanelData(provinceData);
    console.log('provinceData to be thrown on Infopanel Nig:', provinceData);
    pushToNavigationStack('info');
    pushToNavigationStack('city');

  };

  // Handle marker click to show location info (from map markers)
  const handleLocationMarkerClick = (locationData, associatedCityData, provinceData = null) => {
    setSelectedLocation(locationData);

    // Create proper navigation stack: info -> city -> location
    if (associatedCityData) {
      setSelectedCity(associatedCityData);

      // Create minimal province data for the info panel

      console.log('Marker Click Province Data:', provinceData);
      console.log('Marker Click City Data:', associatedCityData);
      console.log('Marker Click Location Data:', locationData);

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
    console.log('location data from city', locationDataFromCityPanel);
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
      const province = await fetch(`http://localhost:5000/api/getProvince/${fullData.locality}`);
       const getprovince = await province.json();
      if (!locOfCity.ok) {
        // Handle HTTP errors, e.g., 404 from your backend
        const errorData = await locOfCity.json();

        throw new Error(errorData.error || `HTTP error! Status: ${locOfCity.status}`);
      }
      console.log('Province: ', getprovince);
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
        provinceName: getprovince.province,
        freeWiFiSites: getprovince.numberOfSites,
        governor: 'Unknown Governor',
        totalAPSites: getprovince.numberOfLocations,
        digitizationRate: 0,
        siteTypes: (getprovince.categoryCounts || []).map(item => ({
          type: item.category,
          count: item.count
        })),

        cities: getprovince.cities
      };

      // 4. Call handleLocationMarkerClick with the full data
      setPanelData(provinceData);
      setSelectedCity(cityData);
      handleLocationMarkerClick(fullData, cityData, provinceData);
      clearNavigationStack();
      pushToNavigationStack('info');
      pushToNavigationStack('city');
      pushToNavigationStack('location');

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
    contractStatus: null, // Default to 'All' for contract status
    category: null
  }) => {
    // Clear any existing markers on the map before adding new ones.
    if (markers.length > 0) {
      clearMarkers('');
    }

    try {
      const response = await fetch('http://localhost:5000/api/map-pins');
      const data = await response.json();

      const categ = {
        'Public High School': "PHS",
        'Tourism Sea': 'TRM-SEA',
        'Rural Health Unit': "RHU",
        'Library': "LIB",
        'Local Government Unit - Tourism': "LGU-TOUR",
        'Local Government Unit - Municipal Hall/City Hall': 'LGU-BRGY',
        'Integrated High School': 'Integrated HS',
        'Parks and Playground': 'PP',
        'Transport Terminals': 'Transport Terminals',
        'Public Librarie': 'Public Librarie',
        'State Universities and Colleges': 'SUC',
        'Elementary School': 'Elementary School',
        'National and Local Government Offices': 'National and Local Government Offices',
        'National Government Agency': 'NGA',
        'Market': 'MKT',
        'Barangay': 'BGY',
        'High School': 'High School',
        'Local Government Unit - Municipal / City Hall': 'LGU-HALL',
        'Local Government Unit - Health Services': 'LGU-HEALTH',
        'Tourism Sites': 'Tourism Sites',
        'Clinical Quality Framework': 'CQF',
        'Plaza': 'PLZ',
        'Government Hospitals and RHUs': 'Government Hospitals and RHUs',
        'Public Elementary School': 'PES',
        'Local Government Unit': 'LGU',
        'Health Service Provider': 'HSP',
        'Plazas and Open Areas': 'Plazas and Open Areas'
      };

      const contract = {
        'Active': false,
        'Terminated': true
      }

      const newMarkers = [];
      const processedLocationIds = new Set();

      const filterProvince = filters.Province ? filters.Province.toLowerCase() : null;
      const filterDistrict = filters.district ? filters.district.toLowerCase() : null;
      const filterContractStatus = contract[filters.contractStatus];
      const filterCategory = categ[filters.category] ? categ[filters.category].toLowerCase() : null;

      data.forEach(item => {
        if (processedLocationIds.has(item.location_id)) {
          return;
        }

        if (filterProvince && (!item.province || item.province.toLowerCase() !== filterProvince)) {
          console.log(`Filtering out marker for province: ${item.province} (Does not match filter: ${filters.Province})`);
          return;
        }

        if (filterDistrict && (!item.congressional_district || item.congressional_district.toLowerCase() !== filterDistrict)) {
          console.log(`Filtering out marker for district: ${item.congressional_district} (Does not match filter: ${filters.district})`);
          return;
        }

        var markerColor = '#3151ba';

        if (filterContractStatus === false || filterContractStatus === true) {
          markerColor = filterContractStatus === true ? '#DD4040' : '#40bd40';
          if (item.isterminated !== filterContractStatus) {
            console.log(`Filtering out marker for contract status: ${item.isterminated} (Does not match filter: ${filterContractStatus})`);
            return;
          }
        }

        if (filterCategory && (!item.category || item.category.toLowerCase() !== filterCategory)) {
          console.log(`Filtering out marker for category: ${item.category} (Does not match filter: ${filters.category})`);
          return;
        }

        processedLocationIds.add(item.location_id);

        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);

        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(
            `Skipping marker for location_id ${item.location_id || 'N/A'} ` +
            `(${item.location_name || 'Unnamed Location'}) due to invalid coordinates: ` +
            `Lat ${item.latitude}, Lng ${item.longitude}`
          );
          return;
        }

        // --- Custom Marker Element with SVG Icon ---
        const el = document.createElement('div');
        el.className = 'mapbox-custom-marker'; // Use a specific class for this marker type

        // Base SVG path for a Mapbox-like marker (circle with a point)
        // This SVG is designed to have a base size, which we will scale.
        // The viewBox attribute ensures it scales correctly.
        // The path defines the shape. You might need to adjust the path
        // slightly based on your exact desired look.
        // It's a circle (M 12 2 C 7.58 2 4 5.58 4 10 S 12 22 12 22 S 20 10 20 10 S 16.42 2 12 2 Z)
        // with the "point" coming down to (12, 22)
        const svgContent = `
  <svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <path 
      fill="${markerColor}" 
      stroke="white" 
      stroke-width="1" 
      d="M12 2
         C8.13 2 5 5.13 5 9
         c0 4.25 4.68 9.5 6.42 11.45
         a1 1 0 0 0 1.16 0
         C14.32 18.5 19 13.25 19 9
         c0-3.87-3.13-7-7-7
         Z"
    />
    <circle 
      cx="12" 
      cy="9" 
      r="2.5" 
      fill="white"
    />
  </svg>
`;
        el.innerHTML = svgContent;


        // Set initial size and transform for positioning
        // The 'transform' is crucial to correctly anchor the pointed bottom.
        // Mapbox markers are typically anchored at the bottom-center of their icon.
        const initialZoom = mapInstance.getZoom();
        // Adjust this formula for desired scaling. This formula makes the marker bigger as zoom increases.
        // The values here (base size 20, zoom 5, factor 1.5) are examples.
        const baseMarkerSize = 25; // Size at reference zoom
        const zoomReference = 7;    // Zoom level where marker is baseMarkerSize
        const scaleFactor = 3.5;   // How much it grows per zoom level
        let newSize = baseMarkerSize + (initialZoom - zoomReference) * scaleFactor;

        // Clamp the size to prevent it from becoming too small or too large
        newSize = Math.max(10, Math.min(60, newSize)); // Example: min 10px, max 60px

        el.style.width = `${newSize}px`;
        el.style.height = `${newSize * 1.5}px`; // Adjust height to account for the pointer
        // The transform origin and translate are key for correct anchoring
        el.style.transform = `translate(-50%, -100%)`; // Centers the marker horizontally, aligns bottom to coordinates

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom' // Explicitly set anchor to 'bottom'
        })
          .setLngLat([lng, lat])
          .addTo(mapInstance);

        marker.getElement().addEventListener('click', async () => {
          try {
            if (item.location_id) {
              const response = await fetch(`http://localhost:5000/api/location-with-sites/${item.location_id}`);
              const fullData = await response.json();

              mapInstance.flyTo({
                center: [parseFloat(fullData.longitude), parseFloat(fullData.latitude)],
                zoom: 15,
                essential: true
              });

              const siteOfCity = await fetch(`http://localhost:5000/api/sitesByLocality/${fullData.locality}`);
              const locOfCity = await fetch(`http://localhost:5000/api/getLocationsOfProvince/${fullData.locality}`);
              const province = await fetch(`http://localhost:5000/api/getProvince/${fullData.locality}`);

                const getprovince = await province.json();
                console.log('Province Data:', getprovince);

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

              console.log('Province Data:', getprovince);

              const cityData = {
                name: fullData.locality || 'Unknown City',
                provinceName: fullData.province || 'Unknown Province',
                totalSites: siteOfCityData.totalSitesCount,
                mayor: 'Unknown',
                totalAPSites: locationsOfCity.length,
                digitizationRate: 0,
                siteTypes: [],
                freeWifiLocations: locationsOfCity
              };

              const provinceData = {
                provinceName: getprovince.province,
                freeWiFiSites: getprovince.numberOfSites,
                governor: 'Unknown Governor',
                totalAPSites: getprovince.numberOfLocations,
                digitizationRate: 0,
                siteTypes: (getprovince.categoryCounts || []).map(item => ({
                  type: item.category,
                  count: item.count
                })),

                cities: getprovince.cities
              };
              console.log('Constructed Province Data:', provinceData);

              setSearchQuery(fullData.location_name);
              setPanelData(provinceData);
              setSelectedCity(cityData);

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

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);
      console.log(`Added ${newMarkers.length} unique location markers from database`);

      // --- Add Map Zoom Event Listener ---
      mapInstance.on('zoom', () => {
        const currentZoom = mapInstance.getZoom();
        newMarkers.forEach(marker => {
          const el = marker.getElement();
          // Use the same clamping and scaling logic as during marker creation
          const baseMarkerSize = 20;
          const zoomReference = 7;
          const scaleFactor = 3.5;
          let newSize = baseMarkerSize + (currentZoom - zoomReference) * scaleFactor;
          newSize = Math.max(10, Math.min(60, newSize)); // Clamp the size

          el.style.width = `${newSize}px`;
          el.style.height = `${newSize * 1.5}px`; // Maintain aspect ratio of the icon
          // Transform is fixed, as it's about anchoring the point correctly
          el.style.transform = `translate(-50%, -100%)`;
        });
      });

    } catch (err) {
      console.error('Failed to fetch map pins:', err);
    }
  };
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