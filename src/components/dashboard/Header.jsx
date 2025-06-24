import React, { useState } from "react";
import { ChevronDown, Wifi, Download } from "lucide-react";

const Header = ({
  region = "Region IV – A Calabarzon",
  onProvinceSelect,
  selectedProvince = "all",
  onGenerateReport,
}) => {
  const provinces = [
    { id: "all", name: "Region IV - A Calabarzon" },
    { id: "cavite", name: "Cavite" },
    { id: "laguna", name: "Laguna" },
    { id: "batangas", name: "Batangas" },
    { id: "rizal", name: "Rizal" },
    { id: "quezon", name: "Quezon" },
  ];

  return (
    <header className="bg-white/80 border-gray-200 backdrop-blur-lg border-b sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 text-xl font-bold">
                  WiFi Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  {region}
                </p>
              </div>
            </div>

            {/* Province Selector */}
            <div className="relative ml-8">
              <select 
                value={selectedProvince}
                onChange={(e) => onProvinceSelect && onProvinceSelect(e.target.value)}
                className="appearance-none bg-white border-gray-300 text-gray-900 border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-blue-400"
              >
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="text-gray-500 w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Generate Report Button */}
          <div className="flex items-center">
            <button
              onClick={onGenerateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-colors duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;