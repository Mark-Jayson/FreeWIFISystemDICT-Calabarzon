import React from 'react';

const WifiTechnologyCard = ({ data }) => {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-2">WiFi Technology of Free Wifi Spots in Calabarzon</div>
      <div className="flex flex-col">
        <div className="flex h-8">
          {data.map((item, index) => (
            <div 
              key={index}
              className="h-full" 
              style={{ 
                backgroundColor: item.color, 
                width: `${(item.value / total) * 100}%` 
              }}
            ></div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-lg" style={{ color: item.color }}>{item.icon}</span>
              <div className="text-xs">
                <div>{item.value}</div>
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