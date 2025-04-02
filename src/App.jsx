import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import './App.css'

const INITIAL_CENTER = [121.2, 14.1]
const INITIAL_ZOOM = 8.8
const PHILIPPINES_BOUNDS = [
  [114.0952145, 4.5873032], 
  [126.8039607, 21.1217806], 
];

const Sidebar = ({ mapInstance }) => {
  const [filters, setFilters] = useState({
    District: { checked: false, options: ["Option 1", "Option 2", "Option 3"] },
    Gida: { checked: false, options: ["Option 1", "Option 2"] },
    Status: { checked: false, options: ["Option 1", "Option 2"] },
    Type: { checked: false, options: ["Option 1", "Option 2"] },
    Classification: { checked: false, options: ["Option 1", "Option 2"] },
    CmsProvider: { checked: false, options: ["Option 1", "Option 2", "Option 3", "Option 4"] },
    LinkProvider: { checked: false, options: ["Option 1", "Option 2"] },
    ElcacArea: { checked: false, options: ["Option 1", "Option 2"] },
    Procurement: { checked: false, options: ["Option 1", "Option 2"] },
    ContractEnd: { checked: false, options: ["Option 1", "Option 2"] },
    Technology: { checked: false, options: ["Fiber Optic", "Satellite", "DSL", "Wireless", "Others"] }
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const toggleCheckbox = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: { ...prev[filterKey], checked: !prev[filterKey].checked }
    }));
  };

  const toggleDropdown = (filterKey) => {
    setOpenDropdown(openDropdown === filterKey ? null : filterKey);
  };

  const toggleOption = (filterKey, option) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[filterKey] || [];
      const newOptions = currentOptions.includes(option)
        ? currentOptions.filter((opt) => opt !== option)
        : [...currentOptions, option];
      return { ...prev, [filterKey]: newOptions };
    });
  };

  // Perform a direct search using Mapbox Geocoding API
  const performSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Access token is already set in the mapboxgl instance
      const accessToken = mapboxgl.accessToken;
      
      // Construct the API URL with Philippines filter
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ph&limit=5&access_token=${accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Update search results
      setSearchResults(data.features || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Only search if there's a value and it's at least 3 characters
    if (value && value.length >= 3) {
      setIsSearching(true);
      
      // Debounce the search to avoid too many API calls
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim().length >= 3) {
      performSearch(searchValue);
    }
  };

  // Select a search result
  const handleSelectResult = (result) => {
    // Clear search UI
    setSearchResults([]);
    setSearchValue("");
    
    // Check if mapInstance exists and has necessary methods
    if (!mapInstance || !result.center) {
      console.error("Map instance not available or result has no center coordinates");
      return;
    }
    
    console.log("Flying to:", result.center);
    console.log("Map instance:", mapInstance);
    
    try {
      // Add a marker at the selected location
      const marker = new mapboxgl.Marker({
        color: '#FF0000',
        scale: 1.5
      })
      .setLngLat(result.center)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${result.place_name}</h3>`)
      )
      .addTo(mapInstance);
      
      // Fly to the selected location
      mapInstance.flyTo({
        center: result.center,
        zoom: 12,
        essential: true
      });
    } catch (error) {
      console.error("Error flying to location:", error);
    }
  };

  return (
    <div className="absolute w-[262px] bg-[#17319E] text-white p-4 flex flex-col 
        font-montserrat max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar z-10">
      <div className="flex items-center space-x-2">
        <img src="/logo.webp" alt="DICT Logo" className="w-30" />
        <img src="/freewifilogo.png" alt="Free WiFi Logo" className="w-30" />
      </div>

      <div className="relative mt-4">
        <input
          type="text"
          placeholder="Search province, district, or city"
          className="w-[228px] h-[30px] p-2 pl-8 rounded bg-white text-gray-700"
          onKeyDown={handleSearch}
          onChange={handleSearchChange}
          value={searchValue}
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 10.35a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z"
            />
          </svg>
        </span>
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-20 mt-1 w-[228px] max-h-60 overflow-y-auto bg-white rounded shadow-lg">
            {searchResults.map((result) => (
              <div 
                key={result.id}
                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                onClick={() => handleSelectResult(result)}
              >
                {result.place_name}
              </div>
            ))}
          </div>
        )}
        
        {/* Loading indicator */}
        {isSearching && searchResults.length === 0 && (
          <div className="absolute z-20 mt-1 w-[228px] bg-white rounded shadow-lg p-2 text-gray-700 text-sm">
            Searching...
          </div>
        )}
      </div> 

      <div className="mt-6 space-y-4">
        <label className="block text-white font-bold mb-2 text-lg">Filters</label>

        {Object.keys(filters).map((filterKey) => (
          <div key={filterKey} className="flex flex-col">
            <div className="flex items-center justify-between bg-[#223DAC] p-2 rounded cursor-pointer">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters[filterKey].checked}
                  onChange={() => toggleCheckbox(filterKey)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-white">{filterKey.replace(/([A-Z])/g, " $1")}</span>
              </label>

              <button onClick={() => toggleDropdown(filterKey)} className="ml-2">
                {openDropdown === filterKey ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {openDropdown === filterKey && (
              <div className="mt-1 bg-[#17319E] text-white rounded p-2 transition-all duration-300 text-sm">
                {filters[filterKey].options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 p-2 pl-6 hover:bg-[#1A2F85] rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions[filterKey]?.includes(option) || false}
                      onChange={() => toggleOption(filterKey, option)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

//________________________________________________________________________________________________________________________________________
function App() {
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const [error, setError] = useState(null)
  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [mapInitialized, setMapInitialized] = useState(false)
  
  useEffect(() => {
    // Use access token
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

      if(!mapboxgl.accessToken){
        throw new Error('Mapbox access token is missing');
      }
    } catch(err) {
      console.error("mapbox error", err);
      setError("Failed to set Mapbox access token");
      return;
    }

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
            description: 'Provincial capital of Sorsogon'
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
            description: 'Capital of Albay Province'
          }
        }
      ]
    };

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v12',
      maxBounds: PHILIPPINES_BOUNDS
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    // Only add markers after map is loaded
    mapRef.current.on('load', () => {
      console.log("Map loaded successfully");
      
      // Add markers for each feature
      geojson.features.forEach(feature => {
        console.log("Adding marker at:", feature.geometry.coordinates);
        
        // Create a marker for each feature
        new mapboxgl.Marker({
          color: '#FF0000',
          scale: 1.5
        })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h3>${feature.properties.title}</h3>
              <p>${feature.properties.description}</p>`
            )
        )
        .addTo(mapRef.current);
      });
      
      // Set map as initialized after it's fully loaded
      setMapInitialized(true);
    });
    

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array

  const handleButtonClick = () => {
    if (mapRef.current) {
      mapRef.current.setCenter(INITIAL_CENTER);
      mapRef.current.setZoom(INITIAL_ZOOM);
      
      // Update state to match
      setCenter(INITIAL_CENTER);
      setZoom(INITIAL_ZOOM);
    }
  }

  const goToSorsogon = () => {
    if (mapRef.current) {
      const sorsogonCoords = [122.6058, 13.9223];
      
      // Directly set the map's center and zoom
      mapRef.current.setCenter(sorsogonCoords);
      mapRef.current.setZoom(10);
      
      // Update state to match
      setCenter(sorsogonCoords);
      setZoom(10);
    }
  }
  
  return (
    <>
      <div className="relative">
        {/* Only pass mapRef.current to Sidebar after map is initialized */}
        {mapInitialized ? <Sidebar mapInstance={mapRef.current} /> : <Sidebar mapInstance={null} />}
        
        {/* <div className="coordinates-display">
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div> */}
        <button className='reset-button' onClick={handleButtonClick}>
          Reset 
        </button>
        
        {error && <div className="error-message">{error}</div>}
        
        <div id='map-container' ref={mapContainerRef} />
        <button className='sorsogon-button' onClick={goToSorsogon}>
          Sorsogon
        </button>
      </div>
    </>
  );
}

export default App;