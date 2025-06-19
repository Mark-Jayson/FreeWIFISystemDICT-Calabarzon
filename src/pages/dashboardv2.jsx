import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Wifi, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Bell,
  User,
  Calendar,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';

// Mock data for demonstration
const mockProvinces = [
  { id: 'all', name: 'All Provinces' },
  { id: 'batangas', name: 'Batangas' },
  { id: 'cavite', name: 'Cavite' },
  { id: 'laguna', name: 'Laguna' },
  { id: 'quezon', name: 'Quezon' },
  { id: 'rizal', name: 'Rizal' }
];

const mockLocationTypes = [
  { name: 'Schools', value: 245, icon: '🏫' },
  { name: 'LGU Offices', value: 187, icon: '🏛️' },
  { name: 'Health Centers', value: 156, icon: '🏥' },
  { name: 'Police Stations', value: 98, icon: '👮' },
  { name: 'Markets', value: 87, icon: '🛒' },
  { name: 'Libraries', value: 65, icon: '📚' },
  { name: 'Barangay Halls', value: 234, icon: '🏘️' },
  { name: 'Tourism Sites', value: 43, icon: '🌴' }
];

const mockLGUData = [
  { id: 1, name: 'Antipolo City', subtext: 'Rizal', value: 45 },
  { id: 2, name: 'Bacoor City', subtext: 'Cavite', value: 38 },
  { id: 3, name: 'Calamba City', subtext: 'Laguna', value: 35 },
  { id: 4, name: 'Dasmarinas City', subtext: 'Cavite', value: 32 },
  { id: 5, name: 'San Pedro City', subtext: 'Laguna', value: 28 }
];

const mockExpiringContracts = [
  { site: 'Antipolo Sports Complex', date: '2025-07-15' },
  { site: 'Bacoor Government Center', date: '2025-08-22' },
  { site: 'Calamba Public Market', date: '2025-09-10' },
  { site: 'Santa Rosa Plaza', date: '2025-09-28' },
  { site: 'Biñan City Hall', date: '2025-10-05' }
];

const mockYearlyData = [
  { year: '2019', value: 245 },
  { year: '2020', value: 312 },
  { year: '2021', value: 428 },
  { year: '2022', value: 567 },
  { year: '2023', value: 634 },
  { year: '2024', value: 721 }
];

const mockProvincesData = [
  { name: 'Cavite', value: 342, color: '#3b82f6' },
  { name: 'Laguna', value: 298, color: '#10b981' },
  { name: 'Batangas', value: 234, color: '#f59e0b' },
  { name: 'Rizal', value: 187, color: '#ef4444' },
  { name: 'Quezon', value: 156, color: '#8b5cf6' }
];

