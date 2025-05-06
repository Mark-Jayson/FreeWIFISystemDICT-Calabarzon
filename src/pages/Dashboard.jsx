import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
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
import SitesStatusBar from '../components/dashboard/SitesStatusBar';
import { provinceData, staticData } from '../utils/provinceData';

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProvince, setSelectedProvince] = useState('all');
  
  const handleProvinceSelect = (provinceId) => {
    setSelectedProvince(provinceId);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 bg-blue-50 overflow-y-auto">
        <Header 
          region="Region IV - A Calabarzon" 
          onProvinceSelect={handleProvinceSelect}
          selectedProvince={selectedProvince}
        />
        <DashboardContent selectedProvince={selectedProvince} />
      </div>
    </div>
  );
};

// Dashboard Content
const DashboardContent = ({ selectedProvince }) => {
  // Get current province data
  const currentData = provinceData[selectedProvince];
  
  // Static data that remains the same regardless of province
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
            title={selectedProvince === 'all' 
              ? "Free WiFi Sites location per location types in Calabarzon"
              : `Free WiFi Sites location per location types in ${provinceData[selectedProvince].provincesData[0].name}`
            }
            subtitle={selectedProvince === 'all'
              ? null
              : `Free WiFi sites location per location types in ${provinceData[selectedProvince].provincesData[0].name}`
            }
            data={currentData.locationTypes}
          />
        </div>
        
        {/* Middle Column */}
        <div className="flex flex-col gap-4">
          <FreeWifiStatCard
            title="Total No. of FreeWiFi Sites"
            value={currentData.freeWifiStats.totalCount}
            trendValue={currentData.freeWifiStats.trendValue}
            totalSites={currentData.freeWifiStats.totalSites}
            activeCount={currentData.freeWifiStats.activeCount}
            terminatedCount={currentData.freeWifiStats.terminatedCount}
            activePercentage={currentData.freeWifiStats.activePercentage}
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
        
        {/* Right Column - Static data */}
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