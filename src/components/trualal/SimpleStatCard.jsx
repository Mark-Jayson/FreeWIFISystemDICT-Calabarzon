import React from 'react';

const SimpleStatCard = ({ title, value }) => {
  return (
    <div className="py-2">
      <div className="text-sm font-medium mb-1 text-gray-700">{title}</div>
      <div className="text-4xl font-bold text-right text-gray-900">{value}</div>
    </div>
  );
};

export default SimpleStatCard;