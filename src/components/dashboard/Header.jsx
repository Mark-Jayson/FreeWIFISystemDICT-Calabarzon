import React, { useState } from "react";
import { ChevronDown, Wifi, Download } from "lucide-react";

const Header = ({
  region = "Region IV – A Calabarzon",
  onProvinceSelect,
  selectedProvince = "all",
  onGenerateReport,
<<<<<<< HEAD
=======
  isGeneratingPdf,

>>>>>>> b21854da7dbb2da72c8e5d03671bcbb3a1910e40
}) => {
  const provinces = [
    { id: "all", name: "Region IV - A Calabarzon" },
    { id: "cavite", name: "Cavite" },
    { id: "laguna", name: "Laguna" },
    { id: "batangas", name: "Batangas" },
    { id: "rizal", name: "Rizal" },
    { id: "quezon", name: "Quezon" },
  ];

  // Custom RGBA colors
  const colors = {
    background: 'rgba(255, 255, 255, 0.8)', // bg-white/80
    border: 'rgba(229, 231, 235, 1)', // border-gray-200
    text: {
      primary: 'rgba(17, 24, 39, 1)', // text-gray-900
      secondary: 'rgba(75, 85, 99, 1)', // text-gray-600
      muted: 'rgba(107, 114, 128, 1)', // text-gray-500
    },
    blue: {
      400: 'rgba(96, 165, 250, 1)',
      500: 'rgba(59, 130, 246, 1)',
      600: 'rgba(37, 99, 235, 1)',
      700: 'rgba(29, 78, 216, 1)',
    },
    purple: {
      600: 'rgba(147, 51, 234, 1)',
    },
    white: 'rgba(255, 255, 255, 1)',
    gray: {
      300: 'rgba(209, 213, 219, 1)',
    }
  };

  return (
    <header 
      className="backdrop-blur-lg border-b sticky top-0 z-50"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border
      }}
    >
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.blue[500]}, ${colors.purple[600]})`
                }}
              >
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 
                  className="text-xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  WiFi Dashboard
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {region}
                </p>
              </div>
            </div>

            {/* Province Selector */}
            <div className="relative ml-8">
              <select
                value={selectedProvince}
                onChange={(e) => onProvinceSelect && onProvinceSelect(e.target.value)}
<<<<<<< HEAD
                className="appearance-none bg-white border-gray-300 text-gray-900 border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-blue-400"
=======
                className="appearance-none border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:border-transparent transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: colors.white,
                  borderColor: colors.gray[300],
                  color: colors.text.primary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = `0 0 0 2px ${colors.blue[500]}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.gray[300];
                  e.target.style.boxShadow = 'none';
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = colors.blue[400];
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.borderColor = colors.gray[300];
                  }
                }}
>>>>>>> b21854da7dbb2da72c8e5d03671bcbb3a1910e40
              >
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ color: colors.text.muted }}
              />
            </div>
          </div>

          {/* Generate Report Button */}
          <div className="flex items-center">
            <button
              onClick={onGenerateReport}
<<<<<<< HEAD
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-colors duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer hover:shadow-lg"
=======
              className="px-4 py-2 rounded-xl shadow-md transition-colors duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer hover:shadow-lg"
              style={{
                backgroundColor: colors.blue[600],
                color: colors.white
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.blue[700];
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.blue[600];
              }}
>>>>>>> b21854da7dbb2da72c8e5d03671bcbb3a1910e40
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