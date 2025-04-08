import React, { useState } from "react";

const citiesData = [
  { 
    city: "Batangas City", 
    locations: 5, 
    sites: 26,
    mayor: "Beverley Rose Musni",
    freeWifiSites: 41,
    digitizationRate: 25,
    siteLocations: [
      { 
        name: "BatStateU - College of Science Building", 
        sites: 11, 
        type: "SU Main",
        address: "Rizal Avenue, Batangas City",
        coordinates: "13.7565° N, 121.0583° E",
        status: "Operational",
        installedDate: "June 15, 2023",
        accessPoints: 4,
        averageUsers: 250,
        bandwidth: "100 Mbps",
        provider: "DICT-UNDP"
      },
      { 
        name: "PUP Sto. Tomas Campus", 
        sites: 11, 
        type: "SU Main",
        address: "National Highway, Sto. Tomas",
        coordinates: "14.1113° N, 121.1528° E",
        status: "Operational",
        installedDate: "July 22, 2023",
        accessPoints: 3,
        averageUsers: 180,
        bandwidth: "50 Mbps",
        provider: "DICT-UNDP"
      },
      { 
        name: "BatStateU - College of Science Building", 
        sites: 11, 
        type: "SU Main",
        address: "Rizal Avenue, Batangas City",
        coordinates: "13.7565° N, 121.0583° E",
        status: "Operational",
        installedDate: "August 5, 2023",
        accessPoints: 4,
        averageUsers: 220,
        bandwidth: "75 Mbps",
        provider: "DICT-UNDP"
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
        name: "BatStateU - College of Science Building", 
        sites: 11, 
        type: "SU Main",
        address: "Rizal Avenue Extension, Sto. Tomas",
        coordinates: "14.0956° N, 121.1234° E",
        status: "Operational",
        installedDate: "May 10, 2023",
        accessPoints: 5,
        averageUsers: 300,
        bandwidth: "120 Mbps",
        provider: "DICT-UNDP"
      },
      { 
        name: "PUP Sto. Tomas Campus", 
        sites: 11, 
        type: "SU Main",
        address: "National Highway, Sto. Tomas",
        coordinates: "14.1113° N, 121.1528° E",
        status: "Operational",
        installedDate: "April 18, 2023",
        accessPoints: 3,
        averageUsers: 210,
        bandwidth: "80 Mbps",
        provider: "DICT-UNDP"
      },
      { 
        name: "BatStateU - College of Science Building", 
        sites: 11, 
        type: "SU Main",
        address: "Rizal Avenue, Sto. Tomas",
        coordinates: "14.0921° N, 121.1456° E",
        status: "Operational",
        installedDate: "June 7, 2023",
        accessPoints: 4,
        averageUsers: 280,
        bandwidth: "100 Mbps",
        provider: "DICT-UNDP"
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

// New component for the site location detail panel (3rd panel)
const SiteLocationDetailPanel = ({ location, onBack }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 
                    w-[390px] max-h-screen rounded-[16px] border border-gray-300 overflow-auto">
      <button 
        onClick={onBack} 
        className="text-blue-500 text-xs mb-2 hover:text-blue-700"
      >
        ← Back
      </button>

      <div className="mt-2">
        <p className="text-xs text-gray-500">Site Location</p>
        <h2 className="text-xl font-bold text-gray-900">{location.name}</h2>
        <p className="text-xs text-gray-500 mt-1">
          {location.address}
        </p>
        <p className="text-xs text-blue-500">
          {location.coordinates}
        </p>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <div className="flex items-center mt-1">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            <p className="text-sm font-semibold text-gray-900">{location.status}</p>
          </div>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-xs text-gray-500">Installed</p>
          <p className="text-sm font-semibold text-gray-900">{location.installedDate}</p>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-xs text-gray-500">Type</p>
          <p className="text-sm font-semibold text-gray-900">{location.type}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-500">Access Points</p>
          <p className="text-xl font-bold text-gray-900">{location.accessPoints}</p>
        </div>
        
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-500">Avg. Daily Users</p>
          <p className="text-xl font-bold text-gray-900">{location.averageUsers}</p>
        </div>
        
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-500">Bandwidth</p>
          <p className="text-xl font-bold text-gray-900">{location.bandwidth}</p>
        </div>
        
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-500">Provider</p>
          <p className="text-xl font-bold text-gray-900">{location.provider}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>
      
      <div className="mt-3">
        <p className="text-xs text-gray-500">Usage Distribution</p>
        <div className="h-32 w-full bg-gray-100 rounded-lg mt-2 flex items-center justify-center">
          <p className="text-gray-400 text-xs">Usage chart placeholder</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-500">Monthly Performance</p>
        <div className="h-32 w-full bg-gray-100 rounded-lg mt-2 flex items-center justify-center">
          <p className="text-gray-400 text-xs">Performance chart placeholder</p>
        </div>
      </div>
    </div>
  );
};

const DetailedCityPanel = ({ city, onBack, onSelectSiteLocation }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 
                    w-[390px] max-h-screen rounded-[16px] border border-gray-300 overflow-auto">
      <button 
        onClick={onBack} 
        className="text-blue-500 text-xs mb-2 hover:text-blue-700"
      >
        ← Back
      </button>

      <div className="mt-2">
        <p className="text-xs text-gray-500">Province of</p>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{city.city}</h2>
          <p className="text-xs text-gray-500">
            Mayor <span className="text-gray-700 font-medium">{city.mayor || 'N/A'}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">No. of Free WIFI sites</p>
          <p className="text-2xl font-semibold text-gray-900">{city.freeWifiSites || 0}</p>
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
        <p className="text-xs text-gray-500">Free WiFi sites location per location types</p>
        <div className="grid grid-cols-6 gap-4 mt-2">
          <div className="flex flex-col items-center w-16">
            <img src="/icons/terminal.svg" alt="Terminal" className="w-7 h-7" />
            <p className="font-bold text-[13px]">20</p>
            <p className="text-gray-500 text-[10px] text-center">Terminals</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/hospital.svg" alt="Hospital" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-red-600">12</p>
            <p className="text-gray-500 text-[10px] text-center">Hospitals</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/fire-station.svg" alt="Fire Station" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-red-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Fire Stations</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/market.svg" alt="Public Market" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-blue-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Public Market</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/school.svg" alt="School" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-orange-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Schools</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/plaza.svg" alt="Plaza" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-green-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Plaza</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Digitization Rate</p>
        <p className="text-xs text-gray-400">(No. of Brgys with WIFI Location / Total no. of Brgys)</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl font-bold text-gray-900">{city.digitizationRate || 0}%</p>
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
          <p className="text-xs text-gray-500">Some locations with Free WIFI sites</p>
          {city.siteLocations.map((location, index) => (
            <div 
              key={index} 
              className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white mt-2 cursor-pointer hover:bg-gray-50 transition duration-150"
              onClick={() => onSelectSiteLocation(location)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Site Location</p>
                  <p className="text-base font-bold text-gray-900">{location.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{location.sites}</p>
                  <p className="text-xs text-gray-500">{location.type} Sites</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">{location.address || 'Address not available'}</p>
                <div className="flex items-center text-blue-500">
                  <span className="text-xs">View details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoPanel = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSiteLocation, setSelectedSiteLocation] = useState(null);

  // If a site location is selected, render the SiteLocationDetailPanel
  if (selectedSiteLocation) {
    return (
      <SiteLocationDetailPanel 
        location={selectedSiteLocation} 
        onBack={() => setSelectedSiteLocation(null)} 
      />
    );
  }

  // If a city is selected, render the DetailedCityPanel
  if (selectedCity) {
    return (
      <DetailedCityPanel 
        city={selectedCity} 
        onBack={() => setSelectedCity(null)} 
        onSelectSiteLocation={(location) => setSelectedSiteLocation(location)}
      />
    );
  }

  // Default view with province-level information and city list
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 
                    w-[390px] max-h-screen rounded-[16px] border border-gray-300 overflow-auto">
      <div className="mt-2">
        <p className="text-xs text-gray-500">Province of</p>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Batangas</h2>
          <p className="text-xs text-gray-500">
            Provincial ID <span className="text-gray-700 font-medium">L3-4335</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">No. of location with Free WIFI sites</p>
          <p className="text-2xl font-semibold text-gray-900">20</p>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-xs text-gray-500">Governor</p>
          <p className="text-base font-semibold text-gray-900">Dodo Mandanas</p>
        </div>
      </div>

      <div className="mt-4 text-xs">
        <p className="font-medium text-gray-600">
          Free WiFi sites location per location types in Batangas
        </p>

        <div className="grid grid-cols-6 gap-4 mt-2">
          <div className="flex flex-col items-center w-16">
            <img src="/icons/terminal.svg" alt="Terminal" className="w-7 h-7" />
            <p className="font-bold text-[13px]">20</p>
            <p className="text-gray-500 text-[10px] text-center">Terminals</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/hospital.svg" alt="Hospital" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-red-600">12</p>
            <p className="text-gray-500 text-[10px] text-center">Hospitals</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/fire-station.svg" alt="Fire Station" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-red-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Fire Stations</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/market.svg" alt="Public Market" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-blue-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Public Market</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/school.svg" alt="School" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-orange-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Schools</p>
          </div>

          <div className="flex flex-col items-center w-16">
            <img src="/icons/plaza.svg" alt="Plaza" className="w-7 h-7" />
            <p className="font-bold text-[13px] text-green-600">3</p>
            <p className="text-gray-500 text-[10px] text-center">Plaza</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Total no. of AP sites in Batangas</p>
        <p className="text-2xl font-bold text-gray-900">125</p>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="mt-2">
        <p className="text-xs text-gray-500">Digitization Rate</p>
        <p className="text-xs text-gray-400">(No. of Brgys with WIFI Location / Total no. of Brgys)</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-2xl font-bold text-gray-900">67%</p>
          <div className="w-full bg-gray-300 rounded-full h-3 relative">
            <div className="bg-blue-500 h-3 rounded-full" style={{ width: "67%" }}></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div>
        <p className="text-xs text-gray-500">Some cities/ Municipalities of Batangas</p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {citiesData.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition duration-150"
              onClick={() => setSelectedCity(item)}
            >
              <p className="text-xs text-gray-500">City</p>
              <p className="text-base font-bold text-gray-900">{item.city}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{item.locations}</p>
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
    </div>
  );
};

export default InfoPanel;