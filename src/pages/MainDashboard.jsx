import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [map, setMap] = useState(null);

  //Mapbox map
  useEffect(() => {
    if (activeTab === 'map') {
      // actual Mapbox access token
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
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <MapToolbar />
        
        {activeTab === 'map' && (
          <div className="flex-1 relative">
            <div id="map-container" className="w-full h-full"></div>
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            </div>
          </div>
        )}
        
        {activeTab === 'wifi' && (
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Free Wi-Fi Sites</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;