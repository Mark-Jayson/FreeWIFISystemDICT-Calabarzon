import React, { useState } from "react";

const citiesData = [
  { 
    city: "Batangas City", 
    locations: 3, 
    sites: 26,
    mayor: "Beverley Rose Dimacuha",
    freeWifiSites: 41,
    digitizationRate: 25,
    siteLocations: [
      {
        name: "BatStateU - College of Science Building", 
        sites: 4, 
        type: "SUC Main",
        locID: "L3-4335",
        address: "Kumintang Ilaya, Brgy. Alangilan, Batangas City, BATANGAS",
        flcacArea: true,
        notCIDA: true,
        apSites: [
          {
            name: "BatStateU - College of Science Building",
            status: "active",
            led: "LED",
            mbps: 30,
            location: "Batangas State University - Alangilan",
            technology: "LED",
            procurement: "Central",
            cmsProvider: "HTECH Inc.",
            linkProvider: "Converge Technologies",
            bandwidth: "30 MB/S",
            project: "DICT Calabarzon",
            contractStatus: "Active",
            activationDate: "January 3, 2022",
            endOfContract: "March 30, 2028"
          }
        ]
      },
      { 
        name: "Batangas State University - Alangilan", 
        sites: 4, 
        type: "SUC Main",
        locID: "L3-4335",
        address: "Kumintang Ilaya, Brgy. Alangilan, Batangas City, BATANGAS",
        flcacArea: true,
        notCIDA: true,
        apSites: [
          {
            name: "BatStateU - College of Engineering Building",
            status: "active",
            led: "LED",
            mbps: 30
          }
        ]
      }
    ]
  },
  {
    city: "Sto. Tomas", 
    locations: 5, 
    sites: 26,
    mayor: "Art Jun Malapitan",
    freeWifiSites: 41,
    digitizationRate: 25,
    siteLocations: [
      { 
        name: "PUP Sto. Tomas Campus", 
        sites: 5, 
        type: "SUC Main",
        locID: "L3-4338",
        address: "National Highway, Sto. Tomas, BATANGAS",
        flcacArea: false,
        notCIDA: true,
        apSites: [
          {
            name: "PUP Admin Building",
            status: "active",
            led: "LED",
            mbps: 30
          }
        ]
      },
      { 
        name: "Sto. Tomas Municipal Hall", 
        sites: 2, 
        type: "Gov't Office",
        locID: "L3-4339",
        address: "Municipal Road, Sto. Tomas, BATANGAS",
        flcacArea: true,
        notCIDA: true,
        apSites: [
          {
            name: "Main Hall",
            status: "active",
            led: "LED",
            mbps: 30
          }
        ]
      }
    ]
  },
  {
    city: "Tanauan City", 
    locations: 5, 
    sites: 26,
    mayor: "N/A",
    freeWifiSites: 0,
    digitizationRate: 0
  },
  {
    city: "Mataas na Kahoy", 
    locations: 5, 
    sites: 26,
    mayor: "N/A",
    freeWifiSites: 0,
    digitizationRate: 0
  },
];

