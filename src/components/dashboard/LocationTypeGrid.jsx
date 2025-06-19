// components/dashboard/LocationTypeGrid.jsx
import React from 'react';
import { MapPin, Building, Home, School, Hospital, TreePine } from 'lucide-react';

const LocationTypeGrid = ({ title, subtitle, data, darkMode = false }) => {
  // Icon mapping for different location types
  const getLocationIcon = (name) => {
    const iconMap = {
      'Municipal Hall': Building,
      'School': School,
      'Hospital': Hospital,
      'Barangay Hall': Home,
      'Public Plaza': TreePine,
      'Market': Building,
      'Community Center': Building,
      'Unknown': MapPin
    };
    
    const IconComponent = iconMap[name] || MapPin;
    return IconComponent;
  };

  // Color mapping for different location types
  const getLocationColor = (name, index) => {
    const colorMap = {
      'Municipal Hall': 'from-blue-400 to-blue-600',
      'School': 'from-green-400 to-green-600',
      'Hospital': 'from-red-400 to-red-600',
      'Barangay Hall': 'from-purple-400 to-purple-600',
      'Public Plaza': 'from-emerald-400 to-emerald-600',
      'Market': 'from-orange-400 to-orange-600',
      'Community Center': 'from-indigo-400 to-indigo-600',
      'Unknown': 'from-gray-400 to-gray-600'
    };
    
    return colorMap[name] || `from-gray-${400 + (index % 3) * 100} to-gray-${600 + (index % 3) * 100}`;
  };

  // If no data, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
        rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
        <div className="mb-6">
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="text-center py-8">
          <MapPin className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-3`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            No location data available
          </p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="mb-6">
        <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold mb-1`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Grid of location types */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {data.slice(0, 6).map((item, index) => {
          const IconComponent = getLocationIcon(item.name);
          const colorClass = getLocationColor(item.name, index);
          const percentage = total > 0 ? ((item.value / total) * 100) : 0;
          
          return (
            <div
              key={index}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} 
                rounded-xl p-4 transition-all duration-200 cursor-pointer group hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs font-medium`}>
                  {percentage.toFixed(1)}%
                </div>
              </div>
              
              <div>
                <div className={`${darkMode ? 'text-white' : 'text-gray-900'} font-bold text-lg mb-1`}>
                  {item.value.toLocaleString()}
                </div>
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium leading-tight`}>
                  {item.name}
                </div>
              </div>
              
              {/* Mini progress bar */}
              <div className={`${darkMode ? 'bg-gray-600' : 'bg-gray-200'} h-1 rounded-full mt-3 overflow-hidden`}>
                <div 
                  className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Show additional items if more than 6 */}
      {data.length > 6 && (
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3`}>
          <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-2`}>
            Other Location Types
          </div>
          <div className="grid grid-cols-1 gap-2">
            {data.slice(6).map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100) : 0;
              return (
                <div key={index + 6} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xs font-semibold`}>
                      {item.value}
                    </span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Total summary */}
      {total > 0 && (
        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-4 text-center pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          Total Sites: <span className="font-semibold">{total.toLocaleString()}</span> across {data.length} location types
        </div>
      )}
    </div>
  );
};

export default LocationTypeGrid;