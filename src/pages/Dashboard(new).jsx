import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Wifi, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Bell,
  Settings,
  User,
  RefreshCw,
  Filter
} from 'lucide-react';

const ModernDashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock data - replace with your actual data
const mockData = {
    wifiStats: {
      totalSites: 1247,
      activeSites: 1089,
      terminatedSites: 158,
      trendValue: '+12.5%',
      isPositiveTrend: true
    },
    locationCount: 220,
    digitalProgress: 67,
    gidaCount: 89,
    elcacCount: 156,
    expiringContracts: [
      { site: 'Cavite Public Plaza', date: '2025-07-15' },
      { site: 'Laguna Community Center', date: '2025-07-22' },
      { site: 'Batangas Municipal Hall', date: '2025-08-03' }
    ],
    yearlyData: [
      { year: '2020', value: 45 },
      { year: '2021', value: 123 },
      { year: '2022', value: 289 },
      { year: '2023', value: 456 },
      { year: '2024', value: 334 }
    ],
    provinceData: [
      { name: 'Cavite', value: 45, color: '#10B981' },
      { name: 'Laguna', value: 38, color: '#3B82F6' },
      { name: 'Batangas', value: 52, color: '#8B5CF6' },
      { name: 'Rizal', value: 41, color: '#F59E0B' },
      { name: 'Quezon', value: 44, color: '#EF4444' }
    ],
    lguData: [
      { id: 1, name: 'Antipolo City', subtext: 'Rizal', value: 45 },
      { id: 2, name: 'Bacoor City', subtext: 'Cavite', value: 38 },
      { id: 3, name: 'General Trias City', subtext: 'Cavite', value: 32 },
      { id: 4, name: 'Biñan City', subtext: 'Laguna', value: 28 },
      { id: 5, name: 'Santa Rosa City', subtext: 'Laguna', value: 25 },
      { id: 6, name: 'Calamba City', subtext: 'Laguna', value: 23 },
      { id: 7, name: 'Lipa City', subtext: 'Batangas', value: 21 },
      { id: 8, name: 'Dasmariñas City', subtext: 'Cavite', value: 19 }
    ]
  };
  
  const provinces = [
    { id: 'all', name: 'Region IV - A Calabarzon' },
    { id: 'cavite', name: 'Cavite' },
    { id: 'laguna', name: 'Laguna' },
    { id: 'batangas', name: 'Batangas' },
    { id: 'rizal', name: 'Rizal' },
    { id: 'quezon', name: 'Quezon' }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue", loading = false }) => {
    if (loading) {
      return (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-6 transition-all duration-300`}>
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-100 hover:bg-gray-50'} 
        rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium`}>{title}</span>
          <div className={`p-2 rounded-xl bg-gradient-to-br from-${color}-400 to-${color}-600 group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-3xl font-bold mb-2`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="font-medium">{trendValue}</span>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>vs last month</span>
          </div>
        )}
      </div>
    );
  };

  const ProgressCard = ({ title, percentage, description, color = "blue" }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>{title}</h3>
          <span className={`text-2xl font-bold text-${color}-600`}>{percentage}%</span>
        </div>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{description}</p>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} h-3 rounded-full overflow-hidden`}>
        <div 
          className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-2`}>
        3,125 out of 21,464 Barangays in Calabarzon
      </div>
    </div>
  );

  const ChartCard = ({ title, data, type = "bar" }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold mb-6`}>{title}</h3>
      
      {type === "bar" && (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{item.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-24 h-2 rounded-full overflow-hidden`}>
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold text-sm w-8`}>
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ContractsCard = ({ contracts }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
      rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>Expiring Contracts</h3>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
            {contracts.length} expiring
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {contracts.map((contract, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} 
            rounded-xl p-4 transition-colors duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium text-sm`}>
                  {contract.site}
                </p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>
                  Expires: {new Date(contract.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 border-gray-200'} 
        backdrop-blur-lg border-b sticky top-0 z-50`}>
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>
                    WiFi Dashboard
                  </h1>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    Region IV - A Calabarzon
                  </p>
                </div>
              </div>
              
              {/* Province Selector */}
              <div className="relative ml-8">
                <select 
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} 
                    border rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                >
                  {provinces.map(province => (
                    <option key={province.id} value={province.id}>{province.name}</option>
                  ))}
                </select>
                <ChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none`} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                  p-2 rounded-xl transition-colors duration-200`}>
                  <Search className="w-5 h-5" />
                </button>
                <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                  p-2 rounded-xl transition-colors duration-200 relative`}>
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                    p-2 rounded-xl transition-colors duration-200`}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                <button className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} 
                  p-2 rounded-xl transition-colors duration-200`}>
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total WiFi Sites"
            value={mockData.wifiStats.totalSites}
            icon={Wifi}
            trend="up"
            trendValue={mockData.wifiStats.trendValue}
            color="blue"
            loading={isLoading}
          />
          <StatCard
            title="Active Sites"
            value={mockData.wifiStats.activeSites}
            icon={CheckCircle}
            trend="up"
            trendValue="+8.2%"
            color="green"
            loading={isLoading}
          />
          <StatCard
            title="Locations Served"
            value={mockData.locationCount}
            icon={MapPin}
            trend="up"
            trendValue="+15.3%"
            color="purple"
            loading={isLoading}
          />
          <StatCard
            title="Terminated Sites"
            value={mockData.wifiStats.terminatedSites}
            icon={XCircle}
            trend="down"
            trendValue="-2.1%"
            color="red"
            loading={isLoading}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <ProgressCard
              title="Digitization Progress"
              percentage={mockData.digitalProgress}
              description="WiFi Location Coverage in Calabarzon"
              color="blue"
            />
            
            <ChartCard
              title="Distribution per Province"
              data={mockData.provinceData}
              type="bar"
            />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                  Yearly Activations
                </h3>
                <Activity className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              
              <div className="space-y-4">
                {mockData.yearlyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium`}>
                      {item.year}
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} w-32 h-3 rounded-full overflow-hidden`}>
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full transition-all duration-1000"
                          style={{ width: `${(item.value / Math.max(...mockData.yearlyData.map(d => d.value))) * 100}%` }}
                        />
                      </div>
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-bold text-sm w-12`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                    Service Areas
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    Special program coverage
                  </p>
                </div>
                <Users className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'} mb-1`}>
                    {mockData.gidaCount}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-700'} font-medium`}>
                    GIDA Serviced
                  </div>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-xl p-4 text-center`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-purple-900'} mb-1`}>
                    {mockData.elcacCount}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-purple-700'} font-medium`}>
                    ELCAC Areas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <ContractsCard contracts={mockData.expiringContracts} />
            
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
              rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-semibold`}>
                  Quick Actions
                </h3>
                <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl py-3 px-4 font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                  Generate Report
                </button>
                <button className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} 
                  rounded-xl py-3 px-4 font-medium transition-all duration-200`}>
                  Export Data
                </button>
                <button className={`w-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} 
                  rounded-xl py-3 px-4 font-medium transition-all duration-200`}>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModernDashboard;