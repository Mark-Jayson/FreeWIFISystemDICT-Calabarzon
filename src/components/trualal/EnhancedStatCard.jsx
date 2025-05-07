import React from 'react';

const EnhancedStatCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  totalSites, 
  activeCount, 
  terminatedCount, 
  activePercentage
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full truncate wrap-anywhere">
      <div className="flex h-full">
        <div className="flex flex-col flex-1 border-r pr-4">
          <div className="flex items-start mb-2">
            <div className="w-1 h-12 bg-red-500 mr-2 mt-1"></div>
            <div>
              <div className="text-sm font-medium mb-1">{title}</div>
              <div className="text-4xl font-bold text-gray-900">{value}</div>
            </div>
          </div>
          
          <div className="flex items-center text-xs mt-1 truncate wrap-anywhere">
            <div className="flex items-center text-red-600">
              <span className="mr-1">↓</span> {trendValue}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col pl-4 w-48">
          <div className="text-xs text-gray-600 mb-2">
            Total Sites: {totalSites}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-green-500 h-2.5 rounded-l-full" 
              style={{ width: `${activePercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs ">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{activeCount}</span>
              <span className="text-gray-500">Active Sites</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
              <span>{terminatedCount}</span>
              <span className="text-gray-500">Terminated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatCard;