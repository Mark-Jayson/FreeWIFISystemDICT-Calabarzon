import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

// RGB Color Override Styles
const rgbColors = {
  // Background colors
  bgWhite: { backgroundColor: 'rgb(255, 255, 255)' },
  bgGray200: { backgroundColor: 'rgb(229, 231, 235)' },
  bgBlue50: { backgroundColor: 'rgb(239, 246, 255)' },
  bgGray50: { backgroundColor: 'rgb(249, 250, 251)' },
  
  // Text colors
  textGray900: { color: 'rgb(17, 24, 39)' },
  textGray600: { color: 'rgb(75, 85, 99)' },
  textGray700: { color: 'rgb(55, 65, 81)' },
  textBlue600: { color: 'rgb(37, 99, 235)' },
  textBlue700: { color: 'rgb(29, 78, 216)' },
  textBlue900: { color: 'rgb(30, 58, 138)' },
  textGreen600: { color: 'rgb(22, 163, 74)' },
  textWhite: { color: 'rgb(255, 255, 255)' },
  
  // Border colors
  borderGray200: { borderColor: 'rgb(233, 236, 239)' },
  
  // Combined styles
  cardStyle: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(233, 236, 239)',
    borderWidth: '1px',
    borderStyle: 'solid',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  },
  
  blueStatCard: {
    backgroundColor: 'rgb(239, 246, 255)',
    borderColor: 'rgb(233, 236, 239)',
    borderWidth: '1px',
    borderStyle: 'solid'
  },
  
  grayStatCard: {
    backgroundColor: 'rgb(249, 250, 251)',
    borderColor: 'rgb(233, 236, 239)',
    borderWidth: '1px',
    borderStyle: 'solid'
  },
  
  // Gradient backgrounds (for elements that need gradients)
  blueGradient: {
    background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))'
  },
  
  progressGradient: {
    background: 'linear-gradient(90deg, rgb(96, 165, 250), rgb(37, 99, 235))'
  }
};

const DigitizationCard = ({
  percentage = 0,
  totalCount = 0,
  activeCount = 0,
  description = "WiFi Location Coverage in Calabarzon"
}) => {
  const calculatedPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : percentage;

  return (
    <div 
      className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
      style={rgbColors.cardStyle}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-xl"
            style={rgbColors.blueGradient}
          >
            <Activity 
              className="w-5 h-5" 
              style={rgbColors.textWhite}
            />
          </div>
          <h3 
            className="font-semibold"
            style={rgbColors.textGray900}
          >
            Digitization Progress
          </h3>
        </div>
        <span 
          className="text-2xl font-bold"
          style={rgbColors.textBlue600}
        >
          {calculatedPercentage}%
        </span>
      </div>
      
      {/* Description */}
      <p 
        className="text-sm mb-6"
        style={rgbColors.textGray600}
      >
        {description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          className="h-3 rounded-full overflow-hidden"
          style={rgbColors.bgGray200}
        >
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              ...rgbColors.progressGradient,
              width: `${calculatedPercentage}%` 
            }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div 
          className="rounded-xl p-3"
          style={rgbColors.blueStatCard}
        >
          <div 
            className="text-lg font-bold mb-1"
            style={rgbColors.textBlue900}
          >
            {activeCount.toLocaleString()}
          </div>
          <div 
            className="text-xs font-medium"
            style={rgbColors.textBlue700}
          >
            Active Sites
          </div>
        </div>
        <div 
          className="rounded-xl p-3"
          style={rgbColors.grayStatCard}
        >
          <div 
            className="text-lg font-bold mb-1"
            style={rgbColors.textGray900}
          >
            {totalCount.toLocaleString()}
          </div>
          <div 
            className="text-xs font-medium"
            style={rgbColors.textGray700}
          >
            Total Locations
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div 
        className="text-xs"
        style={rgbColors.textGray600}
      >
        Coverage across 21,464 Barangays in Calabarzon
      </div>
      
      {/* Trend Indicator */}
      {calculatedPercentage > 0 && (
        <div 
          className="flex items-center mt-3 text-sm"
          style={rgbColors.textGreen600}
        >
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="font-medium">Growing coverage</span>
        </div>
      )}
    </div>
  );
};

export default DigitizationCard;