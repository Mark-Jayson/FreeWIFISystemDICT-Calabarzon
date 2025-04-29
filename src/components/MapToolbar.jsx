import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapToolbar = ({ mapInstance, setPanelData, onSearch }) => {
  // State to track which button is being hovered for UI feedback
  const [hoveredButton, setHoveredButton] = useState(null);
  // Ref to store timeout ID for debouncing search requests
  const searchTimeoutRef = useRef(null);

  // Filter options for the map interface
  const filterItems = [
    { id: 'district', label: 'District' },
    { id: 'technology', label: 'Technology' },
    { id: 'elcac', label: 'ELCAC' },
    { id: 'cida', label: 'CIDA' },
    { id: 'status', label: 'Status' },
    { id: 'type', label: 'Type' },
    { id: 'classification', label: 'Classification' }
  ];

  // Search-related state variables
  const [searchValue, setSearchValue] = useState("");       // Current value in the search input
  const [searchResults, setSearchResults] = useState([]);   // List of geocoding results
  const [isSearching, setIsSearching] = useState(false);    // Flag to show loading indicator

  /**
   * Performs a geocoding search using Mapbox API
   * @param {string} query - The search query text
   */
  const performSearch = async (query) => {
    // Validate query - must be at least 3 characters
    if (!query || query.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Set searching state to show loading indicator
    setIsSearching(true);

    try {
      // Get Mapbox access token and construct the geocoding API URL
      // Limiting search to Philippines ('country=ph') with max 5 results
      const accessToken = mapboxgl.accessToken;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=ph&limit=5&access_token=${accessToken}`;

      // Fetch results from Mapbox API
      const response = await fetch(url);
      const data = await response.json();

      // Update search results state with the features returned
      setSearchResults(data.features || []);

      // Call original onSearch if provided (maintaining compatibility with HEAD version)
      if (onSearch) {
        onSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      // Turn off searching indicator regardless of success/failure
      setIsSearching(false);
    }
  };

  /**
   * Handles changes to the search input with debouncing
   * @param {Event} e - The input change event
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear any existing timeout to implement debounce
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is long enough, start searching after a short delay
    if (value && value.length >= 3) {
      setIsSearching(true);

      // Debounce search to avoid too many API calls while typing
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 300); // 300ms debounce delay
    } else {
      // Clear results if search term is too short
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  /**
   * Handles pressing Enter key in the search input
   * @param {Event} e - The keyboard event
   */
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim().length >= 3) {
      performSearch(searchValue);
    }
  };

  /**
   * Handles selection of a location from the search results
   * This is the CRITICAL function that was causing the issue in the original code
   * @param {Object} result - The selected location result from Mapbox
   */
  const handleSelectResult = (result) => {
    // Clear search results and input field after selection
    setSearchResults([]);
    setSearchValue("");

    // Validate that we have both a map instance and coordinates to fly to
    if (!mapInstance || !result.center) {
      console.error("Map instance not available or result has no center coordinates");
      return;
    }

    console.log("Flying to:", result.center);
    console.log("Map instance:", mapInstance);

    try {
      // IMPORTANT FIX: Use the imported mapboxgl directly instead of window.mapboxgl
      // Create and add a marker at the selected location
      const marker = new mapboxgl.Marker({
        color: '#FF0000',
        scale: 1.5
      })
        .setLngLat(result.center)
        .addTo(mapInstance);

      // Add click event to the marker to show location details in panel
      marker.getElement().addEventListener('click', () => {
        setPanelData({
          title: result.place_name,
          description: result.place_name,
          coordinates: result.center,
          show: true
        });
      });

      // IMPORTANT FIX: Check that mapInstance is valid and has the flyTo method
      // This ensures we don't try to use the map before it's fully initialized
      if (mapInstance && typeof mapInstance.flyTo === 'function') {
        // Animate the map to fly to the selected location
        mapInstance.flyTo({
          center: result.center,
          zoom: 12,
          essential: true
        });
      } else {
        console.error("Map instance is not ready or doesn't have flyTo method");
      }
    } catch (error) {
      console.error("Error flying to location:", error);
    }
  };

  // Add useEffect to log when mapInstance changes
  useEffect(() => {
    console.log("MapToolbar received mapInstance:", mapInstance);
  }, [mapInstance]);

  return (
    <div className="bg-white p-3 shadow-md flex items-center">
      <div className="relative mr-4">
        <input
          type="text"
          placeholder="Search"
          className="w-48 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-m"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>



        {showResults && searchResults.length > 0 && (
          <div className="absolute z-20 mt-1 w-[228px] max-h-60 overflow-y-auto bg-white rounded shadow-lg">
            {searchResults.map((location, index) => (
              <div
                key={location.lot_id || index}
                className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm"
                onClick={() => handleResultClick(location)}
              >
                <div className="font-medium">{location.location_name}</div>
                <div className="text-sm text-gray-600">{location.locality}, {location.province}</div>
                <div className="text-xs text-gray-500">{location.site_type}</div>
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
            className={`px-3 py-1 border border-gray-300 rounded-full flex items-center text-xs whitespace-nowrap transition-all duration-200 ${hoveredButton === item.id
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
          className={`p-1 border border-gray-300 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${hoveredButton === 'more'
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