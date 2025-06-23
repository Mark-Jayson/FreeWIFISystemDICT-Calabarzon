import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import FreeWifiStatCard from '../components/dashboard/FreeWifiStatCard';
import SitesStatusBar from '../components/dashboard/SitesStatusBar';
import DigitizationCard from '../components/dashboard/DigitizationCard';
//import KeyMetricCard from '../components/dashboard/KeyMetricCard';
import LocationProvincesCard from '../components/dashboard/LocationProvincesCard';
// import WifiTechnologyBar from '../components/dashboard/WifiTechnologyBar'; // COMMENTED OUT
import LocationTypeGrid from '../components/dashboard/LocationTypeGrid';
import TopLGUListCard from '../components/dashboard/TopLGUListCard';
import ExpiringContractsTable from '../components/dashboard/ExpiringContractsTable';
import YearlyActivationChart from '../components/dashboard/YearlyActivationChart';
// Import the new components
import RecentlyAddedSitesCard from '../components/dashboard/RecentlyAddedSitesCard';
import RecentlyTerminatedSitesCard from '../components/dashboard/RecentlyTerminatedSitesCard';
import RecentActivitySummaryCard from '../components/dashboard/RecentActivitySummaryCard';

const Dashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [darkMode, setDarkMode] = useState(false); // Add dark mode state
  const [expiringContracts, setExpiringContracts] = useState([]);
  const [yearlyActivationData, setYearlyActivationData] = useState([]);
  const [noDateCount, setNoDateCount] = useState(0);
  const [siteTypeData, setSiteTypeData] = useState([]);
  const [topLGUs, setTopLGUs] = useState([]);

  // New state for recent sites
  const [recentlyAddedSites, setRecentlyAddedSites] = useState([]);
  const [recentlyTerminatedSites, setRecentlyTerminatedSites] = useState([]);
  const [recentSitesLoading, setRecentSitesLoading] = useState(true);

  const [locationDistribution, setLocationDistribution] = useState({
    locationCount: 0,
    provincesData: [],
    trendValue: '0%',
  });

  const [wifiStats, setWifiStats] = useState({
    totalSites: 0,
    activeSites: 0,
    terminatedSites: 0,
    forRenewalSites: 0,
    unknownSites: 0,
    activePercentage: 0,
    terminatedPercentage: 0,
    forRenewalPercentage: 0,
    unknownPercentage: 0,
    trendValue: '0%',
    isPositiveTrend: true,
    loading: true,
    error: null,
  });

  // Add digitization stats state
  const [digitizationStats, setDigitizationStats] = useState({
    percentage: 0,
    totalCount: 0,
    activeCount: 0,
    description: "WiFi Location Coverage in Calabarzon"
  });

  const handleProvinceSelect = (provinceId) => setSelectedProvince(provinceId);

  // Add dark mode toggle handler
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

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

      // Update digitization stats based on wifi stats
      setDigitizationStats({
        percentage: data.activePercentage || 0,
        totalCount: data.totalSites || 0,
        activeCount: data.activeSites || 0,
        description: province === 'all'
          ? "WiFi Location Coverage in Calabarzon"
          : `WiFi Location Coverage in ${province}`
      });
    } catch (err) {
      console.error('WiFi‑stats error:', err);
      setWifiStats((p) => ({ ...p, loading: false, error: 'Fetch failed' }));
    }
  };

  // New function to fetch recently added sites
  const fetchRecentlyAddedSites = async () => {
    try {
      setRecentSitesLoading(true);
      const url = selectedProvince === 'all'
        ? 'http://localhost:5000/api/recently-added-sites'
        : `http://localhost:5000/api/recently-added-sites?province=${selectedProvince}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('✅ Dashboard got sites:', data);
      setRecentlyAddedSites(data);
    } catch (err) {
      console.error('Recently added sites error:', err);
      setRecentlyAddedSites([]);
    }
  };

  // New function to fetch recently terminated sites
  const fetchRecentlyTerminatedSites = async () => {
    try {
      const url = selectedProvince === 'all'
        ? 'http://localhost:5000/api/recently-terminated-sites'
        : `http://localhost:5000/api/recently-terminated-sites?province=${selectedProvince}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecentlyTerminatedSites(data);
    } catch (err) {
      console.error('Recently terminated sites error:', err);
      setRecentlyTerminatedSites([]);
    } finally {
      setRecentSitesLoading(false);
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

  const fetchLocationDistribution = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/location-distribution');
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();

      const colorPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];
      const allProvinces = data.provinces.map((p, idx) => ({
        name: p.name,
        value: p.count,
        color: colorPalette[idx % colorPalette.length],
      }));

      let filteredProvinces;
      let locationCount;

      if (selectedProvince === 'all') {
        filteredProvinces = allProvinces;
        locationCount = data.total;
      } else {
        const match = allProvinces.find(
          (p) => p.name.toLowerCase() === selectedProvince.toLowerCase()
        );
        const count = match?.value || 0;
        locationCount = count;
        filteredProvinces = count > 0
          ? [{ name: match.name, value: count, color: match.color }, {
            name: 'Other',
            value: data.total - count,
            color: '#f0f0f0',
          }]
          : [];
      }

      setLocationDistribution({
        locationCount,
        provincesData: filteredProvinces,
        trendValue: '0%',
      });
    } catch (err) {
      console.error('Location distribution error:', err);
      setLocationDistribution({ locationCount: 0, provincesData: [], trendValue: '0%' });
    }
  };

  useEffect(() => {
    fetchWifiStats(selectedProvince);
    fetchExpiringContracts();
    fetchYearlyActivations();
    fetchTopLGUs();
    fetchSiteTypes();
    fetchLocationDistribution();
    // Fetch recent sites data
    fetchRecentlyAddedSites();
    fetchRecentlyTerminatedSites();
  }, [selectedProvince]);

  return (
    <div className={`flex-1 ${darkMode ? 'bg-gray-900' : 'bg-blue-50'} overflow-y-auto transition-colors duration-200`}>
      <Header
        region="Region IV – A Calabarzon"
        onProvinceSelect={handleProvinceSelect}
        selectedProvince={selectedProvince}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
      />
      <div className="px-6 pb-6">
        {/* Recent Activity Summary Row */}
        <div className="mb-6">
          <RecentActivitySummaryCard
            recentlyAdded={recentlyAddedSites}
            recentlyTerminated={recentlyTerminatedSites}
            loading={recentSitesLoading}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Location & Infrastructure */}
          <div className="flex flex-col gap-4">
            <LocationProvincesCard
              locationCount={locationDistribution.locationCount}
              trendValue={locationDistribution.trendValue}
              provincesData={locationDistribution.provincesData}
            />
            {/* <WifiTechnologyBar data={[]} /> */}
            <LocationTypeGrid
              title={
                selectedProvince === 'all'
                  ? 'Free WiFi Sites location per location types in Calabarzon'
                  : `Free WiFi Sites location per location types in ${selectedProvince}`
              }
              subtitle={selectedProvince === 'all' ? null : ''}
              data={siteTypeData}
            />
            {/* Recent Sites */}
            <RecentlyAddedSitesCard
              data={recentlyAddedSites}
              loading={recentSitesLoading}
            />

            <RecentlyTerminatedSitesCard
              data={recentlyTerminatedSites}
              loading={recentSitesLoading}
            />
          </div>

          {/* Middle Column - Stats & Metrics */}
          <div className="flex flex-col gap-4">
            <FreeWifiStatCard
              title="Total No. of FreeWiFi Sites"
              totalSites={wifiStats.totalSites}
              activeSites={wifiStats.activeSites}
              terminatedSites={wifiStats.terminatedSites}
              forRenewalSites={wifiStats.forRenewalSites}
              unknownSites={wifiStats.unknownSites}
              trendValue={wifiStats.trendValue}
              isPositiveTrend={wifiStats.isPositiveTrend}
              loading={wifiStats.loading}
              error={wifiStats.error}
            />

            {/* <KeyMetricCard gidaCount={0} elcacCount={0} /> */}

            <DigitizationCard
              percentage={digitizationStats.percentage}
              totalCount={digitizationStats.totalCount}
              activeCount={digitizationStats.activeCount}
              description={digitizationStats.description}
            />

            <TopLGUListCard
              title="Top LGU per Province with Most Free WiFi"
              data={topLGUs}
            />


          </div>

          {/* Right Column - Charts & Tables */}
          <div className="flex flex-col gap-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 transition-colors duration-200`}>
              <ExpiringContractsTable contracts={expiringContracts} />
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 transition-colors duration-200`}>
              <YearlyActivationChart
                title="No. of WiFi Activated per Year of Activation"
                data={yearlyActivationData}
                highlightYear="2023"
                noDateCount={noDateCount}
              />
              <div className={`mt-4 text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
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