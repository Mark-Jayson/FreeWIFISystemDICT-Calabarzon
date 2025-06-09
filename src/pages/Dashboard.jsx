import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import FreeWifiStatCard from '../components/dashboard/FreeWifiStatCard';
import DigitizationCard from '../components/dashboard/DigitizationCard';
import KeyMetricCard from '../components/dashboard/KeyMetricCard';
import LocationProvincesCard from '../components/dashboard/LocationProvincesCard';
import WifiTechnologyBar from '../components/dashboard/WifiTechnologyBar';
import LocationTypeGrid from '../components/dashboard/LocationTypeGrid';
import TopLGUListCard from '../components/dashboard/TopLGUListCard';
import ExpiringContractsTable from '../components/dashboard/ExpiringContractsTable';
import YearlyActivationChart from '../components/dashboard/YearlyActivationChart';
import { provinceData, staticData } from '../utils/provinceData';

const Dashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [wifiStats, setWifiStats] = useState({
    totalSites: 0,
    activeSites: 0,
    terminatedSites: 0,
    activePercentage: 0,
    terminatedPercentage: 0,
    trendValue: "0%",
    isPositiveTrend: true,
    loading: true,
    error: null
  });

  const handleProvinceSelect = (provinceId) => {
    setSelectedProvince(provinceId);
  };

  // Fetch WiFi statistics from API
  const fetchWifiStats = async (province = 'all') => {
    try {
      setWifiStats(prev => ({ ...prev, loading: true, error: null }));
      
      const url = province === 'all' 
        ? 'http://localhost:5000/api/wifi-stats'
        : `http://localhost:5000/api/wifi-stats?province=${province}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setWifiStats({
        totalSites: data.totalSites,
        activeSites: data.activeSites,
        terminatedSites: data.terminatedSites,
        activePercentage: data.activePercentage,
        terminatedPercentage: data.terminatedPercentage,
        trendValue: data.trendValue,
        isPositiveTrend: data.isPositiveTrend,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Error fetching WiFi stats:', error);
      setWifiStats(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch WiFi statistics'
      }));
    }
  };

  // Fetch data when component mounts or province changes
  useEffect(() => {
    fetchWifiStats(selectedProvince);
  }, [selectedProvince]);

  return (
    <div className="flex-1 bg-blue-50 overflow-y-auto">
      <Header
        region="Region IV - A Calabarzon"
        onProvinceSelect={handleProvinceSelect}
        selectedProvince={selectedProvince}
      />
      <DashboardContent 
        selectedProvince={selectedProvince} 
        wifiStats={wifiStats}
      />
    </div>
  );
};

const DashboardContent = ({ selectedProvince, wifiStats }) => {
  const currentData = provinceData[selectedProvince];
  const { expiringContracts, activationData } = staticData;

  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <LocationProvincesCard
            locationCount={currentData.locationCount}
            trendValue={currentData.trendValue}
            provincesData={currentData.provincesData}
          />
          <WifiTechnologyBar data={currentData.wifiTechData} />
          <LocationTypeGrid
            title={
              selectedProvince === 'all'
                ? 'Free WiFi Sites location per location types in Calabarzon'
                : `Free WiFi Sites location per location types in ${currentData.provincesData[0].name}`
            }
            subtitle={
              selectedProvince === 'all'
                ? null
                : `Free WiFi sites location per location types in ${currentData.provincesData[0].name}`
            }
            data={currentData.locationTypes}
          />
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-4">
          <FreeWifiStatCard
            title="Total No. of FreeWiFi Sites"
            totalSites={wifiStats.totalSites}
            activeSites={wifiStats.activeSites}
            terminatedSites={wifiStats.terminatedSites}
            trendValue={wifiStats.trendValue}
            isPositiveTrend={wifiStats.isPositiveTrend}
            loading={wifiStats.loading}
            error={wifiStats.error}
          />
          <KeyMetricCard
            gidaCount={currentData.gidaCount}
            elcacCount={currentData.elcacCount}
          />
          <DigitizationCard
            percentage={currentData.digitization.percentage}
            totalCount={currentData.digitization.totalCount}
            activeCount={currentData.digitization.activeCount}
            description={currentData.digitization.description}
          />
          <TopLGUListCard
            title="LGUs with most Free WiFi Location"
            data={currentData.lguData}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow p-4 h-full">
            <ExpiringContractsTable contracts={expiringContracts} />
          </div>
          <div className="bg-white rounded-lg shadow p-4 h-full">
            <YearlyActivationChart
              title="No. of WiFi Activated per Year of Activation"
              data={activationData}
              highlightYear="2023"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;