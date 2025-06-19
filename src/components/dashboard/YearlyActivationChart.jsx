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
import { Activity, TrendingUp, Calendar } from 'lucide-react';

const YearlyActivationChart = ({ title, data, highlightYear, noDateCount, darkMode = false }) => {
  const barSize = data.length > 5
    ? Math.max(8, Math.floor(240 / data.length))
    : 32;

  // Calculate trend
  const currentYearData = data.find(d => d.year === highlightYear);
  const previousYearData = data.find(d => d.year === (parseInt(highlightYear) - 1).toString());
  const trendPercentage = currentYearData && previousYearData 
    ? ((currentYearData.value - previousYearData.value) / previousYearData.value * 100).toFixed(1)
    : null;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          p-3 rounded-lg shadow-lg border`}>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
            Year {label}
          </p>
          <p className="text-blue-500 font-semibold">
            {payload[0].value} activations
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}
      style={{ height: '400px', maxHeight: '400px' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-base`}>
              {title}
            </h3>
          </div>
          
          {/* Trend indicator */}
          {trendPercentage && (
            <div className={`flex items-center text-sm ${
              parseFloat(trendPercentage) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${parseFloat(trendPercentage) < 0 ? 'rotate-180' : ''}`} />
              <span className="font-medium">{Math.abs(trendPercentage)}%</span>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                vs {parseInt(highlightYear) - 1}
              </span>
            </div>
          )}
        </div>
        
        {/* Highlight year badge */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {highlightYear} Focus
        </div>
      </div>

      {/* Chart container with fixed height */}
      <div style={{ height: '240px', width: '100%' }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={darkMode ? '#374151' : '#e5e7eb'}
              />
              <XAxis 
                dataKey="year" 
                tick={{ 
                  fill: darkMode ? '#9CA3AF' : '#6B7280',
                  fontSize: 12 
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]} 
                barSize={barSize}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.year === highlightYear 
                      ? 'url(#highlightGradient)' 
                      : darkMode ? '#4B5563' : '#E5E7EB'
                    }
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="highlightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} 
            h-full flex flex-col items-center justify-center`}>
            <Activity className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">No activation data available</p>
          </div>
        )}
      </div>

      {/* Footer info */}
      {noDateCount > 0 && (
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center justify-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              <strong className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {noDateCount}
              </strong> sites activated without date
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyActivationChart;