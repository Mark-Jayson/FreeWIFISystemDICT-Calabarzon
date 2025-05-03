import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CombinedStatPieCard = ({ statTitle, statValue, statTrend, statTrendValue, pieTitle, pieData }) => {
  const isPositive = statTrend === 'up';
  
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex flex-col">
        <div className="border-b pb-4 mb-2">
          <div className="flex items-start">
            <div className="w-1 h-12 bg-green-500 mr-2 mt-1"></div>
            <div>
              <div className="text-sm font-medium mb-1">{statTitle}</div>
              <div className="text-4xl font-bold text-blue-950">{statValue}</div>
            </div>
          </div>
          
          {statTrendValue && (
            <div className="flex items-center text-xs mt-1">
              {isPositive ? (
                <div className="flex items-center text-green-600">
                  <span className="mr-1">↑</span> {statTrendValue}
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <span className="mr-1">↓</span> {statTrendValue}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <div className="text-sm font-medium mb-3">{pieTitle}</div>
          
          <div className="flex items-center">
            <div className="flex flex-col text-sm gap-1">
              {pieData.map((entry, index) => (
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
            
            <div className="w-36 h-36 ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={50}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedStatPieCard;