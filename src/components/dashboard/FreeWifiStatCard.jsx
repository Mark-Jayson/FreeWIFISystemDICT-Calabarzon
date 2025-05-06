// components/dashboard/FreeWifiStatCard.jsx
import React from 'react';

const FreeWifiStatCard = ({ 
  title, 
  value, 
  trendValue, 
  totalSites, 
  activeCount, 
  terminatedCount, 
  activePercentage
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex items-start mb-4">
        <div className="w-1 h-12 bg-red-500 mr-3 mt-1"></div>
        <div>
          <div className="text-sm font-medium mb-1 text-gray-600">{title}</div>
          <div className="text-4xl font-bold text-gray-900">{value}</div>
          <div className="flex items-center text-xs mt-1 text-red-600">
            <span className="mr-1">↓</span> {trendValue}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mb-2">
        Total Sites: {totalSites}
      </div>
      
      <div className="flex h-6 rounded-sm overflow-hidden mb-2">
        <div 
          className="bg-green-400 h-full flex items-center justify-end pr-2"
          style={{ width: `${activePercentage}%` }}
        >
          <div className="text-white text-xs font-medium">{activePercentage}%</div>
        </div>
        <div 
          className="bg-gray-600 h-full flex items-center justify-center"
          style={{ width: `${100 - activePercentage}%` }}
        >
          <div className="text-white text-xs font-medium">{100 - activePercentage}%</div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
          <span className="font-medium">{activeCount}</span>
          <span className="text-gray-600">Active Sites</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-600 rounded-full"></span>
          <span className="font-medium">{terminatedCount}</span>
          <span className="text-gray-600">Terminated</span>
        </div>
      </div>
    </div>
  );
};

export default FreeWifiStatCard;