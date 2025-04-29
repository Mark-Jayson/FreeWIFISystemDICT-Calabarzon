import React, { useState, useEffect } from 'react';
import CityInfoPanel from './CityInfoPanel';


const InfoPanel = ({ searchQuery, panelData }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [provinceData, setProvinceData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Sampledata
  const sampleProvinceData = {
    provinceName: "Batangas",
    provincialID: "L3-4335",
    governor: "Dodo Mandanas",
    freeWiFiSites: 20,
    totalAPSites: 125,
    digitizationRate: 67,
    siteTypes: [
      { type: "Municipal", count: 20 },
      { type: "Hospitals", count: 12 },
      { type: "Fire Stations", count: 3 },
      { type: "Public Market", count: 7 },
      { type: "Schools", count: 10 },
      { type: "Parks", count: 3 }
    ],
    cities: [
      { 
        name: "Batangas City", 
        locations: 5, 
        sites: 26,
        mayor: "Beverly Rose Dimacuha",
        totalAPSites: 125,
        digitizationRate: 42,
        freeWifiLocations: [
          { name: "Batangas City Hall", type: "Municipal", sites: 8 },
          { name: "Batangas Provincial Hospital", type: "Hospital", sites: 12 },
          { name: "Batangas State University", type: "School", sites: 15 }
        ]
      },
      { 
        name: "Sto. Tomas", 
        locations: 5, 
        sites: 41,
        mayor: "Art Jun Maligalig",
        totalAPSites: 125,
        digitizationRate: 25,
        freeWifiLocations: [
          { name: "BatState - College of Science Building", type: "School", sites: 11 },
          { name: "PUP Sto. Tomas Campus", type: "School", sites: 11 },
          { name: "BatState - College of Science Building", type: "School", sites: 11 }
        ]
      },
      { 
        name: "Tanauan City", 
        locations: 5, 
        sites: 26,
        mayor: "Mary Angeline Halili",
        totalAPSites: 98,
        digitizationRate: 35,
        freeWifiLocations: [
          { name: "Tanauan City Hall", type: "Municipal", sites: 7 },
          { name: "First Asia Institute of Technology", type: "School", sites: 9 },
          { name: "Tanauan Public Market", type: "Public Market", sites: 5 }
        ]
      },
      { 
        name: "Mataas na Kahoy", 
        locations: 5, 
        sites: 26,
        mayor: "Janet Ilagan",
        totalAPSites: 65,
        digitizationRate: 40,
        freeWifiLocations: [
          { name: "Mataas na Kahoy Municipal Hall", type: "Municipal", sites: 6 },
          { name: "Mataas na Kahoy National High School", type: "School", sites: 8 },
          { name: "Mataas na Kahoy Healthcare Center", type: "Hospital", sites: 4 }
        ]
      }
    ]
  };

  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      // In a real app, you would fetch data based on the search query
      // For now, we'll just show the sample data
      setProvinceData(panelData);
      setShowPanel(true);
      setSelectedCity(null); 
    }
  }, [searchQuery]);

  const handleClosePanel = () => {
    setShowPanel(false);
    setSelectedCity(null);
  };
  
  const handleCityClick = (city) => {
    setSelectedCity(city);
  };
  
  const handleBackToProvince = () => {
    setSelectedCity(null);
  };

  if (!showPanel) return null;
  
  if (selectedCity) {
    return <CityInfoPanel cityData={selectedCity} onBack={handleBackToProvince} />;
  }

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
            <div className="font-medium mt-1">{provinceData?.governor}</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">Free WiFi sites location per location types in {provinceData?.provinceName}:</div>
        
        <div className="flex justify-between mb-4">
  {provinceData?.siteTypes.slice(0, 6).map((site, index) => {
    // Map site type to icon file name - ADD THIS FUNCTION
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
          <div className="text-sm text-gray-500 mb-3">Some Cities/Municipalities of {provinceData?.provinceName}</div>
          <div className="grid grid-cols-2 gap-3">
            {provinceData?.cities.slice(0, 2).map((city, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition duration-200"
                onClick={() => handleCityClick(city)}
              >
                <div className="text-xs text-gray-500">City</div>
                <div className="text-sm font-medium mb-3">{city.name}</div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <div className="text-center">
                    <div className="text-xl font-bold">{city.locations}</div>
                    <div className="text-xs text-gray-500">Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{city.sites}</div>
                    <div className="text-xs text-gray-500">Sites</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {provinceData?.cities.slice(2, 4).map((city, index) => (
              <div 
                key={index + 2} 
                className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition duration-200"
                onClick={() => handleCityClick(city)}
              >
                <div className="text-xs text-gray-500">City</div>
                <div className="text-sm font-medium mb-3">{city.name}</div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <div className="text-center">
                    <div className="text-xl font-bold">{city.locations}</div>
                    <div className="text-xs text-gray-500">Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{city.sites}</div>
                    <div className="text-xs text-gray-500">Sites</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
  );
};

export default InfoPanel;