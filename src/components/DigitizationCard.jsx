import React from 'react';

const DigitizationCard = ({ percentage, totalCount, activeCount, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium">Digitization Rate in Calabarzon</div>
      <div className="text-xs text-gray-600">{description}</div>
      
      <div className="flex justify-center items-center h-32">
        <div className="text-5xl font-bold text-blue-700">{percentage}%</div>
      </div>
      
      <div className="text-xs text-center">
        {activeCount} out of {totalCount} Barangays in Calabarzon
      </div>
    </div>
  );
};

export default DigitizationCard;