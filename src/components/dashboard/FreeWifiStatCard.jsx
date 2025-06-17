import React from 'react';

const FreeWifiStatCard = ({
  title = "Free WiFi Sites",
  totalSites = 0,
  activeSites = 0,
  terminatedSites = 0,
  forRenewalSites = 0,
  unknownSites = 0,
  trendValue = "0%",
  isPositiveTrend = false,
  loading = false,
  error = null,
}) => {
  const safeTotalSites = totalSites ?? 0;
  const safeActive = activeSites ?? 0;
  const safeTerminated = terminatedSites ?? 0;
  const safeRenewal = forRenewalSites ?? 0;
  const safeUnknown = unknownSites ?? Math.max(safeTotalSites - (safeActive + safeTerminated + safeRenewal), 0);

  let activePercentage = 0;
  let terminatedPercentage = 0;
  let renewalPercentage = 0;
  let unknownPercentage = 0;

  if (safeTotalSites > 0) {
    activePercentage = Math.round((safeActive / safeTotalSites) * 100);
    terminatedPercentage = Math.round((safeTerminated / safeTotalSites) * 100);
    renewalPercentage = Math.round((safeRenewal / safeTotalSites) * 100);
    unknownPercentage = 100 - (activePercentage + terminatedPercentage + renewalPercentage);
    if (unknownPercentage < 0) unknownPercentage = 0;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <div className="flex items-start mb-4">
          <div className="w-1 h-12 bg-blue-500 mr-3 mt-1"></div>
          <div>
            <div className="text-sm font-medium mb-1 text-gray-600">{title}</div>
            <div className="text-4xl font-bold text-gray-400">Loading...</div>
            <div className="text-xs text-gray-400 mt-1">Fetching data...</div>
          </div>
        </div>
        <div className="text-xs text-gray-600 mb-2">Total Sites: Loading...</div>
        <div className="flex h-6 rounded-sm overflow-hidden mb-2 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-full">
        <div className="flex items-start mb-4">
          <div className="w-1 h-12 bg-red-500 mr-3 mt-1"></div>
          <div>
            <div className="text-sm font-medium mb-1 text-gray-600">{title}</div>
            <div className="text-4xl font-bold text-red-600">Error</div>
            <div className="text-xs text-red-600 mt-1">Failed to load data</div>
          </div>
        </div>
        <div className="text-xs text-red-600 mb-2">{error}</div>
        <div className="flex h-6 rounded-sm overflow-hidden mb-2 bg-red-100">
          <div className="w-full flex items-center justify-center text-red-600 text-xs">
            Unable to load statistics
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="flex items-start mb-4">
        <div className="w-1 h-12 bg-blue-500 mr-3 mt-1"></div>
        <div>
          <div className="text-sm font-medium mb-1 text-gray-600">{title}</div>
          <div className="text-4xl font-bold text-gray-900">
            {safeTotalSites.toLocaleString()}
          </div>
          <div className={`flex items-center text-xs mt-1 ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">{isPositiveTrend ? '↑' : '↓'}</span> {trendValue}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-2">
        Total Sites: {safeTotalSites.toLocaleString()}
      </div>

      {/* Progress bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2 relative flex">
        {activePercentage > 0 && (
          <div className="h-full bg-green-500" style={{ width: `${activePercentage}%` }} />
        )}
        {terminatedPercentage > 0 && (
          <div className="h-full bg-red-500" style={{ width: `${terminatedPercentage}%` }} />
        )}
        {renewalPercentage > 0 && (
          <div className="h-full bg-yellow-400" style={{ width: `${renewalPercentage}%` }} />
        )}
        {unknownPercentage > 0 && (
          <div className="h-full bg-gray-100" style={{ width: `${unknownPercentage}%` }} />
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-sm text-gray-700 mt-1 flex-wrap gap-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="font-medium">{safeActive.toLocaleString()}</span>
          <span>Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="font-medium">{safeTerminated.toLocaleString()}</span>
          <span>Terminated</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="font-medium">{safeRenewal.toLocaleString()}</span>
          <span>For Renewal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-gray-100 rounded-full"></span>
          <span className="font-medium">{safeUnknown.toLocaleString()}</span>
          <span>Unknown</span>
        </div>
      </div>
    </div>
  );
};

export default FreeWifiStatCard;
