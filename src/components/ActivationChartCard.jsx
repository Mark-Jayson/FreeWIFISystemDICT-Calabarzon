import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, Text } from 'recharts';

const ActivationChartCard = ({ title, data, highlightYear }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-sm font-medium mb-2">{title}</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis hide />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Activations']}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.year === highlightYear ? '#9333ea' : '#e2e8f0'} 
                />
              ))}
            </Bar>
            {data.map((entry, index) => (
              <Text
                key={`text-${index}`}
                x={(index + 0.5) * (600 / data.length)}
                y={entry.year === highlightYear ? 100 : 150}
                textAnchor="middle"
                verticalAnchor="middle"
                fill="#333"
              >
                {entry.value}
              </Text>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivationChartCard;