// components/dashboard/ExpiringContractsTable.jsx
import React, { useState } from 'react';
import { AlertTriangle, Calendar, Clock, MapPin, ChevronDown, ChevronUp, Filter } from 'lucide-react';

// RGB Color Overrides for Tailwind Classes
const rgbColors = {
  // Gray colors
  'text-gray-900': { color: 'rgb(17, 24, 39)' },
  'text-gray-600': { color: 'rgb(75, 85, 99)' },
  'text-gray-500': { color: 'rgb(107, 114, 128)' },
  'text-gray-400': { color: 'rgb(156, 163, 175)' },
  'bg-gray-100': { backgroundColor: 'rgb(243, 244, 246)' },
  'bg-gray-200': { backgroundColor: 'rgb(229, 231, 235)' },
  
  // Red colors
  'text-red-500': { color: 'rgb(239, 68, 68)' },
  'text-red-600': { color: 'rgb(220, 38, 38)' },
  'text-red-800': { color: 'rgb(153, 27, 27)' },
  'bg-red-100': { backgroundColor: 'rgb(254, 226, 226)' },
  'border-red-400': { borderLeftColor: 'rgb(248, 113, 113)' },
  'border-red-500': { borderLeftColor: 'rgb(239, 68, 68)' },
  
  // Amber colors
  'text-amber-600': { color: 'rgb(217, 119, 6)' },
  'text-amber-800': { color: 'rgb(146, 64, 14)' },
  'bg-amber-100': { backgroundColor: 'rgb(254, 243, 199)' },
  'border-amber-400': { borderLeftColor: 'rgb(251, 191, 36)' },
  
  // Green colors
  'text-green-600': { color: 'rgb(22, 163, 74)' },
  'text-green-800': { color: 'rgb(22, 101, 52)' },
  'bg-green-100': { backgroundColor: 'rgb(220, 252, 231)' },
  'border-green-400': { borderLeftColor: 'rgb(74, 222, 128)' },
  
  // Blue colors
  'text-blue-600': { color: 'rgb(37, 99, 235)' },
  'text-blue-700': { color: 'rgb(29, 78, 216)' },
  
  // Hover states
  'hover:text-blue-700': { color: 'rgb(29, 78, 216)' },
};

// Helper function to get RGB styles
const getRgbStyle = (className) => rgbColors[className] || {};

const ExpiringContractsTable = ({ contracts }) => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAll, setShowAll] = useState(false);

  // Sort contracts by expiration date
  const sortedContracts = [...contracts].sort((a, b) => {
    const dateA = new Date(a.contract_expiry_date || a.date);
    const dateB = new Date(b.contract_expiry_date || b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Show only first 5 contracts unless "showAll" is true
  const displayedContracts = showAll ? sortedContracts : sortedContracts.slice(0, 5);

  // Get urgency level based on days until expiry
  const getUrgencyLevel = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { level: 'expired', color: 'red', text: 'Expired' };
    if (daysUntilExpiry <= 30) return { level: 'critical', color: 'red', text: `${daysUntilExpiry} days` };
    if (daysUntilExpiry <= 60) return { level: 'warning', color: 'amber', text: `${daysUntilExpiry} days` };
    return { level: 'normal', color: 'green', text: `${daysUntilExpiry} days` };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!contracts || contracts.length === 0) {
    return (
      <div 
        className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderColor: 'rgba(233, 236, 239, 1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 font-semibold" style={getRgbStyle('text-gray-900')}>
            Expiring Contracts
          </h3>
          <Calendar className="w-5 h-5 text-gray-600" style={getRgbStyle('text-gray-600')} />
        </div>
        
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" style={getRgbStyle('text-gray-400')} />
          <p className="text-gray-500 text-sm" style={getRgbStyle('text-gray-500')}>
            No expiring contracts found
          </p>
        </div>
      </div>
    );
  }

  const criticalCount = contracts.filter(contract => {
    const urgency = getUrgencyLevel(contract.contract_expiry_date || contract.date);
    return urgency.level === 'critical' || urgency.level === 'expired';
  }).length;

  return (
    <div 
      className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(233, 236, 239, 1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold" style={getRgbStyle('text-gray-900')}>
            Expiring Contracts
          </h3>
          <p className="text-gray-600 text-sm" style={getRgbStyle('text-gray-600')}>
            Monitor upcoming contract renewals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {criticalCount > 0 && (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-red-500" style={getRgbStyle('text-red-500')} />
              <span 
                className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  ...getRgbStyle('bg-red-100'),
                  ...getRgbStyle('text-red-800')
                }}
              >
                {criticalCount} urgent
              </span>
            </div>
          )}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-gray-600 p-2 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: 'rgba(243, 244, 246, 1)',
              borderColor: 'rgba(233, 236, 239, 1)',
              borderWidth: '1px',
              borderStyle: 'solid',
              ...getRgbStyle('text-gray-600')
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(229, 231, 235, 1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(243, 244, 246, 1)'}
            title={`Sort ${sortOrder === 'asc' ? 'newest first' : 'oldest first'}`}
          >
            {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {displayedContracts.map((contract, index) => {
          const urgency = getUrgencyLevel(contract.contract_expiry_date || contract.date);
          
          return (
            <div
              key={index}
              className={`rounded-xl p-4 transition-all duration-200 border-l-4`}
              style={{ 
                backgroundColor: 'rgba(249, 250, 251, 1)',
                borderTopColor: 'rgba(233, 236, 239, 1)',
                borderRightColor: 'rgba(233, 236, 239, 1)',
                borderBottomColor: 'rgba(233, 236, 239, 1)',
                borderTopWidth: '1px',
                borderRightWidth: '1px',
                borderBottomWidth: '1px',
                borderTopStyle: 'solid',
                borderRightStyle: 'solid',
                borderBottomStyle: 'solid',
                ...(urgency.level === 'expired' ? getRgbStyle('border-red-500') :
                   urgency.level === 'critical' ? getRgbStyle('border-red-400') :
                   urgency.level === 'warning' ? getRgbStyle('border-amber-400') :
                   getRgbStyle('border-green-400'))
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(243, 244, 246, 1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(249, 250, 251, 1)'}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div 
                      className={`p-2 rounded-lg`}
                      style={{
                        ...(urgency.level === 'expired' ? getRgbStyle('bg-red-100') :
                           urgency.level === 'critical' ? getRgbStyle('bg-red-100') :
                           urgency.level === 'warning' ? getRgbStyle('bg-amber-100') :
                           getRgbStyle('bg-green-100'))
                      }}
                    >
                      <Calendar 
                        className={`w-4 h-4`}
                        style={{
                          ...(urgency.level === 'expired' ? getRgbStyle('text-red-600') :
                             urgency.level === 'critical' ? getRgbStyle('text-red-600') :
                             urgency.level === 'warning' ? getRgbStyle('text-amber-600') :
                             getRgbStyle('text-green-600'))
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 font-medium text-sm truncate" style={getRgbStyle('text-gray-900')}>
                        {contract.site_name || contract.site || 'Unknown Site'}
                      </h4>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        {contract.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-500" style={getRgbStyle('text-gray-500')} />
                            <span className="text-gray-600 text-xs" style={getRgbStyle('text-gray-600')}>
                              {contract.location}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" style={getRgbStyle('text-gray-500')} />
                          <span className="text-gray-600 text-xs" style={getRgbStyle('text-gray-600')}>
                            Expires: {formatDate(contract.contract_expiry_date || contract.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end ml-4">
                  <span 
                    className={`text-xs px-2 py-1 rounded-full font-medium`}
                    style={{
                      ...(urgency.level === 'expired' ? { ...getRgbStyle('bg-red-100'), ...getRgbStyle('text-red-800') } :
                         urgency.level === 'critical' ? { ...getRgbStyle('bg-red-100'), ...getRgbStyle('text-red-800') } :
                         urgency.level === 'warning' ? { ...getRgbStyle('bg-amber-100'), ...getRgbStyle('text-amber-800') } :
                         { ...getRgbStyle('bg-green-100'), ...getRgbStyle('text-green-800') })
                    }}
                  >
                    {urgency.text}
                  </span>
                  
                  {urgency.level === 'expired' && (
                    <span className="text-xs text-red-600 font-medium mt-1" style={getRgbStyle('text-red-600')}>
                      Action Required
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {contracts.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            style={getRgbStyle('text-blue-600')}
            onMouseEnter={(e) => Object.assign(e.target.style, getRgbStyle('hover:text-blue-700'))}
            onMouseLeave={(e) => Object.assign(e.target.style, getRgbStyle('text-blue-600'))}
          >
            {showAll ? 'Show Less' : `Show All ${contracts.length} Contracts`}
          </button>
        </div>
      )}

      {/* Summary */}
      <div 
        className="mt-4 pt-4"
        style={{ 
          borderTopColor: 'rgba(233, 236, 239, 1)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid'
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600" style={getRgbStyle('text-gray-600')}>
            Total: {contracts.length} contracts
          </span>
          {criticalCount > 0 && (
            <span className="text-red-600 font-medium" style={getRgbStyle('text-red-600')}>
              {criticalCount} require immediate attention
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiringContractsTable;