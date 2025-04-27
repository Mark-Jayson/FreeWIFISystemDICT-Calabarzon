import React, { useState } from 'react';

const MapToolbar = ({ onSearch }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [searchText, setSearchText] = useState('');

  const filterItems = [
    { id: 'district', label: 'District' },
    { id: 'technology', label: 'Technology' },
    { id: 'elcac', label: 'ELCAC' },  
    { id: 'cida', label: 'CIDA' },
    { id: 'status', label: 'Status' },
    { id: 'type', label: 'Type' },
    { id: 'classification', label: 'Classification' }
  ];

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchText);
    }
  };

  const handleSearchClick = () => {
    onSearch(searchText);
  };

  return (
    <div className="bg-white p-3 shadow-md flex items-center">
      <div className="relative mr-4">
        <input 
          type="text" 
          placeholder="Search" 
          value={searchText}
          onChange={handleSearchChange}
          onKeyPress={handleSearchSubmit}
          className="w-48 pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-m"
        />
        <div 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={handleSearchClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
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