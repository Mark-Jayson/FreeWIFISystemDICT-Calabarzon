import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import PieChartCard from '../components/PieChartCard';
import ExpiringContractsCard from '../components/ExpiringContractsCard';
import DigitizationCard from '../components/DigitizationCard';
import SimpleStatCard from '../components/SimpleStatCard';
import WifiTechnologyCard from '../components/WifiTechnologyCard';
import LocationTypesCard from '../components/LocationTypesCard';
import LGUListCard from '../components/LGUListCard';
import ActivationChartCard from '../components/ActivationChartCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const provincesData = [
    { name: 'Cavite', value: 20, color: '#4ade80' },
    { name: 'Laguna', value: 20, color: '#facc15' },
    { name: 'Rizal', value: 20, color: '#f87171' },
    { name: 'Quezon', value: 20, color: '#a855f7' },
    { name: 'Batangas', value: 20, color: '#3b82f6' }
  ];
  
  const wifiTechData = [
    { name: 'LTO', value: 40, color: '#fb923c', icon: '⚡' },
    { name: 'Fiber', value: 60, color: '#c084fc', icon: '〰️' }
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
    <div className="flex h-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 bg-blue-50 overflow-y-auto">
        <Header region="Region IV - A Calabarzon" />
        
        <div className="px-6 pb-6 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <StatCard 
              title="No. of location with Free WiFi sites" 
              value="220" 
              trend="up" 
              trendValue="23 new loc vs last month"
            />
          </div>
          
          <div className="col-span-5">
            <StatCard 
              title="Total No. of FreeWiFi sites" 
              value="220" 
              trend="down" 
              trendValue="23 new sites vs last month"
            >
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>1235 Active sites</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                  <span>235 Terminated</span>
                </div>
              </div>
            </StatCard>
          </div>
          
          <div className="col-span-4">
            <ExpiringContractsCard contracts={expiringContracts} />
          </div>
          
          <div className="col-span-4">
            <PieChartCard title="Distribution per Province" data={provincesData} />
          </div>
          
          <div className="col-span-4">
            <DigitizationCard 
              percentage={67}
              totalCount={21464}
              activeCount={3125}
              description="(No. of Brgys with WiFi Location / Total no. of Brgys)"
            />
          </div>
          
          <div className="col-span-2">
            <SimpleStatCard title="GIDA Serviced" value="220" />
          </div>
          
          <div className="col-span-2">
            <SimpleStatCard title="ELCAC Area Serviced" value="220" />
          </div>
          
          <div className="col-span-4">
            <WifiTechnologyCard data={wifiTechData} />
          </div>
          
          <div className="col-span-4">
            <LocationTypesCard 
              title="Free WiFi Sites location per location types in Calabarzon"
              subtitle="Free WiFi sites location per location types in Batangas"
              data={locationTypes}
            />
          </div>
          
          <div className="col-span-4">
            <LGUListCard 
              title="LGUs with most Free WiFi Location"
              data={lguData}
            />
          </div>
          
          <div className="col-span-12">
            <ActivationChartCard 
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