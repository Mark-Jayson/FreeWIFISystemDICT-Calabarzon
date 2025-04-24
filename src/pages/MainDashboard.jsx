import { useRef, useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


const INITIAL_CENTER = [121.2, 14.1];
const INITIAL_ZOOM = 8.8;
const PHILIPPINES_BOUNDS = [
  [114.0952145, 4.5873032], 
  [126.8039607, 21.1217806], 
]; 

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [panelData, setPanelData] = useState(null);


  //Mapbox map
  useEffect(() => {
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if(!mapboxgl.accessToken) {
        throw new Error('Mapbox access token is missing');
      }
    } catch(err) {
      console.error("mapbox error", err);
      setError("Failed to set Mapbox access token");
      return;
    }

    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [122.14, 13.69]
          },
          properties: {
            title: 'Sorsogon City',
            description: 'Provincial capital of Sorsogon',
            city: 'Sorsogon City',
            locations: 5,
            sites: 26,
            mayor: 'John Doe',
            freeWifiSites: 41,
            digitizationRate: 25,
            siteLocations: [
              {
                name: 'Sorsogon City Hall',
                sites: 11,
                type: 'Government',
                address: 'Magsaysay Street, Sorsogon City',
                status: 'Operational',
                installedDate: 'June 15, 2023',
                accessPoints: 4,
                averageUsers: 250,
                bandwidth: '100 Mbps',
                provider: 'DICT-UNDP'
              }
            ]
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [123.30, 13.45]
          },
          properties: {
            title: 'Legazpi City',
            description: 'Capital of Albay Province',
            city: 'Legazpi City',
            locations: 8,
            sites: 32,
            mayor: 'Jane Smith',
            freeWifiSites: 45,
            digitizationRate: 35,
            siteLocations: [
              {
                name: 'Legazpi City Hall',
                sites: 15,
                type: 'Government',
                address: 'Old Albay District, Legazpi City',
                status: 'Operational',
                installedDate: 'July 22, 2023',
                accessPoints: 6,
                averageUsers: 300,
                bandwidth: '150 Mbps',
                provider: 'DICT-UNDP'
              }
            ]
          }
        }
      ]
    };

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
      style: 'mapbox://styles/mapbox/streets-v12',
      maxBounds: PHILIPPINES_BOUNDS
    });
    
    // Make the map instance available for other components
    setMap(mapRef.current);

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

    mapRef.current.on('load', () => {
      console.log("Map loaded successfully");
      
      geojson.features.forEach(feature => {
        console.log("Adding marker at:", feature.geometry.coordinates);
        
        const marker = new mapboxgl.Marker({
          color: '#FF0000',
          scale: 1.5
        })
        .setLngLat(feature.geometry.coordinates)
        .addTo(mapRef.current);

        marker.getElement().addEventListener('click', () => {
          setPanelData({
            ...feature.properties,
            coordinates: feature.geometry.coordinates,
            show: true
          });
        });
      });
      
      setMapInitialized(true);
    });
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
      
        <MapToolbar mapInstance={map} setPanelData={setPanelData} />

        {activeTab === 'map' && (
          <div className="flex-1 relative">
            <div id="map-container" className="w-full h-full" ref={mapContainerRef}></div>
            
            {panelData && panelData.show && (
              <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg max-w-md">
                <h3 className="text-lg font-bold">{panelData.title}</h3>
                <p className="text-gray-600">{panelData.description}</p>
                <div className="mt-2">
                  <p><strong>Sites:</strong> {panelData.sites}</p>
                  <p><strong>Free WiFi Sites:</strong> {panelData.freeWifiSites}</p>
                  <p><strong>Mayor:</strong> {panelData.mayor}</p>
                </div>
                <button 
                  className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => setPanelData(prev => ({ ...prev, show: false }))}
                >
                  Close
                </button>
              </div>
            )}
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