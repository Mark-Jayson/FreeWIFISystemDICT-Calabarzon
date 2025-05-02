import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DICTLogo from '../assets/DICTLogo.png';
import FreeWifi from '../assets/FreeWifi.png';
import Dashboard from '../assets/Dashboard.png';
import MapMarker from '../assets/MapMarker.png';
import AddLocation from '../assets/AddLocation.png';
import Settings from '../assets/Settings.png';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveTab(path);
  }, [location, setActiveTab]);

  const navItems = [
    // Logo (special item)
    { id: 'logo', label: 'DICT Logo', icon: DICTLogo, type: 'logo' },
    
    // Title item
    { id: 'wifi', label: 'Free WiFi', icon: FreeWifi, path: '/wifi', type: 'title' },
    
    // Main nav items (top section)
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard, path: '/dashboard', section: 'main' },
    { id: 'map', label: 'Map', icon: MapMarker, path: '/map', section: 'main' },
    
    // Bottom nav items
    { id: 'add', label: 'Add Location', icon: AddLocation, path: '/add-wifi-site', section: 'bottom' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'bottom' }
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  const renderNavItem = (item) => {
    // Skip logo in the list as it's rendered separately
    if (item.type === 'logo') return null;
    
    const isActive = activeTab === item.id;
    const isHovered = hoveredItem === item.id;
    const shouldShowLabel = isHovered;
    
    return (
      <div 
        key={item.id}
        className={`relative w-full flex justify-center py-4 cursor-pointer transition-all duration-200 
                   ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}
                   ${item.type === 'title' ? 'mb-4' : ''}`}
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

  // Group items by section
  const mainItems = navItems.filter(item => item.section === 'main');
  const bottomItems = navItems.filter(item => item.section === 'bottom');
  const titleItem = navItems.find(item => item.type === 'title');
  
  return (
    <div className="bg-blue-800 text-white w-16 flex flex-col h-full">
      {/* Logo */}
      <div className="w-full flex justify-center py-4 mb-6">
        <div className="bg-white rounded-full p-2">
          <img 
            src={DICTLogo}
            alt="DICT Logo"
            className="w-6 h-6"
          />
        </div>
      </div>
      
      {/* Title Item */}
      {renderNavItem(titleItem)}
      
      {/* Main Navigation */}
      <div>
        {mainItems.map(renderNavItem)}
      </div>
      
      {/* Spacer */}
      <div className="flex-grow"></div>
      
      {/* Bottom Navigation */}
      <div>
        {bottomItems.map(renderNavItem)}
      </div>
    </div>
  );
};

export default Sidebar;