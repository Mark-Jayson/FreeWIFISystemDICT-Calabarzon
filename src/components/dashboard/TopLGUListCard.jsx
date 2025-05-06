// components/dashboard/TopLGUListCard.jsx
import React from 'react';

const TopLGUListCard = ({ title, data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full relative">
      <div className="text-sm font-medium mb-2">{title}</div>
      
      <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto mt-2">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1 border-b">
            <div className="flex items-center gap-2">
              <div className="text-gray-800 text-sm">{item.id}</div>
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-600">{item.subtext}</div>
              </div>
            </div>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLGUListCard;