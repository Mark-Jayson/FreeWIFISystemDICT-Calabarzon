import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import EnhancedStatCard from '../components/EnhancedStatCard';
import CombinedLocationProvincesCard from '../components/CombinedLocationProvincesCard';
import DigitizationCard from '../components/DigitizationCard';
import SimpleStatCard from '../components/SimpleStatCard';
import WifiTechnologyCard from '../components/WifiTechnologyCard';
import LocationTypesCard from '../components/LocationTypesCard';
import LGUListCard from '../components/LGUListCard';
import ExpiringContractsCard from '../components/ExpiringContractsCard';
import ActivationChartCard from '../components/ActivationChartCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRegion, setSelectedRegion] = useState('Region IV - A CALABARZON');
  
  // Sample data 
  const provincesData = [
    { name: 'Cavite', value: 20, color: '#4ade80' },
    { name: 'Laguna', value: 20, color: '#facc15' },
    { name: 'Rizal', value: 20, color: '#f87171' },
    { name: 'Quezon', value: 20, color: '#3b82f6' },
    { name: 'Batangas', value: 20, color: '#a855f7' }
  ];
  
  const wifiTechData = [
    { name: 'LTO', value: 40, color: '#fb923c', icon: '⚡', count: 10 },
    { name: 'Fiber', value: 60, color: '#c084fc', icon: '〰️', count: 16 }
  ];
  
  const locationTypes = [
    { name: 'Terminals', value: 20, icon: '🚌' },
    { name: 'Hospitals', value: 12, icon: '🏥' },
    { name: 'Fire Stations', value: 3, icon: '🚒' },
    { name: 'Public Market', value: 3, icon: '🏪' },
    { name: 'Schools', value: 3, icon: '📚' },
    { name: 'Plaza', value: 3, icon: '🏞️' }
  ];
  
  const lguData = [
    { id: 1, name: 'Calamba City', subtext: 'Laguna', value: 30 },
    { id: 2, name: 'Sta. Cruz', subtext: 'Batangas', value: 30 },
    { id: 3, name: 'Batangas City', subtext: 'Batangas', value: 30 },
    { id: 4, name: 'Antipolo City', subtext: 'Rizal', value: 30 },
    { id: 5, name: 'Lipa City', subtext: 'Batangas', value: 30 },
    { id: 6, name: 'Nasugbu', subtext: 'Batangas', value: 30 },
    { id: 7, name: 'Dasmariñas City', subtext: 'Cavite', value: 30 },
    { id: 8, name: 'Angono City', subtext: 'Rizal', value: 30 }
  ];
  
  const expiringContracts = [
    { site: 'BSU Main Building 2', date: 'October 5, 2025' },
    { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' },
    { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' },
    { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' },
    { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' }
  ];
  
  const activationData = [
    { year: '2020', value: 345 },
    { year: '2021', value: 345 },
    { year: '2022', value: 345 },
    { year: '2023', value: 365 },
    { year: '2024', value: 345 },
    { year: '2025', value: 345 }
  ];

  return (
    <div className="flex h-screen w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 bg-blue-50 overflow-y-auto">
        <Header region={selectedRegion} 
        onRegionChange={setSelectedRegion} />
        
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-4">
              <CombinedLocationProvincesCard
                locationCount="220"
                trendValue="23 new loc vs last month"
                provincesData={provincesData}
              />
              
              <WifiTechnologyCard data={wifiTechData} />
              
              <LocationTypesCard 
                title={"Free WiFi Sites location per location types in" + selectedRegion}
                subtitle="Free WiFi sites location per location types in Batangas"
                data={locationTypes}
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <EnhancedStatCard
                title="Total No. of FreeWiFi Sites" 
                value="220" 
                trend="down" 
                trendValue="23 new sites vs last month"
                totalSites="1470"
                activeCount="1235"
                terminatedCount="235"
                activePercentage="80"
              />
              
              <DigitizationCard 
                percentage={67}
                totalCount={21464}
                activeCount={3125}
                description="(No. of Brgys with WiFi Location / Total no. of Brgys)"
              />
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-col gap-2">
                  <SimpleStatCard title="GIDA Serviced" value="220" />
                  <SimpleStatCard title="ELCAC Area Serviced" value="220" />
                </div>
              </div>
              
              <LGUListCard 
                title={'LGUs in ${selectedRegion }with most Free WiFi Location'}
                data={lguData}
              />
            </div>
            
            <div className="bg-blue-900 rounded-lg p-4 flex flex-col gap-4">
              <div className="flex-1">
                <ExpiringContractsCard contracts={expiringContracts} />
              </div>
              
              <div className="flex-1">
                <ActivationChartCard 
                  title="No. of WiFi Activated per Year of Activation"
                  data={activationData}
                  highlightYear="2023"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;