import React, { useState, useEffect } from 'react';
import SiteInfoPanel from "./SiteInfoPanel";

const API_URL = import.meta.env.VITE_API_URL;

const LocationInfoPanel = ({ locationData, onBack }) => {
  const [selectedSite, setSelectedSite] = useState(null);

  // Reset selectedSite whenever locationData changes
  useEffect(() => {
    setSelectedSite(null);
  }, [locationData]);

  const handleBackToLocation = () => {
    setSelectedSite(null);
  };

  if (!locationData) {
    return (
      <div className="fixed top-[108px] right-4 bg-white rounded-lg shadow-lg w-80 z-50 p-4">
        <p className="text-gray-500">Loading location data...</p>
      </div>
    );
  }

  const {
    location_name,
    location_id,
    category,
    province,
    locality,
    congressional_district,
    latitude,
    longitude,
    apSites = []
  } = locationData;

  const handleSiteClick = async (site) => {
    console.log("Clicked site:", site);

    if (!site.site_id) {
      console.error("No site_id found for this site:", site);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/site/${site.site_id}`);
      const text = await res.text();
      console.log("Raw response:", text);

      const json = JSON.parse(text);
      setSelectedSite(json);
    } catch (error) {
      console.error("Failed to fetch full site data:", error);
    }
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

          <div className="flex items-center mb-2 mt-3 pl-6">
            <div className="w-8 h-8 rounded-lg bg-red-100 mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">{location_name}</h2>
            </div>
          </div>

          <div className="flex justify-between mb-3 mt-2 pl-6">
            <div>
              <div className="text-xs text-gray-500">Loc ID</div>
              <div className="text-sm font-medium">{location_id}</div>
            </div>
            <div className="mr-4">
              <div className="text-xs text-gray-500">Category</div>
              <div className="text-sm font-medium">{category}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="mb-4">
            <div className="text-xs text-gray-500">Province / Locality</div>
            <div className="text-sm mt-1">{province} / {locality}</div>
          </div>

          <div className="flex mb-4 border-t border-b border-gray-200 py-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500">Congressional</div>
              <div className="text-sm font-medium">{congressional_district}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Latitude</div>
              <div className="text-sm font-medium">{latitude}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Longitude</div>
              <div className="text-sm font-medium">{longitude}</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Associated Sites</div>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium mb-2">{apSites.length} Site(s)</div>

            {apSites.map((site, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg py-3 px-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleSiteClick(site)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <div className="text-sm">{site.name || site.site_name}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-1 rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="text-xs text-purple-600 ml-1">{site.technology}</div>
                  </div>
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

      {selectedSite && (
        <SiteInfoPanel siteData={selectedSite} onBack={handleBackToLocation} />
      )}
    </>
  );
};

export default LocationInfoPanel;