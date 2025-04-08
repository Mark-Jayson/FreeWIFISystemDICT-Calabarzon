import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faChevronDown, 
  faChartLine, 
  faList, 
  faDownload, 
  faShareAlt, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';

// Define the CSS styles
const styles = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebarGradient: {
    background: 'linear-gradient(to bottom, #1e3a8a, #1e40af)'
  },
  activeBorder: {
    borderLeft: '4px solid #3b82f6'
  }
};

const Sidebar = () => {
  // State for tracking active menu items
  const [isMapActive, setIsMapActive] = useState(true);
  const [isCalabarzanActive, setIsCalabarzanActive] = useState(true);

  // Toggle function for Map menu item
  const toggleMap = (e) => {
    e.preventDefault();
    setIsMapActive(!isMapActive);
  };

  // Toggle function for CALABARZON submenu
  const toggleCalabarzon = (e) => {
    e.preventDefault();
    setIsCalabarzanActive(!isCalabarzanActive);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div 
        className="flex flex-col w-56 text-white"
        style={styles.sidebarGradient}
      >
        {/* Search Box */}
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <FontAwesomeIcon icon={faSearch} className="text-white/70" />
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="px-2">
            {/* Dashboard Item */}
            <li className="my-1">
              <a href="#" className="flex items-center p-3 rounded hover:bg-white/10 transition-colors">
                <span>Dashboard</span>
              </a>
            </li>

            {/* Map Item */}
            <li className="my-1">
              <a 
                href="#" 
                onClick={toggleMap}
                className={`flex items-center p-3 rounded ${isMapActive ? 'bg-white/10' : 'hover:bg-white/10'}`}
                style={isMapActive ? styles.activeBorder : {}}
              >
                <span>Map</span>
              </a>
              
              {/* CALABARZON Submenu */}
              {isMapActive && (
                <div className="pl-5">
                  <div className="py-1">
                    <a 
                      href="#" 
                      onClick={toggleCalabarzon}
                      className="block p-2 text-blue-200 font-medium rounded"
                    >
                      CALABARZON
                    </a>
                    
                    {/* Regions Submenu */}
                    {isCalabarzanActive && (
                      <ul className="pl-3 text-sm">
                        <li>
                          <a href="#" className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                            Batangas
                          </a>
                        </li>
                        <li>
                          <a href="#" className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                            Cavite
                          </a>
                        </li>
                        <li>
                          <a href="#" className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                            Laguna
                          </a>
                        </li>
                        <li>
                          <a href="#" className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                            Quezon
                          </a>
                        </li>
                        <li>
                          <a href="#" className="block py-1 px-2 text-blue-100 hover:bg-white/10 rounded">
                            Rizal
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </li>

            {/* Settings Link at Bottom */}
            <li className="mt-auto">
              <a href="#" className="flex items-center p-3 rounded hover:bg-white/10 transition-colors">
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content - Map Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Filter Bar */}
        <div className="bg-white p-2 shadow-md flex gap-2 items-center overflow-x-auto">
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            District <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-blue-600 bg-blue-50 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            SOCA <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Technology <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Status <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Type <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Classification <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            ELGAC Area <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
        </div>

        {/* Map Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Map Background (Placeholder) */}
          <div className="absolute inset-0 bg-blue-50 bg-opacity-70">
            {/* This would be where your actual map goes */}
            <div 
              className="p-4 h-full w-full" 
              style={{ backgroundImage: "url('/api/placeholder/600/400')", backgroundSize: "cover" }}
            ></div>
          </div>

          {/* Info Cards */}
          <div className="absolute top-4 right-4 w-72">
            {/* City Card */}
            <div className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
              <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Sto. Tomas City</h3>
                <div className="text-xs text-gray-500">Pinned as epicenter</div>
              </div>
              <div className="p-3">
                <div className="flex justify-between mb-2">
                  <div className="text-xs text-gray-500">AirJan Magnetometer</div>
                  <div className="font-bold text-xl">41</div>
                </div>
                <div className="flex gap-2 mb-4">
                  <button className="p-1 bg-gray-100 rounded border border-gray-200">
                    <FontAwesomeIcon icon={faChartLine} className="text-xs text-gray-700" />
                  </button>
                  <button className="p-1 bg-gray-100 rounded border border-gray-200">
                    <FontAwesomeIcon icon={faList} className="text-xs text-gray-700" />
                  </button>
                  <button className="p-1 bg-gray-100 rounded border border-gray-200">
                    <FontAwesomeIcon icon={faDownload} className="text-xs text-gray-700" />
                  </button>
                  <button className="p-1 bg-gray-100 rounded border border-gray-200">
                    <FontAwesomeIcon icon={faShareAlt} className="text-xs text-gray-700" />
                  </button>
                  <button className="p-1 bg-gray-100 rounded border border-gray-200">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-xs text-gray-700" />
                  </button>
                </div>
                
                {/* Alert Level */}
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <div className="text-xs text-gray-500">Alert Level</div>
                    <div className="font-bold">125</div>
                  </div>
                </div>
                
                {/* Displacement Level */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <div className="text-xs text-gray-500">Displacement Level</div>
                    <div className="font-bold">25%</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Cards */}
            <div className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
              <div className="p-3 border-b">
                <div className="text-xs text-gray-500">Nearby buildings with threat status</div>
              </div>
              <div className="p-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Batangas I - College of Science Building</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 font-bold">!</span>
                    <span className="font-bold">11</span>
                  </div>
                </div>
              </div>
              <div className="p-3 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">ICBT - Sto. Tomas Campus</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 font-bold">!</span>
                    <span className="font-bold">11</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Batangas I - College of Science Building</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 font-bold">!</span>
                    <span className="font-bold">11</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;