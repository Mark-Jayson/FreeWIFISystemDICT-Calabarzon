import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar2';
import InfoPanel from '../components/InfoPanel';
import CityInfoPanel from '../components/CityInfoPanel';
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
  const [selectedCity, setSelectedCity] = useState(null);          // City data when a city is selected
  const [searchQuery, setSearchQuery] = useState('');             // Search query from toolbar
  
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
      if(!mapboxgl.accessToken) {
        throw new Error('Mapbox access token is missing');
      }
    } catch(err) {
      console.error("mapbox error", err);
      setError("Failed to set Mapbox access token");
      
      // Fallback to placeholder if map initialization fails
      const container = document.getElementById('map-container');
      if (container) {
        container.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100">Map Placeholder (MapBox not configured)</div>';
      }
      return;
    }

    // Sample geojson data - would normally come from an API
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [122.14, 13.69]
          },
          properties: {
            title: 'Sorsogon City',
            description: 'Provincial capital of Sorsogon',
            city: 'Sorsogon City',
            locations: 5,
            sites: 26,
            mayor: 'John Doe',
            freeWifiSites: 41,
            digitizationRate: 25,
            provinceName: 'Sorsogon',
            totalAPSites: 125,
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
                name: 'Sorsogon City Hall',
                sites: 11,
                type: 'Government',
                address: 'Magsaysay Street, Sorsogon City',
                status: 'Operational',
                installedDate: 'June 15, 2023',
                accessPoints: 4,
                averageUsers: 250,
                bandwidth: '100 Mbps',
                provider: 'DICT-UNDP'
              }
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [123.30, 13.45]
          },
          properties: {
            title: 'Legazpi City',
            description: 'Capital of Albay Province',
            city: 'Legazpi City',
            locations: 8,
            sites: 32,
            mayor: 'Jane Smith',
            freeWifiSites: 45,
            digitizationRate: 35,
            provinceName: 'Albay',
            totalAPSites: 145,
            siteTypes: [
              { type: "School", count: 25 },
              { type: "Hospital", count: 10 },
              { type: "Fire Station", count: 5 },
              { type: "Public Market", count: 8 },
              { type: "Barangay", count: 20 },
              { type: "Park", count: 7 }
            ],
            freeWifiLocations: [
              {
                name: 'Legazpi City Hall',
                sites: 15,
                type: 'Government',
                address: 'Old Albay District, Legazpi City',
                status: 'Operational',
                installedDate: 'July 22, 2023',
                accessPoints: 6,
                averageUsers: 300,
                bandwidth: '150 Mbps',
                provider: 'DICT-UNDP'
              }
            ]
          }
        }
      ]
    };

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
      
      // Add markers for each location in the geojson data
      geojson.features.forEach(feature => {
        console.log("Adding marker at:", feature.geometry.coordinates);
        
        // Create a red marker for each location
        const marker = new mapboxgl.Marker({
          color: '#FF0000',  // Red color
          scale: 1.5         // Slightly larger than default
        })
        .setLngLat(feature.geometry.coordinates)  // Position the marker
        .addTo(mapInstance);                      // Add it to the map
        
        // Add click event listener to show location info in panel
        marker.getElement().addEventListener('click', () => {
          // Pass the city data to the city info panel component
          handleMarkerClick({
            name: feature.properties.title,
            provinceName: feature.properties.provinceName,
            totalSites: feature.properties.sites,
            mayor: feature.properties.mayor,
            totalAPSites: feature.properties.totalAPSites,
            digitizationRate: feature.properties.digitizationRate,
            siteTypes: feature.properties.siteTypes,
            freeWifiLocations: feature.properties.freeWifiLocations,
          });
        });
      });
      
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
    switch(activeTab) {
      case 'map':
        return (
          <div className="flex-1 relative">
            {/* Map container - this div is where Mapbox will render the map */}
            <div id="map-container" className="w-full h-full" ref={mapContainerRef}></div>
            
            {/* Show the info panel when search is performed but no city is selected */}
            {searchQuery && !selectedCity && (
              <InfoPanel searchQuery={searchQuery} onCityClick={handleMarkerClick} />
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar navigation */}
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