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
    <div className="fixed top-[108px] right-4 rounded-lg shadow-lg w-80 z-50 max-h-[75vh] flex flex-col" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div className="p-4 pb-0 relative border-b" style={{ borderColor: 'rgb(243, 244, 246)' }}>
        <button 
          onClick={handleClosePanel} 
          className="absolute top-2 right-2 hover:text-gray-600 z-10"
          style={{ color: 'rgb(156, 163, 175)' }}
          onMouseEnter={(e) => e.target.style.color = 'rgb(75, 85, 99)'}
          onMouseLeave={(e) => e.target.style.color = 'rgb(156, 163, 175)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-3">
          <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Province of</div>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl font-bold">{provinceData?.provinceName}</h2>
            <div className="text-right">
              <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Provincial ID</div>
              <div className="text-sm font-medium">{provinceData?.provincialID}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-3">
        <div className="flex border-t border-b my-2" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="w-1/2 py-3 pr-3">
            <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              No. of location with<br />Free WiFi sites
            </div>
            <div className="text-4xl font-bold mt-1">{provinceData?.freeWiFiSites}</div>
          </div>
          <div className="w-1/2 py-3 pl-3 border-l" style={{ borderColor: 'rgb(229, 231, 235)' }}>
            <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>Governor</div>
            <div className="font-medium mt-1">{governorName}</div>
          </div>
        </div>
        
        <div className="text-xs mb-2" style={{ color: 'rgb(107, 114, 128)' }}>
          Free WiFi sites location per location types in {provinceData?.provinceName}:
        </div>
        
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
              return typeMap[type] || new URL('../assets/default.png', import.meta.url).href;
            };
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '16%' }}>
                <div className="w-8 h-8 mb-1 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'rgb(243, 244, 246)' }}>
                  <img 
                    src={getIconPath(site.type)} 
                    alt={site.type} 
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <div className="text-xs font-bold text-center">{site.count}</div>
                <div className="text-xs text-center" style={{ fontSize: "0.65rem", color: 'rgb(107, 114, 128)' }}>
                  {site.type.includes(' ') ? site.type.split(' ')[0] : site.type}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
            Total no. of AP sites<br />in {provinceData?.provinceName}
          </div>
          <div className="text-4xl font-bold">{provinceData?.totalAPSites}</div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>
              Digitization Rate<br />No. of Brgy with WiFi Location / Total no. of Brgys
            </div>
            <div className="text-lg font-bold">{provinceData?.digitizationRate}%</div>
          </div>
          <div className="w-full rounded-full h-4" style={{ backgroundColor: 'rgb(229, 231, 235)' }}>
            <div 
              className="h-4 rounded-full" 
              style={{ 
                width: `${provinceData?.digitizationRate}%`,
                backgroundColor: 'rgb(59, 130, 246)'
              }}
            ></div>
          </div>
        </div>
        
        <div className="mb-4 border-t pt-3" style={{ borderColor: 'rgb(229, 231, 235)' }}>
          <div className="text-sm mb-3" style={{ color: 'rgb(107, 114, 128)' }}>
            Cities/Municipalities with Free WiFi Sites
          </div>
          
          {panelData.cities.map((city, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-3 mb-3 cursor-pointer hover:shadow-md transition-all duration-200"
              style={{ borderColor: 'rgb(229, 231, 235)' }}
              onClick={() => handleCityClick(city.locality)}
            >
              <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>City/Municipality</div>
              <div className="text-sm font-medium mb-2">{city.locality}</div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="rounded-full p-2 mr-2" style={{ backgroundColor: 'rgb(59, 130, 246)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgb(255, 255, 255)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-1-8h1m-1 4h1" />
                    </svg>
                  </div>
                  <div className="text-xs" style={{ color: 'rgb(107, 114, 128)' }}>{city.locality} WiFi Sites</div>
                </div>
                <div className="text-xs" style={{ color: 'rgb(156, 163, 175)' }}>Click to view</div>
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
          background: rgb(241, 241, 241);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(193, 193, 193);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(168, 168, 168);
        }
      `}</style>
    </div>
  );
};

export default InfoPanel;