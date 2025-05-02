import React from 'react';

const LocationTypesCard = ({ title, subtitle, data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-600 mb-3">{subtitle}</div>}
      
      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex justify-center items-center w-8 h-8 mb-1 bg-gray-100 rounded-full">
              <span className="text-lg">{item.icon}</span>
            </div>
            <div className="text-xs font-medium">{item.value}</div>
            <div className="text-xs text-gray-600">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationTypesCard;