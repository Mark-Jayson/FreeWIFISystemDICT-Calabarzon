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
  [114.0952145, 4.5873032], // Southwest coordinates
  [126.8039607, 21.1217806], // Northeast coordinates
];

const Sidebar = () => {
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
  const searchInputRef = useRef(null); // Added missing reference

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

  // Added missing handleSearch function
  const handleSearch = (e) => {
    // Implement search functionality
    if (e.key === 'Enter') {
      console.log('Search query:', searchInputRef.current.value);
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
          ref={searchInputRef}
          type="text"
          placeholder="Search province, district, or city"
          className="w-[228px] h-[30px] p-2 pl-8 rounded bg-white text-gray-700"
          onKeyDown={handleSearch}
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
  const geocoderRef = useRef(null)
  const [error, setError] = useState(null)
  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  
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
    
    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'ph',
      bbox: [
        PHILIPPINES_BOUNDS[0][0],
        PHILIPPINES_BOUNDS[0][1],
        PHILIPPINES_BOUNDS[1][0],
        PHILIPPINES_BOUNDS[1][1]
      ],
      maker: false,
      placeholder: 'Search places in the Philippines'
    });
    geocoderRef.current = geocoder;
    
    // Add geocoder to map but hide its UI
    // You could skip this if you only want to use your custom search
    const geocoderContainer = document.createElement('div');
    geocoderContainer.style.display = 'none';
    document.body.appendChild(geocoderContainer);
    geocoderContainer.appendChild(geocoder.onAdd(mapRef.current));

    // Handle geocoder results
    geocoder.on('result', (e) => {
      console.log('Geocoder result:', e.result);
      
      // Create a standard marker - no custom element
      new mapboxgl.Marker({
        color: '#FF0000',
        scale: 1.5
      })
      .setLngLat(e.result.center)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3>${e.result.place_name}</h3>`
          )
      )
      .addTo(mapRef.current);
      
      // Fly to the location
      mapRef.current.flyTo({
        center: e.result.center,
        zoom: 12,
        essential: true
      });
    });

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
        <Sidebar geocoder={geocoderRef.current} />
        
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