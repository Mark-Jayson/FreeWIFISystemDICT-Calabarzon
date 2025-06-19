import React, { useState, useEffect } from 'react';
import { Search, Wifi, MapPin, Clock, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const WifiList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [wifiData, setWifiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  useEffect(() => {
    const fetchWifiSites = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await fetch('http://localhost:5000/api/wifisites');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map(item => ({
          id: item.site_id,
          siteName: item.site_name,
          location: item.location_name,
          status: item.contract_status || 'UNKNOWN',
          lastUpdated: item.activation_date ? new Date(item.activation_date).toLocaleDateString() : 'N/A',
          bandwidth: item.bandwidth ? `${item.bandwidth} Mbps` : 'N/A',
          provider: item.link_provider || 'N/A'
        }));
        setWifiData(formattedData);
      } catch (e) {
        console.error("Failed to fetch WiFi sites:", e);
        setError("Failed to load WiFi sites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWifiSites();
  }, []); // Empty dependency array means this runs once on mount

  // For Filter and Search Logic
  const filteredData = wifiData.filter(item => {
    const siteNameSafe = item.siteName ? String(item.siteName).toLowerCase() : '';
    const locationSafe = item.location ? String(item.location).toLowerCase() : '';
    const matchesSearch = siteNameSafe.includes(searchTerm.toLowerCase()) ||
                          locationSafe.includes(searchTerm.toLowerCase());
    const itemStatusSafe = item.status ? String(item.status).toLowerCase() : '';
    const matchesFilter = filterStatus === 'all' || itemStatusSafe === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to render page numbers with ellipsis for up to 9 numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 9; // Max number of page buttons to show
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let displayStart;
      let displayEnd;
      const halfVisible = Math.floor(maxVisiblePages / 2);
      if (currentPage <= halfVisible + 1) {
        // Current page is near the beginning
        displayStart = 1;
        displayEnd = maxVisiblePages - 2;
      } else if (currentPage >= totalPages - halfVisible) {
        // Current page is near the end
        displayStart = totalPages - (maxVisiblePages - 2);
        displayEnd = totalPages;
      } else {
        // Current page is in the middle
        displayStart = currentPage - halfVisible + 1;
        displayEnd = currentPage + halfVisible - 1;
      }

      if (displayStart > 1) {
          pageNumbers.push(1);
          if (displayStart > 2) pageNumbers.push('...');
      }
      for (let i = displayStart; i <= displayEnd; i++) {
        if (i !== 1 && i !== totalPages) {
            pageNumbers.push(i);
          }
      }
      if (displayEnd < totalPages) {
          if (displayEnd < totalPages - 1) pageNumbers.push('...');
          pageNumbers.push(totalPages);
      }
    }
    return pageNumbers.map((number, index) =>
      number === '...' ? (
        <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300">
          <span className="text-gray-400">...</span>
        </span>
      ) : (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200 ease-in-out hover:scale-105 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            ${number === currentPage 
              ? 'z-10 bg-gradient-to-r from-blue-600 to-blue-700 border-blue-600 text-white shadow-md transform scale-105' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'
            }
          `}
        >
          {number}
        </button>
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'for renewal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading WiFi Sites...</p>
        </div>
      </div>
    );
  }

  // Only one error display block is needed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Retry
              </button>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Wifi className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">WiFi List</h1>
            </div>
            {/* Only one total sites display needed */}
            <div className="text-sm text-gray-500">
              Total Sites: {wifiData.length} | Active: {wifiData.filter(item => item.status === 'ACTIVE').length}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by site name or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="TERMINATED">Terminated</option>
                <option value="FOR RENEWAL">For Renewal</option>
              </select>
            </div>
          </div>
        </div>

        {/* WiFi Sites Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Free WiFi Sites</h2>
            {/* Only one showing count needed */}
            <p className="text-sm text-gray-500 mt-1">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} sites
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Network Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{site.siteName}</div>
                          <div className="text-sm text-gray-500">{site.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{site.bandwidth}</div>
                      <div className="text-sm text-gray-500">{site.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(site.status)}`}>
                          {site.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {site.lastUpdated}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="p-8 text-center">
              <Wifi className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No WiFi sites found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No WiFi sites have been configured yet.'}
              </p>
            </div>
          )}

          {/* Enhanced Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
              {/* Mobile pagination info */}
              <div className="flex-1 flex justify-between items-center sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>

              {/* Desktop pagination */}
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                    {' '}({filteredData.length} total results)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* First page button */}
                    <button
                      onClick={() => paginate(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="First page"
                    >
                      <span className="sr-only">First</span>
                      <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Previous button */}
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Previous page"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Page numbers */}
                    {renderPageNumbers()}
                    
                    {/* Next button */}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Next page"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {/* Last page button */}
                    <button
                      onClick={() => paginate(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Last page"
                    >
                      <span className="sr-only">Last</span>
                      <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WifiList;