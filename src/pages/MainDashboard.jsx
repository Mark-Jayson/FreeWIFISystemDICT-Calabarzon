import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar2';
import InfoPanel from '../components/InfoPanel';
import CityInfoPanel from '../components/CityInfoPanel';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { convertFWSToGeoJSON, formatFWSDataForInfoPanel } from '../utils/fwsLocations';

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
  const [selectedCity, setSelectedCity] = useState(null);          // City data when a city is selected
  const [searchQuery, setSearchQuery] = useState('');             // Search query from toolbar
  const [markers, setMarkers] = useState([]);
  const [panelData, setPanelData] = useState(null);              // Added missing state for panel data

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
    // Clear any selected city when performing a new search
    setSelectedCity(null);
    
    // Remove existing markers from the map
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  // Handle search from MapToolbar
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Clear any selected city when performing a new search
    setSelectedCity(null);
  };

  // Handle marker click to show city info
  const handleMarkerClick = (cityData) => {
    setSelectedCity(cityData);
  };

  // Function to add FWS markers to the map
  const addFWSMarkers = (mapInstance) => {
    // Clear existing markers
    if (markers.length > 0) {
      clearMarkers('');
    }
    
    // Convert FWS locations to GeoJSON format
    const geojson = convertFWSToGeoJSON();
    
    // Create new markers for each FWS location
    const newMarkers = geojson.features.map(feature => {
      // Create a marker for each location
      const marker = new mapboxgl.Marker({
        color: '#0066FF',  // Blue color for FWS markers
        scale: 1.2         // Slightly larger than default
      })
        .setLngLat(feature.geometry.coordinates)  // Position the marker
        .addTo(mapInstance);                      // Add it to the map

      // Add click event listener to show location info in panel
      marker.getElement().addEventListener('click', () => {
        // Get the lot_id from the marker's feature properties
        const lotId = feature.properties.lotId;

        // Import the FWS locations utility and get location data
        import('../utils/fwsLocations').then(module => {
          const location = module.getLocationById(lotId);
          if (location) {
            // Format the location data for the InfoPanel
            const formattedData = formatFWSDataForInfoPanel(location);
            // Set the panel data to display the location info
            setPanelData(formattedData);
            setSearchQuery(location.location_name);
          }
        });
      });

      return marker;
    });

    // Store the new markers in state
    setMarkers(newMarkers);
    
    console.log(`Added ${newMarkers.length} FWS markers to the map`);
  };

  // Handle closing the city info panel
  const handleCloseCityPanel = () => {
    setSelectedCity(null);
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

            {/* Show the info panel when search is performed but no city is selected */}
            {searchQuery && !selectedCity && (
              <InfoPanel searchQuery={searchQuery} onCityClick={handleMarkerClick} panelData={panelData} />
            )}

            {/* Show the city info panel when a city is selected */}
            {selectedCity && (
              <CityInfoPanel cityData={selectedCity} onBack={handleCloseCityPanel} />
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
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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