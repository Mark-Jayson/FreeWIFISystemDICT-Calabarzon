// components/dashboard/ExpiringContractsTable.jsx
import React, { useState } from 'react';
import { AlertTriangle, Calendar, Clock, MapPin, ChevronDown, ChevronUp, Filter } from 'lucide-react';

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
      <div className="bg-white border-gray-100 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900 font-semibold">
            Expiring Contracts
          </h3>
          <Calendar className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
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
    <div className="bg-white border-gray-100 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-gray-900 font-semibold">
            Expiring Contracts
          </h3>
          <p className="text-gray-600 text-sm">
            Monitor upcoming contract renewals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {criticalCount > 0 && (
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                {criticalCount} urgent
              </span>
            </div>
          )}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors duration-200"
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
              className={`bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 border-l-4 ${
                urgency.level === 'expired' ? 'border-red-500' :
                urgency.level === 'critical' ? 'border-red-400' :
                urgency.level === 'warning' ? 'border-amber-400' :
                'border-green-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      urgency.level === 'expired' ? 'bg-red-100' :
                      urgency.level === 'critical' ? 'bg-red-100' :
                      urgency.level === 'warning' ? 'bg-amber-100' :
                      'bg-green-100'
                    }`}>
                      <Calendar className={`w-4 h-4 ${
                        urgency.level === 'expired' ? 'text-red-600' :
                        urgency.level === 'critical' ? 'text-red-600' :
                        urgency.level === 'warning' ? 'text-amber-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 font-medium text-sm truncate">
                        {contract.site_name || contract.site || 'Unknown Site'}
                      </h4>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        {contract.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600 text-xs">
                              {contract.location}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-600 text-xs">
                            Expires: {formatDate(contract.contract_expiry_date || contract.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end ml-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    urgency.level === 'expired' ? 'bg-red-100 text-red-800' :
                    urgency.level === 'critical' ? 'bg-red-100 text-red-800' :
                    urgency.level === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {urgency.text}
                  </span>
                  
                  {urgency.level === 'expired' && (
                    <span className="text-xs text-red-600 font-medium mt-1">
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
          >
            {showAll ? 'Show Less' : `Show All ${contracts.length} Contracts`}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">
            Total: {contracts.length} contracts
          </span>
          {criticalCount > 0 && (
            <span className="text-red-600 font-medium">
              {criticalCount} require immediate attention
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiringContractsTable;