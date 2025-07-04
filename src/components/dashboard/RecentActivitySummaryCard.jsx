import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RecentActivitySummaryCard = ({ recentlyAdded = [], recentlyTerminated = [], loading = false }) => {
  const totalAdded = recentlyAdded.length;
  const totalTerminated = recentlyTerminated.length;
  const netChange = totalAdded - totalTerminated;

  // RGB color overrides for Tailwind's OKLCH defaults
  const rgbColors = {
    white: 'rgb(255, 255, 255)',
    gray: {
      50: 'rgb(249, 250, 251)',
      100: 'rgb(243, 244, 246)',
      200: 'rgb(229, 231, 235)',
      300: 'rgb(209, 213, 219)',
      400: 'rgb(156, 163, 175)',
      500: 'rgb(107, 114, 128)',
      600: 'rgb(75, 85, 99)',
      700: 'rgb(55, 65, 81)',
      800: 'rgb(31, 41, 55)',
      900: 'rgb(17, 24, 39)',
    },
    green: {
      50: 'rgb(240, 253, 244)',
      100: 'rgb(220, 252, 231)',
      200: 'rgb(187, 247, 208)',
      300: 'rgb(134, 239, 172)',
      400: 'rgb(74, 222, 128)',
      500: 'rgb(34, 197, 94)',
      600: 'rgb(22, 163, 74)',
      700: 'rgb(21, 128, 61)',
      800: 'rgb(22, 101, 52)',
      900: 'rgb(20, 83, 45)',
    },
    red: {
      50: 'rgb(254, 242, 242)',
      100: 'rgb(254, 226, 226)',
      200: 'rgb(254, 202, 202)',
      300: 'rgb(252, 165, 165)',
      400: 'rgb(248, 113, 113)',
      500: 'rgb(239, 68, 68)',
      600: 'rgb(220, 38, 38)',
      700: 'rgb(185, 28, 28)',
      800: 'rgb(153, 27, 27)',
      900: 'rgb(127, 29, 29)',
    }
  };

  // Component styles using RGB colors
  const styles = {
    card: {
      backgroundColor: rgbColors.white,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    title: {
      color: rgbColors.gray[800],
    },
    addedCard: {
      backgroundColor: rgbColors.green[50],
    },
    addedText: {
      color: rgbColors.green[700],
    },
    addedNumber: {
      color: rgbColors.green[600],
    },
    addedIcon: {
      color: rgbColors.green[600],
    },
    terminatedCard: {
      backgroundColor: rgbColors.red[50],
    },
    terminatedText: {
      color: rgbColors.red[700],
    },
    terminatedNumber: {
      color: rgbColors.red[600],
    },
    terminatedIcon: {
      color: rgbColors.red[600],
    },
    border: {
      borderColor: rgbColors.gray[300],
    },
    netChangeLabel: {
      color: rgbColors.gray[600],
    },
    netChangePositive: {
      color: rgbColors.green[600],
    },
    netChangeNegative: {
      color: rgbColors.red[600],
    },
    netChangeNeutral: {
      color: rgbColors.gray[600],
    },
    skeleton: {
      backgroundColor: rgbColors.gray[200],
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg p-4" style={styles.card}>
        <div className="animate-pulse">
          <div 
            className="h-6 rounded w-1/2 mb-4"
            style={styles.skeleton}
          ></div>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className="h-16 rounded"
              style={styles.skeleton}
            ></div>
            <div 
              className="h-16 rounded"
              style={styles.skeleton}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-4" style={styles.card}>
      <h3 className="font-semibold mb-4" style={styles.title}>
        Recent Activity Summary
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg" style={styles.addedCard}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp size={16} style={styles.addedIcon} />
            <span className="text-sm font-medium" style={styles.addedText}>
              Added
            </span>
          </div>
          <div className="text-2xl font-bold" style={styles.addedNumber}>
            {totalAdded}
          </div>
          <div className="text-xs" style={styles.addedIcon}>
            Last 30 days
          </div>
        </div>
        
        <div className="text-center p-3 rounded-lg" style={styles.terminatedCard}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown size={16} style={styles.terminatedIcon} />
            <span className="text-sm font-medium" style={styles.terminatedText}>
              Terminated
            </span>
          </div>
          <div className="text-2xl font-bold" style={styles.terminatedNumber}>
            {totalTerminated}
          </div>
          <div className="text-xs" style={styles.terminatedIcon}>
            Last 30 days
          </div>
        </div>
      </div>

      <div className="border-t pt-3" style={styles.border}>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={styles.netChangeLabel}>
            Net Change:
          </span>
          <div 
            className="flex items-center gap-1 font-medium"
            style={
              netChange > 0 
                ? styles.netChangePositive 
                : netChange < 0 
                ? styles.netChangeNegative 
                : styles.netChangeNeutral
            }
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