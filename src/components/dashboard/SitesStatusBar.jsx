// components/dashboard/SitesStatusBar.jsx
import React from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const SitesStatusBar = ({ 
  totalSites, 
  activeCount, 
  terminatedCount, 
  forRenewalCount = 0,
  unknownCount = 0,
  activePercentage,
  terminatedPercentage,
  forRenewalPercentage = 0,
  unknownPercentage = 0,
  trendValue = '0%',
  isPositiveTrend = true,
  loading = false,
  darkMode = false
}) => {
  if (loading) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
        rounded-2xl border p-6 transition-all duration-300`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusData = [
    {
      label: 'Active Sites',
      count: activeCount,
      percentage: activePercentage,
      color: '#10B981',
      bgColor: 'bg-green-500',
      icon: CheckCircle,
      textColor: 'text-green-600'
    },
    {
      label: 'For Renewal',
      count: forRenewalCount,
      percentage: forRenewalPercentage,
      color: '#F59E0B',
      bgColor: 'bg-amber-500',
      icon: RefreshCw,
      textColor: 'text-amber-600'
    },
    {
      label: 'Terminated',
      count: terminatedCount,
      percentage: terminatedPercentage,
      color: '#EF4444',
      bgColor: 'bg-red-500',
      icon: XCircle,
      textColor: 'text-red-600'
    },
    {
      label: 'Unknown',
      count: unknownCount,
      percentage: unknownPercentage,
      color: '#6B7280',
      bgColor: 'bg-gray-500',
      icon: AlertTriangle,
      textColor: 'text-gray-600'
    }
  ].filter(item => item.count > 0); // Only show categories with data

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>
            Sites Status Overview
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
            Total Sites: {totalSites?.toLocaleString() || 0}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isPositiveTrend ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          <span className={`text-sm font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-4 rounded-full overflow-hidden flex`}>
          {statusData.map((item, index) => (
            <div
              key={index}
              className={`h-full flex items-center justify-center transition-all duration-1000 ease-out`}
              style={{ 
                backgroundColor: item.color,
                width: `${item.percentage}%`
              }}
            >
              {item.percentage > 10 && (
                <span className="text-white text-xs font-bold">
                  {Math.round(item.percentage)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statusData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} 
              rounded-xl p-4 transition-all duration-200 cursor-pointer group/item`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${item.bgColor} group-hover/item:scale-110 transition-transform duration-200`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium`}>
                  {item.label}
                </span>
                <span className={`${item.textColor} text-sm font-semibold`}>
                  {Math.round(item.percentage)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl p-4 mt-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`${darkMode ? 'text-white' : 'text-blue-900'} font-semibold text-sm`}>
              Active Rate
            </p>
            <p className={`${darkMode ? 'text-gray-400' : 'text-blue-700'} text-xs`}>
              {activeCount} of {totalSites} sites operational
            </p>
          </div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>
            {Math.round(activePercentage)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitesStatusBar;