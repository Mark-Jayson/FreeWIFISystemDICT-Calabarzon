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
  error = null
}) => {
  // Calculate percentages
  const activePercentage = totalSites > 0 ? ((activeSites / totalSites) * 100).toFixed(1) : 0;
  const terminatedPercentage = totalSites > 0 ? ((terminatedSites / totalSites) * 100).toFixed(1) : 0;
  const forRenewalPercentage = totalSites > 0 ? ((forRenewalSites / totalSites) * 100).toFixed(1) : 0;
  const unknownPercentage = totalSites > 0 ? ((unknownSites / totalSites) * 100).toFixed(1) : 0;

  // RGB color palette
  const colors = {
    background: 'rgba(255, 255, 255, 1)',
    border: 'rgba(236, 237, 240, 1)',
    blue: {
      100: 'rgba(219, 234, 254, 1)',
      400: 'rgba(96, 165, 250, 1)',
      600: 'rgba(37, 99, 235, 1)',
    },
    green: {
      100: 'rgba(220, 252, 231, 1)',
      400: 'rgba(74, 222, 128, 1)',
      600: 'rgba(22, 163, 74, 1)',
      700: 'rgba(21, 128, 61, 1)',
    },
    red: {
      50: 'rgba(254, 242, 242, 1)',
      100: 'rgba(254, 226, 226, 1)',
      200: 'rgba(254, 202, 202, 1)',
      500: 'rgba(239, 68, 68, 1)',
      600: 'rgba(220, 38, 38, 1)',
      700: 'rgba(185, 28, 28, 1)',
    },
    yellow: {
      100: 'rgba(254, 249, 195, 1)',
      600: 'rgba(202, 138, 4, 1)',
      700: 'rgba(161, 98, 7, 1)',
    },
    gray: {
      50: 'rgba(249, 250, 251, 1)',
      100: 'rgba(243, 244, 246, 1)',
      200: 'rgba(229, 231, 235, 1)',
      300: 'rgba(209, 213, 219, 1)',
      500: 'rgba(107, 114, 128, 1)',
      600: 'rgba(75, 85, 99, 1)',
      700: 'rgba(55, 65, 81, 1)',
      900: 'rgba(17, 24, 39, 1)',
    }
  };

  const StatItem = ({ icon: Icon, label, value, percentage, colorKey, isMain = false }) => (
    <div 
      className={`${isMain ? 'col-span-2' : ''} rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200`}
      style={{ backgroundColor: colors.gray[50] }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: colors[colorKey][100] }}
          >
            <Icon 
              className="w-4 h-4" 
              style={{ color: colors[colorKey][600] }}
            />
          </div>
          <span 
            className="text-sm font-medium"
            style={{ color: colors.gray[600] }}
          >
            {label}
          </span>
        </div>
        {percentage && (
          <span 
            className="text-xs px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: colors[colorKey][100],
              color: colors[colorKey][700]
            }}
          >
            {percentage}%
          </span>
        )}
      </div>
      <div 
        className={`${isMain ? 'text-3xl' : 'text-xl'} font-bold`}
        style={{ color: colors.gray[900] }}
      >
        {value.toLocaleString()}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div 
        className="rounded-2xl border p-6 transition-all duration-300"
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div 
              className="h-6 rounded w-48"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
            <div 
              className="h-8 w-8 rounded-lg"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className="col-span-2 h-20 rounded-xl"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
            <div 
              className="h-16 rounded-xl"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
            <div 
              className="h-16 rounded-xl"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
            <div 
              className="h-16 rounded-xl"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
            <div 
              className="h-16 rounded-xl"
              style={{ backgroundColor: colors.gray[300] }}
            ></div>
          </div>
          <div 
            className="h-4 rounded w-32"
            style={{ backgroundColor: colors.gray[300] }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="rounded-2xl border p-6 transition-all duration-300"
        style={{ 
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-lg font-semibold"
            style={{ color: colors.gray[900] }}
          >
            {title}
          </h3>
          <div 
            className="p-2 rounded-xl"
            style={{ backgroundColor: colors.red[100] }}
          >
            <AlertTriangle 
              className="w-6 h-6"
              style={{ color: colors.red[600] }}
            />
          </div>
        </div>
        <div className="text-center py-8">
          <div 
            className="text-6xl font-bold mb-2"
            style={{ color: colors.red[500] }}
          >
            Error
          </div>
          <p 
            className="font-medium mb-1"
            style={{ color: colors.red[600] }}
          >
            Failed to load data
          </p>
          <p 
            className="text-sm"
            style={{ color: colors.gray[600] }}
          >
            {error}
          </p>
          <div 
            className="mt-4 border rounded-lg p-3"
            style={{ 
              backgroundColor: colors.red[50],
              borderColor: colors.red[200]
            }}
          >
            <p 
              className="text-sm"
              style={{ color: colors.red[700] }}
            >
              Unable to load statistics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.gray[50];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.background;
      }}
    >
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: colors.gray[900] }}
        >
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <div 
            className="p-2 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${colors.blue[400]}, ${colors.blue[600]})`
            }}
          >
            <Wifi className="w-6 h-6 text-white" />
          </div>
          {trendValue && (
            <div 
              className="flex items-center text-sm"
              style={{ color: isPositiveTrend ? colors.green[600] : colors.red[600] }}
            >
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
          colorKey="blue"
          isMain={true}
        />
        
        <StatItem
          icon={CheckCircle}
          label="Active"
          value={activeSites}
          percentage={activePercentage}
          colorKey="green"
        />
        
        <StatItem
          icon={XCircle}
          label="Terminated"
          value={terminatedSites}
          percentage={terminatedPercentage}
          colorKey="red"
        />
        
        <StatItem
          icon={RefreshCw}
          label="For Renewal"
          value={forRenewalSites}
          percentage={forRenewalPercentage}
          colorKey="yellow"
        />
        
        <StatItem
          icon={AlertTriangle}
          label="Unknown"
          value={unknownSites}
          percentage={unknownPercentage}
          colorKey="gray"
        />
      </div>

      {/* Progress Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span 
            className="font-medium"
            style={{ color: colors.gray[600] }}
          >
            Active Rate
          </span>
          <span 
            className="font-bold"
            style={{ color: colors.gray[900] }}
          >
            {activePercentage}%
          </span>
        </div>
        <div 
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.gray[200] }}
        >
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${activePercentage}%`,
              background: `linear-gradient(90deg, ${colors.green[400]}, ${colors.green[600]})`
            }}
          />
        </div>
      </div>

      {/* Summary Text */}
      <div 
        className="text-xs mt-4 text-center"
        style={{ color: colors.gray[600] }}
      >
        <span className="font-medium">{activeSites.toLocaleString()}</span> active sites out of{' '}
        <span className="font-medium">{totalSites.toLocaleString()}</span> total WiFi locations
      </div>
    </div>
  );
};

export default FreeWifiStatCard;