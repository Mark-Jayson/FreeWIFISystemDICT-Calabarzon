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
  faInfoCircle,
  faBuilding,
  faCity,
  faLandmark
} from '@fortawesome/free-solid-svg-icons';

// Info panel component that renders main panels
const InfoPanel = ({ 
  selectedLocation = null,
  panelStack = [], 
  handleBack = () => {}, 
  handleClose = () => {}, 
  handleLocationSelect = () => {}, 
  handleMunicipalitySelect = () => {}, 
  handleWifiSiteSelect = () => {} 
}) => {
  if (panelStack.length === 0) {
    return <DefaultCard />;
  }

  const currentPanel = panelStack[panelStack.length - 1];

  // Helper function to get appropriate icon based on location type
  const getLocationIcon = (locationType) => {
    switch (locationType) {
      case 'province':
        return faLandmark;
      case 'municipality':
        return faCity;
      case 'wifi':
        return faWifi;
      default:
        return faMapMarkerAlt;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {panelStack.length > 1 && (
            <button 
              onClick={handleBack}
              className="mr-2 p-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
            </button>
          )}
          <h2 className="text-xl font-bold">{currentPanel.data.title}</h2>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close panel"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>
      </div>
      
      <div className="mb-4">
        <p>{currentPanel.data.description}</p>
      </div>
      
      {/* CALABARZON Panel content */}
      {currentPanel.id === 'CALABARZON' && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Provinces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentPanel.data.provinces.map(province => (
              <button
                key={province}
                onClick={() => handleLocationSelect(province)}
                className="flex items-center p-2 rounded-md hover:bg-blue-50 border border-gray-200 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faLandmark} size="sm" className="mr-2 text-blue-600" />
                {province}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Province Panels content */}
      {['Batangas', 'Cavite', 'Laguna', 'Rizal', 'Quezon'].includes(currentPanel.id) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Municipalities/Cities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
            {currentPanel.data.municipalities.map(municipality => (
              <button
                key={municipality}
                onClick={() => handleMunicipalitySelect(currentPanel.id, municipality)}
                className="flex items-center p-2 rounded-md hover:bg-blue-50 border border-gray-200 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faCity} size="sm" className="mr-2 text-blue-600" />
                {municipality}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Municipality Panel content */}
      {currentPanel.id === 'Santo Tomas' && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Free WiFi Sites</h3>
          <div className="grid grid-cols-1 gap-2">
            {currentPanel.data.wifiSites.map(site => (
              <button
                key={site}
                onClick={() => handleWifiSiteSelect(site)}
                className="flex items-center p-2 rounded-md hover:bg-blue-50 border border-gray-200 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faWifi} size="sm" className="mr-2 text-blue-600" />
                {site}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Show loading state when data is not available */}
      {!currentPanel.data && (
        <div className="flex justify-center items-center p-4">
          <div className="text-center text-gray-500">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent" role="status"></div>
            <p className="mt-2">Loading data...</p>
          </div>
        </div>
      )}
      
      {/* Breadcrumb navigation showing current path */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <nav className="flex text-xs text-gray-500">
          {panelStack.map((panel, index) => (
            <React.Fragment key={panel.id}>
              {index > 0 && <span className="mx-1">/</span>}
              <button 
                onClick={() => {
                  // Navigate to this level in the panel stack
                  handleLocationSelect(panel.id);
                }}
                className="hover:text-blue-600"
              >
                {panel.id}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Details panel component that shows wifi site details
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
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="sm" />
          </button>
          <h2 className="text-xl font-bold">{data.title}</h2>
        </div>
        <button 
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close panel"
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>
      </div>
      
      <div className="mb-4">
        <p>{data.description}</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Details</h3>
        <ul className="space-y-2">
          {Object.entries(data.details || {}).map(([key, value]) => (
            <li key={key} className="flex">
              <span className="font-medium w-32 capitalize">{key}:</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Status indicators */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between mb-2">
          <div className="text-sm">Network Status</div>
          <div className="font-bold text-green-600 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-1"></span>
            Online
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <div className="text-sm text-gray-500">Current Usage</div>
            <div className="font-bold">42 Users</div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div>Last Updated</div>
          <div className="text-gray-600">Today, 10:45 AM</div>
        </div>
      </div>
    </div>
  );
};

// Default card shown when no panels are active
const DefaultCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Sto. Tomas City</h3>
        <div className="text-xs text-gray-500">Pinned as epicenter</div>
      </div>
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="text-xs text-gray-500">AirJan Magnetometer</div>
          <div className="font-bold text-xl">41</div>
        </div>
        <div className="flex gap-2 mb-4">
          <button className="p-1 bg-gray-100 rounded border border-gray-200" aria-label="Show chart">
            <FontAwesomeIcon icon={faChartLine} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200" aria-label="Show list">
            <FontAwesomeIcon icon={faList} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200" aria-label="Download data">
            <FontAwesomeIcon icon={faDownload} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200" aria-label="Share">
            <FontAwesomeIcon icon={faShareAlt} className="text-xs text-gray-700" />
          </button>
          <button className="p-1 bg-gray-100 rounded border border-gray-200" aria-label="More information">
            <FontAwesomeIcon icon={faInfoCircle} className="text-xs text-gray-700" />
          </button>
        </div>
        
        {/* Alert Level */}
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <div className="text-xs text-gray-500">Alert Level</div>
            <div className="font-bold">125</div>
          </div>
        </div>
        
        {/* Displacement Level */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <div className="text-xs text-gray-500">Displacement Level</div>
            <div className="font-bold">25%</div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "25%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// WiFi Sites Card component
const WifiSitesCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 border-b">
        <div className="text-xs text-gray-500">Nearby buildings with threat status</div>
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

// For backward compatibility
const InfoPanels = InfoPanel;

// Export components individually and as a group
export { DetailsPanel, DefaultCard, WifiSitesCard, InfoPanels };

// Export InfoPanel as the default export
export default InfoPanel;