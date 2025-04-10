import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('map');
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
    
    switch(item) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'map':
        navigate('/dashboard'); 
        break;
      case 'add':
        navigate('/add-location');
        break;
      case 'settings':
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-[#17319E] text-white flex flex-col">
      <div className="p-2 mt-2 flex justify-center">
        <div className="bg-white rounded-full p-1 w-8 h-8 flex items-center justify-center">
          <img src="src/assets/DICTlogo.png" alt="Logo" />
        </div>
      </div>
      
      <div className="mt-1 flex justify-center">
        <div className="w-10 h-10">
          <img src="src/assets/FreeWifi.png" alt="Free Wifi" />
        </div>
      </div>

      <div className="flex flex-col items-center flex-grow mt-8 space-y-6">
        <div className="relative group">
          <button 
            onClick={() => handleItemClick('dashboard')}
            className={`p-2 rounded-md ${activeItem === 'dashboard' ? 'bg-[#0F256E]' : 'hover:bg-[#0F256E]'}`}
          >
            <img src="src/assets/DashboardLayout.png" alt="Dashboard" className="w-6 h-6" />
          </button>
          <div className="absolute left-full top-[-.5rem] ml-2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            Dashboard
          </div>
        </div>
        
        <div className="relative group">
          <button 
            onClick={() => handleItemClick('map')}
            className={`p-2 rounded-md ${activeItem === 'map' ? 'bg-[#0F256E]' : 'hover:bg-[#0F256E]'}`}
          >
            <img src="src/assets/MapMarker.png" alt="Map" className="w-6 h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            Map Marker
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col items-center space-y-4">
        <div className="relative group">
          <button 
            onClick={() => handleItemClick('add')}
            className={`p-2 rounded-md ${activeItem === 'add' ? 'bg-[#0F256E]' : 'hover:bg-[#0F256E]'}`}
          >
            <img src="src/assets/Add.png" alt="Add" className="w-6 h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            Add Location
          </div>
        </div>
        
        <div className="relative group">
          <button 
            onClick={() => handleItemClick('settings')}
            className={`p-2 rounded-md ${activeItem === 'settings' ? 'bg-[#0F256E]' : 'hover:bg-[#0F256E]'}`}
          >
            <img src="src/assets/settings.png" alt="Settings" className="w-6 h-6" />
          </button>
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            Settings
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;