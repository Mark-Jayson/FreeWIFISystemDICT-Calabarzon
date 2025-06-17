// MapToolbar2.jsx
import React, { useState, useRef, useEffect } from 'react';

const MapToolbar = ({ mapInstance, setPanelData, onSearch, onLocationSelected }) => {
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

  // Handle search result selection - UPDATED for database structure
  const handleResultClick = async (location) => {
    // Hide the search results dropdown
    setShowResults(false);

    // Clear the search input
    setSearchTerm('');

    try {
      // Get site data for this location from database
      const siteResponse = await fetch(`http://localhost:5000/api/map-pins`);
      const allSites = await siteResponse.json();

      // Find sites that match this location
      const locationSites = allSites.filter(site =>
        site.location_id === location.loc_id
      );

      // Construct the full location data including apSites for LocationInfoPanel
      const fullLocationData = {
        location_name: location.location_name,
        location_id: location.loc_id,
        category: location.category,
        province: location.province,
        locality: location.locality,
        congressional_district: location.congressional_district,
        // Take latitude/longitude from the first site if available, or location if it has them
        latitude: location.latitude || (locationSites.length > 0 ? locationSites[0].latitude : null),
        longitude: location.longitude || (locationSites.length > 0 ? locationSites[0].longitude : null),
        apSites: locationSites.map(site => ({
          name: site.site_name,
          technology: site.technology,
          status: site.contract_status,
          site_id: site.site_id
        }))
      };

      if (locationSites.length > 0 && mapInstance) {
        // Use the first site's coordinates for map navigation
        const firstSite = locationSites[0];
        mapInstance.flyTo({
          center: [firstSite.longitude, firstSite.latitude],
          zoom: 15,
          essential: true
        });
      }

      // Trigger search with the selected location's data (this will clear the InfoPanel)
      onSearch(''); // Clear search query to close InfoPanel

      // Call the new prop to pass the full location data to MainDashboard
      if (onLocationSelected) {
        onLocationSelected(fullLocationData);
      }

    } catch (error) {
      console.error('Error handling result click:', error);
      // Still trigger search even if other operations fail
      onSearch('');
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

export default MapToolbar1;