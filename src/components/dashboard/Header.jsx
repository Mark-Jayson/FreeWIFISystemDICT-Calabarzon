// components/dashboard/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Header = ({ region, onProvinceSelect, selectedProvince }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // List of provinces in Calabarzon
  const provinces = [
    { id: 'all', name: 'Region IV - A Calabarzon' },
    { id: 'cavite', name: 'Cavite' },
    { id: 'laguna', name: 'Laguna' },
    { id: 'batangas', name: 'Batangas' },
    { id: 'rizal', name: 'Rizal' },
    { id: 'quezon', name: 'Quezon' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current displayed province name
  const getCurrentProvinceName = () => {
    const currentProvince = provinces.find(p => p.id === selectedProvince);
    return currentProvince ? currentProvince.name : region;
  };

  return (
    <div className="p-6 pb-4">
      <div className="flex justify-between items-center">
        <div className="relative" ref={dropdownRef}>
          <button 
            className="px-4 py-2 bg-white border rounded-md shadow flex items-center gap-2 text-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {getCurrentProvinceName()} <ChevronDown className="w-4 h-4" />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-64">
              {provinces.map(province => (
                <div 
                  key={province.id}
                  className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                    selectedProvince === province.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => {
                    onProvinceSelect(province.id);
                    setIsOpen(false);
                  }}
                >
                  {province.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;