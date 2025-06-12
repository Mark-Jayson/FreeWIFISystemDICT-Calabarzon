import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapToolbar from '../components/MapToolbar2';
import InfoPanel from '../components/infopanels/InfoPanel';
import CityInfoPanel from '../components/infopanels/CityInfoPanel';
import LocationInfoPanel from '../components/infopanels/LocationInfoPanel';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

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
      try {
        console.log('Fetching location with sites for loc_id:', searchParams.loc_id);
        const response = await fetch(`http://localhost:5000/api/location-with-sites/${searchParams.loc_id}`);
        const fullData = await response.json();
        console.log('Fetched full location data:', fullData);
        // Create minimal city data for proper navigation
        const cityData = {
          name: fullData.locality || 'Unknown City',
          provinceName: fullData.province || 'Unknown Province',
          totalSites: 1, // Or calculate based on fullData.apSites if available
          mayor: 'Unknown',
          totalAPSites: fullData.apSites?.length || 0,
          digitizationRate: 0,
          siteTypes: [],
          freeWifiLocations: [fullData]
        };

        handleLocationMarkerClick(fullData, cityData);
        setSearchQuery(fullData.location_name); // Set search query to the selected location name
      } catch (err) {
        console.error('Error fetching location with sites after search:', err);
        // Fallback to general search behavior if fetching specific location fails
        setSearchQuery(searchParams.location_name || ''); // Use the location name from searchParams if available
        setPanelData(null); // Clear any old panel data
        clearNavigationStack();
        pushToNavigationStack('info'); // This might not be desired, but keeps some panel open
      }
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
  const handleCityClickFromInfo = (cityData) => {
    setSelectedCity(cityData);
    pushToNavigationStack('city');
  };

  // Handle marker click to show location info (from map markers)
  const handleLocationMarkerClick = (locationData, associatedCityData = null) => {
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

      setPanelData(minimalProvinceData);
      clearNavigationStack();
      pushToNavigationStack('info');
      pushToNavigationStack('city');
      pushToNavigationStack('location');
    } else {
      // If no city data, just show location panel
      clearNavigationStack();
      pushToNavigationStack('location');
    }
  };

  // Handle location click from CityInfoPanel
  const handleLocationClickFromCity = (locationData) => {
    setSelectedLocation(locationData);
    pushToNavigationStack('location');
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
  const addFWSMarkers = async (mapInstance) => {
    // Clear any existing markers on the map
    if (markers.length > 0) {
      clearMarkers(''); // Assuming clearMarkers clears all markers when called with an empty string
    }

    try {
      // Fetch map pin data from the server endpoint.
      // This endpoint returns site data joined with location data.
      const response = await fetch('http://localhost:5000/api/map-pins');
      const data = await response.json();

      // Initialize an empty array to store the new Mapbox GL JS marker objects.
      const newMarkers = [];
      // Use a Set to keep track of unique location IDs for which we've already created a marker.
      // This ensures that if a location has multiple sites, only one marker is placed for that location.
      const processedLocationIds = new Set();

      // Iterate through each item received from the API.
      // Each 'item' represents a site, but contains location details (latitude, longitude, location_id, isterminated).
      data.forEach(item => {
        // Check if a marker for this location_id has already been created.
        // If it has, skip this item to avoid duplicate markers for the same location.
        if (processedLocationIds.has(item.location_id)) {
          return; // Skip to the next item in the loop
        }

        // --- New functionality: Handle 'isterminated' property ---
        // If the location is terminated (isterminated is true), skip creating a marker.
        if (item.isterminated === true) {
          console.log(`Skipping marker for terminated location: ${item.location_name} (ID: ${item.location_id})`);
          return; // Skip this item
        }
        // --- End of new functionality ---

        // Add the current location_id to the set of processed IDs.
        // This marks it as handled, so no further markers will be created for this location.
        processedLocationIds.add(item.location_id);

        // Parse latitude and longitude from the current item.
        // These coordinates are from the 'location' table (l.latitude, l.longitude) as per your server query.
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);

        // Validate latitude and longitude before creating a marker.
        // Invalid coordinates can cause issues with map rendering.
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(
            `Skipping marker for location_id ${item.location_id || 'N/A'} ` +
            `(${item.location_name || 'Unnamed Location'}) due to invalid coordinates: ` +
            `Lat ${item.latitude}, Lng ${item.longitude}`
          );
          return; // Skip this item if coordinates are invalid
        }

        // Determine marker color based on 'isterminated' status.
        // If isterminated is false, the marker will be red. Otherwise, the default Mapbox blue.
        // Note: If item.isterminated is undefined/null or not explicitly false, it will default to blue.
        const markerColor = item.isterminated === false ? '#FF0000' : '#00FF00'; // Red for non-terminated, Green otherwise

        // Create a new Mapbox GL JS marker.
        // Mapbox expects coordinates in [longitude, latitude] format.
        const marker = new mapboxgl.Marker({ color: markerColor, scale: 1.0 })
          .setLngLat([lng, lat])
          .addTo(mapInstance); // Add the marker to the provided map instance.

        // Add a click event listener to the marker's DOM element.
        // In the addFWSMarkers function, replace the marker click event listener with this:

marker.getElement().addEventListener('click', async () => {
  try {
    // Ensure location_id is valid before making the API call for detailed data.
    if (item.location_id) {
      // Fetch detailed data for the clicked location using its location_id.
      const response = await fetch(`http://localhost:5000/api/location-with-sites/${item.location_id}`);
      const fullData = await response.json();

      const cityData = {
        name: fullData.locality || 'Unknown City',
        provinceName: fullData.province || 'Unknown Province',
        totalSites: 1,
        mayor: 'Unknown',
        totalAPSites: fullData.apSites?.length || 0,
        digitizationRate: 0,
        siteTypes: [],
        freeWifiLocations: [fullData]
      };

      // Create proper province data for the full navigation stack
      const provinceData = {
        provinceName: fullData.province || 'Unknown Province',
        provincialID: 'P-04',
        freeWiFiSites: 150,
        governor: 'Unknown Governor',
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
        cities: [cityData]
      };

      // Set up the proper navigation stack and data
      setSearchQuery(fullData.location_name);
      setPanelData(provinceData);
      setSelectedCity(cityData);
      
      // Call handleLocationMarkerClick to set up the navigation properly
      handleLocationMarkerClick(fullData, cityData);
      
    } else {
      console.warn(
        `Cannot fetch location-with-sites: location_id is undefined for location ` +
        `${item.location_name || 'N/A'}`
      );
    }
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
      addFWSMarkers(mapInstance);
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
                onLocationClick={handleLocationClickFromCity}
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
      case 'settings':
        return (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white p-4 rounded shadow">Settings content will appear here</div>
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
            onSearch={handleSearch} // This prop now accepts an object for specific location clicks
          />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default MainDashboard;