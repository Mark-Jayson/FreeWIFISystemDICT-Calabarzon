import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div 
      className="flex flex-col w-56 text-white h-full"
      style={styles.sidebarGradient}
    >
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            <FontAwesomeIcon icon={faSearch} className="text-white/70" />
          </span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col">
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
              className={`flex items-center p-3 rounded ${isMapActive ? 'bg-white/10' : 'hover:bg-white/10'}`}
              style={isMapActive ? styles.activeBorder : {}}
            >
              <span>Map</span>
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
                    className="block p-2 text-blue-200 font-medium rounded"
                  >
                    CALABARZON
                  </a>
                  
                  {isCalabarzanActive && (
                    <ul className="pl-3 text-sm">
                      <li>
                        <a href="#" onClick={(e) => handleLocationClick('Batangas', e)} className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                          Batangas
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => handleLocationClick('Cavite', e)} className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                          Cavite
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => handleLocationClick('Laguna', e)} className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                          Laguna
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => handleLocationClick('Rizal', e)} className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                          Rizal
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={(e) => handleLocationClick('Quezon', e)} className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
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