// components/dashboard/RecentActivitySummaryCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RecentActivitySummaryCard = ({ recentlyAdded = [], recentlyTerminated = [], loading = false }) => {
  const totalAdded = recentlyAdded.length;
  const totalTerminated = recentlyTerminated.length;
  const netChange = totalAdded - totalTerminated;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-800 mb-4">Recent Activity Summary</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-sm text-green-700 font-medium">Added</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{totalAdded}</div>
          <div className="text-xs text-green-600">Last 30 days</div>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="text-red-600" size={16} />
            <span className="text-sm text-red-700 font-medium">Terminated</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{totalTerminated}</div>
          <div className="text-xs text-red-600">Last 30 days</div>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Net Change:</span>
          <div className={`flex items-center gap-1 font-medium ${
            netChange > 0 ? 'text-green-600' : netChange < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
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