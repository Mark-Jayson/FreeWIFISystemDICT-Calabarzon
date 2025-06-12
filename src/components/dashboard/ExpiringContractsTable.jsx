import React, { useState } from 'react';

const ExpiringContractsTable = ({ contracts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 5;

  const indexOfLast = currentPage * contractsPerPage;
  const indexOfFirst = indexOfLast - contractsPerPage;
  const currentContracts = contracts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(contracts.length / contractsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full">
      <div className="text-base font-medium mb-4">
        Free WiFi Site near approaching end of contract
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-2 text-xs font-medium text-gray-700 border-b pb-2 mb-1">
          <div>Site Name</div>
          <div>Date of End</div>
        </div>

        {currentContracts.map((contract, index) => (
          <div key={index} className="grid grid-cols-2 text-xs py-2 border-b">
            <div>{contract.site}</div>
            <div>
              {new Date(contract.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>

          </div>
        ))}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'}`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiringContractsTable;
