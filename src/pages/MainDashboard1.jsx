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

// Constants for map initialization
const INITIAL_CENTER = [121.2, 14.1];  // Initial center coordinates (Philippines)
const INITIAL_ZOOM = 8.8;              // Initial zoom level
const PHILIPPINES_BOUNDS = [           // Boundary coordinates for Philippines
  [114.0952145, 4.5873032],            // Southwest corner (min longitude, min latitude)
  [126.8039607, 21.1217806],           // Northeast corner (max longitude, max latitude)
];

const MainDashboard = () => {
  // Get the current location to determine active tab
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  // UI state
  const [activeTab, setActiveTab] = useState(currentPath || 'map');  // Default to map if no path
  const [selectedCity, setSelectedCity] = useState(null);            // City data when a city is selected
  const [selectedLocation, setSelectedLocation] = useState(null);    // Location data when a location is selected
  const [searchQuery, setSearchQuery] = useState('');                // Search query from toolbar
  const [markers, setMarkers] = useState([]);
  const [panelData, setPanelData] = useState(null);                  // Panel data for InfoPanel (search results)

  // Map state
  const [map, setMap] = useState(null);                          // Mapbox map instance
  const mapRef = useRef(null);                                   // Ref to store map instance (for cleanup)
  const mapContainerRef = useRef(null);                          // Ref to the DOM element for map container
  const [error, setError] = useState(null);                      // Error state for map initialization
  const [center, setCenter] = useState(INITIAL_CENTER);          // Current map center coordinates
  const [zoom, setZoom] = useState(INITIAL_ZOOM);                // Current map zoom level
  const [mapInitialized, setMapInitialized] = useState(false);   // Flag to track if map is fully loaded

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(currentPath || 'map');
  }, [currentPath]);

  // Fixed clearMarkers function - removed + symbols and defined query parameter
  const clearMarkers = (query) => {
    setSearchQuery(query);
    // Clear any selected city or location when performing a new search
    setSelectedCity(null);
    setSelectedLocation(null);

    // Remove existing markers from the map
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  // Handle search from MapToolbar
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setSelectedCity(null);
    setSelectedLocation(null);

    // Fetch data for the InfoPanel when a search is performed
    if (query) {
      try {
        const response = await fetch(`http://localhost:5000/api/location/search?query=${query}`);
        const data = await response.json();
        setPanelData(data); // Set the search results to panelData
      } catch (err) {
        console.error('Error fetching search results for InfoPanel:', err);
        setPanelData([]); // Clear panel data on error
      }
    } else {
      setPanelData(null); // Clear panel data if query is empty
    }
  };

  // Handle marker click to show city info (This pathway might be from other functionalities, not direct marker click)
  const handleCityClick = (cityData) => {
    setSelectedCity(cityData);
    setSelectedLocation(null); // Clear any selected location when selecting a city
  };

  // Handle marker click to show location info (from map marker)
  const handleLocationMarkerClick = (locationData) => {
    setSelectedLocation(locationData);
    setSelectedCity(null); // Clear any selected city when selecting a location
  };

  // NEW: Handle click on a search result from InfoPanel
  const handleSearchLocationClick = async (locId) => {
    setSelectedCity(null); // Clear any selected city
    setSearchQuery(''); // Clear search query to close InfoPanel

    try {
      // Use the new backend endpoint to fetch detailed location info by loc_id
      const response = await fetch(`http://localhost:5000/api/sites-by-location/${locId}`);
      const fullData = await response.json();
      setSelectedLocation(fullData);
      setPanelData(null); // Clear the search results from InfoPanel
    } catch (err) {
      console.error('Error fetching detailed location info from search result:', err);
    }
  };

  // NEW: Handle location selected directly from MapToolbar search result
  const handleLocationSelectedFromSearch = (locationData) => {
    setSelectedLocation(locationData);
    setSelectedCity(null);
    setSearchQuery(''); // Clear search query to close InfoPanel
    setPanelData(null); // Clear search results from InfoPanel
  };


  // Handle closing the location info panel
  const handleCloseLocationPanel = () => {
    setSelectedLocation(null);
  };

  // Handle closing the city info panel
  const handleCloseCityPanel = () => {
    setSelectedCity(null);
  };

  // Function to add FWS markers to the map
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
            const markerColor = item.isterminated === false ? '#FF0000' : '#00FF00'; // Red for non-terminated, Blue otherwise

            // Create a new Mapbox GL JS marker.
            // Mapbox expects coordinates in [longitude, latitude] format.
            const marker = new mapboxgl.Marker({ color: markerColor, scale: 1.0 })
                .setLngLat([lng, lat])
                .addTo(mapInstance); // Add the marker to the provided map instance.

            // Add a click event listener to the marker's DOM element.
            marker.getElement().addEventListener('click', async () => {
                try {
                    // Ensure location_id is valid before making the API call for detailed data.
                    if (item.location_id) {
                        // Fetch detailed data for the clicked location using its location_id.
                        const response = await fetch(`http://localhost:5000/api/location-with-sites/${item.location_id}`);
                        const fullData = await response.json();
                        // Set the selected location data, likely to update an info panel or similar UI element.
                        
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
                        
                        handleLocationMarkerClick(fullData, cityData);
                        setSearchQuery(site.location_name);
                    } else {
                        console.warn(
                            `Cannot fetch location-with-sites: location_id is undefined for location ` +
                            `${item.location_name || 'N/A'}`
                        );
                    }
                } catch (err) {
                    console.error('Error fetching location with sites:', err);
                }

                // Clear related UI states, likely to hide other panels and show the selected location's details.
                setSearchQuery(''); // Clear search query to hide a search results panel
                setSelectedCity(null); // Clear any selected city state
                setPanelData(null); // Clear generic panel data
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

  // Step 1: Set up the Mapbox access token from environment variables
  try {
    // Get the Mapbox access token from Vite environment variables
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!mapboxgl.accessToken) {
      throw new Error('Mapbox access token is missing');
    }
  } catch (err) {
    console.error("mapbox error", err);
    setError("Failed to set Mapbox access token"); 

    // Fallback to placeholder if map initialization fails
    const container = document.getElementById('map-container');
    if (container) {
      container.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100">Map Placeholder (MapBox not configured)</div>';
    }
    return;
  }

  // Step 2: Initialize the Mapbox map instance
  const mapInstance = new mapboxgl.Map({
    container: mapContainerRef.current,  // DOM element to render the map in
    center: center,                      // Initial center position
    zoom: zoom,                          // Initial zoom level
    style: 'mapbox://styles/mapbox/streets-v12', // Map style to use
    maxBounds: PHILIPPINES_BOUNDS        // Restrict panning to these boundaries
  });

  // Store the map instance in the ref for cleanup when component unmounts
  mapRef.current = mapInstance;

  // Step 3: Add navigation controls (zoom in/out, rotate, etc.)
  mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

  // Step 4: Wait for the map to load before adding markers and updating state
  mapInstance.on('load', () => {
    console.log("Map loaded successfully");

    // IMPORTANT: Call addFWSMarkers to display WiFi site markers from JSON data
    addFWSMarkers(mapInstance);

    // IMPORTANT: Only set the map state AFTER map is fully loaded
    // This ensures MapToolbar receives a fully initialized map instance
    setMap(mapInstance);
    setMapInitialized(true);
    console.log("Map instance set in state:", mapInstance);
  });

  // Step 5: Cleanup function to remove the map when the component unmounts
  // This prevents memory leaks
  return () => {
    if (mapRef.current) {
      mapRef.current.remove();  // Remove the map from the DOM
      mapRef.current = null;    // Clear the reference
    }
  };
}, [activeTab, center, zoom]); // Run when activeTab, center, or zoom changes

