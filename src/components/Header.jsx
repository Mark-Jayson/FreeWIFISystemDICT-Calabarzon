import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Header = ({ regions, onRegionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]); // Default to the first region

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    onRegionChange(region); // Notify the parent component of the change
    setIsOpen(false);
  };

  return (
    <div className="p-6 pb-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <button
            className="px-4 py-2 bg-white border rounded-md shadow flex items-center gap-2 text-sm"
            onClick={toggleDropdown}
          >
            {selectedRegion} <ChevronDown className="w-4 h-4" />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-md z-10">
              {regions.map((region) => (
                <button
                  key={region}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => handleRegionClick(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;