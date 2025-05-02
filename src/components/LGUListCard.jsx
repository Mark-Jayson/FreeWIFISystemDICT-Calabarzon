import React from 'react';

const LGUListCard = ({ title, data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-2">{title}</div>
      
      <div className="flex flex-col space-y-1 max-h-40 overflow-y-auto">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1 border-b">
            <div className="flex items-center">
              <div className="text-gray-800 text-xs mr-1">{item.id}.</div>
              <div>
                <div className="text-xs font-medium">{item.name}</div>
                <div className="text-xs text-gray-600">{item.subtext}</div>
              </div>
            </div>
            <div className="text-xs font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LGUListCard;