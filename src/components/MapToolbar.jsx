import React, { useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';


const MapToolbar = ({ mapInstance, setPanelData }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const searchTimeoutRef = useRef(null);

  const filterItems = [
    { id: 'district', label: 'District' },
    { id: 'technology', label: 'Technology' },
    { id: 'elcac', label: 'ELCAC' },  
    { id: 'cida', label: 'CIDA' },
    { id: 'status', label: 'Status' },
    { id: 'type', label: 'Type' },
    { id: 'classification', label: 'Classification' }
  ];
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Make sure mapboxgl is defined and has accessToken
      // if (!window.mapboxgl || !window.mapboxgl.accessToken) {
      //   console.error('Mapbox GL or access token not available');
      //   setIsSearching(false);
      //   return;
      // }

      const accessToken = mapboxgl.accessToken;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ph&limit=5&access_token=${accessToken}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setSearchResults(data.features || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value && value.length >= 3) {
      setIsSearching(true);
      
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim().length >= 3) {
      performSearch(searchValue);
    }
  };

  const handleSelectResult = (result) => {
    setSearchResults([]);
    setSearchValue("");
    
    if (!mapInstance || !result.center) {
      console.error("Map instance not available or result has no center coordinates");
      return;
    }
    
    console.log("Flying to:", result.center);
    console.log("Map instance:", mapInstance);
    
    try {
      
        const marker = new mapboxgl.Marker({
          color: '#FF0000',
          scale: 1.5
        })
        .setLngLat(result.center)
        .addTo(mapInstance);

        marker.getElement().addEventListener('click', () => {
          
            setPanelData({
              title: result.place_name,
              description: result.place_name,
              coordinates: result.center,
              show: true
            });
          
        });
        
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
    <div className="bg-white p-3 shadow-md flex items-center ">
      <div className="relative mr-4">
        <input 
          type="text" 
          placeholder="Search" 
          className="w-48 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-m"
          onKeyDown={handleSearch}
          onChange={handleSearchChange}
          value={searchValue}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
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

        {isSearching && searchResults.length === 0 && (
          <div className="absolute z-20 mt-1 w-[228px] bg-white rounded shadow-lg p-2 text-gray-700 text-sm">
            Searching...
          </div>
        )}


      </div>
      
      <div className="text-gray-700 mr-2 text-sm whitespace-nowrap">
        Filters
      </div>
      
      <div className="flex space-x-2 overflow-x-auto">
        {filterItems.map(item => (
          <button 
            key={item.id}
            className={`px-3 py-1 border border-gray-300 rounded-full flex items-center text-xs whitespace-nowrap transition-all duration-200 ${
              hoveredButton === item.id 
                ? 'bg-blue-50 border-blue-300 text-blue-600' 
                : 'hover:bg-gray-50'
            }`}
            onMouseEnter={() => setHoveredButton(item.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {item.label}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ))}
        
        <button 
          className={`p-1 border border-gray-300 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
            hoveredButton === 'more' 
              ? 'bg-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onMouseEnter={() => setHoveredButton('more')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapToolbar;