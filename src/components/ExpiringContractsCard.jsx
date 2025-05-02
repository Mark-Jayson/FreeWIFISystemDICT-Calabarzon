import React from 'react';

const ExpiringContractsCard = ({ contracts }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-lg font-medium mb-2">Free WiFi Site near approaching end of contract</div>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 text-xs font-medium text-gray-600 border-b pb-1 mb-1">
          <div>Site Name</div>
          <div>Date of End</div>
        </div>
        
        {contracts.map((contract, index) => (
          <div key={index} className="grid grid-cols-2 text-xs py-1 border-b">
            <div>{contract.site}</div>
            <div>{contract.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiringContractsCard;