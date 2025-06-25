import React from 'react';
import { Trophy, Medal, Award, MapPin, TrendingUp } from 'lucide-react';

const TopLGUListCard = ({ 
  title = "Top LGU per Province with Most Free WiFi", 
  data = []
}) => {
  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1: return <Medal className="w-4 h-4 text-gray-400" />;
      case 2: return <Award className="w-4 h-4 text-amber-600" />;
      default: return (
        <div 
          className="w-6 h-6 rounded-full text-gray-600 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: 'rgba(229, 231, 235, 1)' }}
        >
          {index + 1}
        </div>
      );
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return { 
        backgroundColor: 'rgba(255, 251, 235, 1)', 
        borderColor: 'rgba(254, 240, 138, 1)' 
      };
      case 1: return { 
        backgroundColor: 'rgba(249, 250, 251, 1)', 
        borderColor: 'rgba(229, 231, 235, 1)' 
      };
      case 2: return { 
        backgroundColor: 'rgba(255, 251, 235, 1)', 
        borderColor: 'rgba(252, 211, 77, 1)' 
      };
      default: return { 
        backgroundColor: 'rgba(249, 250, 251, 1)', 
        borderColor: 'rgba(229, 231, 235, 1)' 
      };
    }
  };

  return (
    <div 
      className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(243, 244, 246, 1)'
      }}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg mb-1">
            Top Performing LGUs
          </h3>
          <p className="text-gray-600 text-sm">
            {title}
          </p>
        </div>
        <div 
          className="p-2 rounded-xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 1), rgba(34, 197, 94, 1))'
          }}
        >
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* LGU List */}
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.slice(0, 8).map((lgu, index) => {
            const colors = getRankColor(index);
            return (
              <div 
                key={lgu.id || index} 
                className="border rounded-xl p-4 transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: colors.backgroundColor,
                  borderColor: colors.borderColor
                }}
                onMouseEnter={(e) => {
                  if (index >= 3) {
                    e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index >= 3) {
                    e.currentTarget.style.backgroundColor = colors.backgroundColor;
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(index)}
                    </div>
                    
                    {/* LGU Info */}
                    <div className="flex-1">
                      <div className="text-gray-900 font-semibold text-sm">
                        {lgu.name}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600 text-xs">
                          {lgu.subtext || lgu.province || 'Unknown Province'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Count */}
                  <div className="text-right">
                    <div className="text-gray-900 text-lg font-bold">
                      {lgu.value || lgu.count || 0}
                    </div>
                    <div className="text-gray-500 text-xs">
                      sites
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(229, 231, 235, 1)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        background: 'linear-gradient(90deg, rgba(59, 130, 246, 1), rgba(147, 51, 234, 1))',
                        width: `${data.length > 0 ? ((lgu.value || lgu.count || 0) / Math.max(...data.map(d => d.value || d.count || 0))) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div 
          className="rounded-xl p-8 text-center"
          style={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
        >
          <div className="text-gray-500 mb-2">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
          </div>
          <p className="text-gray-500 text-sm">
            No LGU data available
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Data will appear when WiFi sites are activated
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {data && data.length > 0 && (
        <div 
          className="mt-6 pt-4"
          style={{ borderTop: '1px solid rgba(243, 244, 246, 1)' }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-gray-900 text-lg font-bold">
                {data.length}
              </div>
              <div className="text-gray-600 text-xs">
                Top LGUs
              </div>
            </div>
            <div>
              <div className="text-gray-900 text-lg font-bold">
                {data.reduce((sum, lgu) => sum + (lgu.value || lgu.count || 0), 0)}
              </div>
              <div className="text-gray-600 text-xs">
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