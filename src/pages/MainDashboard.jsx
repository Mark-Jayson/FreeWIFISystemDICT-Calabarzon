import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import MapToolbar from '../components/MapToolbar'; 
import { InfoPanels, DetailsPanel, DefaultCard, WifiSitesCard } from '../components/InfoPanels';
import locationData from '../data/locationData';
import Layout from '../components/Layout';


const MainDashboard = () => {
  const [panelStack, setPanelStack] = useState([]);
  const [detailsPanel, setDetailsPanel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationSelect = (location) => {
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-white">
        <MapToolbar />
        
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-50 bg-opacity-70">
            <div 
              className="p-4 h-full w-full" 
              style={{ backgroundImage: "url('/api/placeholder/600/400')", backgroundSize: "cover" }}
            ></div>
          </div>

          <div className="absolute inset-y-4 right-4 w-72 flex flex-col gap-4 overflow-auto max-h-full">
            {panelStack.length > 0 && (
              <InfoPanel
                panelStack={panelStack}
                handleBack={handleBack}
                handleClose={handleClose}
                handleLocationSelect={handleLocationSelect}
                handleMunicipalitySelect={handleMunicipalitySelect}
                handleWifiSiteSelect={handleWifiSiteSelect}
              />
            )}
            
            {detailsPanel && (
              <DetailsPanel
                detailsPanel={detailsPanel}
                handleClose={() => setDetailsPanel(null)}
              />
            )}
            
            {panelStack.length === 0 && !detailsPanel && <DefaultCard />}
            
            <WifiSitesCard />
          </div>
        </div>
      </div>
    </div>
  );
};


const InfoPanel = ({ 
  panelStack, 
  handleBack, 
  handleClose, 
  handleLocationSelect, 
  handleMunicipalitySelect, 
  handleWifiSiteSelect 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {panelStack.map((panel, index) => (
        <div key={panel.id} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{panel.id}</h3>
            <div className="flex">
              {index > 0 && (
                <button 
                  onClick={handleBack}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainDashboard;

