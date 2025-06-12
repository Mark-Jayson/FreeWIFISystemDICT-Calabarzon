import React, { useState, useEffect } from 'react';
import LocationInfoPanel from "./LocationInfoPanel";
import congressionalDistricts from "../../data/congressional-district.json";
import governorAndMayors from "../../data/govrmayr.json";

const CityInfoPanel = ({ cityData, onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mayor, setMayor] = useState('N/A');

  // Default values in case some data is missing
  const {
    name = 'Sto. Tomas City',
    provinceName = 'Batangas',
    totalSites = 41,
    totalAPSites = 125,
    digitizationRate = 25,
    siteTypes = [
      { type: "School", count: 20 },
      { type: "Hospital", count: 12 },
      { type: "Fire Station", count: 3 },
      { type: "Public Market", count: 7 },
      { type: "Barangay", count: 15 },
      { type: "Park", count: 6 }
    ],
    freeWifiLocations = [
      {
        name: "BatState - College of Science Building",
        type: "School",
        sites: 11,
        location: "Batangas State University - Alangilan",
        locID: "L3-4335",
        category: "SUCs",
        address: "0234 Mababang Parang, Batangas City, Batangas",
        congressional: "IV",
        latitude: "12.8797",
        longitude: "16.8797",
        technology: "LEO",
        procurement: "Central",
        cmsProvider: "HTECH Inc.",
        linkProvider: "Converge Technologies",
        bandwidth: "30 MB/S",
        project: "DICT Calabarzon",
        contractStatus: "Active",
        activationDate: "January 3, 2022",
        endOfContract: "March 30, 2028",
        apSites: [
          { name: "BatStateU Building 1", technology: "LEO", status: "Active" },
          { name: "BatStateU Building 2", technology: "LEO", status: "Active" },
          { name: "BatStateU Building 3", technology: "LEO", status: "Active" },
          { name: "BatStateU Building 4", technology: "LEO", status: "Active" }
        ]
      },
      {
        name: "PUP Sto. Tomas Campus",
        type: "School",
        sites: 11,
        location: "PUP Sto. Tomas",
        locID: "L3-4336",
        category: "SUCs",
        address: "National Highway, Sto. Tomas, Batangas",
        congressional: "IV",
        latitude: "14.1234",
        longitude: "121.1456",
        technology: "VSAT",
        procurement: "Regional",
        cmsProvider: "HTECH Inc.",
        linkProvider: "PLDT",
        bandwidth: "50 MB/S",
        project: "DICT Calabarzon",
        contractStatus: "Active",
        activationDate: "June 15, 2022",
        endOfContract: "June 15, 2025",
        apSites: [
          { name: "PUP Main Building", technology: "VSAT", status: "Active" },
          { name: "PUP Library", technology: "VSAT", status: "Active" },
          { name: "PUP Gymnasium", technology: "VSAT", status: "Active" }
        ]
      },
      {
        name: "Sto. Tomas Public Library",
        type: "Public",
        sites: 6,
        location: "Sto. Tomas City Center",
        locID: "L3-4337",
        category: "LGU",
        address: "City Hall Complex, Sto. Tomas, Batangas",
        congressional: "IV",
        latitude: "14.0987",
        longitude: "121.2345",
        technology: "Fiber",
        procurement: "Local",
        cmsProvider: "DICT",
        linkProvider: "Globe Telecom",
        bandwidth: "100 MB/S",
        project: "DICT Calabarzon",
        contractStatus: "Active",
        activationDate: "November 20, 2021",
        endOfContract: "November 20, 2024",
        apSites: [
          { name: "Library Main Hall", technology: "Fiber", status: "Active" },
          { name: "Reading Room", technology: "Fiber", status: "Active" },
          { name: "Computer Laboratory", technology: "Fiber", status: "Active" }
        ]
      }
    ]
  } = cityData || {};

useEffect(() => {
  // Find the province in the governorAndMayors data
  const provinceData = governorAndMayors[provinceName];

  if (provinceData) {
    let foundMayor = 'N/A';
    if (Array.isArray(provinceData)) { // For provinces like Batangas, Cavite, Laguna, Quezon
      const mayorEntry = provinceData.find(entry =>
        entry.Municipalities === name || entry.Municipalities === name.replace('City of ', '')
      );

      if (mayorEntry) {
        foundMayor = mayorEntry.Mayor;
      }
    } else if (provinceName === "Rizal") { // Special handling for Rizal structure
      const mayorEntry = provinceData.Municipalities.find(entry =>
        entry.Municipality === name || entry.Municipality === name.replace('City of ', '')
      );

      if (mayorEntry) {
        foundMayor = mayorEntry.Mayor;
      }
    }
    setMayor(foundMayor);
  }
}, [name, provinceName]);


const handleLocationClick = (location) => {
  setSelectedLocation(location);
};

const handleBackToCity = () => {
  setSelectedLocation(null);
};

return (
  <>
    <div className="fixed top-[108px] right-4 bg-white rounded-lg shadow-lg w-80 z-50 max-h-[75vh] flex flex-col">
      <div className="p-4 pb-0 relative border-b border-gray-100">
        <button
          onClick={onBack}
          className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="mb-3 mt-3 pl-6">
          <div className="text-xs text-gray-500">Province of {provinceName}</div>
          <h2 className="text-2xl font-bold">{name}</h2>

          <div className="flex justify-between mt-3 bg-gray-50 rounded-lg">
            <div className="flex-1 p-2">
              <div className="text-xs text-gray-500">Total no. of</div>
              <div className="text-xs text-gray-500">Free WiFi sites</div>
              <div className="text-2xl font-bold">{totalSites}</div>
            </div>

            <div className="flex-1 p-2">
              <div className="text-xs text-gray-500">Mayor</div>
              <div className="text-sm font-medium">{mayor}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-3">
        <div className="text-xs text-gray-500 mb-2">Free WiFi sites location per location types in {name}:</div>

        <div className="flex justify-between mb-4">
          {siteTypes.slice(0, 6).map((site, index) => {
            const getIconPath = (type) => {
              const typeMap = {
                "School": new URL('../assets/School.png', import.meta.url).href,
                "Hospital": new URL('../assets/Hospital.png', import.meta.url).href,
                "Fire Station": new URL('../assets/Firestation.png', import.meta.url).href,
                "Public Market": new URL('../assets/Shop.png', import.meta.url).href,
                "Barangay": new URL('../assets/Jeep.png', import.meta.url).href,
                "Park": new URL('../assets/Playground.png', import.meta.url).href
              };
              return typeMap[type] || defaultIcon;
            };

            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '16%' }}>
                <div className="w-8 h-8 mb-1 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
                  <img
                    src={getIconPath(site.type)}
                    alt={site.type}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="text-xs font-bold text-center">{site.count}</div>
                <div className="text-xs text-gray-500 text-center" style={{ fontSize: "0.65rem" }}>
                  {site.type.includes(' ') ? site.type.split(' ')[0] : site.type}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-gray-500">Total no. of AP sites<br />in {provinceName}</div>
          <div className="text-4xl font-bold">{totalAPSites}</div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div className="text-xs text-gray-500">Digitization Rate<br />No. of Brgy with WiFi Location / Total no. of Brgys</div>
            <div className="text-lg font-bold">{digitizationRate}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${digitizationRate}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4 border-t border-gray-200 pt-3">
          <div className="text-sm text-gray-500 mb-3">Some locations with Free WiFi Sites</div>

          {freeWifiLocations.map((location, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 mb-3 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => handleLocationClick(location)}
            >
              <div className="text-xs text-gray-500">Site Location</div>
              <div className="text-sm font-medium mb-2">{location.name}</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-orange-500 rounded-full p-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">{location.sites} AP Sites</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}</style>
    </div>

    {selectedLocation && (
      <LocationInfoPanel locationData={selectedLocation} onBack={handleBackToCity} />
    )}
  </>
);
};

export default CityInfoPanel;