// components/dashboard/LocationTypeGrid.jsx
import React from 'react';

const LocationTypeGrid = ({ title, subtitle, data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-600 mb-2">{subtitle}</div>}
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center p-1">
            <div className="flex justify-center items-center w-8 h-8 mb-1">
              <span className="text-lg">{item.icon}</span>
            </div>
            <div className="text-sm font-medium">{item.value}</div>
            <div className="text-xs text-gray-600 text-center">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationTypeGrid;