// Modern Header Component
const ModernHeader = ({ selectedProvince, onProvinceSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentProvinceName = () => {
    const current = mockProvinces.find(p => p.id === selectedProvince);
    return current ? current.name : 'Region IV – A Calabarzon';
  };

  const filteredProvinces = mockProvinces.filter(province =>
    province.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-xl">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                📊 CALABARZON Dashboard
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Free WiFi Infrastructure Monitoring System
              </p>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{getCurrentProvinceName()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 min-w-[300px] overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search provinces..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredProvinces.map(province => (
                      <button 
                        key={province.id}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center space-x-3 ${
                          selectedProvince === province.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          onProvinceSelect(province.id);
                          setIsDropdownOpen(false);
                          setSearchTerm('');
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full ${selectedProvince === province.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <span>{province.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30 transition-all duration-200">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced WiFi Stats Card
const EnhancedWifiStatCard = ({ totalSites = 2847, activeSites = 2156, terminatedSites = 691, loading = false }) => {
  const activePercentage = totalSites > 0 ? Math.round((activeSites / totalSites) * 100) : 0;
  const terminatedPercentage = totalSites > 0 ? Math.round((terminatedSites / totalSites) * 100) : 0;
  const unknownSites = totalSites - activeSites - terminatedSites;
  const unknownPercentage = totalSites > 0 ? Math.round((unknownSites / totalSites) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h3 className="text-gray-600 font-medium">Total WiFi Sites</h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {totalSites.toLocaleString()}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
          <Wifi className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 font-medium">
          Distribution Overview
        </div>
        
        <div className="flex h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out"
            style={{ width: `${activePercentage}%` }}
          />
          <div 
            className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-1000 ease-out"
            style={{ width: `${terminatedPercentage}%` }}
          />
          <div 
            className="bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-1000 ease-out"
            style={{ width: `${unknownPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Active</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{activeSites.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{activePercentage}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Terminated</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{terminatedSites.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{terminatedPercentage}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">Unknown</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{unknownSites.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{unknownPercentage}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Location Provinces Card
const EnhancedLocationProvincesCard = ({ locationCount = 1217, trendValue = "8.2%" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h3 className="text-gray-600 font-medium">WiFi Locations</h3>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {locationCount.toLocaleString()}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{trendValue}</span>
            <span className="text-gray-500 ml-1">this month</span>
          </div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Distribution per Province</h4>
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            {mockProvincesData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-700 font-medium">{entry.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                  <span className="text-xs text-gray-500">sites</span>
                </div>
              </div>
            ))}
          </div>
          <div className="w-32 h-32 ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockProvincesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockProvincesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} sites`, name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Location Type Grid
const EnhancedLocationTypeGrid = ({ title = "Location Types Distribution" }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(mockLocationTypes.length / itemsPerPage);
  const currentItems = mockLocationTypes.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">WiFi sites by location category</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentItems.map((item, index) => (
          <div key={index} className="group p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-600 font-medium">{item.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === 0 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === totalPages - 1 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-blue-600 bg-blue-100 hover:bg-blue-200'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Digitization Card
const EnhancedDigitizationCard = ({ percentage = 78, totalCount = 4012, activeCount = 3129 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Digitization Rate</h3>
          <p className="text-sm text-gray-500">CALABARZON Region</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
          {percentage}%
        </div>
        <div className="text-sm text-gray-600">Digitization Progress</div>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="absolute -top-8 right-0 text-xs font-medium text-green-600">
            {percentage}%
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-600">Digitized:</span>
            <span className="font-bold text-green-600 ml-1">{activeCount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-gray-900 ml-1">{totalCount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Barangays in CALABARZON Region
        </div>
      </div>
    </div>
  );
};

// Enhanced Top LGU Card
const EnhancedTopLGUCard = ({ title = "Top LGUs by WiFi Sites" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Leading local government units</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-yellow-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        {mockLGUData.map((item, index) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                'bg-gradient-to-r from-blue-400 to-blue-600'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">{item.subtext}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">{item.value}</span>
              <span className="text-xs text-gray-500">sites</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Expiring Contracts Table
const EnhancedExpiringContractsTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockExpiringContracts.length / itemsPerPage);
  const currentContracts = mockExpiringContracts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const getDaysUntilExpiry = (dateString) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days) => {
    if (days <= 30) return 'text-red-600 bg-red-100';
    if (days <= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Contract Renewals</h3>
          <p className="text-sm text-gray-500 mt-1">Sites approaching contract end</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
          <Clock className="w-5 h-5 text-red-600" />
        </div>
      </div>

      <div className="space-y-3">
        {currentContracts.map((contract, index) => {
          const daysLeft = getDaysUntilExpiry(contract.date);
          const urgencyColor = getUrgencyColor(daysLeft);
          
          return (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-red-50 hover:to-pink-50 transition-all duration-200 group">
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm group-hover:text-red-700 transition-colors">
                  {contract.site}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Expires: {new Date(contract.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
                 <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColor}`}>
                  {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                </span>
                {daysLeft <= 30 && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === 0 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-red-600 bg-red-100 hover:bg-red-200'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === totalPages - 1 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-red-600 bg-red-100 hover:bg-red-200'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Enhanced Historical Growth Chart
const EnhancedHistoricalGrowthChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setChartData(mockYearlyData);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Historical Growth</h3>
          <p className="text-sm text-gray-500 mt-1">WiFi sites deployment over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Last 6 years</option>
            <option>Last 3 years</option>
            <option>Last year</option>
          </select>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                fontSize: '14px'
              }}
              formatter={(value) => [`${value} sites`, 'Total Sites']}
            />
            <Bar 
              dataKey="value" 
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              Growth Rate: <span className="font-bold text-green-600">+13.7% YoY</span>
            </div>
            <div className="text-gray-600">
              Peak Year: <span className="font-bold text-blue-600">2024</span>
            </div>
          </div>
          <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Status Summary Card
const EnhancedStatusSummaryCard = () => {
  const statusData = [
    { 
      status: 'Operational', 
      count: 2156, 
      percentage: 76, 
      color: 'green',
      icon: CheckCircle,
      trend: '+2.3%'
    },
    { 
      status: 'Maintenance', 
      count: 145, 
      percentage: 5, 
      color: 'yellow',
      icon: AlertCircle,
      trend: '-0.8%'
    },
    { 
      status: 'Offline', 
      count: 89, 
      percentage: 3, 
      color: 'red',
      icon: XCircle,
      trend: '-1.2%'
    },
    { 
      status: 'Terminated', 
      count: 457, 
      percentage: 16, 
      color: 'gray',
      icon: XCircle,
      trend: '+0.5%'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[color] || colors.gray;
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      red: 'text-red-600',
      gray: 'text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Site Status Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Real-time operational status</p>
        </div>
        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
          <Wifi className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statusData.map((item, index) => {
          const IconComponent = item.icon;
          const isPositiveTrend = item.trend.startsWith('+');
          
          return (
            <div key={index} className={`p-4 rounded-xl border-2 ${getColorClasses(item.color)} hover:shadow-md transition-all duration-200 group`}>
              <div className="flex items-start justify-between mb-3">
                <IconComponent className={`w-5 h-5 ${getIconColor(item.color)} group-hover:scale-110 transition-transform`} />
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isPositiveTrend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.count.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                {item.status}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    item.color === 'green' ? 'bg-green-500' :
                    item.color === 'yellow' ? 'bg-yellow-500' :
                    item.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {item.percentage}% of total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Quick Stats Row
const EnhancedQuickStatsRow = () => {
  const quickStats = [
    {
      label: 'Active Users',
      value: '245.6K',
      change: '+12.5%',
      isPositive: true,
      icon: User,
      color: 'blue'
    },
    {
      label: 'Data Usage',
      value: '1.2TB',
      change: '+8.3%',
      isPositive: true,
      icon: BarChart3,
      color: 'green'
    },
    {
      label: 'Avg. Speed',
      value: '45.2 Mbps',
      change: '-2.1%',
      isPositive: false,
      icon: Wifi,
      color: 'purple'
    },
    {
      label: 'Uptime',
      value: '99.7%',
      change: '+0.3%',
      isPositive: true,
      icon: CheckCircle,
      color: 'emerald'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      emerald: 'from-emerald-500 to-emerald-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {quickStats.map((stat, index) => {
        const IconComponent = stat.icon;
        const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown;
        
        return (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(stat.color)} text-white group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Dark Mode Toggle Component
const DarkModeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        isDark ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
        isDark ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </button>
  );
};

// Enhanced Breadcrumb Component
const EnhancedBreadcrumb = ({ selectedProvince }) => {
  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'CALABARZON', href: '#' },
  ];

  if (selectedProvince && selectedProvince !== 'all') {
    const province = mockProvinces.find(p => p.id === selectedProvince);
    if (province) {
      breadcrumbItems.push({ label: province.name, href: '#' });
    }
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <ChevronDown className="w-4 h-4 rotate-[-90deg] text-gray-400" />
          )}
          <button 
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbItems.length - 1 ? 'text-blue-600 font-medium' : ''
            }`}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading CALABARZON Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <ModernHeader 
        selectedProvince={selectedProvince} 
        onProvinceSelect={setSelectedProvince}
      />
      
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <EnhancedBreadcrumb selectedProvince={selectedProvince} />
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Dark Mode</span>
            <DarkModeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </div>

        <EnhancedQuickStatsRow />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <EnhancedWifiStatCard loading={false} />
          <EnhancedLocationProvincesCard />
          <EnhancedDigitizationCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EnhancedLocationTypeGrid />
          <EnhancedTopLGUCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EnhancedExpiringContractsTable />
          <EnhancedStatusSummaryCard />
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <EnhancedHistoricalGrowthChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;