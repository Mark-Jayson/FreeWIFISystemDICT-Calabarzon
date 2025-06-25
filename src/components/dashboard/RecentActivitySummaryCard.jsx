import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RecentActivitySummaryCard = ({ recentlyAdded = [], recentlyTerminated = [], loading = false }) => {
  const totalAdded = recentlyAdded.length;
  const totalTerminated = recentlyTerminated.length;
  const netChange = totalAdded - totalTerminated;

  // Custom RGBA colors
  const colors = {
    background: 'rgba(255, 255, 255, 1)', // bg-white
    text: {
      primary: 'rgba(31, 41, 55, 1)', // text-gray-800
      secondary: 'rgba(75, 85, 99, 1)', // text-gray-600
    },
    green: {
      50: 'rgba(240, 253, 244, 1)', // bg-green-50
      600: 'rgba(22, 163, 74, 1)', // text-green-600
      700: 'rgba(21, 128, 61, 1)', // text-green-700
    },
    red: {
      50: 'rgba(254, 242, 242, 1)', // bg-red-50
      600: 'rgba(220, 38, 38, 1)', // text-red-600
      700: 'rgba(185, 28, 28, 1)', // text-red-700
    },
    gray: {
      200: 'rgba(229, 231, 235, 1)', // bg-gray-200
      300: 'rgba(209, 213, 219, 1)', // border-gray-300
    },
    shadow: 'rgba(0, 0, 0, 0.1)', // shadow equivalent
  };

  if (loading) {
    return (
      <div 
        className="rounded-lg p-4"
        style={{ 
          backgroundColor: colors.background,
          boxShadow: `0 1px 3px 0 ${colors.shadow}, 0 1px 2px 0 ${colors.shadow}`
        }}
      >
        <div className="animate-pulse">
          <div 
            className="h-6 rounded w-1/2 mb-4"
            style={{ backgroundColor: colors.gray[200] }}
          ></div>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="h-16 rounded"
              style={{ backgroundColor: colors.gray[200] }}
            ></div>
            <div 
              className="h-16 rounded"
              style={{ backgroundColor: colors.gray[200] }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg p-4"
      style={{ 
        backgroundColor: colors.background,
        boxShadow: `0 1px 3px 0 ${colors.shadow}, 0 1px 2px 0 ${colors.shadow}`
      }}
    >
      <h3 
        className="font-semibold mb-4"
        style={{ color: colors.text.primary }}
      >
        Recent Activity Summary
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div 
          className="text-center p-3 rounded-lg"
          style={{ backgroundColor: colors.green[50] }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp 
              size={16}
              style={{ color: colors.green[600] }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: colors.green[700] }}
            >
              Added
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: colors.green[600] }}
          >
            {totalAdded}
          </div>
          <div 
            className="text-xs"
            style={{ color: colors.green[600] }}
          >
            Last 30 days
          </div>
        </div>
        
        <div 
          className="text-center p-3 rounded-lg"
          style={{ backgroundColor: colors.red[50] }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown 
              size={16}
              style={{ color: colors.red[600] }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: colors.red[700] }}
            >
              Terminated
            </span>
          </div>
          <div 
            className="text-2xl font-bold"
            style={{ color: colors.red[600] }}
          >
            {totalTerminated}
          </div>
          <div 
            className="text-xs"
            style={{ color: colors.red[600] }}
          >
            Last 30 days
          </div>
        </div>
      </div>

      <div 
        className="border-t pt-3"
        style={{ borderColor: colors.gray[300] }}
      >
        <div className="flex items-center justify-between">
          <span 
            className="text-sm"
            style={{ color: colors.text.secondary }}
          >
            Net Change:
          </span>
          <div 
            className="flex items-center gap-1 font-medium"
            style={{ 
              color: netChange > 0 ? colors.green[600] : netChange < 0 ? colors.red[600] : colors.text.secondary
            }}
          >
            {netChange > 0 ? (
              <TrendingUp size={16} />
            ) : netChange < 0 ? (
              <TrendingDown size={16} />
            ) : null}
            <span>{netChange > 0 ? '+' : ''}{netChange}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivitySummaryCard;