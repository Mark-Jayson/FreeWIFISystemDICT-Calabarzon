import React, { useState, useEffect } from "react";

const citiesData = [
  { 
    city: "Batangas City", 
    locations: 3, 
    sites: 26,
    mayor: "Beverley Rose Dimacuha",
    freeWifiSites: 41,
    digitizationRate: 25,
    siteLocations: [
      { //eto yung nasa labas (1st panel)
        name: "BatStateU - College of Science Building", 
        sites: 4, 
        type: "SUC Main",
        locID: "L3-4335",
        address: "Kumintang Ilaya, Brgy. Alangilan, Batangas City, BATANGAS",
        flcacArea: true,
        notCIDA: true,
        apSites: [
           {//2nd panel na from here
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
  { //eto yung nasa labas (1st panel)
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
          },
          {
            name: "Frontdesk",
            status: "active",
            led: "LED",
            mbps: 30
          }
        ]
      }
    ]
  },
  { //eto yung nasa labas (1st panel)
    city: "Tanauan City", 
    locations: 5, 
    sites: 26,
    mayor: "N/A",
    freeWifiSites: 0,
    digitizationRate: 0
  },
  { //eto yung nasa labas (1st panel)
    city: "Mataas na Kahoy", 
    locations: 5, 
    sites: 26,
    mayor: "N/A",
    freeWifiSites: 0,
    digitizationRate: 0
  },
];

const PanelWrapper = ({ children, className = "", isActive }) => (
  <div className={`
    bg-white shadow-lg p-4 w-full h-full max-w-md mx-auto rounded-lg border border-gray-300 
    flex flex-col transition-all duration-300 ease-in-out
    ${isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0 absolute top-0 left-0 right-0'}
    ${className}
  `}>
    {children}
  </div>
);
// AP Site Info Panel (4th panel)
const APSiteInfoPanel = ({ apSite, onBack, isActive }) => {
  return (
    <PanelWrapper isActive={isActive}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 " >
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          <h3 className="text-lg font-bold">{apSite?.name || "AP Site Name"}</h3>
        </div>
        <div className="bg-purple-100 p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-600">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>
            
      <div className="p-4 border-t border-gray-200 flex justify-end">
        <button onClick={onBack} className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
          Close
        </button>
      </div>
    </PanelWrapper>
  );
};

// Site Details Panel (3rd panel)
const SiteDetailsPanel = ({ site, cityName, onBack, onAPSiteClick, isActive }) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  
  return (
    <PanelWrapper isActive={isActive}>
      <button 
        onClick={onBack} 
        className="text-blue-500 text-xs mb-2 hover:text-blue-700 flex items-center"
      >
        ← Back to {cityName || "City"}
      </button>
      
      <div className="mt-2 flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Site Location</p>
          <h2 className="text-xl font-bold text-gray-900 break-words">{site.name}</h2>
        </div>
        <div className="bg-orange-100 px-2 py-1 rounded text-orange-600 text-sm flex items-center shrink-0 ml-2">
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
      
      <div className="flex-grow overflow-y-auto pr-1">
        <p className="text-base font-semibold text-gray-900 mb-2">{site.sites} WIFI Sites</p>
        
        {site.apSites && site.apSites.map((apSite, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-50"
            onClick={() => onAPSiteClick(apSite)}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">AP Site Name</p>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${apSite.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm font-medium">{apSite.name}</p>
                </div>
              </div>
              <div className="flex items-center shrink-0 ml-2">
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
              <span className="text-xs text-blue-500 flex items-center">
                View details 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
      
    </PanelWrapper>
  );
};

// Detailedd City Panel (2nd panel)
const DetailedCityPanel = ({ city, onBack, onSiteClick, isActive }) => {
  return (
    <PanelWrapper isActive={isActive}>
      <div className="flex items-center mb-2">
        <button 
          onClick={onBack} 
          className="text-blue-500 text-xs hover:text-blue-700 flex items-center"
        >
          ← Back
        </button>
        <div className="flex-grow"></div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-500">City</p>
            <h2 className="text-xl font-bold text-gray-900">{city.city}</h2>
          </div>
          <div>
            <p className="text-xs text-gray-500">Province of</p>
            <p className="text-xs text-gray-700 text-right">Batangas</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">No. of location with</p>
          <p className="text-xs text-gray-500">Free WiFi sites</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">41</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Mayor</p>
          <p className="text-sm font-medium text-gray-900">Art Jun Malapitan</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">Free WiFi sites location per location types in Batangas</p>
        
    
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total no. of AP sites</p>
            <p className="text-xs text-gray-500">in {city.city}</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{city.freeWifiSites || 0}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Digitization Rate</p>
        <p className="text-xs text-gray-400">(No. of Brgys with WIFI Location / Total no. of Brgy)</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xl font-bold text-gray-900">{city.digitizationRate || 0}%</p>
          <div className="w-full bg-gray-200 rounded-full h-3 relative">
            <div 
              className="bg-blue-500 h-3 rounded-full" 
              style={{ width: `${city.digitizationRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="flex-grow overflow-y-auto pr-1">
        <p className="text-xs text-gray-500">Some locations with Free WiFi sites</p>
        <div className="space-y-2 mt-2">
          {city.siteLocations && city.siteLocations.map((location, index) => (
            <div 
              key={index} 
              className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSiteClick(location)}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Site Location</p>
                  <p className="text-sm font-medium text-gray-900">{location.name}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="font-bold text-lg">{location.sites}</span>
                    <span className="text-xs text-gray-500 ml-1">Sites</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs text-blue-500 flex items-center">
                  View details 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelWrapper>
  );
};

// Province Info Panel (1st panel)
const ProvincePanel = ({ onCityClick, isActive }) => {
  return (
    <PanelWrapper isActive={isActive} className="bg-white rounded-lg shadow-lg w-full">
      <div className="pt-1">
        <p className="text-xs text-gray-500">Province of</p>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Batangas</h2>
          <div className="text-xs text-gray-500">
            Provincial ID <span className="text-gray-700 font-medium">L3-4335</span>
          </div>
        </div>
      </div>

      

      <div className="border-t border-gray-200 my-3"></div>

      <div>
        <p className="text-xs text-gray-500 mb-2">Some cities/Municipalities of Batangas</p>
        <div className="grid grid-cols-2 gap-2">
          {citiesData.map((item, index) => (
            <div
              key={index}
              className="p-2 border border-gray-200 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onCityClick(item)}
            >
              <p className="text-xs text-gray-500">City</p>
              <p className="text-sm font-medium text-gray-900 mb-2">{item.city}</p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-900">{item.locations}</p>
                  <p className="text-xs text-gray-500">Locations</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{item.sites}</p>
                  <p className="text-xs text-gray-500">Sites</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelWrapper>
  );
};

// Main Info Panel Component
const InfoPanel = () => {
  const [activePanel, setActivePanel] = useState("province"); // province, city, site, apSite
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedAPSite, setSelectedAPSite] = useState(null);
  const [panelHistory, setPanelHistory] = useState(["province"]);

  // city selection
  const handleCityClick = (city) => {
    setSelectedCity(city);
    setActivePanel("city");
    setPanelHistory([...panelHistory, "city"]);
  };

  // site selection
  const handleSiteClick = (site) => {
    setSelectedSite(site);
    setActivePanel("site");
    setPanelHistory([...panelHistory, "site"]);
  };

  // AP site selection
  const handleAPSiteClick = (apSite) => {
    setSelectedAPSite(apSite);
    setActivePanel("apSite");
    setPanelHistory([...panelHistory, "apSite"]);
  };

  //back button from city panel
  const handleCityBack = () => {
    setActivePanel("province");
    setPanelHistory(panelHistory.slice(0, -1));
  };

  //back button from site panel
  const handleSiteBack = () => {
    setActivePanel("city");
    setPanelHistory(panelHistory.slice(0, -1));
  };

  //back button from AP site panel
  const handleAPSiteBack = () => {
    setActivePanel("site");
    setPanelHistory(panelHistory.slice(0, -1));
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md h-full p-4 relative">
        <ProvincePanel 
          onCityClick={handleCityClick} 
          isActive={activePanel === "province"} 
        />
        
        {selectedCity && (
          <DetailedCityPanel 
            city={selectedCity} 
            onBack={handleCityBack}
            onSiteClick={handleSiteClick}
            isActive={activePanel === "city"}
          />
        )}
        
        {selectedSite && (
          <SiteDetailsPanel 
            site={selectedSite} 
            cityName={selectedCity?.city}
            onBack={handleSiteBack}
            onAPSiteClick={handleAPSiteClick}
            isActive={activePanel === "site"}
          />
        )}
        
        {selectedAPSite && (
          <APSiteInfoPanel 
            apSite={selectedAPSite}
            onBack={handleAPSiteBack}
            isActive={activePanel === "apSite"}
          />
        )}
      </div>
    </div>
  );
};

export default InfoPanel;