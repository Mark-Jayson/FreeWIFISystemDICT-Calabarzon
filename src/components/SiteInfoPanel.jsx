import React from 'react';

const SiteInfoPanel = ({ siteData, onBack }) => {
  // Default values 
  const {
    name = 'BatStateU - College of Science Building',
    location = 'Batangas State University - Alangilan',
    technology = 'LEO',
    procurement = 'Central',
    cmsProvider = 'HTECH Inc.',
    linkProvider = 'Converge Technologies',
    bandwidth = '30 MB/S',
    project = 'DICT Calabarzon',
    contractStatus = 'Active',
    activationDate = 'January 3, 2022',
    endOfContract = 'March 30, 2028'
  } = siteData || {};

  return (
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
            <h2 className="text-base font-bold">{name}</h2>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-purple-100 p-2 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="text-xs text-purple-600 text-center mt-1">LEO</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="flex flex-col">
          <InfoRow label="Location" value={location} />
          <InfoRow label="Technology" value={technology} />
          <InfoRow label="Procurement" value={procurement} />
          <InfoRow label="CMS Provider" value={cmsProvider} />
          <InfoRow label="Link Provider" value={linkProvider} />
          <InfoRow label="Bandwidth" value={bandwidth} />
          <InfoRow label="Project" value={project} />
          <InfoRow label="Contract Status" value={contractStatus} />
          <InfoRow label="Activation Date" value={activationDate} />
          <InfoRow label="End of Contract" value={endOfContract} />
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-3 px-4 border-b border-gray-100">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-sm font-medium text-right">{value}</div>
  </div>
);

export default SiteInfoPanel;