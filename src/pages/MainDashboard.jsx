import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar.jsx';
import InfoPanel from '../components/InfoPanel';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab === 'map') {
      // 
      /* 
      mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
      
      const initializeMap = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [121.0244, 14.2546], 
        zoom: 9
      });
      
      setMap(initializeMap);
      
      return () => {
        initializeMap.remove();
      };
      */
      
      const container = document.getElementById('map-container');
      if (container) {
        container.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100">Map Placeholder (MapBox not configured)</div>';
      }
    }
  }, [activeTab]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <MapToolbar onSearch={handleSearch} />
        
        {activeTab === 'map' && (
          <div className="flex-1 relative">
            <div id="map-container" className="w-full h-full"></div>
            
            <InfoPanel searchQuery={searchQuery} />
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">Dashboard content will appear here</div>
            </div>
          </div>
        )}
        
        {activeTab === 'wifi' && (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Free Wi-Fi Sites</h1>
            <div className="bg-white p-4 rounded shadow">Wi-Fi sites content will appear here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;