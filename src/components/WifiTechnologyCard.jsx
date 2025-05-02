import React from 'react';

const WifiTechnologyCard = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-[200px]">
      <div className="text-sm font-medium mb-4">WiFi Technology of Free Wifi Spots in Calabarzon</div>
      <div className="flex flex-col">
        <div className="flex h-8 rounded-sm overflow-hidden">
          {data.map((item, index) => (
            <div 
              key={index}
              className="h-full flex items-center justify-center text-white font-bold"
              style={{ 
                backgroundColor: item.color, 
                width: `${item.value}%` 
              }}
            >
              {item.value}%
            </div>
          ))}
        </div>
        
        <div className="flex justify-around mt-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-lg" style={{ color: item.color }}>{item.icon}</span>
              <div className="text-xs">
                <div className="font-medium">{item.count}</div>
                <div>{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WifiTechnologyCard;