// Render appropriate content based on active tab
const renderContent = () => {
  switch (activeTab) {
    case 'map':
      return (
        <div className="flex-1 relative">
          {/* Map container - this div is where Mapbox will render the map */}
          <div id="map-container" className="w-full h-full" ref={mapContainerRef}></div>

          {/* Show the info panel when search is performed but no city/location is selected */}
          {searchQuery && !selectedCity && !selectedLocation && (
            // Pass the new onLocationClick prop to InfoPanel
            <InfoPanel
              searchQuery={searchQuery}
              onCityClick={handleCityClick} // This seems to be for generic city info, might not be used now
              onLocationClick={handleSearchLocationClick} // NEW: For clicking search results
              panelData={panelData} // Pass the search results
            />
          )}

          {/* Show the city info panel when a city is selected */}
          {selectedCity && (
            <CityInfoPanel cityData={selectedCity} onBack={handleCloseCityPanel} />
          )}

          {/* Show the location info panel when a location is selected */}
          {selectedLocation && (
            <LocationInfoPanel locationData={selectedLocation} onBack={handleCloseLocationPanel} />
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
      {/* Only show MapToolbar when in map view */}
      {activeTab === 'map' && (
        <MapToolbar
          mapInstance={map}
          onSearch={handleSearch}
          onLocationSelected={handleLocationSelectedFromSearch} // Pass the new handler
        />
      )}

      {/* Dynamic content based on active tab */}
      {renderContent()}
    </div>
  </div>
);
};

export default MainDashboard1;