// File: components/dashboard/RecentlyTerminatedSitesCard.jsx
import React, { useState } from 'react';
import { TrendingDown, AlertCircle, MapPin, Calendar } from 'lucide-react';

const RecentlyTerminatedSitesCard = ({ data = [], loading = false }) => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? data : data.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-red-600" size={20} />
          <h3 className="font-semibold text-gray-800">Recently Terminated Sites</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="text-red-600" size={20} />
          <h3 className="font-semibold text-gray-800">Recently Terminated Sites</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
          <span className="bg-red-100 px-2 py-1 rounded-full">
            -{data.length} Terminated
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
          <p>No recently terminated sites</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayData.map((site, index) => (
              <div key={index} className="border-l-4 border-red-500 pl-3 py-2 bg-red-50 rounded-r">
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
                        <span>{site.dateTerminated || site.date_terminated}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Terminated
                      </span>
                      {(site.reason || site.termination_reason) && (
                        <span className="text-xs text-gray-500">
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
              className="w-full mt-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium border-t border-gray-200 pt-3"
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
