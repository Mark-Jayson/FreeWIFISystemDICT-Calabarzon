import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faTimes, 
  faWifi, 
  faMapMarkerAlt,
  faChartLine,
  faList,
  faDownload,
  faShareAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';


const InfoPanels = ({ 
  panelStack, 
  handleBack, 
  handleClose, 
  handleLocationSelect, 
  handleMunicipalitySelect, 
  handleWifiSiteSelect 
}) => {
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
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
            </button>
          )}
          <h2 className="text-xl font-bold">Info Panel: {currentPanel.data.title}</h2>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
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
                <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" className="mr-2 text-blue-600" />
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
                <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" className="mr-2 text-blue-600" />
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
                <FontAwesomeIcon icon={faWifi} size="sm" className="mr-2 text-blue-600" />
                {site}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailsPanel = ({ detailsPanel, handleClose }) => {
  if (!detailsPanel) return null;

  const { data } = detailsPanel;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button 
            onClick={handleClose}
            className="mr-2 p-2 rounded-full hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          </button>
          <h2 className="text-xl font-bold">{data.title}</h2>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
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

const DefaultCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Sto. Tomas City</h3>
      </div>
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="text-xs text-gray-500">AirJan Magnetometer</div>
          <div className="font-bold text-xl">41</div>
        </div>
        <div className="flex gap-2 mb-4">
          <button className="p-1 bg-gray-100 rounded border border-gray-200">
            <FontAwesomeIcon icon={faChartLine} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200">
            <FontAwesomeIcon icon={faList} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200">
            <FontAwesomeIcon icon={faDownload} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200">
            <FontAwesomeIcon icon={faShareAlt} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200">
            <FontAwesomeIcon icon={faInfoCircle} className="text-xs text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

const WifiSitesCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 border-b">
        <div className="text-xs text-gray-500">others</div>
      </div>
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-sm">Batangas I - College of Science Building</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 font-bold">!</span>
            <span className="font-bold">11</span>
          </div>
        </div>
      </div>
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-sm">ICBT - Sto. Tomas Campus</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 font-bold">!</span>
            <span className="font-bold">11</span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-sm">Batangas I - College of Science Building</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 font-bold">!</span>
            <span className="font-bold">11</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { InfoPanels, DetailsPanel, DefaultCard, WifiSitesCard };