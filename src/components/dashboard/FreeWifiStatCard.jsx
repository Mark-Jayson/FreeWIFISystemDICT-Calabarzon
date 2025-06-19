import React from 'react';
import { 
  Wifi, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertTriangle,
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

const FreeWifiStatCard = ({
  title = "Total No. of FreeWiFi Sites",
  totalSites = 0,
  activeSites = 0,
  terminatedSites = 0,
  forRenewalSites = 0,
  unknownSites = 0,
  trendValue = '0%',
  isPositiveTrend = true,
  loading = false,
  error = null,
  darkMode = false
}) => {
  // Calculate percentages
  const activePercentage = totalSites > 0 ? ((activeSites / totalSites) * 100).toFixed(1) : 0;
  const terminatedPercentage = totalSites > 0 ? ((terminatedSites / totalSites) * 100).toFixed(1) : 0;
  const forRenewalPercentage = totalSites > 0 ? ((forRenewalSites / totalSites) * 100).toFixed(1) : 0;
  const unknownPercentage = totalSites > 0 ? ((unknownSites / totalSites) * 100).toFixed(1) : 0;

  const StatItem = ({ icon: Icon, label, value, percentage, color, isMain = false }) => (
    <div className={`${isMain ? 'col-span-2' : ''} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 hover:${darkMode ? 'bg-gray-650' : 'bg-gray-100'} transition-colors duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`w-4 h-4 text-${color}-600`} />
          </div>
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>
            {label}
          </span>
        </div>
        {percentage && (
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} bg-${color}-100 text-${color}-700 px-2 py-1 rounded-full`}>
            {percentage}%
          </span>
        )}
      </div>
      <div className={`${darkMode ? 'text-white' : 'text-gray-900'} ${isMain ? 'text-3xl' : 'text-xl'} font-bold`}>
        {value.toLocaleString()}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-6 transition-all duration-300`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2 h-20 bg-gray-300 rounded-xl"></div>
            <div className="h-16 bg-gray-300 rounded-xl"></div>
            <div className="h-16 bg-gray-300 rounded-xl"></div>
            <div className="h-16 bg-gray-300 rounded-xl"></div>
            <div className="h-16 bg-gray-300 rounded-xl"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-6 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>{title}</h3>
          <div className="p-2 rounded-xl bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-red-500 mb-2">Error</div>
          <p className="text-red-600 font-medium mb-1">Failed to load data</p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {error}
          </p>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">Unable to load statistics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} text-lg font-semibold`}>{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          {trendValue && (
            <div className={`flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveTrend ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatItem
          icon={Wifi}
          label="Total Sites"
          value={totalSites}
          color="blue"
          isMain={true}
        />
        
        <StatItem
          icon={CheckCircle}
          label="Active"
          value={activeSites}
          percentage={activePercentage}
          color="green"
        />
        
        <StatItem
          icon={XCircle}
          label="Terminated"
          value={terminatedSites}
          percentage={terminatedPercentage}
          color="red"
        />
        
        <StatItem
          icon={RefreshCw}
          label="For Renewal"
          value={forRenewalSites}
          percentage={forRenewalPercentage}
          color="yellow"
        />
        
        <StatItem
          icon={AlertTriangle}
          label="Unknown"
          value={unknownSites}
          percentage={unknownPercentage}
          color="gray"
        />
      </div>

      {/* Progress Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Active Rate</span>
          <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-bold`}>{activePercentage}%</span>
        </div>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-2 rounded-full overflow-hidden`}>
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${activePercentage}%` }}
          />
        </div>
      </div>

      {/* Summary Text */}
      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-4 text-center`}>
        <span className="font-medium">{activeSites.toLocaleString()}</span> active sites out of{' '}
        <span className="font-medium">{totalSites.toLocaleString()}</span> total WiFi locations
      </div>
    </div>
  );
};

export default FreeWifiStatCard;