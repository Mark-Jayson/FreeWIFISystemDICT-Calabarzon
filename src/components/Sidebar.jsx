import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DICTLogo from '../assets/DICTLogo.png';
import FreeWifi from '../assets/FreeWifi.png';
import Dashboard from '../assets/Dashboard.png';
import MapMarker from '../assets/MapMarker.png';
import AddLocation from '../assets/AddLocation.png';
import Settings from '../assets/Settings.png';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();

  const navItems = [
    { id: 'logo', label: 'DICT Logo', icon: DICTLogo, type: 'logo' },
    { id: 'wifi', label: 'Free WiFi', icon: FreeWifi, path: '/wifi' },
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard, showLabel: true, path: '/dashboard' },
    { id: 'map', label: 'Map', icon: MapMarker, showLabel: true, path: '/map' },
    { id: 'add', label: 'Add Location', icon: AddLocation, showLabel: true, path: '/add-wifi-site' },
    { id: 'settings', label: 'Settings', icon: Settings, showLabel: true, path: '/settings' }
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  const renderNavItem = (item, index) => {
    if (item.type === 'logo') return null;
    
    const isActive = activeTab === item.id;
    const isHovered = hoveredItem === item.id;
    const shouldShowLabel = item.showLabel && isHovered;
    
    return (
      <div 
        key={item.id}
        className={`relative w-full flex justify-center py-4 cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
        onClick={() => handleNavigation(item)}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <img 
          src={item.icon} 
          alt={item.label}
          className="w-6 h-6"
        />
        
        {shouldShowLabel && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-10">
            {item.label}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-blue-800 text-white w-16 flex flex-col h-full">
      <div className="w-full flex justify-center py-4 mb-6">
        <div className="bg-white rounded-full p-2">
          <img 
            src={navItems[0].icon}
            alt="DICT Logo"
            className="w-6 h-6"
          />
        </div>
      </div>
      
      <div className="mb-4">
        {renderNavItem(navItems[1], 1)}
      </div>
      
      <div>
        {navItems.slice(2, 4).map((item, index) => renderNavItem(item, index + 2))}
      </div>
      
      <div className="flex-grow"></div>
      
      <div>
        {navItems.slice(4).map((item, index) => renderNavItem(item, index + 4))}
      </div>
    </div>
  );
};

export default Sidebar;