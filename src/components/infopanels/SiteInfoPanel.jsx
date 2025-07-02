import React from 'react';

const SiteInfoPanel = ({ siteData, onBack }) => {
  if (!siteData) {
    return (
      <div className="fixed top-[108px] right-4 bg-white rounded-lg shadow-lg w-80 z-50 p-4" style={{ right: '340px' }}>
        <p className="text-gray-500">Loading site details...</p>
      </div>
    );
  }

  const {
    site_name,
    site_code,
    site_type,
    contract_status,
    activation_date,
    end_of_contract,
    contract,
    cms_provider,
    link_provider,
    bandwidth,
    latitude,
    longitude,
    date_accepted,
    date_declaration,
    location_name
  } = siteData;

  // Determine the class for contract status
  const getContractStatusClass = (status) => {
    if (status === 'ACTIVE') {
      return 'text-green-600';
    } else if (status === 'TERMINATED') {
      return 'text-red-600';
    } else if (status === 'FOR RENEWAL') {
      return 'text-yellow-600';
    }
    return ''; // Default or no special color
  };

  return (
    <>
      <style>{`
        /* RGB Color Overrides for Tailwind OKLCH colors */
        .text-gray-400 { color: rgb(156, 163, 175) !important; }
        .text-gray-500 { color: rgb(107, 114, 128) !important; }
        .text-gray-600 { color: rgb(75, 85, 99) !important; }
        .text-green-600 { color: rgb(22, 163, 74) !important; }
        .text-red-600 { color: rgb(220, 38, 38) !important; }
        .text-yellow-600 { color: rgb(202, 138, 4) !important; }
        .bg-white { background-color: rgb(255, 255, 255) !important; }
        .bg-green-500 { background-color: rgb(34, 197, 94) !important; }
        .border-gray-100 { border-color: rgb(243, 244, 246) !important; }
        
        /* Hover states */
        .hover\\:text-gray-600:hover { color: rgb(75, 85, 99) !important; }
        
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(241, 241, 241);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(193, 193, 193);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(168, 168, 168);
        }
      `}</style>
      
      <div className="fixed top-[108px] right-4 bg-white rounded-lg shadow-lg w-80 z-50 max-h-[75vh] flex flex-col" style={{ right: '340px' }}>
        <div className="p-4 pb-2 relative border-b border-gray-100">
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="mb-2 mt-3 pl-6">
            <div className="text-xs text-gray-500">AP Site Name</div>
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h2 className="text-base font-bold">{site_name}</h2>
            </div>
            <div className="text-xs text-gray-400 mt-1 pl-5">{site_code}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          <div className="flex flex-col">
            <InfoRow label="Location" value={location_name} />
            <InfoRow label="Site Type" value={site_type} />
            <InfoRow label="Contract Status" value={contract_status} valueClassName={getContractStatusClass(contract_status)}/>
            <InfoRow label="Activation Date" value={formatDate(activation_date)} />
            <InfoRow label="End of Contract" value={formatDate(end_of_contract)} />
            <InfoRow label="Contract" value={contract} />
            <InfoRow label="CMS Provider" value={cms_provider} />
            <InfoRow label="Link Provider" value={link_provider} />
            <InfoRow label="Bandwidth" value={bandwidth ? `${bandwidth} Mbps` : '—'} />
            <InfoRow label="Latitude" value={latitude} />
            <InfoRow label="Longitude" value={longitude} />
            <InfoRow label="Date Accepted" value={formatDate(date_accepted)} />
            <InfoRow label="Date Declared" value={formatDate(date_declaration)} />
          </div>
        </div>
      </div>
    </>
  );
};

// Utility for formatting dates nicely
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

// Modified InfoRow component to accept valueClassName
const InfoRow = ({ label, value, valueClassName = '' }) => (
  <div className="flex justify-between py-3 px-4 border-b border-gray-100">
    <div className="text-sm text-gray-500">{label}</div>
    <div className={`text-sm font-medium text-right ${valueClassName}`}>{value ?? '—'}</div>
  </div>
);

export default SiteInfoPanel;