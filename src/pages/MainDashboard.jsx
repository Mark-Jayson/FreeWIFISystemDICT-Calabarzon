import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import { InfoPanels, DetailsPanel, DefaultCard, WifiSitesCard } from '../components/InfoPanels';
import locationData from '../data/locationData';

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
      <Sidebar 
        onLocationSelect={handleLocationSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex-1 flex flex-col">
        <div className="bg-white p-2 shadow-md flex gap-2 items-center overflow-x-auto">
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            District <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-blue-600 bg-blue-50 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            SOCA <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Technology <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Status <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Type <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            Classification <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
          <button className="text-gray-700 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium flex items-center">
            ELGAC Area <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
          </button>
        </div>

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

export default MainDashboard;