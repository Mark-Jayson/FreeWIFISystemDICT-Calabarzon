// File: components/dashboard/RecentlyTerminatedSitesCard.jsx
import React, { useState } from 'react';
import { TrendingDown, AlertCircle, MapPin, Calendar } from 'lucide-react';

// RGB color overrides for Tailwind's default OKLCH colors
const colorOverrides = {
  // Red colors
  'text-red-600': { color: 'rgb(220, 38, 38)' },
  'text-red-700': { color: 'rgb(185, 28, 28)' },
  'bg-red-50': { backgroundColor: 'rgb(254, 242, 242)' },
  'bg-red-100': { backgroundColor: 'rgb(254, 226, 226)' },
  'bg-red-900': { color: 'rgb(127, 29, 29)' },
  'border-red-500': { borderColor: 'rgb(239, 68, 68)' },
  
  // Gray colors
  'text-gray-500': { color: 'rgb(107, 114, 128)' },
  'text-gray-600': { color: 'rgb(75, 85, 99)' },
  'text-gray-800': { color: 'rgb(31, 41, 55)' },
  'bg-gray-300': { backgroundColor: 'rgb(209, 213, 219)' },
  'bg-white': { backgroundColor: 'rgb(255, 255, 255)' },
  'border-gray-200': { borderColor: 'rgb(229, 231, 235)' },
  'border-gray-300': { borderColor: 'rgb(209, 213, 219)' },
};

// Helper function to apply color overrides
const applyColorOverrides = (classNames) => {
  const styles = {};
  if (typeof classNames === 'string') {
    classNames.split(' ').forEach(className => {
      if (colorOverrides[className]) {
        Object.assign(styles, colorOverrides[className]);
      }
    });
  }
  return styles;
};

const RecentlyTerminatedSitesCard = ({ data = [], loading = false }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 5);

  if (loading) {
    return (
      <div 
        className="rounded-lg shadow p-4"
        style={{ 
          ...applyColorOverrides('bg-white border-gray-200'),
          border: '1px solid'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown 
            size={20} 
            style={applyColorOverrides('text-red-600')}
          />
          <h3 
            className="font-semibold"
            style={applyColorOverrides('text-gray-800')}
          >
            Recently Terminated Sites
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div 
                className="h-4 rounded w-3/4 mb-2"
                style={applyColorOverrides('bg-gray-300')}
              ></div>
              <div 
                className="h-3 rounded w-1/2"
                style={applyColorOverrides('bg-gray-300')}
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
        ...applyColorOverrides('bg-white border-gray-200'),
        border: '1px solid'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown 
            size={20} 
            style={applyColorOverrides('text-red-600')}
          />
          <h3 
            className="font-semibold"
            style={applyColorOverrides('text-gray-800')}
          >
            Recently Terminated Sites
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span 
            className="px-2 py-1 rounded-full"
            style={{ 
              ...applyColorOverrides('bg-red-100 text-red-600')
            }}
          >
            -{data.length} Terminated
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div 
          className="text-center py-8"
          style={applyColorOverrides('text-gray-500')}
        >
          <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p>No recently terminated sites</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayData.map((site, index) => (
              <div 
                key={index} 
                className="pl-3 py-2 rounded-r"
                style={{ 
                  borderLeft: '4px solid rgb(239, 68, 68)', // border-red-500
                  ...applyColorOverrides('bg-red-50')
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 
                      className="font-medium text-sm"
                      style={applyColorOverrides('text-gray-800')}
                    >
                      {site.siteName || site.site_name}
                    </h4>
                    <div 
                      className="flex items-center gap-4 mt-1 text-xs"
                      style={applyColorOverrides('text-gray-600')}
                    >
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{site.municipality}, {site.province}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{site.dateTerminated || site.date_terminated}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span 
                        className="inline-block px-2 py-1 text-xs rounded-full"
                        style={{ 
                          ...applyColorOverrides('bg-red-100'),
                          color: 'rgb(127, 29, 29)' // text-red-900
                        }}
                      >
                        Terminated
                      </span>
                      {(site.reason || site.termination_reason) && (
                        <span 
                          className="text-xs"
                          style={applyColorOverrides('text-gray-500')}
                        >
                          Reason: {site.reason || site.termination_reason}
                        </span>
                      )}
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
                borderTop: '1px solid rgb(229, 231, 235)', // border-gray-200
                ...applyColorOverrides('text-red-600'),
                ':hover': applyColorOverrides('text-red-700')
              }}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, applyColorOverrides('text-red-700'));
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, applyColorOverrides('text-red-600'));
              }}
            >
              {showAll ? 'Show Less' : `Show All ${data.length} Sites`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RecentlyTerminatedSitesCard;