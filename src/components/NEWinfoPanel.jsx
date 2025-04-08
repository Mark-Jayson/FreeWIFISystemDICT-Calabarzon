import { useState } from 'react';
import { ArrowLeft, X, Search, MapPin, Wifi } from 'lucide-react';

// Sample data structure (placeholder)
const locationData = {
  'CALABARZON': {
    title: 'Region 4-A CALABARZON',
    description: 'CALABARZON is a region in the Philippines located in southwestern Luzon. It is composed of five provinces: Cavite, Laguna, Batangas, Rizal, and Quezon.',
    provinces: ['Batangas', 'Cavite', 'Laguna', 'Rizal', 'Quezon']
  },
  'Batangas': {
    title: 'Batangas Province',
    description: 'Batangas is a province in the Philippines located in the CALABARZON region. It is known for its beaches, diving spots, and the Taal Volcano.',
    municipalities: ['Santo Tomas', 'Lipa City', 'Batangas City', 'Tanauan', 'Lemery']
  },
  'Cavite': {
    title: 'Cavite Province',
    description: 'Cavite is a province in the Philippines located in the CALABARZON region. It is known for its historical significance in Philippine independence.',
    municipalities: ['Kawit', 'Tagaytay', 'Dasmariñas', 'Imus', 'Trece Martires']
  },
  'Laguna': {
    title: 'Laguna Province',
    description: 'Laguna is a province in the Philippines located in the CALABARZON region. It is known for Laguna de Bay, hot springs, and waterfalls.',
    municipalities: ['Calamba', 'Los Baños', 'Santa Rosa', 'San Pablo', 'Biñan']
  },
  'Rizal': {
    title: 'Rizal Province',
    description: 'Rizal is a province in the Philippines located in the CALABARZON region. It was named after the national hero José Rizal.',
    municipalities: ['Antipolo', 'Taytay', 'Cainta', 'Angono', 'Binangonan']
  },
  'Quezon': {
    title: 'Quezon Province',
    description: 'Quezon is a province in the Philippines located in the CALABARZON region. It is known for its coconut products and beautiful beaches.',
    municipalities: ['Lucena', 'Tayabas', 'Pagbilao', 'Lucban', 'Sariaya']
  },
  'Santo Tomas': {
    title: 'Santo Tomas',
    description: 'Santo Tomas is a city in the province of Batangas, Philippines. It is known for its industrial parks and educational institutions.',
    wifiSites: ['BatStateU – College of Science Building', 'Santo Tomas City Hall', 'Santo Tomas Public Library', 'Santo Tomas Central Terminal']
  },
  'BatStateU – College of Science Building': {
    title: 'BatStateU – College of Science Building',
    description: 'A free WiFi site located at the Batangas State University College of Science Building in Santo Tomas.',
    details: {
      address: '123 University Ave, Santo Tomas, Batangas',
      openHours: '7:00 AM - 8:00 PM',
      provider: 'DICT Free WiFi Program',
      speed: 'Up to 100 Mbps',
      accessibility: 'Open to students and public'
    }
  }
};

