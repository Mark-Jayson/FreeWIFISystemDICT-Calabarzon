// components/dashboard/KeyMetricCard.jsx
import React from 'react';

const KeyMetricCard = ({ gidaCount, elcacCount }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div className="text-gray-600 text-sm font-medium mb-2">GIDA Serviced</div>
          <div className="text-3xl font-bold text-gray-900">{gidaCount}</div>
        </div>
        <div className="w-px bg-gray-300 h-16"></div>
        <div className="flex flex-col items-center">
          <div className="text-gray-600 text-sm font-medium mb-2">ELCAC Area Serviced</div>
          <div className="text-3xl font-bold text-gray-900">{elcacCount}</div>
        </div>
      </div>
    </div>
  );
};

export default KeyMetricCard;