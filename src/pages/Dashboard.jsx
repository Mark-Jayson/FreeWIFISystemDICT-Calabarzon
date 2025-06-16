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
import { provinceData } from '../utils/provinceData';

const Dashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [expiringContracts, setExpiringContracts] = useState([]);
  const [yearlyActivationData, setYearlyActivationData] = useState([]);
  const [noDateCount, setNoDateCount] = useState(0);
  const [siteTypeData, setSiteTypeData] = useState([]);

  const [wifiStats, setWifiStats] = useState({
    totalSites: 0,
    activeSites: 0,
    terminatedSites: 0,
    activePercentage: 0,
    terminatedPercentage: 0,
    trendValue: '0%',
    isPositiveTrend: true,
    loading: true,
    error: null,
  });

  const handleProvinceSelect = (provinceId) => setSelectedProvince(provinceId);

  const fetchWifiStats = async (province = 'all') => {
    try {
      setWifiStats((prev) => ({ ...prev, loading: true, error: null }));
      const url =
        province === 'all'
          ? 'http://localhost:5000/api/wifi-stats'
          : `http://localhost:5000/api/wifi-stats?province=${province}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setWifiStats({ ...data, loading: false, error: null });
    } catch (err) {
      console.error('WiFi‑stats error:', err);
      setWifiStats((p) => ({ ...p, loading: false, error: 'Fetch failed' }));
    }
  };

  const fetchExpiringContracts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/expiring-contracts');
      if (!res.ok) throw new Error(res.status);
      setExpiringContracts(await res.json());
    } catch (err) {
      console.error('Contracts error:', err);
      setExpiringContracts([]);
    }
  };

  const fetchYearlyActivations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/yearly-activations');
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setYearlyActivationData(data.yearlyData);
      setNoDateCount(data.noDate);
    } catch (err) {
      console.error('Yearly‑activations error:', err);
      setYearlyActivationData([]);
    }
  };

  const fetchSiteTypes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/site-types');
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const transformed = data.map((item) => ({
        name: item.site_type || 'Unknown',
        value: item.count,
        icon: '📍',
      }));
      setSiteTypeData(transformed);
    } catch (err) {
      console.error('Site‑types error:', err);
      setSiteTypeData([]);
    }
  };

  useEffect(() => {
    fetchWifiStats(selectedProvince);
  }, [selectedProvince]);

  useEffect(() => {
    fetchExpiringContracts();
    fetchYearlyActivations();
    fetchSiteTypes();
  }, []);

  const currentData = provinceData[selectedProvince];

  return (
    <div className="flex-1 bg-blue-50 overflow-y-auto">
      <Header
        region="Region IV – A Calabarzon"
        onProvinceSelect={handleProvinceSelect}
        selectedProvince={selectedProvince}
      />
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4">
          {/* ----------  COLUMN 1  ---------- */}
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
              data={siteTypeData}
            />
          </div>

          {/* ----------  COLUMN 2  ---------- */}
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

          {/* ----------  COLUMN 3  ---------- */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <ExpiringContractsTable contracts={expiringContracts} />
            </div>

            <div className="bg-white rounded-lg shadow p-4 h-full">
              <YearlyActivationChart
                title="No. of WiFi Activated per Year of Activation"
                data={yearlyActivationData}
                highlightYear="2023"
                noDateCount={noDateCount}
              />
              <div className="mt-4 text-center text-sm text-gray-700">
                <strong>WiFi activated without date:</strong> {noDateCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