export default function InfoPanelSystem() {
  const [panelStack, setPanelStack] = useState([]);
  const [detailsPanel, setDetailsPanel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationSelect = (location) => {
    // Reset details panel when selecting a new main location
    setDetailsPanel(null);
    
    if (location === 'CALABARZON') {
      setPanelStack([{ id: 'CALABARZON', data: locationData['CALABARZON'] }]);
    } else if (['Batangas', 'Cavite', 'Laguna', 'Rizal', 'Quezon'].includes(location)) {
      setPanelStack([
        { id: 'CALABARZON', data: locationData['CALABARZON'] },
        { id: location, data: locationData[location] }
      ]);
    } else if (location === 'Santo Tomas') {
      setPanelStack([
        { id: 'CALABARZON', data: locationData['CALABARZON'] },
        { id: 'Batangas', data: locationData['Batangas'] },
        { id: 'Santo Tomas', data: locationData['Santo Tomas'] }
      ]);
    }
  };

  const handleMunicipalitySelect = (province, municipality) => {
    setDetailsPanel(null);
    setPanelStack([
      { id: 'CALABARZON', data: locationData['CALABARZON'] },
      { id: province, data: locationData[province] },
      { id: municipality, data: locationData[municipality] }
    ]);
  };

  const handleWifiSiteSelect = (siteId) => {
    setDetailsPanel({ id: siteId, data: locationData[siteId] });
  };

  const handleBack = () => {
    if (detailsPanel) {
      setDetailsPanel(null);
    } else if (panelStack.length > 1) {
      setPanelStack(panelStack.slice(0, panelStack.length - 1));
    }
  };

  const handleClose = () => {
    if (detailsPanel) {
      setDetailsPanel(null);
    } else {
      setPanelStack([]);
    }
  };

  const renderPanel = () => {
    if (panelStack.length === 0) {
      return null;
    }

    const currentPanel = panelStack[panelStack.length - 1];

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {panelStack.length > 1 && (
              <button 
                onClick={handleBack}
                className="mr-2 p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold">Info Panel: {currentPanel.data.title}</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <p>{currentPanel.data.description}</p>
        </div>
        
        {currentPanel.id === 'CALABARZON' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Provinces</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPanel.data.provinces.map(province => (
                <button
                  key={province}
                  onClick={() => handleLocationSelect(province)}
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 border border-gray-200"
                >
                  <MapPin size={16} className="mr-2 text-blue-600" />
                  {province}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {['Batangas', 'Cavite', 'Laguna', 'Rizal', 'Quezon'].includes(currentPanel.id) && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Municipalities/Cities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPanel.data.municipalities.map(municipality => (
                <button
                  key={municipality}
                  onClick={() => handleMunicipalitySelect(currentPanel.id, municipality)}
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 border border-gray-200"
                >
                  <MapPin size={16} className="mr-2 text-blue-600" />
                  {municipality}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {currentPanel.id === 'Santo Tomas' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Some Locations with Free WIFI Sites</h3>
            <div className="grid grid-cols-1 gap-2">
              {currentPanel.data.wifiSites.map(site => (
                <button
                  key={site}
                  onClick={() => handleWifiSiteSelect(site)}
                  className="flex items-center p-2 rounded-md hover:bg-blue-50 border border-gray-200"
                >
                  <Wifi size={16} className="mr-2 text-blue-600" />
                  {site}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDetailsPanel = () => {
    if (!detailsPanel) return null;

    const { data } = detailsPanel;

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => setDetailsPanel(null)}
              className="mr-2 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">{data.title}</h2>
          </div>
          <button 
            onClick={() => setDetailsPanel(null)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4">
          <p>{data.description}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <ul className="space-y-2">
            {Object.entries(data.details).map(([key, value]) => (
              <li key={key} className="flex">
                <span className="font-medium w-32 capitalize">{key}:</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-full md:w-64 p-4 border-r">
        <h1 className="text-xl font-bold mb-4">Locations</h1>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Location options */}
        <div className="space-y-1">
          <button 
            className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center"
            onClick={() => handleLocationSelect('CALABARZON')}
          >
            <MapPin size={16} className="mr-2 text-blue-600" />
            CALABARZON
          </button>
          
          <div className="pl-6 space-y-1 border-l border-gray-200 ml-2">
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center"
              onClick={() => handleLocationSelect('Batangas')}
            >
              <MapPin size={16} className="mr-2 text-blue-600" />
              Batangas
            </button>
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center"
              onClick={() => handleLocationSelect('Cavite')}
            >
              <MapPin size={16} className="mr-2 text-blue-600" />
              Cavite
            </button>
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center"
              onClick={() => handleLocationSelect('Laguna')}
            >
              <MapPin size={16} className="mr-2 text-blue-600" />
              Laguna
            </button>
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center"
              onClick={() => handleLocationSelect('Rizal')}
            >
              <MapPin size={16} className="mr-2 text-blue-600" />
              Rizal
            </button>
            <button 
              className="w-full text-left p-2 rounded-md hover:bg-blue-50 flex items-center"
              onClick={() => handleLocationSelect('Quezon')}
            >
              <MapPin size={16} className="mr-2 text-blue-600" />
              Quezon
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area - Responsive panel layout */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex flex-col md:flex-row gap-4">
          {panelStack.length > 0 && (
            <div className="w-full md:w-1/2">
              {renderPanel()}
            </div>
          )}
          
          {detailsPanel && (
            <div className="w-full md:w-1/2">
              {renderDetailsPanel()}
            </div>
          )}
          
          {panelStack.length === 0 && !detailsPanel && (
            <div className="flex items-center justify-center w-full h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Select a location from the sidebar to view information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}