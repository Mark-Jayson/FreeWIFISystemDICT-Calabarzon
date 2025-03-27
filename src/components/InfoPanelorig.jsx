import React, { useState } from "react";

const citiesData = [
  { city: "Batangas City", locations: 5, sites: 26 },
  { city: "Sto. Tomas", locations: 5, sites: 26 },
  { city: "Tanauan City", locations: 5, sites: 26 },
  { city: "Mataas na Kahoy", locations: 5, sites: 26 },
];


const InfoPanel = () => {
  const [selectedCity, setSelectedCity] = useState(null);

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


      {/* 
      <div class</div>Name="mt-2 text-xs">  
        <p className="font-medium">Free WiFi sites location per type:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          <p>📍 <strong>20</strong> Terminals</p>
          <p>🏥 <strong>12</strong> Hospitals</p>
          <p>🔥 <strong>3</strong> Fire Stations</p>
          <p>🏛 <strong>3</strong> Public Market</p>
          <p>🏫 <strong>3</strong> Schools</p>
          <p>🌳 <strong>3</strong> Plaza</p>
        </div>
      </div>
      */}

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

      {/* <div className="mt-2">
        <p className="text-base font-semibold">Total no. of AP sites in Batangas</p>
        <p className="text-2xl font-bold text-blue-600">125</p>
      </div>

      Digitization Rate 
      <div className="mt-2">
        <p className="text-base font-semibold">Digitization Rate</p>
        <p className="text-xs text-gray-500">(No. of Brgys with WIFI Location / Total no. of Brgys)</p>
        <div className="w-full bg-gray-300 rounded-full h-3 mt-1">
          <div className="bg-blue-600 h-3 rounded-full" style={{ width: "67%" }}></div>
        </div>
        <p className="text-base font-bold mt-1">67%</p>
      </div>

      {/* Cities / Municipalities 
      <div className="mt-4">
        <p className="text-base font-semibold">Some cities/ Municipalities of Batangas</p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[
            { city: "Batangas City", locations: 5, sites: 26 },
            { city: "Sto. Tomas", locations: 5, sites: 26 },
            { city: "Tanauan City", locations: 5, sites: 26 },
            { city: "Mataas na Kahoy", locations: 5, sites: 26 },
          ].map((item, index) => (
            <div key={index} className="p-2 border rounded-lg shadow-sm bg-gray-100">
              <p className="text-xs font-semibold">City</p>
              <p className="text-sm font-bold">{item.city}</p>
              <p className="text-xs text-gray-600">{item.locations} Locations</p>
              <p className="text-xs text-gray-600">{item.sites} Sites</p>
            </div>
          ))}
        </div>
      </div>*/}

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

      {/* If city selected, show the s2nd panel */}
      {selectedCity ? (
        <div>
          <button
            onClick={() => setSelectedCity(null)}
            className="text-blue-500 text-xs mb-2"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold">{selectedCity.city}</h2>
          <p className="text-sm text-gray-600 mt-2">
            No. of Locations: {selectedCity.locations}
          </p>
          <p className="text-sm text-gray-600">
            No. of Sites: {selectedCity.sites}
          </p>
        </div>
      ) : (
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
      )}

    </div>
  );
};

export default InfoPanel;
