// components/dashboard/LocationProvincesCard.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const LocationProvincesCard = ({ locationCount, trendValue, provincesData }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex items-start mb-4 pb-4 border-b">
        <div className="w-1 h-12 bg-blue-500 mr-2 mt-1"></div>
        <div>
          <div className="text-sm font-medium mb-1">No. of location with Free WiFi sites</div>
          <div className="text-4xl font-bold text-blue-950">{locationCount}</div>

          <div className="flex items-center text-xs mt-1 text-green-600">
            <span className="mr-1">↑</span> {trendValue}
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-4">Distribution per Province</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col text-sm gap-2">
            {provincesData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-gray-700">{entry.name}</span>
                <span className="ml-auto font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={provincesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={60}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {provincesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationProvincesCard;