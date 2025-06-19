import React from 'react';
import { Trophy, Medal, Award, MapPin, TrendingUp } from 'lucide-react';

const TopLGUListCard = ({ 
  title = "Top LGU per Province with Most Free WiFi", 
  data = [], 
  darkMode = false 
}) => {
  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1: return <Medal className="w-4 h-4 text-gray-400" />;
      case 2: return <Award className="w-4 h-4 text-amber-600" />;
      default: return <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'} flex items-center justify-center text-xs font-bold`}>{index + 1}</div>;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200';
      case 1: return darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
      case 2: return darkMode ? 'bg-amber-900 border-amber-700' : 'bg-amber-50 border-amber-200';
      default: return darkMode ? 'bg-gray-700 hover:bg-gray-650 border-gray-600' : 'bg-gray-50 hover:bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-lg mb-1`}>
            Top Performing LGUs
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {title}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-gradient-to-br from-green-400 to-green-600">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* LGU List */}
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.slice(0, 8).map((lgu, index) => (
            <div 
              key={lgu.id || index} 
              className={`${getRankColor(index)} border rounded-xl p-4 transition-all duration-200 hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index)}
                  </div>
                  
                  {/* LGU Info */}
                  <div className="flex-1">
                    <div className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-sm`}>
                      {lgu.name}
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                        {lgu.subtext || lgu.province || 'Unknown Province'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Count */}
                <div className="text-right">
                  <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>
                    {lgu.value || lgu.count || 0}
                  </div>
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                    sites
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className={`${darkMode ? 'bg-gray-600' : 'bg-gray-200'} h-2 rounded-full overflow-hidden`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${data.length > 0 ? ((lgu.value || lgu.count || 0) / Math.max(...data.map(d => d.value || d.count || 0))) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-8 text-center`}>
          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            No LGU data available
          </p>
          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-xs mt-1`}>
            Data will appear when WiFi sites are activated
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {data && data.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>
                {data.length}
              </div>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                Top LGUs
              </div>
            </div>
            <div>
              <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-lg font-bold`}>
                {data.reduce((sum, lgu) => sum + (lgu.value || lgu.count || 0), 0)}
              </div>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                Total Sites
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopLGUListCard;