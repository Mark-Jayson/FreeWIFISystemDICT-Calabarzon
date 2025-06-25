import React from 'react';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';

const LocationProvincesCard = ({ 
  locationCount, 
  trendValue, 
  provincesData 
}) => {
  const isPositiveTrend = trendValue && trendValue.startsWith('+');
  
  // Custom RGBA colors
  const colors = {
    background: 'rgba(255, 255, 255, 1)', // bg-white
    border: 'rgba(243, 244, 246, 1)', // border-gray-100
    text: {
      primary: 'rgba(17, 24, 39, 1)', // text-gray-900
      secondary: 'rgba(75, 85, 99, 1)', // text-gray-600
      tertiary: 'rgba(55, 65, 81, 1)', // text-gray-700
      muted: 'rgba(107, 114, 128, 1)', // text-gray-500
    },
    purple: {
      400: 'rgba(196, 181, 253, 1)',
      600: 'rgba(147, 51, 234, 1)',
    },
    green: {
      600: 'rgba(22, 163, 74, 1)',
    },
    red: {
      600: 'rgba(220, 38, 38, 1)',
    },
    gray: {
      50: 'rgba(249, 250, 251, 1)',
      200: 'rgba(229, 231, 235, 1)',
    },
    white: 'rgba(255, 255, 255, 1)',
  };

  return (
    <div 
      className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border
      }}
    >
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${colors.purple[400]}, ${colors.purple[600]})`
            }}
          >
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 
              className="font-semibold text-lg"
              style={{ color: colors.text.primary }}
            >
              Locations Served
            </h3>
            <p 
              className="text-sm"
              style={{ color: colors.text.secondary }}
            >
              Active WiFi coverage areas
            </p>
          </div>
        </div>
      </div>

      {/* Main Count */}
      <div className="mb-6">
        <div 
          className="text-4xl font-bold mb-2"
          style={{ color: colors.text.primary }}
        >
          {locationCount ? locationCount.toLocaleString() : '0'}
        </div>
        {trendValue && (
          <div 
            className="flex items-center text-sm"
            style={{ color: isPositiveTrend ? colors.green[600] : colors.red[600] }}
          >
            {isPositiveTrend ? 
              <TrendingUp className="w-4 h-4 mr-1" /> : 
              <TrendingDown className="w-4 h-4 mr-1" />
            }
            <span className="font-medium">{trendValue}</span>
            <span 
              className="ml-1"
              style={{ color: colors.text.muted }}
            >
              vs last month
            </span>
          </div>
        )}
      </div>

      {/* Province Distribution */}
      {provincesData && provincesData.length > 0 && (
        <div>
          <h4 
            className="font-medium mb-4 text-sm"
            style={{ color: colors.text.primary }}
          >
            Distribution by Province
          </h4>
          <div className="space-y-3">
            {provincesData.map((province, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: province.color }}
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: colors.text.tertiary }}
                  >
                    {province.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-20 h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.gray[200] }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${provincesData.length > 0 ? (province.value / Math.max(...provincesData.map(p => p.value))) * 100 : 0}%`,
                        backgroundColor: province.color 
                      }}
                    />
                  </div>
                  <span 
                    className="font-semibold text-sm w-8 text-right"
                    style={{ color: colors.text.primary }}
                  >
                    {province.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!provincesData || provincesData.length === 0) && (
        <div 
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: colors.gray[50] }}
        >
          <p 
            className="text-sm"
            style={{ color: colors.text.muted }}
          >
            No province data available
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationProvincesCard;