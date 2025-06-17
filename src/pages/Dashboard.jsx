import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import FreeWifiStatCard from '../components/dashboard/FreeWifiStatCard';
import DigitizationCard from '../components/dashboard/DigitizationCard';
// import KeyMetricCard from '../components/dashboard/KeyMetricCard';
import LocationProvincesCard from '../components/dashboard/LocationProvincesCard';
// import WifiTechnologyBar from '../components/dashboard/WifiTechnologyBar';
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
  const [topLGUs, setTopLGUs] = useState([]);

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

  /* ----------------  DATA FETCH HELPERS  ---------------- */

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
      const res = await fetch(`http://localhost:5000/api/expiring-contracts?province=${selectedProvince}`);
      if (!res.ok) throw new Error(res.status);
      setExpiringContracts(await res.json());
    } catch (err) {
      console.error('Contracts error:', err);
      setExpiringContracts([]);
    }
  };


  const fetchYearlyActivations = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/yearly-activations?province=${selectedProvince}`);
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
      const res = await fetch(`http://localhost:5000/api/site-types?province=${selectedProvince}`);
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

  const fetchTopLGUs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/top-lgus?province=${selectedProvince}`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setTopLGUs(data);
    } catch (err) {
      console.error('Top LGU error:', err);
      setTopLGUs([]);
    }
  };

  useEffect(() => {
    fetchWifiStats(selectedProvince);
    fetchExpiringContracts();
    fetchYearlyActivations();
    fetchTopLGUs();
    fetchSiteTypes();
  }, [selectedProvince]);


  /* ----------------  RENDER  ---------------- */

  return (
    <div className="flex-1 bg-blue-50 overflow-y-auto">
      <Header
        region="Region IV – A Calabarzon"
        onProvinceSelect={handleProvinceSelect}
        selectedProvince={selectedProvince}
      />


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
              title="Top LGU per Province with Most Free WiFi"
              data={topLGUs}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4 h-full">
            <YearlyActivationChart
              title="No. of WiFi Activated per Year of Activation"
              data={yearlyActivationData}
              highlightYear="2023"
              noDateCount={noDateCount}
            />

            {/* single line INSIDE the card, below the chart */}
            <div className="mt-4 text-center text-sm text-gray-700">
              <strong>WiFi activated without date:</strong> {noDateCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;