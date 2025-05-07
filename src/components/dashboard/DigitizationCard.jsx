// components/dashboard/DigitizationCard.jsx
import React from 'react';

const DigitizationCard = ({ percentage, totalCount, activeCount, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-1">Digitization Rate in Calabarzon</div>
      <div className="text-xs text-gray-600">{description}</div>
      
      <div className="flex items-start mt-4">
        <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
      </div>
      
      <div className="mt-3">
        <div className="bg-blue-400 h-6 rounded-sm" style={{ width: `${percentage}%` }}></div>
      </div>
      
      <div className="text-xs mt-2">
        {activeCount} out of {totalCount} Barangays in Calabarzon
      </div>
    </div>
  );
};

export default DigitizationCard;