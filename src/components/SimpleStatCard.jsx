import React from 'react';

const SimpleStatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="text-4xl font-bold text-center my-4">{value}</div>
    </div>
  );
};

export default SimpleStatCard;