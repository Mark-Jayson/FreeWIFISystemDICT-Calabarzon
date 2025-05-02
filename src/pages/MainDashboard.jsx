import { useRef, useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar2';
import InfoPanel from '../components/InfoPanel';
import WiFiList from './WiFiList';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { convertFWSToGeoJSON, formatFWSDataForInfoPanel } from '../utils/fwsLocations';

// Constants for map initialization
const INITIAL_CENTER = [121.2, 14.1];  // Initial center coordinates (Philippines CALABARZON region)
const INITIAL_ZOOM = 8.8;              // Initial zoom level
const PHILIPPINES_BOUNDS = [           // Boundary coordinates for Philippines
  [114.0952145, 4.5873032],            // Southwest corner (min longitude, min latitude)
  [126.8039607, 21.1217806],           // Northeast corner (max longitude, max latitude)
];



const MainDashboard = () => {
  // UI state
  const [activeTab, setActiveTab] = useState('map');        // Current active tab (map, dashboard, wifi)
  const [panelData, setPanelData] = useState(null);         // Data to display in the info panel
  const [searchQuery, setSearchQuery] = useState('');       // Search query
  const [markers, setMarkers] = useState([]);               // Array to store map markers

  // Map state
  const [map, setMap] = useState(null);                     // Mapbox map instance (to pass to child components)
  const mapRef = useRef(null);                             // Ref to store map instance (for cleanup)
  const mapContainerRef = useRef(null);                    // Ref to the DOM element for map container
  const [error, setError] = useState(null);                // Error state for map initialization
  const [center, setCenter] = useState(INITIAL_CENTER);    // Current map center coordinates
  const [zoom, setZoom] = useState(INITIAL_ZOOM);          // Current map zoom level
  const [mapInitialized, setMapInitialized] = useState(false); // Flag to track if map is fully loaded

  // Handle search from MapToolbar
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Clear existing markers from the map
  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  // Add FWS location markers to the map
  const addFWSMarkers = (map) => {
    // Clear existing markers
    clearMarkers();
    
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
        .addTo(map);                             // Add it to the map

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

      // Add FWS location markers
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
      clearMarkers();
      if (mapRef.current) {
        mapRef.current.remove();  // Remove the map from the DOM
        mapRef.current = null;    // Clear the reference
      }
    };
  }, [activeTab, center, zoom]); // Run when activeTab, center, or zoom changes

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Sidebar navigation */}
      <div className="flex-1 flex flex-col">
        {/* IMPORTANT: Pass both map instance and onSearch handler */}
        <MapToolbar
          mapInstance={map}
          setPanelData={setPanelData}
          onSearch={handleSearch}
        /> 

        {/* Map view */}
        {activeTab === 'map' && (
          <div className="flex-1 relative">
            {/* Map container - this div is where Mapbox will render the map */}
            <div id="map-container" className="w-full h-full" ref={mapContainerRef}></div>
            
            {/* Include the InfoPanel when searchQuery is set or when marker is clicked */}
            <InfoPanel searchQuery={searchQuery} panelData={panelData} />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">Dashboard content will appear here</div>
            </div>
          </div>
        )}

        {activeTab === 'wifi' && (
          <div className="flex-1 p-6">
          <WiFiList/> 
         </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;