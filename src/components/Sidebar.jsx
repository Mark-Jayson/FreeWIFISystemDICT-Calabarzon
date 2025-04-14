import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faChevronDown,
  faChevronRight,
  faMapMarkerAlt,
  faLandmark,
  faCity,
  faWifi
} from '@fortawesome/free-solid-svg-icons';
import locationData from '../data/locationData'; // Import the location data

const styles = {
  sidebarGradient: {
    background: 'linear-gradient(to bottom, #1e3a8a, #1e40af)'
  },
  activeBorder: {
    borderLeft: '4px solid #3b82f6'
  }
};

const Sidebar = ({ onLocationSelect, searchQuery, setSearchQuery }) => {
  const [isMapActive, setIsMapActive] = useState(true);
  const [isCalabarzanActive, setIsCalabarzanActive] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Effect to handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Search across all location data
    const results = [];
    const query = searchQuery.toLowerCase();

    // Helper function to add a result with its full path
    const addResult = (id, title, type, parentPath = []) => {
      results.push({
        id,
        title,
        type,
        parentPath
      });
    };

    // Search in CALABARZON
    if ('CALABARZON'.toLowerCase().includes(query) || 
        locationData['CALABARZON']?.title?.toLowerCase().includes(query)) {
      addResult('CALABARZON', locationData['CALABARZON']?.title || 'CALABARZON', 'region');
    }

    // Search in provinces
    locationData['CALABARZON']?.provinces?.forEach(province => {
      if (province.toLowerCase().includes(query) || 
          locationData[province]?.title?.toLowerCase().includes(query)) {
        addResult(province, locationData[province]?.title || province, 'province', ['CALABARZON']);
      }
      
      // Search in municipalities
      locationData[province]?.municipalities?.forEach(municipality => {
        if (municipality.toLowerCase().includes(query)) {
          addResult(
            municipality, 
            locationData[municipality]?.title || municipality, 
            'municipality',
            ['CALABARZON', province]
          );
        }
        
        // Search in WiFi sites if this is Santo Tomas
        if (municipality === 'Santo Tomas') {
          locationData[municipality]?.wifiSites?.forEach(site => {
            if (site.toLowerCase().includes(query)) {
              addResult(
                site, 
                locationData[site]?.title || site, 
                'wifi',
                ['CALABARZON', province, municipality]
              );
            }
          });
        }
      });
    });

    setSearchResults(results);
  }, [searchQuery]);

  const toggleMap = (e) => {
    e.preventDefault();
    setIsMapActive(!isMapActive);
  };

  const toggleCalabarzon = (e) => {
    e.preventDefault();
    setIsCalabarzanActive(!isCalabarzanActive);
  };

  const handleLocationClick = (location, e) => {
    e.preventDefault();
    onLocationSelect(location);
  };
  
  // Handle clicking a search result
  const handleSearchResultClick = (result, e) => {
    e.preventDefault();
    
    // If it's a WiFi site, we need special handling
    if (result.type === 'wifi') {
      // First navigate to the municipality
      const municipality = result.parentPath[2]; // Santo Tomas
      onLocationSelect(municipality);
      
      // Then handle the WiFi site selection
      // Note: This assumes you have a handler in MainDashboard for this
      setTimeout(() => {
        // This assumes you expose a handleWifiSiteSelect function from MainDashboard
        // You may need to adjust based on your actual implementation
        if (window.handleWifiSiteSelect) {
          window.handleWifiSiteSelect(result.id);
        }
      }, 100);
    } else {
      // For regions, provinces, and municipalities, just use the normal handler
      onLocationSelect(result.id);
    }
    
    // Clear search after selection
    setSearchQuery('');
  };

  // Get icon for search result based on type
  const getIconForType = (type) => {
    switch (type) {
      case 'region':
        return faMapMarkerAlt;
      case 'province':
        return faLandmark;
      case 'municipality':
        return faCity;
      case 'wifi':
        return faWifi;
      default:
        return faMapMarkerAlt;
    }
  };

  return (
    <div 
      className="flex flex-col w-56 text-white h-full"
      style={styles.sidebarGradient}
    >
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search locations..." 
            className="w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <FontAwesomeIcon icon={faSearch} className="text-white/70" />
          </span>
        </div>
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="px-4 py-2 bg-white/10 mx-2 rounded-md mb-2">
          <h3 className="text-sm font-medium mb-2">Search Results</h3>
          {searchResults.length === 0 ? (
            <div className="text-white/70 text-sm py-1">No matches found</div>
          ) : (
            <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {searchResults.map((result, index) => (
                <li key={`${result.id}-${index}`}>
                  <a 
                    href="#" 
                    onClick={(e) => handleSearchResultClick(result, e)}
                    className="flex items-center text-sm p-2 rounded hover:bg-white/20 transition-colors"
                  >
                    <FontAwesomeIcon 
                      icon={getIconForType(result.type)} 
                      className="mr-2 text-blue-300" 
                      size="sm" 
                    />
                    <div>
                      <div>{result.title || result.id}</div>
                      {result.parentPath.length > 0 && (
                        <div className="text-xs text-blue-200">
                          {result.parentPath.join(' > ')}
                        </div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <nav className="flex-1 flex flex-col overflow-y-auto">
        <ul className="px-2">
          <li className="my-1">
            <a href="#" className="flex items-center p-3 rounded hover:bg-white/10 transition-colors">
              <span>Dashboard</span>
            </a>
          </li>

          <li className="my-1">
            <a 
              href="#" 
              onClick={toggleMap}
              className={`flex items-center justify-between p-3 rounded ${isMapActive ? 'bg-white/10' : 'hover:bg-white/10'}`}
              style={isMapActive ? styles.activeBorder : {}}
            >
              <span>Map</span>
              <FontAwesomeIcon 
                icon={isMapActive ? faChevronDown : faChevronRight} 
                className="text-xs" 
              />
            </a>
            
            {isMapActive && (
              <div className="pl-5">
                <div className="py-1">
                  <a 
                    href="#" 
                    onClick={(e) => {
                      toggleCalabarzon(e);
                      handleLocationClick('CALABARZON', e);
                    }}
                    className="flex items-center justify-between p-2 text-blue-200 font-medium rounded hover:bg-white/10"
                  >
                    <span>CALABARZON</span>
                    <FontAwesomeIcon 
                      icon={isCalabarzanActive ? faChevronDown : faChevronRight} 
                      className="text-xs" 
                    />
                  </a>
                  
                  {isCalabarzanActive && (
                    <ul className="pl-3 text-sm">
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => handleLocationClick('Batangas', e)} 
                          className="flex items-center py-1 px-2 text-blue-100 hover:bg-white/10 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faLandmark} size="sm" className="mr-2 text-blue-300" />
                          Batangas
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => handleLocationClick('Cavite', e)} 
                          className="flex items-center py-1 px-2 text-blue-100 hover:bg-white/10 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faLandmark} size="sm" className="mr-2 text-blue-300" />
                          Cavite
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => handleLocationClick('Laguna', e)} 
                          className="flex items-center py-1 px-2 text-blue-100 hover:bg-white/10 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faLandmark} size="sm" className="mr-2 text-blue-300" />
                          Laguna
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => handleLocationClick('Rizal', e)} 
                          className="flex items-center py-1 px-2 text-blue-100 hover:bg-white/10 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faLandmark} size="sm" className="mr-2 text-blue-300" />
                          Rizal
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          onClick={(e) => handleLocationClick('Quezon', e)} 
                          className="flex items-center py-1 px-2 text-blue-100 hover:bg-white/10 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faLandmark} size="sm" className="mr-2 text-blue-300" />
                          Quezon
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </li>

          <li className="mt-auto">
            <a href="#" className="flex items-center p-3 rounded hover:bg-white/10 transition-colors">
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;