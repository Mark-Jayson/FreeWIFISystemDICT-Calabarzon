import React from 'react';
import { Trophy, Medal, Award, MapPin, TrendingUp } from 'lucide-react';

const TopLGUListCard = ({
  title = "Top LGU per Province with Most Free WiFi",
  data = []
}) => {
  // RGB color overrides for Tailwind's OKLCH colors
  const colorOverrides = {
    // Yellow colors
    'text-yellow-500': { color: 'rgb(234, 179, 8)' },
    
    // Gray colors
    'text-gray-400': { color: 'rgb(156, 163, 175)' },
    'text-gray-500': { color: 'rgb(107, 114, 128)' },
    'text-gray-600': { color: 'rgb(75, 85, 99)' },
    'text-gray-900': { color: 'rgb(17, 24, 39)' },
    
    // Amber colors
    'text-amber-600': { color: 'rgb(217, 119, 6)' },
    
    // Background colors
    'bg-white': { backgroundColor: 'rgb(255, 255, 255)' },
    'bg-gray-50': { backgroundColor: 'rgb(249, 250, 251)' },
    'bg-gray-100': { backgroundColor: 'rgb(243, 244, 246)' },
    'bg-gray-200': { backgroundColor: 'rgb(229, 231, 235)' },
    
    // Border colors
    'border-gray-200': { borderColor: 'rgb(229, 231, 235)' },
    'border-gray-300': { borderColor: 'rgb(209, 213, 219)' },
    
    // Blue colors
    'bg-blue-500': { backgroundColor: 'rgb(59, 130, 246)' },
    'text-blue-600': { color: 'rgb(37, 99, 235)' },
    
    // Purple colors
    'bg-purple-600': { backgroundColor: 'rgb(147, 51, 234)' },
    
    // Green colors
    'bg-green-400': { backgroundColor: 'rgb(74, 222, 128)' },
    'bg-green-500': { backgroundColor: 'rgb(34, 197, 94)' },
    'text-green-600': { color: 'rgb(22, 163, 74)' }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="w-4 h-4" style={colorOverrides['text-yellow-500']} />;
      case 1: return <Medal className="w-4 h-4" style={colorOverrides['text-gray-400']} />;
      case 2: return <Award className="w-4 h-4" style={colorOverrides['text-amber-600']} />;
      default: return (
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: 'rgb(229, 231, 235)',
            color: 'rgb(75, 85, 99)'
          }}
        >
          {index + 1}
        </div>
      );
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return { 
        backgroundColor: 'rgb(255, 251, 235)', 
        borderColor: 'rgb(254, 240, 138)' 
      };
      case 1: return { 
        backgroundColor: 'rgb(249, 250, 251)', 
        borderColor: 'rgb(229, 231, 235)' 
      };
      case 2: return { 
        backgroundColor: 'rgb(255, 251, 235)', 
        borderColor: 'rgb(252, 211, 77)' 
      };
      default: return { 
        backgroundColor: 'rgb(249, 250, 251)', 
        borderColor: 'rgb(229, 231, 235)' 
      };
    }
  };

  return (
    <div
      className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
      style={{ 
        backgroundColor: 'rgb(255, 255, 255)',
        borderColor: 'rgb(243, 244, 246)'
      }}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-1" style={colorOverrides['text-gray-900']}>
             Province with Most Free WiFi
          </h3>
          <p className="text-sm" style={colorOverrides['text-gray-600']}>
            {title}
          </p>
        </div>
        <div
          className="p-2 rounded-xl"
          style={{ 
            background: 'linear-gradient(135deg, rgb(74, 222, 128), rgb(34, 197, 94))'
          }}
        >
          <TrendingUp className="w-5 h-5" style={{ color: 'rgb(255, 255, 255)' }} />
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
                    e.currentTarget.style.backgroundColor = 'rgb(243, 244, 246)';
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
                      <div className="font-semibold text-sm" style={colorOverrides['text-gray-900']}>
                        {lgu.name}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3" style={colorOverrides['text-gray-500']} />
                        <span className="text-xs" style={colorOverrides['text-gray-600']}>
                          {lgu.subtext || lgu.province || 'Unknown Province'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Count */}
                  <div className="text-right">
                    <div className="text-lg font-bold" style={colorOverrides['text-gray-900']}>
                      {lgu.value || lgu.count || 0}
                    </div>
                    <div className="text-xs" style={colorOverrides['text-gray-500']}>
                      sites
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgb(229, 231, 235)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        background: 'linear-gradient(90deg, rgb(59, 130, 246), rgb(147, 51, 234))',
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
          style={{ backgroundColor: 'rgb(249, 250, 251)' }}
        >
          <div className="mb-2" style={colorOverrides['text-gray-500']}>
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
          </div>
          <p className="text-sm" style={colorOverrides['text-gray-500']}>
            No LGU data available
          </p>
          <p className="text-xs mt-1" style={colorOverrides['text-gray-400']}>
            Data will appear when WiFi sites are activated
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {data && data.length > 0 && (
        <div
          className="mt-6 pt-4"
          style={{ borderTop: '1px solid rgb(243, 244, 246)' }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold" style={colorOverrides['text-gray-900']}>
                {data.length}
              </div>
              <div className="text-xs" style={colorOverrides['text-gray-600']}>
                Top LGUs
              </div>
            </div>
            <div>
              <div className="text-lg font-bold" style={colorOverrides['text-gray-900']}>
                {data
                  .reduce((sum, lgu) => sum + Number(lgu.value || lgu.count || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs" style={colorOverrides['text-gray-600']}>
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