// Modified to be positioned beside the third panel instead of overlapping
const APSiteDetailsModal = ({ apSite, onClose, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-80 h-max border border-gray-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${apSite.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="text-lg font-bold">AP Site Details</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500">Site Name</p>
          <p className="text-sm font-medium">{apSite.name || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm font-medium">{apSite.location || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Technology</p>
          <p className="text-sm font-medium">{apSite.technology || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Bandwidth</p>
          <p className="text-sm font-medium">{apSite.bandwidth || `${apSite.mbps} Mbps` || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">CMS Provider</p>
          <p className="text-sm font-medium">{apSite.cmsProvider || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Link Provider</p>
          <p className="text-sm font-medium">{apSite.linkProvider || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Project</p>
          <p className="text-sm font-medium">{apSite.project || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Contract Status</p>
          <p className="text-sm font-medium">{apSite.contractStatus || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">Activation Date</p>
          <p className="text-sm font-medium">{apSite.activationDate || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">End of Contract</p>
          <p className="text-sm font-medium">{apSite.endOfContract || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button 
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Site Details Panel (3rd panel)
const SiteDetailsPanel = ({ site, cityName, onBack }) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [selectedAPSite, setSelectedAPSite] = useState(null);
  
  return (
    <div className="flex space-x-4">
      <div className="bg-white shadow-lg p-4 w-80 rounded-lg border border-gray-300 h-max">
        <button 
          onClick={onBack} 
          className="text-blue-500 text-xs mb-2 hover:text-blue-700"
        >
          ← Back to {cityName}
        </button>

        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-500">Site Location</p>
            <h2 className="text-xl font-bold text-gray-900">{site.name}</h2>
          </div>
          <div className="bg-orange-100 px-2 py-1 rounded text-orange-600 text-sm flex items-center">
            <span>{site.type}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 items-center mb-1">
            <p className="text-xs text-gray-500">Loc ID</p>
            <p className="text-xs font-medium text-gray-800">{site.locID}</p>
            
            {site.flcacArea && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                FLCAC Area
              </span>
            )}
            
            {site.notCIDA && (
              <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded">
                Not CIDA
              </span>
            )}
          </div>
          
          <div className="mb-2">
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm text-gray-800">{site.address}</p>
          </div>
          
          <button 
            onClick={() => setExpandedDetails(!expandedDetails)}
            className="text-xs text-blue-500 flex items-center"
          >
            More details {expandedDetails ? "↑" : "↓"}
          </button>
        </div>
        
        {expandedDetails && (
          <div className="mt-2 border-t border-gray-200 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Installation Date</p>
                <p className="text-sm font-medium text-gray-900">March 15, 2023</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Maintenance</p>
                <p className="text-sm font-medium text-gray-900">January 10, 2025</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 my-3"></div>
        
        <div>
          <p className="text-base font-semibold text-gray-900 mb-2">{site.sites} WIFI Sites</p>
          
          {site.apSites.map((apSite, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-3 mb-2"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">AP Site Name</p>
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${apSite.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className="text-sm font-medium">{apSite.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-600">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs">
                    <span className="font-bold">{apSite.mbps}</span> <span className="text-gray-500">Mbps</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  className="text-xs text-blue-500"
                  onClick={() => selectedAPSite === apSite ? setSelectedAPSite(null) : setSelectedAPSite(apSite)}
                >
                  {selectedAPSite === apSite ? "Hide details ↑" : "See more ↓"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <APSiteDetailsModal 
        apSite={selectedAPSite} 
        onClose={() => setSelectedAPSite(null)} 
        isVisible={!!selectedAPSite}
      />
    </div>
  );
};

// Detailed City Panel (2nd panel)
const DetailedCityPanel = ({ city, onBack, onSiteClick }) => {
  return (
    <div className="bg-white shadow-lg p-4 w-80 rounded-lg border border-gray-300 h-max">
      <button 
        onClick={onBack} 
        className="text-blue-500 text-xs mb-2 hover:text-blue-700"
      >
        ← Back
      </button>

      <div className="mt-2">
        <p className="text-xs text-gray-500">Province of</p>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{city.city}</h2>
          <p className="text-xs text-gray-500">
            Mayor <span className="text-gray-700 font-medium">{city.mayor || 'N/A'}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">No. of Free WIFI sites</p>
          <p className="text-xl font-semibold text-gray-900">{city.freeWifiSites || 0}</p>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-xs text-gray-500">Location types</p>
          <div className="flex gap-2">
            <img src="/icons/terminal.svg" alt="Terminal" className="w-5 h-5" />
            <img src="/icons/hospital.svg" alt="Hospital" className="w-5 h-5" />
            <img src="/icons/fire-station.svg" alt="Fire Station" className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">WiFi sites per type</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col items-center">
            <img src="/icons/terminal.svg" alt="Terminal" className="w-6 h-6" />
            <p className="font-bold text-xs">20</p>
            <p className="text-gray-500 text-xs text-center">Terminals</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Digitization Rate</p>
        <p className="text-xs text-gray-400">(Brgys with WIFI / Total Brgys)</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xl font-bold text-gray-900">{city.digitizationRate || 0}%</p>
          <div className="w-full bg-gray-300 rounded-full h-3 relative">
            <div 
              className="bg-blue-500 h-3 rounded-full" 
              style={{ width: `${city.digitizationRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      {city.siteLocations && (
        <div>
          <p className="text-xs text-gray-500">Locations with Free WIFI sites</p>
          <div className="space-y-2 mt-2 max-h-64 overflow-y-auto pr-1">
            {city.siteLocations.map((location, index) => (
              <div 
                key={index} 
                className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onSiteClick(location)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Site Location</p>
                    <p className="text-sm font-bold text-gray-900">{location.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-900">{location.sites}</p>
                    <p className="text-xs text-gray-500">Sites</p>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-1">
                  <span className="text-xs text-blue-500">View details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Province Information Panel (1st panel)
const ProvincePanel = ({ onCityClick }) => {
  return (
    <div className="bg-white shadow-lg p-4 w-80 rounded-lg border border-gray-300 h-max">
      <div className="mt-2">
        <p className="text-xs text-gray-500">Province of</p>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Batangas</h2>
          <p className="text-xs text-gray-500">
            Provincial ID <span className="text-gray-700 font-medium">L3-4335</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Locations with Free WIFI</p>
          <p className="text-xl font-semibold text-gray-900">20</p>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-xs text-gray-500">Governor</p>
          <p className="text-sm font-semibold text-gray-900">Dodo Mandanas</p>
        </div>
      </div>

      <div className="mt-4 text-xs">
        <p className="font-medium text-gray-600">
          WiFi sites by type in Batangas
        </p>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col items-center">
            <img src="/icons/terminal.svg" alt="Terminal" className="w-6 h-6" />
            <p className="font-bold text-xs">20</p>
            <p className="text-gray-500 text-xs text-center">Terminals</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Total AP sites in Batangas</p>
        <p className="text-xl font-bold text-gray-900">125</p>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="mt-2">
        <p className="text-xs text-gray-500">Digitization Rate</p>
        <p className="text-xs text-gray-400">(Brgys with WIFI / Total Brgys)</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xl font-bold text-gray-900">67%</p>
          <div className="w-full bg-gray-300 rounded-full h-3 relative">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: "67%" }}></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div>
        <p className="text-xs text-gray-500">Cities/Municipalities of Batangas</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {citiesData.map((item, index) => (
            <div
              key={index}
              className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onCityClick(item)}
            >
              <p className="text-xs text-gray-500">City</p>
              <p className="text-sm font-bold text-gray-900 truncate">{item.city}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{item.locations}</p>
                  <p className="text-xs text-gray-500">Loc</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{item.sites}</p>
                  <p className="text-xs text-gray-500">Sites</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Info Panel Component
const InfoPanel = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  // Create a cascading panel system
  return (
    <div className="fixed right-0 top-0 h-screen flex items-center pr-4 pl-4 overflow-x-auto">
      <div className="flex space-x-4 items-start py-4">
        {/* Always show the province panel */}
        <ProvincePanel onCityClick={setSelectedCity} />
        
        {/* Conditionally show city panel */}
        {selectedCity && (
          <DetailedCityPanel 
            city={selectedCity} 
            onBack={() => {
              setSelectedCity(null);
              setSelectedSite(null);
            }}
            onSiteClick={setSelectedSite}
          />
        )}
        
        {/* Conditionally show site panel with AP site modal */}
        {selectedSite && selectedCity && (
          <SiteDetailsPanel 
            site={selectedSite} 
            cityName={selectedCity.city}
            onBack={() => setSelectedSite(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default InfoPanel;