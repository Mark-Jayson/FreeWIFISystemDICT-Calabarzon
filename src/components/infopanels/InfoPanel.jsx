import React, { useState, useEffect } from 'react';
import CityInfoPanel from "./CityInfoPanel";
import congressionalDistricts from "../../data/congressional-district.json";
import governorAndMayors from "../../data/govrmayr.json";


const InfoPanel = ({ searchQuery, panelData, onClose, onCityClick }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [provinceData, setProvinceData] = useState(null);
  const [governorName, setGovernorName] = useState('');

  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      setProvinceData(panelData);
      setShowPanel(true);


      console.log('Received panelData:', panelData);
      console.log('City click', onCityClick);

      if (panelData?.provinceName) {
        // FIX: Changed from govMayorsData to governorAndMayors
        const provinceInfo = governorAndMayors[panelData.provinceName];
        console.log('Province Info from JSON:', provinceInfo);

        if (provinceInfo) {
          if (Array.isArray(provinceInfo)) {
            console.log('Governor from array:', provinceInfo[0]?.Governor);
            setGovernorName(provinceInfo[0]?.Governor || 'N/A');
          } else if (typeof provinceInfo === 'object' && provinceInfo !== null) {
            console.log('Governor from object:', provinceInfo.Governor);
            setGovernorName(provinceInfo.Governor || 'N/A');
          } else {
            setGovernorName('N/A');
          }
        } else {
          setGovernorName('N/A');
        }
      }
    }
  }, [searchQuery, panelData]);

  const handleClosePanel = () => {
    setShowPanel(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCityClick = (city) => {
    if (onCityClick) {
      onCityClick(city);
      console.log('City clicked:', city);
    }
  };

  if (!showPanel) return null;

  return (
    <div className="fixed top-[108px] right-4 bg-white rounded-lg shadow-lg w-80 z-50 max-h-[75vh] flex flex-col">
      <div className="p-4 pb-0 relative border-b border-gray-100">
        <button
          onClick={handleClosePanel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-3">
          <div className="text-xs text-gray-500">Province of</div>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl font-bold">{provinceData?.provinceName}</h2>
            <div className="text-right">
              <div className="text-xs text-gray-500">Provincial ID</div>
              <div className="text-sm font-medium">{provinceData?.provincialID}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-3">
        <div className="flex border-t border-b border-gray-200 my-2">
          <div className="w-1/2 py-3 pr-3">
            <div className="text-xs text-gray-500">No. of location with<br />Free WiFi sites</div>
            <div className="text-4xl font-bold mt-1">{provinceData?.freeWiFiSites}</div>
          </div>
          <div className="w-1/2 py-3 pl-3 border-l border-gray-200">
            <div className="text-xs text-gray-500">Governor</div>
            <div className="font-medium mt-1">{governorName}</div> {/* Display the governor's name here */}
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-2">Free WiFi sites location per location types in {provinceData?.provinceName}:</div>

        <div className="flex justify-between mb-4">
          {provinceData?.siteTypes.slice(0, 6).map((site, index) => {
            const getIconPath = (type) => {
              const typeMap = {
                "Municipal": new URL('../assets/Jeep.png', import.meta.url).href,
                "Hospitals": new URL('../assets/Hospital.png', import.meta.url).href,
                "Fire Stations": new URL('../assets/Firestation.png', import.meta.url).href,
                "Public Market": new URL('../assets/Shop.png', import.meta.url).href,
                "Schools": new URL('../assets/School.png', import.meta.url).href,
                "Parks": new URL('../assets/Playground.png', import.meta.url).href
              };

              // Normalize type for comparison (e.g., case-insensitive)
              const matchedKey = Object.keys(typeMap).find(key =>
                key.toLowerCase() === type.toLowerCase()
              );

              return matchedKey ? typeMap[matchedKey] : new URL('../assets/default.png', import.meta.url).href;
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
                  {site.type.length > 10 ? site.type.split(' ')[0] : site.type}
                </div>
              </div>
            );
          })}



        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-gray-500">Total no. of AP sites<br />in {provinceData?.provinceName}</div>
          <div className="text-4xl font-bold">{provinceData?.totalAPSites}</div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div className="text-xs text-gray-500">Digitization Rate<br />No. of Brgy with WiFi Location / Total no. of Brgys</div>
            <div className="text-lg font-bold">{provinceData?.digitizationRate}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${provinceData?.digitizationRate}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4 border-t border-gray-200 pt-3">
          <div className="text-sm text-gray-500 mb-3">Cities/Municipalities with Free WiFi Sites</div>

          {panelData.cities.map((city, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 mb-3 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => handleCityClick(city.locality)}
            >
              <div className="text-xs text-gray-500">City/Municipality</div>
              <div className="text-sm font-medium mb-2">{city.locality}</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full p-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-1-8h1m-1 4h1" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">{city.locality} WiFi Sites</div>
                </div>
                <div className="text-xs text-gray-400">Click to view</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
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
  );
};

export default InfoPanel;