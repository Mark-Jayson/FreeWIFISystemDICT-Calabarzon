import React, { useState } from "react";
import { ChevronDown, Wifi, Download } from "lucide-react";

// RGB Color Override Styles
const rgbColors = {
  // Background colors
  bgWhiteTransparent: { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
  bgWhite: { backgroundColor: 'rgb(255, 255, 255)' },
  
  // Text colors
  textGray900: { color: 'rgb(17, 24, 39)' },
  textGray600: { color: 'rgb(75, 85, 99)' },
  textGray500: { color: 'rgb(107, 114, 128)' },
  textWhite: { color: 'rgb(255, 255, 255)' },
  
  // Border colors
  borderGray200: { borderColor: 'rgb(229, 231, 235)' },
  borderGray300: { borderColor: 'rgb(209, 213, 219)' },
  borderBlue400: { borderColor: 'rgb(96, 165, 250)' },
  borderBlue500: { borderColor: 'rgb(59, 130, 246)' },
  borderTransparent: { borderColor: 'transparent' },
  
  // Blue color variations
  blue400: 'rgb(96, 165, 250)',
  blue500: 'rgb(59, 130, 246)',
  blue600: 'rgb(37, 99, 235)',
  blue700: 'rgb(29, 78, 216)',
  purple600: 'rgb(147, 51, 234)',
  
  // Combined styles
  headerStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgb(229, 231, 235)'
  },
  
  selectStyle: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(209, 213, 219)',
    color: 'rgb(17, 24, 39)'
  },
  
  buttonStyle: {
    backgroundColor: 'rgb(37, 99, 235)',
    color: 'rgb(255, 255, 255)'
  },
  
  buttonHoverStyle: {
    backgroundColor: 'rgb(29, 78, 216)',
    color: 'rgb(255, 255, 255)'
  },
  
  // Gradient background
  logoGradient: {
    background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))'
  }
};

const Header = ({
  region = "Region IV – A Calabarzon",
  onProvinceSelect,
  selectedProvince = "all",
  onGenerateReport,
  isGeneratingPdf,
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
    <header 
      className="backdrop-blur-lg border-b sticky top-0 z-50"
      style={rgbColors.headerStyle}
    >
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={rgbColors.logoGradient}
              >
                <Wifi 
                  className="w-6 h-6" 
                  style={rgbColors.textWhite}
                />
              </div>
              <div>
                <h1 
                  className="text-xl font-bold"
                  style={rgbColors.textGray900}
                >
                  WiFi Dashboard
                </h1>
                <p 
                  className="text-sm"
                  style={rgbColors.textGray600}
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
                className="appearance-none border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:border-transparent transition-all duration-200 cursor-pointer"
                style={rgbColors.selectStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'transparent';
                  e.target.style.boxShadow = `0 0 0 2px ${rgbColors.blue500}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = rgbColors.borderGray300.borderColor;
                  e.target.style.boxShadow = 'none';
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = rgbColors.blue400;
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.target) {
                    e.target.style.borderColor = rgbColors.borderGray300.borderColor;
                  }
                }}
              >
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={rgbColors.textGray500}
              />
            </div>
          </div>

          {/* Generate Report Button */}
          <div className="flex items-center">
            <button
              onClick={onGenerateReport}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl shadow-md transition-colors duration-200 flex items-center gap-2 text-sm font-medium cursor-pointer hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={rgbColors.buttonStyle}
              onMouseEnter={(e) => {
                if (!isGeneratingPdf) {
                  e.target.style.backgroundColor = rgbColors.blue700;
                }
              }}
              onMouseLeave={(e) => {
                if (!isGeneratingPdf) {
                  e.target.style.backgroundColor = rgbColors.blue600;
                }
              }}
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;