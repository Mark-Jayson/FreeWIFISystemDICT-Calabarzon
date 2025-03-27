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
      { name: "BatStateU - College of Science Building", sites: 11, type: "SU Main" },
      { name: "PUP Sto. Tomas Campus", sites: 11, type: "SU Main" },
      { name: "BatStateU - College of Science Building", sites: 11, type: "SU Main" }
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
      { name: "BatStateU - College of Science Building", sites: 11, type: "SU Main" },
      { name: "PUP Sto. Tomas Campus", sites: 11, type: "SU Main" },
      { name: "BatStateU - College of Science Building", sites: 11, type: "SU Main" }
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

const DetailedCityPanel = ({ city, onBack }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 
                    w-[390px] max-h-screen rounded-[16px] border border-gray-300 overflow-hidden">
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
              className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white mt-2"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoPanel = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  // If a city is selected, render the DetailedCityPanel
  if (selectedCity) {
    return (
      <DetailedCityPanel 
        city={selectedCity} 
        onBack={() => setSelectedCity(null)} 
      />
    );
  }

  // Default view with province-level information and city list
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white shadow-lg p-4 
                    w-[390px] max-h-screen rounded-[16px] border border-gray-300 overflow-hidden">
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
              className="p-4 border border-gray-300 rounded-xl shadow-sm bg-white cursor-pointer hover:bg-gray-100"
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