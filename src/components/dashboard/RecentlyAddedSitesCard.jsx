// File: components/dashboard/RecentlyAddedSitesCard.jsx
import React, { useState } from 'react';
import { TrendingUp, Wifi, MapPin, Calendar } from 'lucide-react';

const RecentlyAddedSitesCard = ({ data = [], loading = false }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 5);

  if (loading) {
    return (
      <div 
        className="rounded-lg shadow p-4"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderColor: 'rgba(225, 225, 225, 1)'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-600" size={20} />
          <h3 className="font-semibold text-gray-800">Recently Added Sites</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div 
                className="h-4 rounded w-3/4 mb-2"
                style={{ backgroundColor: 'rgba(229, 231, 235, 1)' }}
              ></div>
              <div 
                className="h-3 rounded w-1/2"
                style={{ backgroundColor: 'rgba(229, 231, 235, 1)' }}
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
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(225, 225, 225, 1)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          <h3 className="font-semibold text-gray-800">Recently Added Sites</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <span 
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(220, 252, 231, 1)' }}
          >
            +{data.length} New
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
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
                  borderLeft: '4px solid rgba(34, 197, 94, 1)',
                  backgroundColor: 'rgba(240, 253, 244, 1)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">{site.siteName || site.site_name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
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
                          backgroundColor: 'rgba(220, 252, 231, 1)',
                          color: 'rgba(22, 101, 52, 1)'
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
              className="w-full mt-3 py-2 text-sm text-green-600 hover:text-green-700 font-medium pt-3"
              style={{ 
                borderTop: '1px solid rgba(229, 231, 235, 1)'
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

export default RecentlyAddedSitesCard;