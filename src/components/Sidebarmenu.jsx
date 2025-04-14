// components/Sidebar.jsx
import { useState } from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Sidebar menu items with their labels
  const sidebarItems = [
    { id: 'wifi', label: 'Wi-Fi', icon: '/icons/wifi-icon.png' },
    { id: 'dashboard', label: 'Dashboard', icon: '/icons/dashboard-icon.png' },
    { id: 'map', label: 'Map', icon: '/icons/map-icon.png' },
    { id: 'add', label: 'Add Sites', icon: '/icons/add-icon.png' },
    { id: 'settings', label: 'Settings', icon: '/icons/settings-icon.png' }
  ];

  return (
    <div className="bg-blue-800 text-white w-16 flex flex-col items-center py-4">
      {sidebarItems.map((item) => (
        <div 
          key={item.id}
          className={`relative group w-12 h-12 flex items-center justify-center mb-4 cursor-pointer rounded-md ${activeTab === item.id ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          onClick={() => setActiveTab(item.id)}
        >
          {/* Icon placeholder */}
          <div className="w-6 h-6 bg-white/80 flex items-center justify-center rounded">
            <img 
              src={item.icon} 
              alt={item.label} 
              className="w-5 h-5"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
              }}
            />
          </div>
          
          {/* Tooltip that appears on hover */}
          <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-10">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;