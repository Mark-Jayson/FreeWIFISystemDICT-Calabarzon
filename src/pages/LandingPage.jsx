import { useState } from "react";
import Sidebar from "../components/Sidebar";
import InfoPanel from "../components/InfoPanel";

const LandingPage = () => {
  // Mock location data (Replace this with real data when integrating Mapbox)
  const [selectedLocation, setSelectedLocation] = useState({
    siteName: "Batangas",
    locId: "L3-4335",
    address: "Batangas, Philippines",
    wifiSites: [
      { name: "Terminal", technology: "Fiber Optic", speed: "100 Mbps" },
      { name: "Hospital", technology: "Satellite", speed: "50 Mbps" },
    ],
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar (Filters) */}
      <div className="w-[262px] bg-[#17319E] text-white">
        <Sidebar />
      </div>

      {/* Main Content (Map + InfoPanel) */}
      <div className="flex-grow relative bg-gray-200">
        {/* Placeholder for Map */}
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <p className="text-gray-600">[ Map ]</p>
        </div>

        {/* InfoPanel (Appears on the right side) */}
        {selectedLocation && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <InfoPanel locationData={selectedLocation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
