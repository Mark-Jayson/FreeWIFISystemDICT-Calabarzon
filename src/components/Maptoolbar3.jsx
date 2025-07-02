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
    <div className="p-3 shadow-md flex items-center" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div className="relative mr-4">
        <input
          type="text"
          placeholder="Search Location"
          className="w-48 pl-8 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 transition-all duration-200 text-m"
          style={{ 
            border: '1px solid rgb(209, 213, 219)',
            color: 'rgb(17, 24, 39)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgb(59, 130, 246)';
            e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
            if (searchResults.length > 0) setShowResults(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgb(209, 213, 219)';
            e.target.style.boxShadow = 'none';
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(107, 114, 128)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading indicator */}
        {isSearching && (
          <div 
            className="absolute z-20 mt-1 w-[280px] rounded shadow-lg p-2 text-sm"
            style={{ 
              backgroundColor: 'rgb(255, 255, 255)',
              color: 'rgb(55, 65, 81)'
            }}
          >
            <div className="flex items-center">
              <div 
                className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2"
                style={{ borderColor: 'rgb(59, 130, 246)' }}
              ></div>
              Searching database...
            </div>
          </div>
        )}

        {/* Search results dropdown - UPDATED for database structure */}
        {showResults && searchResults.length > 0 && !isSearching && (
          <div 
            className="absolute z-20 mt-1 w-[280px] max-h-60 overflow-y-auto rounded shadow-lg" 
            ref={searchResultsRef}
            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
          >
            {searchResults.map((location, index) => (
              <div
                key={location.loc_id || index}
                className="p-3 cursor-pointer text-sm last:border-b-0"
                style={{ 
                  color: 'rgb(55, 65, 81)',
                  borderBottom: index < searchResults.length - 1 ? '1px solid rgb(243, 244, 246)' : 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(243, 244, 246)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleResultClick(location)}
              >
                <div className="font-medium" style={{ color: 'rgb(37, 99, 235)' }}>
                  {location.location_name}
                </div>
                <div className="text-sm mt-1" style={{ color: 'rgb(75, 85, 99)' }}>
                  {location.locality && `${location.locality}, `}{location.province}
                </div>
                {location.congressional_district && (
                  <div className="text-xs mt-1" style={{ color: 'rgb(107, 114, 128)' }}>
                    District: {location.congressional_district}
                  </div>
                )}
                {location.category && (
                  <div className="text-xs mt-1" style={{ color: 'rgb(34, 197, 94)' }}>
                    Category: {location.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showResults && searchResults.length === 0 && !isSearching && searchTerm.trim() !== '' && (
          <div 
            className="absolute z-20 mt-1 w-[280px] rounded shadow-lg p-3 text-sm"
            style={{ backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(55, 65, 81)' }}
          >
            <div className="text-center" style={{ color: 'rgb(107, 114, 128)' }}>
              No locations found for "{searchTerm}"
            </div>
          </div>
        )}
      </div>

      <div className="mr-2 text-sm whitespace-nowrap" style={{ color: 'rgb(55, 65, 81)' }}>
        Filters
      </div>

      <div className="flex space-x-2 overflow-x-auto">
        {filterItems.map(item => (
          <button
            key={item.id}
            className="px-3 py-1 rounded-full flex items-center text-xs whitespace-nowrap transition-all duration-200"
            style={{
              border: hoveredButton === item.id ? '1px solid rgb(147, 197, 253)' : '1px solid rgb(209, 213, 219)',
              backgroundColor: hoveredButton === item.id ? 'rgb(239, 246, 255)' : 'rgb(249, 250, 251)',
              color: hoveredButton === item.id ? 'rgb(37, 99, 235)' : 'rgb(55, 65, 81)'
            }}
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
          className="p-1 rounded-full flex items-center justify-center text-xs transition-all duration-200"
          style={{
            border: '1px solid rgb(209, 213, 219)',
            backgroundColor: hoveredButton === 'more' ? 'rgb(229, 231, 235)' : 'rgb(243, 244, 246)'
          }}
          onMouseEnter={() => setHoveredButton('more')}
          onMouseLeave={() => setHoveredButton(null)}
          onFocus={(e) => e.target.style.backgroundColor = 'rgb(229, 231, 235)'}
          onBlur={(e) => e.target.style.backgroundColor = hoveredButton === 'more' ? 'rgb(229, 231, 235)' : 'rgb(243, 244, 246)'}
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