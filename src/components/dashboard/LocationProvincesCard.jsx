import React from 'react';
import { MapPin, TrendingUp, TrendingDown } from 'lucide-react';

const LocationProvincesCard = ({ 
  locationCount, 
  trendValue, 
  provincesData, 
  darkMode = false 
}) => {
  const isPositiveTrend = trendValue && trendValue.startsWith('+');
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>
              Locations Served
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              Active WiFi coverage areas
            </p>
          </div>
        </div>
      </div>

      {/* Main Count */}
      <div className="mb-6">
        <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-4xl font-bold mb-2`}>
          {locationCount ? locationCount.toLocaleString() : '0'}
        </div>
        {trendValue && (
          <div className={`flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? 
              <TrendingUp className="w-4 h-4 mr-1" /> : 
              <TrendingDown className="w-4 h-4 mr-1" />
            }
            <span className="font-medium">{trendValue}</span>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>vs last month</span>
          </div>
        )}
      </div>

      {/* Province Distribution */}
      {provincesData && provincesData.length > 0 && (
        <div>
          <h4 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium mb-4 text-sm`}>
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
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium`}>
                    {province.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-20 h-2 rounded-full overflow-hidden`}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${provincesData.length > 0 ? (province.value / Math.max(...provincesData.map(p => p.value))) * 100 : 0}%`,
                        backgroundColor: province.color 
                      }}
                    />
                  </div>
                  <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-sm w-8 text-right`}>
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
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            No province data available
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationProvincesCard;