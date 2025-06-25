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
  loading = false
}) => {
  if (loading) {
    return (
      <div 
        className="rounded-2xl border p-6 transition-all duration-300"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderColor: 'rgba(243, 244, 246, 1)'
        }}
      >
        <div className="animate-pulse">
          <div 
            className="h-4 rounded w-32 mb-4"
            style={{ backgroundColor: 'rgba(209, 213, 219, 1)' }}
          ></div>
          <div 
            className="h-6 rounded mb-4"
            style={{ backgroundColor: 'rgba(209, 213, 219, 1)' }}
          ></div>
          <div className="space-y-3">
            <div 
              className="h-4 rounded"
              style={{ backgroundColor: 'rgba(209, 213, 219, 1)' }}
            ></div>
            <div 
              className="h-4 rounded"
              style={{ backgroundColor: 'rgba(209, 213, 219, 1)' }}
            ></div>
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
      color: 'rgba(16, 185, 129, 1)',
      bgColor: 'rgba(34, 197, 94, 1)',
      icon: CheckCircle,
      textColor: 'text-green-600'
    },
    {
      label: 'For Renewal',
      count: forRenewalCount,
      percentage: forRenewalPercentage,
      color: 'rgba(245, 158, 11, 1)',
      bgColor: 'rgba(245, 158, 11, 1)',
      icon: RefreshCw,
      textColor: 'text-amber-600'
    },
    {
      label: 'Terminated',
      count: terminatedCount,
      percentage: terminatedPercentage,
      color: 'rgba(239, 68, 68, 1)',
      bgColor: 'rgba(239, 68, 68, 1)',
      icon: XCircle,
      textColor: 'text-red-600'
    },
    {
      label: 'Unknown',
      count: unknownCount,
      percentage: unknownPercentage,
      color: 'rgba(107, 114, 128, 1)',
      bgColor: 'rgba(107, 114, 128, 1)',
      icon: AlertTriangle,
      textColor: 'text-gray-600'
    }
  ].filter(item => item.count > 0); // Only show categories with data

  return (
    <div 
      className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(243, 244, 246, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      }}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">
            Sites Status Overview
          </h3>
          <p className="text-gray-600 text-sm mt-1">
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
        <div 
          className="h-4 rounded-full overflow-hidden flex"
          style={{ backgroundColor: 'rgba(229, 231, 235, 1)' }}
        >
          {statusData.map((item, index) => (
            <div
              key={index}
              className="h-full flex items-center justify-center transition-all duration-1000 ease-out"
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
            <div 
              key={index} 
              className="rounded-xl p-4 transition-all duration-200 cursor-pointer group/item"
              style={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 1)';
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="p-2 rounded-lg group-hover/item:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 text-xl font-bold">
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm font-medium">
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
      <div 
        className="rounded-xl p-4 mt-4"
        style={{ backgroundColor: 'rgba(239, 246, 255, 1)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm" style={{ color: 'rgba(30, 58, 138, 1)' }}>
              Active Rate
            </p>
            <p className="text-xs" style={{ color: 'rgba(29, 78, 216, 1)' }}>
              {activeCount} of {totalSites} sites operational
            </p>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: 'rgba(30, 58, 138, 1)' }}
          >
            {Math.round(activePercentage)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitesStatusBar;