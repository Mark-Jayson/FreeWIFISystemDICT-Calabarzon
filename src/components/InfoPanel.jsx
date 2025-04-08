import React, { useState } from 'react';
import { InfoPanels, DetailsPanel, DefaultCard, WifiSitesCard } from './InfoPanels';
import locationData from '../data/locationData';

export const InfoPanel = ({ selectedLocation }) => {
  const [panelStack, setPanelStack] = useState([]);
  const [detailsPanel, setDetailsPanel] = useState(null);

  const handleLocationSelect = (location) => {
    setDetailsPanel(null);
    
    if (location === 'CALABARZON') {
      setPanelStack([{ id: 'CALABARZON', data: locationData['CALABARZON'] }]);
    } else if (['Batangas', 'Cavite', 'Laguna', 'Rizal', 'Quezon'].includes(location)) {
      setPanelStack([
        { id: 'CALABARZON', data: locationData['CALABARZON'] },
        { id: location, data: locationData[location] }
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

  React.useEffect(() => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <>
      {panelStack.length > 0 && (
        <InfoPanels
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
      
      {panelStack.length === 0 && !detailsPanel && !selectedLocation && <DefaultCard />}
    </>
  );
};