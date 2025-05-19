import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapToolbar from '../components/MapToolbar2';
import InfoPanel from '../components/infopanels/InfoPanel';
import CityInfoPanel from '../components/infopanels/CityInfoPanel';
import LocationInfoPanel from '../components/infopanels/LocationInfoPanel';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
//import { convertFWSToGeoJSON, formatFWSDataForInfoPanel } from '../utils/fwsLocations';

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
  const [panelData, setPanelData] = useState(null);                  // Panel data for InfoPanel

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
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Clear any selected city or location when performing a new search
    setSelectedCity(null);
    setSelectedLocation(null);
  };

  // Handle marker click to show city info
  const handleMarkerClick = (cityData) => {
    setSelectedCity(cityData);
    setSelectedLocation(null); // Clear any selected location when selecting a city
  };

  // Handle marker click to show location info
  const handleLocationMarkerClick = (locationData) => {
    setSelectedLocation(locationData);
    setSelectedCity(null); // Clear any selected city when selecting a location
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
  if (markers.length > 0) {
    clearMarkers('');
  }

  try {
    const response = await fetch('http://localhost:5000/api/map-pins');
    const data = await response.json();

    const newMarkers = data.map(site => {
      const marker = new mapboxgl.Marker({ color: '#0066FF', scale: 1.2 })
        .setLngLat([site.longitude, site.latitude])
        .addTo(mapInstance);

      marker.getElement().addEventListener('click', () => {
        const formattedData = {
          site_id: site.site_id,
          site_code: site.site_code,
          site_name: site.site_name,
          location_name: site.location_name,
          province: site.province,
          locality: site.locality,
          category: site.category,
          cluster: site.cluster,
        };
        setPanelData(formattedData);
        setSearchQuery(site.location_name);
        handleLocationMarkerClick(formattedData);
      });

      return marker;
    });

    setMarkers(newMarkers);
    console.log(`Added ${newMarkers.length} markers from database`);
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
            <InfoPanel searchQuery={searchQuery} onCityClick={handleMarkerClick} panelData={panelData} />
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
        />
      )}

      {/* Dynamic content based on active tab */}
      {renderContent()}
    </div>
  </div>
);
};

export default MainDashboard;