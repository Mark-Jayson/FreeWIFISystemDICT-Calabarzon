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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Dashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [expiringContracts, setExpiringContracts] = useState([]);
  const [yearlyActivationData, setYearlyActivationData] = useState([]);
  const [noDateCount, setNoDateCount] = useState(0);
  const [siteTypeData, setSiteTypeData] = useState([]);
  const [topLGUs, setTopLGUs] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Added missing darkMode state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
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

  // Single unified report generation handler
  const handleGenerateReport = async () => {
    setIsGeneratingPdf(true); // Corrected: use setIsGeneratingPdf (capital 'I')
    try {
      const input = document.getElementById('dashboard-content');
      if (!input) {
        console.error('Dashboard content element not found!');
        alert('Failed to find dashboard content for PDF generation. Make sure the div has id="dashboard-content".');
        setIsGeneratingPdf(false); // Corrected: use setIsGeneratingPdf (capital 'I')
        return;
      }

      // Add a small delay to ensure all content is rendered, especially charts
      // This can be crucial for html2canvas to capture everything correctly
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(input, {
        scale: 2, // Increase scale for better resolution
        logging: true, // Enable logging for debugging
        useCORS: true, // Important if you have images from different origins
        // Consider increasing the timeout for very large or complex dashboards
        // timeout: 5000,
      });

      // Optional: Temporarily append the canvas to the body to inspect it
      // document.body.appendChild(canvas);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const exportFileDefaultName = `wifi-dashboard-report-${selectedProvince}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(exportFileDefaultName);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again. Check console for details.');
    } finally {
      setIsGeneratingPdf(false); // Corrected: use setIsGeneratingPdf (capital 'I')
    }
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
    <div 
      className="flex-1 overflow-y-auto"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      <Header
        region="Region IV – A Calabarzon"
        onProvinceSelect={handleProvinceSelect}
        selectedProvince={selectedProvince}
        onGenerateReport={handleGenerateReport}
      />

<<<<<<< HEAD
      <div 
        id="dashboard-content" 
        className="px-6 pb-6 pt-6"
        style={{ 
          fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
        }}
      >
=======
      <div id="dashboard-content" className="px-6 pb-6 pt-6">
>>>>>>> 16aebd70dbd3af0ef3c383feedc8243d5b49fb97
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
            <div 
              className="rounded-lg shadow p-4"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(236, 237, 240, 1)', /* Converted from oklch(0.928 0.006 264.531) */
                borderWidth: '1px',
                borderStyle: 'solid',
                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
              }}
            >
              <ExpiringContractsTable contracts={expiringContracts} />
            </div>

            <div 
              className="rounded-lg shadow p-4"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(236, 237, 240, 1)', /* Converted from oklch(0.928 0.006 264.531) */
                borderWidth: '1px',
                borderStyle: 'solid',
                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
              }}
            >
              <YearlyActivationChart
                title="No. of WiFi Activated per Year of Activation"
                data={yearlyActivationData}
                highlightYear="2023"
                noDateCount={noDateCount}
              />
              <div 
                className="mt-4 text-left text-sm"
                style={{ 
                  color: 'rgba(55, 65, 81, 1)' // Gray-700 equivalent
                }}
              >
                <strong>WiFi activated without date:</strong> {noDateCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGeneratingPdf && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
          }}
        >
          <div 
            className="p-6 rounded-lg shadow-xl flex items-center space-x-3"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 1)'
            }}
          >
            <svg 
              className="animate-spin h-5 w-5" 
              style={{ color: 'rgba(37, 99, 235, 1)' }} /* Blue-600 equivalent */
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p 
              className="font-medium"
              style={{ 
                color: 'rgba(31, 41, 55, 1)' // Gray-800 equivalent
              }}
            >
              Generating PDF report...
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;