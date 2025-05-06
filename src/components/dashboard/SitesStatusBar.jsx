// components/dashboard/SitesStatusBar.jsx
import React from 'react';

const SitesStatusBar = ({ 
  totalSites, 
  activeCount, 
  terminatedCount, 
  activePercentage
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-xs text-gray-600 mb-2">
        Total Sites: {totalSites}
      </div>
      
      <div className="flex mb-4">
        <div className="bg-green-400 h-6" style={{ width: `${activePercentage}%` }}></div>
        <div className="bg-gray-600 h-6" style={{ width: `${100 - activePercentage}%` }}>
          <div className="text-white text-center text-xs font-medium pt-1">{100 - activePercentage}%</div>
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

export default SitesStatusBar;