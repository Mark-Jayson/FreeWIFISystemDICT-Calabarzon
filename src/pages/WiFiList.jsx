import React, { useState, useEffect } from 'react';
import { Search, Wifi, MapPin, Signal, Clock, Filter } from 'lucide-react';

const WifiList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [wifiData, setWifiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace this with your actual database call
  const mockWifiData = [
    {
      id: 1,
      siteName: 'Barangay Hall - San Antonio',
      location: 'San Antonio, Paranaque City',
      ipAddress: '192.168.1.100',
      status: 'Active',
      signalStrength: 'Strong',
      connectedUsers: 45,
      lastUpdated: '2025-06-13 10:30 AM',
      bandwidth: '100 Mbps',
      provider: 'PLDT'
    },
    {
      id: 2,
      siteName: 'Public Plaza - BF Homes',
      location: 'BF Homes, Paranaque City',
      ipAddress: '192.168.1.101',
      status: 'Active',
      signalStrength: 'Good',
      connectedUsers: 23,
      lastUpdated: '2025-06-13 10:25 AM',
      bandwidth: '50 Mbps',
      provider: 'Globe'
    },
    {
      id: 3,
      siteName: 'Community Center - Tambo',
      location: 'Tambo, Paranaque City',
      ipAddress: '192.168.1.102',
      status: 'Inactive',
      signalStrength: 'Weak',
      connectedUsers: 0,
      lastUpdated: '2025-06-12 03:15 PM',
      bandwidth: '25 Mbps',
      provider: 'Converge'
    },
    {
      id: 4,
      siteName: 'Municipal Library',
      location: 'City Center, Paranaque City',
      ipAddress: '192.168.1.103',
      status: 'Active',
      signalStrength: 'Strong',
      connectedUsers: 78,
      lastUpdated: '2025-06-13 10:45 AM',
      bandwidth: '200 Mbps',
      provider: 'PLDT'
    },
    {
      id: 5,
      siteName: 'Barangay Covered Court - La Huerta',
      location: 'La Huerta, Paranaque City',
      ipAddress: '192.168.1.104',
      status: 'Maintenance',
      signalStrength: 'Good',
      connectedUsers: 12,
      lastUpdated: '2025-06-13 09:00 AM',
      bandwidth: '75 Mbps',
      provider: 'Globe'
    }
  ];

  // Simulate loading data (replace with actual API call)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWifiData(mockWifiData);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Filter and search logic
  const filteredData = wifiData.filter(item => {
    const matchesSearch = item.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalIcon = (strength) => {
    const baseClass = "w-4 h-4";
    switch (strength.toLowerCase()) {
      case 'strong': return <Signal className={`${baseClass} text-green-600`} />;
      case 'good': return <Signal className={`${baseClass} text-yellow-600`} />;
      case 'weak': return <Signal className={`${baseClass} text-red-600`} />;
      default: return <Signal className={`${baseClass} text-gray-600`} />;
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
              Total Sites: {wifiData.length} | Active: {wifiData.filter(item => item.status === 'Active').length}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* WiFi Sites Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Free WiFi Sites</h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredData.length} of {wifiData.length} sites
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
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((site) => (
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
                      <div className="text-sm text-gray-900">IP: {site.ipAddress}</div>
                      <div className="text-sm text-gray-500">{site.bandwidth} • {site.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getSignalIcon(site.signalStrength)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(site.status)}`}>
                          {site.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{site.signalStrength} Signal</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{site.connectedUsers} users</div>
                      <div className="text-xs text-gray-500">Connected</div>
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
        </div>
      </div>
    </div>
  );
};

export default WifiList;