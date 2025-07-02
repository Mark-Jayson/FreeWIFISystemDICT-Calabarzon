// File: components/dashboard/RecentlyAddedSitesCard.jsx
import React, { useState } from 'react';
import { TrendingUp, Wifi, MapPin, Calendar } from 'lucide-react';

const RecentlyAddedSitesCard = ({ data = [], loading = false }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 5);

  // RGB color overrides for consistent cross-browser support
  const colors = {
    // Green color palette (RGB equivalents)
    green50: 'rgb(240, 253, 244)',    // bg-green-50
    green100: 'rgb(220, 252, 231)',   // bg-green-100
    green600: 'rgb(22, 163, 74)',     // text-green-600
    green700: 'rgb(21, 128, 61)',     // hover:text-green-700
    green800: 'rgb(22, 101, 52)',     // text-green-800
    green900: 'rgb(20, 83, 45)',      // text-green-900
    
    // Gray color palette (RGB equivalents)
    gray50: 'rgb(249, 250, 251)',     // bg-gray-50
    gray200: 'rgb(229, 231, 235)',    // border-gray-200
    gray300: 'rgb(209, 213, 219)',    // border-gray-300
    gray500: 'rgb(107, 114, 128)',    // text-gray-500
    gray600: 'rgb(75, 85, 99)',       // text-gray-600
    gray800: 'rgb(31, 41, 55)',       // text-gray-800
    
    // White and other colors
    white: 'rgb(255, 255, 255)',      // bg-white
    transparent: 'transparent'
  };

  if (loading) {
    return (
      <div 
        className="rounded-lg shadow p-4"
        style={{ 
          backgroundColor: colors.white,
          borderColor: colors.gray200
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp style={{ color: colors.green600 }} size={20} />
          <h3 className="font-semibold" style={{ color: colors.gray800 }}>
            Recently Added Sites
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div 
                className="h-4 rounded w-3/4 mb-2"
                style={{ backgroundColor: colors.gray200 }}
              ></div>
              <div 
                className="h-3 rounded w-1/2"
                style={{ backgroundColor: colors.gray200 }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg shadow p-4"
      style={{ 
        backgroundColor: colors.white,
        borderColor: colors.gray200
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp style={{ color: colors.green600 }} size={20} />
          <h3 className="font-semibold" style={{ color: colors.gray800 }}>
            Recently Added Sites
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span 
            className="px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: colors.green100,
              color: colors.green600
            }}
          >
            +{data.length} New
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8" style={{ color: colors.gray500 }}>
          <Wifi size={32} className="mx-auto mb-2 opacity-50" />
          <p>No recently added sites</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayData.map((site, index) => (
              <div 
                key={index} 
                className="pl-3 py-2 rounded-r"
                style={{ 
                  borderLeft: `4px solid ${colors.green600}`,
                  backgroundColor: colors.green50
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm" style={{ color: colors.gray800 }}>
                      {site.siteName || site.site_name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: colors.gray600 }}>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{site.municipality}, {site.province}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{site.dateAdded || site.date_added}</span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <span 
                        className="inline-block px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: colors.green100,
                          color: colors.green800
                        }}
                      >
                        {site.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-3 py-2 text-sm font-medium pt-3 transition-colors duration-200"
              style={{ 
                borderTop: `1px solid ${colors.gray200}`,
                color: colors.green600
              }}
              onMouseEnter={(e) => e.target.style.color = colors.green700}
              onMouseLeave={(e) => e.target.style.color = colors.green600}
            >
              {showAll ? 'Show Less' : `Show All ${data.length} Sites`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RecentlyAddedSitesCard;