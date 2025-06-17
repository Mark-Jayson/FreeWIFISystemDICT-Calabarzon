import React, { useState, useEffect } from 'react';
import { Search, Wifi, MapPin, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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

      setError(null);
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
  }, []);

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
        displayEnd = maxVisiblePages - 2; e
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
        <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>
      ) : (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
            ${number === currentPage ? 'z-10 bg-blue-600 border-blue-600 text-white' : ''}
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

          {/* For Pagination Controls */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6"
              aria-label="Pagination"
            >

              <div className="flex-1 flex items-center justify-between">
                <div className="relative z-0 inline-flex shadow-sm rounded-md -space-x-px">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {renderPageNumbers()}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default WifiList;