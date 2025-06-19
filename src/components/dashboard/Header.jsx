import React, { useState } from 'react';
import { 
  ChevronDown, 
  Wifi, 
  Search,
  Bell,
  User
} from 'lucide-react';

const Header = ({ 
  region = "Region IV – A Calabarzon", 
  onProvinceSelect, 
  selectedProvince = 'all',
  darkMode = false,
  onDarkModeToggle 
}) => {
  const provinces = [
    { id: 'all', name: 'Region IV - A Calabarzon' },
    { id: 'cavite', name: 'Cavite' },
    { id: 'laguna', name: 'Laguna' },
    { id: 'batangas', name: 'Batangas' },
    { id: 'rizal', name: 'Rizal' },
    { id: 'quezon', name: 'Quezon' }
  ];

  return (
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-gray-200'} 
      backdrop-blur-lg border-b sticky top-0 z-50`}>
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                  WiFi Dashboard
                </h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  {region}
                </p>
              </div>
            </div>
            
            {/* Province Selector */}
            <div className="relative ml-8">
              <select 
                value={selectedProvince}
                onChange={(e) => onProvinceSelect && onProvinceSelect(e.target.value)}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} 
                  border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              >
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>
              <ChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none`} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                p-2 rounded-xl transition-colors duration-200`}>
                <Search className="w-5 h-5" />
              </button>
              <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                p-2 rounded-xl transition-colors duration-200 relative`}>
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={onDarkModeToggle}
                className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                  p-2 rounded-xl transition-colors duration-200`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                p-2 rounded-xl transition-colors duration-200`}>
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;