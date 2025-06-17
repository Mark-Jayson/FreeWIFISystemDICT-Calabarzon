import React, { useState, useRef, useEffect } from 'react';
// COMMENTED OUT: Import from hardcoded JSON utils file
// import { searchFWSLocations } from '../utils/fwsLocations';

const MapToolbar = ({ mapInstance, onSearch, onReset }) => { // Added onReset prop
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const filterItems = [
    { id: 'district', label: 'District' },
    { id: 'technology', label: 'Technology' },
    { id: 'elcac', label: 'ELCAC' },
    { id: 'cida', label: 'CIDA' },
    { id: 'status', label: 'Status' },
    { id: 'type', label: 'Type' },
    { id: 'classification', label: 'Classification' }
  ];

  // Handle click outside of search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // NEW: Database search function
  const searchDatabaseLocations = async (query) => {
    try {
      setIsSearching(true);
      const response = await fetch(`http://localhost:5000/api/location/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching database:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change - UPDATED to use database
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // UPDATED: Search database locations instead of hardcoded JSON
    const results = await searchDatabaseLocations(query);
    setSearchResults(results);
    setShowResults(results.length > 0);
  };

  // Handle search result selection - MODIFIED
  const handleResultClick = async (location) => {
    // Hide the search results dropdown
    setShowResults(false);

    // Clear the search input
    setSearchTerm('');

    try {
      // Fetch map pin data for this location to get coordinates and ensure it's a valid location for map interaction
      // This is necessary because the search results might not contain lat/lng directly
      const response = await fetch(`http://localhost:5000/api/map-pins`);
      const allSites = await response.json();

      // Find a site that matches this location for coordinates
      const targetSite = allSites.find(site => site.location_id === location.loc_id);

      if (targetSite && mapInstance) {
        mapInstance.flyTo({
          center: [parseFloat(targetSite.longitude), parseFloat(targetSite.latitude)],
          zoom: 15,
          essential: true
        });
      }

      // Trigger search in MainDashboard, passing the full location object
      // MainDashboard will then use this loc_id to fetch detailed data for LocationInfoPanel
      onSearch(location);

    } catch (error) {
      console.error('Error handling result click:', error);
      // Even if map fly or data fetch fails, still try to trigger the onSearch to open a panel
      // onSearch(location.location_name); // Fallback to sending just the name
    }
  };

  // NEW: Handle reset button click
  const handleReset = () => {
    // Clear search input and results
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);

    // Reset map to initial position and zoom
    if (mapInstance) {
      mapInstance.flyTo({
        center: [121.2, 14.1], // INITIAL_CENTER from MainDashboard
        zoom: 8.8, // INITIAL_ZOOM from MainDashboard
        essential: true
      });
    }

    // Call the reset function from MainDashboard to clear all panels and state
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="bg-white p-3 shadow-md flex items-center">
      <div className="relative mr-4">
        <input
          type="text"
          placeholder="Search Location"
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

        {/* Loading indicator */}
        {isSearching && (
          <div className="absolute z-20 mt-1 w-[280px] bg-white rounded shadow-lg p-2 text-gray-700 text-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Searching database...
            </div>
          </div>
        )}

        {/* Search results dropdown - UPDATED for database structure */}
        {showResults && searchResults.length > 0 && !isSearching && (
          <div className="absolute z-20 mt-1 w-[280px] max-h-60 overflow-y-auto bg-white rounded shadow-lg" ref={searchResultsRef}>
            {searchResults.map((location, index) => (
              <div
                key={location.loc_id || index}
                className="p-3 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm border-b border-gray-100 last:border-b-0"
                onClick={() => handleResultClick(location)}
              >
                <div className="font-medium text-blue-600">{location.location_name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {location.locality && `${location.locality}, `}{location.province}
                </div>
                {location.congressional_district && (
                  <div className="text-xs text-gray-500 mt-1">
                    District: {location.congressional_district}
                  </div>
                )}
                {location.category && (
                  <div className="text-xs text-green-600 mt-1">
                    Category: {location.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showResults && searchResults.length === 0 && !isSearching && searchTerm.trim() !== '' && (
          <div className="absolute z-20 mt-1 w-[280px] bg-white rounded shadow-lg p-3 text-gray-700 text-sm">
            <div className="text-center text-gray-500">
              No locations found for "{searchTerm}"
            </div>
          </div>
        )}
      </div>

      {/* NEW: Reset Button */}
      <button
        onClick={handleReset}
        className={`px-3 py-2 mr-4 bg-red-500 text-white rounded-full text-xs whitespace-nowrap transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 ${hoveredButton === 'reset' ? 'bg-red-600' : ''}`}
        onMouseEnter={() => setHoveredButton('reset')}
        onMouseLeave={() => setHoveredButton(null)}
        title="Reset map view and clear all panels"
      >
        Reset
      </button>

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