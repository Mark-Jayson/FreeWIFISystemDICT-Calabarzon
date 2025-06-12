import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const YearlyActivationChart = ({ title, data, highlightYear, noDateCount }) => {
  const barSize = data.length > 5
    ? Math.max(8, Math.floor(240 / data.length))
    : 32;

  return (
    <div className="bg-white rounded-lg shadow p-4 h-64 flex flex-col justify-between">
      <div className="text-sm font-medium mb-1">{title}</div>

      {/* Chart container with fixed height */}
      <div style={{ height: '160px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value}`, 'Activations']}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={barSize}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.year === highlightYear ? '#9333ea' : '#e2e8f0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearlyActivationChart;
