import React from 'react';
import { Users, Shield, MapPin } from 'lucide-react';

const KeyMetricCard = ({ 
  gidaCount = 0, 
  elcacCount = 0, 
  darkMode = false 
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
            Service Areas
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Special program coverage
          </p>
        </div>
        <Users className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* GIDA Count */}
        <div className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-blue-50 hover:bg-blue-100'} 
          rounded-xl p-4 text-center transition-colors duration-200 cursor-pointer group`}>
          <div className="flex items-center justify-center mb-2">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} group-hover:scale-110 transition-transform duration-200`}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'} mb-1`}>
            {gidaCount.toLocaleString()}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-700'} font-medium`}>
            GIDA Serviced
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-blue-600'} mt-1`}>
            Geographically Isolated Areas
          </div>
        </div>
        
        {/* ELCAC Count */}
        <div className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-purple-50 hover:bg-purple-100'} 
          rounded-xl p-4 text-center transition-colors duration-200 cursor-pointer group`}>
          <div className="flex items-center justify-center mb-2">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} group-hover:scale-110 transition-transform duration-200`}>
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-purple-900'} mb-1`}>
            {elcacCount.toLocaleString()}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-purple-700'} font-medium`}>
            ELCAC Areas
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-purple-600'} mt-1`}>
            End Local Communist Conflict
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between text-sm">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Special Areas
          </span>
          <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
            {(gidaCount + elcacCount).toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Status Indicator */}
      {(gidaCount > 0 || elcacCount > 0) && (
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Active Coverage</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyMetricCard;