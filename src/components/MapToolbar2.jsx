import React, { useState, useRef, useEffect } from 'react';
import { searchFWSLocations } from '../utils/fwsLocations';

const MapToolbar = ({ mapInstance, setPanelData, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Search FWS locations with the query
    const results = searchFWSLocations(query);
    setSearchResults(results);
    setShowResults(true);
  };

  // Handle search result selection
  const handleResultClick = (location) => {
    // Hide the search results dropdown
    setShowResults(false);

    // Clear the search input
    setSearchTerm('');

    // If map instance exists, fly to the selected location
    if (mapInstance) {
      mapInstance.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 15,
        essential: true
      });
    }

    // Trigger search with the selected location's data
    onSearch(location.location_name);

    // Set panel data with the selected location's information
    import('../utils/fwsLocations').then(module => {
      const formattedData = module.formatFWSDataForInfoPanel(location);
      setPanelData(formattedData);
    });
  };

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

        {/* {isSearching && searchResults.length === 0 && (
          <div className="absolute z-20 mt-1 w-[228px] bg-white rounded shadow-lg p-2 text-gray-700 text-sm">
            Searching...
          </div>
        )} */}
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