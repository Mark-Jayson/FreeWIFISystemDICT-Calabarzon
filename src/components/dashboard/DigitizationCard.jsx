import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

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
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(233, 236, 239, 1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-gray-900 font-semibold">
            Digitization Progress
          </h3>
        </div>
        <span className="text-2xl font-bold text-blue-600">
          {calculatedPercentage}%
        </span>
      </div>
      
      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">
        {description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${calculatedPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div 
          className="rounded-xl p-3"
          style={{ 
            backgroundColor: 'rgba(239, 246, 255, 1)',
            borderColor: 'rgba(233, 236, 239, 1)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="text-lg font-bold text-blue-900 mb-1">
            {activeCount.toLocaleString()}
          </div>
          <div className="text-xs text-blue-700 font-medium">
            Active Sites
          </div>
        </div>
        <div 
          className="rounded-xl p-3"
          style={{ 
            backgroundColor: 'rgba(249, 250, 251, 1)',
            borderColor: 'rgba(233, 236, 239, 1)',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <div className="text-lg font-bold text-gray-900 mb-1">
            {totalCount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-700 font-medium">
            Total Locations
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="text-gray-600 text-xs">
        Coverage across 21,464 Barangays in Calabarzon
      </div>
      
      {/* Trend Indicator */}
      {calculatedPercentage > 0 && (
        <div className="flex items-center mt-3 text-sm text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="font-medium">Growing coverage</span>
        </div>
      )}
    </div>
  );
};

export default DigitizationCard;