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
        activeAPs: 8,
        inactiveAPs: 3,
        installationDate: "March 15, 2023",
        lastMaintenance: "January 10, 2025",
        averageUsers: 120,
        networkProvider: "DICT"
      },
      { 
        name: "PUP Sto. Tomas Campus", 
        sites: 11, 
        type: "SU Main",
        address: "National Highway, Sto. Tomas",
        coordinates: "14.1109° N, 121.1427° E",
        activeAPs: 9,
        inactiveAPs: 2,
        installationDate: "April 22, 2023",
        lastMaintenance: "February 5, 2025",
        averageUsers: 95,
        networkProvider: "DICT" 
      },
      { 
        name: "BatStateU - College of Science Building", 
        sites: 11, 
        type: "SU Main",
        address: "Rizal Avenue, Batangas City",
        coordinates: "13.7565° N, 121.0583° E",
        activeAPs: 7,
        inactiveAPs: 4,
        installationDate: "March 15, 2023",
        lastMaintenance: "January 10, 2025",
        averageUsers: 110,
        networkProvider: "DICT"
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
        address: "Rizal Avenue, Sto. Tomas",
        coordinates: "14.1109° N, 121.1427° E",
        activeAPs: 8,
        inactiveAPs: 3,
        installationDate: "June 10, 2023",
        lastMaintenance: "December 5, 2024",
        averageUsers: 85,
        networkProvider: "DICT"
      },
      { 
        name: "PUP Sto. Tomas Campus", 
        sites: 11, 
        type: "SU Main",
        address: "National Highway, Sto. Tomas",
        coordinates: "14.1109° N, 121.1427° E",
        activeAPs: 10,
        inactiveAPs: 1,
        installationDate: "May 18, 2023",
        lastMaintenance: "January 22, 2025",
        averageUsers: 130,
        networkProvider: "DICT"
      },
      { 
        name: "BatStateU - College of Science Building", 
        sites: 11, 
        type: "SU Main",
        address: "Rizal Avenue, Sto. Tomas",
        coordinates: "14.1109° N, 121.1427° E",
        activeAPs: 7,
        inactiveAPs: 4,
        installationDate: "July 5, 2023",
        lastMaintenance: "February 15, 2025",
        averageUsers: 90,
        networkProvider: "DICT"
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

// New Component for Site Details (3rd panel)
const SiteDetailsPanel = ({ site, cityName, onBack }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 
                    w-[390px] max-h-screen rounded-[16px] border border-gray-300 overflow-auto">
      <button 
        onClick={onBack} 
        className="text-blue-500 text-xs mb-2 hover:text-blue-700"
      >
        ← Back to {cityName}
      </button>

      <div className="mt-2">
        <p className="text-xs text-gray-500">Site Location</p>
        <h2 className="text-xl font-bold text-gray-900">{site.name}</h2>
        <p className="text-xs text-gray-600 mt-1">{site.address}</p>
        <p className="text-xs text-gray-500 mt-1">Coordinates: {site.coordinates}</p>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">No. of APs</p>
          <p className="text-2xl font-semibold text-gray-900">{site.sites}</p>
        </div>

        <div className="w-px h-10 bg-gray-200"></div>

        <div>
          <p className="text-xs text-gray-500">Connectivity Status</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium text-gray-900">Active</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Access Point Status</p>
        <div className="flex mt-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">{site.activeAPs}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Active</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold">{site.inactiveAPs}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Inactive</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Installation Date</p>
          <p className="text-sm font-medium text-gray-900">{site.installationDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Last Maintenance</p>
          <p className="text-sm font-medium text-gray-900">{site.lastMaintenance}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500">Average Daily Users</p>
        <p className="text-2xl font-semibold text-gray-900">{site.averageUsers}</p>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${(site.averageUsers / 150) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      <div>
        <p className="text-xs text-gray-500">Network Provider</p>
        <p className="text-base font-semibold text-gray-900">{site.networkProvider}</p>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-500">Site Type</p>
        <div className="flex items-center gap-2 mt-1">
          <img src="/icons/school.svg" alt="School" className="w-5 h-5" />
          <p className="text-sm font-medium text-gray-900">{site.type}</p>
        </div>
      </div>
    </div>
  );
};

const DetailedCityPanel = ({ city, onBack, onSiteClick }) => {
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
              className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white mt-2 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onSiteClick(location)}
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
              <div className="flex items-center justify-end mt-1">
                <span className="text-xs text-blue-500">View details</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
  const [selectedSite, setSelectedSite] = useState(null);

  // If a site is selected, render the SiteDetailsPanel (3rd panel)
  if (selectedSite && selectedCity) {
    return (
      <SiteDetailsPanel 
        site={selectedSite} 
        cityName={selectedCity.city}
        onBack={() => setSelectedSite(null)} 
      />
    );
  }

  // If a city is selected, render the DetailedCityPanel (2nd panel)
  if (selectedCity) {
    return (
      <DetailedCityPanel 
        city={selectedCity} 
        onBack={() => setSelectedCity(null)}
        onSiteClick={(site) => setSelectedSite(site)}
      />
    );
  }

  // Default view with province-level information and city list (1st panel)
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
              className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white cursor-pointer hover:bg-gray-100 transition-colors"
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