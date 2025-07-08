// components/dashboard/SitesStatusBar.jsx
import React from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

// RGB Color Override System
const rgbColors = {
  // Gray scale
  gray: {
    50: 'rgb(249, 250, 251)',
    100: 'rgb(243, 244, 246)',
    200: 'rgb(229, 231, 235)',
    300: 'rgb(209, 213, 219)',
    400: 'rgb(156, 163, 175)',
    500: 'rgb(107, 114, 128)',
    600: 'rgb(75, 85, 99)',
    700: 'rgb(55, 65, 81)',
    800: 'rgb(31, 41, 55)',
    900: 'rgb(17, 24, 39)',
  },
  // Green scale
  green: {
    50: 'rgb(240, 253, 244)',
    100: 'rgb(220, 252, 231)',
    200: 'rgb(187, 247, 208)',
    300: 'rgb(134, 239, 172)',
    400: 'rgb(74, 222, 128)',
    500: 'rgb(34, 197, 94)',
    600: 'rgb(22, 163, 74)',
    700: 'rgb(21, 128, 61)',
    800: 'rgb(22, 101, 52)',
    900: 'rgb(20, 83, 45)',
  },
  // Red scale
  red: {
    50: 'rgb(254, 242, 242)',
    100: 'rgb(254, 226, 226)',
    200: 'rgb(254, 202, 202)',
    300: 'rgb(252, 165, 165)',
    400: 'rgb(248, 113, 113)',
    500: 'rgb(239, 68, 68)',
    600: 'rgb(220, 38, 38)',
    700: 'rgb(185, 28, 28)',
    800: 'rgb(153, 27, 27)',
    900: 'rgb(127, 29, 29)',
  },
  // Amber scale
  amber: {
    50: 'rgb(255, 251, 235)',
    100: 'rgb(254, 243, 199)',
    200: 'rgb(253, 230, 138)',
    300: 'rgb(252, 211, 77)',
    400: 'rgb(251, 191, 36)',
    500: 'rgb(245, 158, 11)',
    600: 'rgb(217, 119, 6)',
    700: 'rgb(180, 83, 9)',
    800: 'rgb(146, 64, 14)',
    900: 'rgb(120, 53, 15)',
  },
  // Blue scale
  blue: {
    50: 'rgb(239, 246, 255)',
    100: 'rgb(219, 234, 254)',
    200: 'rgb(191, 219, 254)',
    300: 'rgb(147, 197, 253)',
    400: 'rgb(96, 165, 250)',
    500: 'rgb(59, 130, 246)',
    600: 'rgb(37, 99, 235)',
    700: 'rgb(29, 78, 216)',
    800: 'rgb(30, 64, 175)',
    900: 'rgb(30, 58, 138)',
  },
  // White and transparent
  white: 'rgb(255, 255, 255)',
  transparent: 'transparent',
};

// Style generator function
const createRGBStyle = (colorPath) => {
  const pathParts = colorPath.split('.');
  let color = rgbColors;
  
  for (const part of pathParts) {
    color = color[part];
    if (!color) return {};
  }
  
  return { color };
};

const createRGBBgStyle = (colorPath) => {
  const pathParts = colorPath.split('.');
  let color = rgbColors;
  
  for (const part of pathParts) {
    color = color[part];
    if (!color) return {};
  }
  
  return { backgroundColor: color };
};

const createRGBBorderStyle = (colorPath) => {
  const pathParts = colorPath.split('.');
  let color = rgbColors;
  
  for (const part of pathParts) {
    color = color[part];
    if (!color) return {};
  }
  
  return { borderColor: color };
};

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
          ...createRGBBgStyle('white'),
          ...createRGBBorderStyle('gray.100')
        }}
      >
        <div className="animate-pulse">
          <div 
            className="h-4 rounded w-32 mb-4"
            style={createRGBBgStyle('gray.300')}
          ></div>
          <div 
            className="h-6 rounded mb-4"
            style={createRGBBgStyle('gray.300')}
          ></div>
          <div className="space-y-3">
            <div 
              className="h-4 rounded"
              style={createRGBBgStyle('gray.300')}
            ></div>
            <div 
              className="h-4 rounded"
              style={createRGBBgStyle('gray.300')}
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
      color: rgbColors.green[500],
      bgColor: rgbColors.green[500],
      icon: CheckCircle,
      textColorStyle: createRGBStyle('green.600')
    },
    {
      label: 'For Renewal',
      count: forRenewalCount,
      percentage: forRenewalPercentage,
      color: rgbColors.amber[500],
      bgColor: rgbColors.amber[500],
      icon: RefreshCw,
      textColorStyle: createRGBStyle('amber.600')
    },
    {
      label: 'Terminated',
      count: terminatedCount,
      percentage: terminatedPercentage,
      color: rgbColors.red[500],
      bgColor: rgbColors.red[500],
      icon: XCircle,
      textColorStyle: createRGBStyle('red.600')
    },
    {
      label: 'Unknown',
      count: unknownCount,
      percentage: unknownPercentage,
      color: rgbColors.gray[500],
      bgColor: rgbColors.gray[500],
      icon: AlertTriangle,
      textColorStyle: createRGBStyle('gray.600')
    }
  ].filter(item => item.count > 0);

  return (
    <div 
      className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
      style={{ 
        ...createRGBBgStyle('white'),
        ...createRGBBorderStyle('gray.100')
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, createRGBBgStyle('gray.50'));
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, createRGBBgStyle('white'));
      }}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 
            className="font-semibold text-lg"
            style={createRGBStyle('gray.900')}
          >
            Sites Status Overview
          </h3>
          <p 
            className="text-sm mt-1"
            style={createRGBStyle('gray.600')}
          >
            Total Sites: {totalSites?.toLocaleString() || 0}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isPositiveTrend ? (
            <TrendingUp className="w-5 h-5" style={createRGBStyle('green.500')} />
          ) : (
            <TrendingDown className="w-5 h-5" style={createRGBStyle('red.500')} />
          )}
          <span 
            className="text-sm font-medium"
            style={createRGBStyle(isPositiveTrend ? 'green.600' : 'red.600')}
          >
            {trendValue}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="h-4 rounded-full overflow-hidden flex"
          style={createRGBBgStyle('gray.200')}
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
                <span 
                  className="text-xs font-bold"
                  style={createRGBStyle('white')}
                >
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
              style={createRGBBgStyle('gray.50')}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, createRGBBgStyle('gray.100'));
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, createRGBBgStyle('gray.50'));
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="p-2 rounded-lg group-hover/item:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <Icon className="w-4 h-4" style={createRGBStyle('white')} />
                </div>
                <span 
                  className="text-xl font-bold"
                  style={createRGBStyle('gray.900')}
                >
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span 
                  className="text-sm font-medium"
                  style={createRGBStyle('gray.700')}
                >
                  {item.label}
                </span>
                <span 
                  className="text-sm font-semibold"
                  style={item.textColorStyle}
                >
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
        style={createRGBBgStyle('blue.50')}
      >
        <div className="flex items-center justify-between">
          <div>
            <p 
              className="font-semibold text-sm"
              style={createRGBStyle('blue.900')}
            >
              Active Rate
            </p>
            <p 
              className="text-xs"
              style={createRGBStyle('blue.700')}
            >
              {activeCount} of {totalSites} sites operational
            </p>
          </div>
          <div 
            className="text-2xl font-bold"
            style={createRGBStyle('blue.900')}
          >
            {Math.round(activePercentage)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitesStatusBar;