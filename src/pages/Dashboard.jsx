import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '../components/dashboard/Header';
import FreeWifiStatCard from '../components/dashboard/FreeWifiStatCard';
import SitesStatusBar from '../components/dashboard/SitesStatusBar';
import DigitizationCard from '../components/dashboard/DigitizationCard';
import LocationProvincesCard from '../components/dashboard/LocationProvincesCard';
import LocationTypeGrid from '../components/dashboard/LocationTypeGrid';
import TopLGUListCard from '../components/dashboard/TopLGUListCard';
import ExpiringContractsTable from '../components/dashboard/ExpiringContractsTable';
import YearlyActivationChart from '../components/dashboard/YearlyActivationChart';
import RecentlyAddedSitesCard from '../components/dashboard/RecentlyAddedSitesCard';
import RecentlyTerminatedSitesCard from '../components/dashboard/RecentlyTerminatedSitesCard';
import RecentActivitySummaryCard from '../components/dashboard/RecentActivitySummaryCard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// RGB Color Override Styles
const rgbColors = {
  // Background colors
  bgWhite: { backgroundColor: 'rgb(255, 255, 255)' },
  bgGray50: { backgroundColor: 'rgb(249, 250, 251)' },
  bgGray100: { backgroundColor: 'rgb(243, 244, 246)' },
  bgGray800: { backgroundColor: 'rgb(31, 41, 55)' },
  bgGray900: { backgroundColor: 'rgb(17, 24, 39)' },
  bgBlue50: { backgroundColor: 'rgb(239, 246, 255)' },
  bgBlue500: { backgroundColor: 'rgb(59, 130, 246)' },
  bgBlue600: { backgroundColor: 'rgb(37, 99, 235)' },
  bgRed50: { backgroundColor: 'rgb(254, 242, 242)' },
  bgGreen50: { backgroundColor: 'rgb(240, 253, 244)' },
  bgYellow50: { backgroundColor: 'rgb(254, 252, 232)' },
  bgTransparent: { backgroundColor: 'transparent' },
  
  // Text colors
  textGray600: { color: 'rgb(75, 85, 99)' },
  textGray700: { color: 'rgb(55, 65, 81)' },
  textGray800: { color: 'rgb(31, 41, 55)' },
  textGray900: { color: 'rgb(17, 24, 39)' },
  textBlue600: { color: 'rgb(37, 99, 235)' },
  textWhite: { color: 'rgb(255, 255, 255)' },
  
  // Border colors
  borderGray200: { borderColor: 'rgb(229, 231, 235)' },
  borderGray300: { borderColor: 'rgb(209, 213, 219)' },
  borderBlue200: { borderColor: 'rgb(191, 219, 254)' },
  
  // Combined styles for common patterns
  cardStyle: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderColor: 'rgb(229, 231, 235)',
    borderWidth: '1px',
    borderStyle: 'solid',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  },
  
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  },
  
  transparentBg: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  }
};

// Color conversion utility
const convertModernColors = (element) => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );

  const colorMappings = {
    'oklch(0.65 0.15 200)': 'rgb(59, 130, 246)', // blue-500
    'oklch(0.55 0.15 200)': 'rgb(37, 99, 235)', // blue-600
    'oklch(0.98 0.01 106)': 'rgb(249, 250, 251)', // gray-50
    'oklch(0.96 0.01 106)': 'rgb(243, 244, 246)', // gray-100
    'oklch(0.22 0.01 106)': 'rgb(31, 41, 55)', // gray-800
    'oklch(0.15 0.01 106)': 'rgb(17, 24, 39)', // gray-900
  };

  let node;
  while (node = walker.nextNode()) {
    const computedStyle = window.getComputedStyle(node);
    
    // Check and convert background-color
    const bgColor = computedStyle.backgroundColor;
    if (bgColor && bgColor.includes('oklch')) {
      const rgbEquivalent = colorMappings[bgColor] || 'rgb(255, 255, 255)';
      node.style.backgroundColor = rgbEquivalent;
    }
    
    // Check and convert color
    const textColor = computedStyle.color;
    if (textColor && textColor.includes('oklch')) {
      const rgbEquivalent = colorMappings[textColor] || 'rgb(0, 0, 0)';
      node.style.color = rgbEquivalent;
    }
    
    // Check and convert border-color
    const borderColor = computedStyle.borderColor;
    if (borderColor && borderColor.includes('oklch')) {
      const rgbEquivalent = colorMappings[borderColor] || 'rgb(229, 231, 235)';
      node.style.borderColor = rgbEquivalent;
    }
  }
};

// Province display name utility
const getProvinceDisplayName = (provinceId) => {
  const provinceMap = {
    'all': 'Region IV – A Calabarzon',
    'cavite': 'Cavite',
    'laguna': 'Laguna', 
    'batangas': 'Batangas',
    'rizal': 'Rizal',
    'quezon': 'Quezon'
  };
  return provinceMap[provinceId] || provinceId;
};

// Custom hook for API error handling
const useApiErrorHandler = () => {
  const [globalError, setGlobalError] = useState(null);

  const handleError = useCallback((error, context) => {
    console.error(`Error in ${context}:`, error);
    setGlobalError(`Failed to load ${context}. Please try again.`);
  }, []);

  const clearError = useCallback(() => {
    setGlobalError(null);
  }, []);

  return { globalError, handleError, clearError };
};

const Dashboard = () => {
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { globalError, handleError, clearError } = useApiErrorHandler();
  
  // Consolidated loading states
  const [loadingStates, setLoadingStates] = useState({
    wifiStats: true,
    contracts: true,
    yearlyActivations: true,
    siteTypes: true,
    topLGUs: true,
    locationDistribution: true,
    recentSites: true
  });

  // Data states
  const [expiringContracts, setExpiringContracts] = useState([]);
  const [yearlyActivationData, setYearlyActivationData] = useState([]);
  const [noDateCount, setNoDateCount] = useState(0);
  const [siteTypeData, setSiteTypeData] = useState([]);
  const [topLGUs, setTopLGUs] = useState([]);
  const [recentlyAddedSites, setRecentlyAddedSites] = useState([]);
  const [recentlyTerminatedSites, setRecentlyTerminatedSites] = useState([]);

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

  // Memoized digitization stats
  const digitizationStats = useMemo(() => ({
    percentage: wifiStats.activePercentage || 0,
    totalCount: wifiStats.totalSites || 0,
    activeCount: wifiStats.activeSites || 0,
    description: selectedProvince === 'all'
      ? "WiFi Location Coverage in Calabarzon"
      : `WiFi Location Coverage in ${getProvinceDisplayName(selectedProvince)}`
  }), [wifiStats.activePercentage, wifiStats.totalSites, wifiStats.activeSites, selectedProvince]);

  // Check if any data is loading
  const isAnyLoading = useMemo(() => 
    Object.values(loadingStates).some(Boolean), 
    [loadingStates]
  );

  // Update loading state helper
  const updateLoadingState = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Province selection handler
  const handleProvinceSelect = useCallback((provinceId) => {
    setSelectedProvince(provinceId);
    clearError();
  }, [clearError]);

  // API fetch functions with improved error handling
  const fetchWifiStats = useCallback(async (province = 'all') => {
    try {
      updateLoadingState('wifiStats', true);
      setWifiStats((prev) => ({ ...prev, loading: true, error: null }));
      
      const url = province === 'all'
        ? 'http://localhost:5000/api/wifi-stats'
        : `http://localhost:5000/api/wifi-stats?province=${province}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setWifiStats({ ...data, loading: false, error: null });
    } catch (err) {
      handleError(err, 'WiFi statistics');
      setWifiStats((prev) => ({ ...prev, loading: false, error: 'Fetch failed' }));
    } finally {
      updateLoadingState('wifiStats', false);
    }
  }, [handleError, updateLoadingState]);

  const fetchExpiringContracts = useCallback(async () => {
    try {
      updateLoadingState('contracts', true);
      const res = await fetch(`http://localhost:5000/api/expiring-contracts?province=${selectedProvince}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setExpiringContracts(data);
    } catch (err) {
      handleError(err, 'expiring contracts');
      setExpiringContracts([]);
    } finally {
      updateLoadingState('contracts', false);
    }
  }, [selectedProvince, handleError, updateLoadingState]);

  const fetchYearlyActivations = useCallback(async () => {
    try {
      updateLoadingState('yearlyActivations', true);
      const res = await fetch(`http://localhost:5000/api/yearly-activations?province=${selectedProvince}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setYearlyActivationData(data.yearlyData || []);
      setNoDateCount(data.noDate || 0);
    } catch (err) {
      handleError(err, 'yearly activations');
      setYearlyActivationData([]);
      setNoDateCount(0);
    } finally {
      updateLoadingState('yearlyActivations', false);
    }
  }, [selectedProvince, handleError, updateLoadingState]);

  const fetchSiteTypes = useCallback(async () => {
    try {
      updateLoadingState('siteTypes', true);
      const res = await fetch(`http://localhost:5000/api/site-types?province=${selectedProvince}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const transformed = data.map((item) => ({
        name: item.site_type || 'Unknown',
        value: item.count,
        icon: '📍',
      }));
      setSiteTypeData(transformed);
    } catch (err) {
      handleError(err, 'site types');
      setSiteTypeData([]);
    } finally {
      updateLoadingState('siteTypes', false);
    }
  }, [selectedProvince, handleError, updateLoadingState]);

  const fetchTopLGUs = useCallback(async () => {
    try {
      updateLoadingState('topLGUs', true);
      const res = await fetch(`http://localhost:5000/api/top-lgus?province=${selectedProvince}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      setTopLGUs(data);
    } catch (err) {
      handleError(err, 'top LGUs');
      setTopLGUs([]);
    } finally {
      updateLoadingState('topLGUs', false);
    }
  }, [selectedProvince, handleError, updateLoadingState]);

  const fetchLocationDistribution = useCallback(async () => {
    try {
      updateLoadingState('locationDistribution', true);
      const res = await fetch('http://localhost:5000/api/location-distribution');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
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
          ? [
              { name: match.name, value: count, color: match.color },
              { name: 'Other', value: data.total - count, color: '#f0f0f0' }
            ]
          : [];
      }

      setLocationDistribution({
        locationCount,
        provincesData: filteredProvinces,
        trendValue: '0%',
      });
    } catch (err) {
      handleError(err, 'location distribution');
      setLocationDistribution({ locationCount: 0, provincesData: [], trendValue: '0%' });
    } finally {
      updateLoadingState('locationDistribution', false);
    }
  }, [selectedProvince, handleError, updateLoadingState]);

  const fetchRecentSites = useCallback(async () => {
    try {
      updateLoadingState('recentSites', true);
      
      const [addedUrl, terminatedUrl] = [
        selectedProvince === 'all'
          ? 'http://localhost:5000/api/recently-added-sites'
          : `http://localhost:5000/api/recently-added-sites?province=${selectedProvince}`,
        selectedProvince === 'all'
          ? 'http://localhost:5000/api/recently-terminated-sites'
          : `http://localhost:5000/api/recently-terminated-sites?province=${selectedProvince}`
      ];

      const [addedRes, terminatedRes] = await Promise.all([
        fetch(addedUrl),
        fetch(terminatedUrl)
      ]);

      if (!addedRes.ok || !terminatedRes.ok) {
        throw new Error('Failed to fetch recent sites data');
      }

      const [addedData, terminatedData] = await Promise.all([
        addedRes.json(),
        terminatedRes.json()
      ]);

      setRecentlyAddedSites(addedData);
      setRecentlyTerminatedSites(terminatedData);
    } catch (err) {
      handleError(err, 'recent sites');
      setRecentlyAddedSites([]);
      setRecentlyTerminatedSites([]);
    } finally {
      updateLoadingState('recentSites', false);
    }
  }, [selectedProvince, handleError, updateLoadingState]);

  // Enhanced PDF generation with better error handling
  const handleGenerateReport = useCallback(async () => {
    setIsGeneratingPdf(true);
    try {
      const input = document.getElementById('dashboard-content');
      if (!input) {
        throw new Error('Dashboard content element not found');
      }

      // Clone the element to avoid modifying the original
      const clonedInput = input.cloneNode(true);
      clonedInput.style.position = 'absolute';
      clonedInput.style.top = '-9999px';
      clonedInput.style.left = '-9999px';
      document.body.appendChild(clonedInput);

      // Convert modern colors to compatible formats
      convertModernColors(clonedInput);

      // Add a small delay to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clonedInput, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        ignoreElements: (element) => {
          return element.tagName === 'IFRAME' || 
                 element.classList.contains('no-pdf') ||
                 element.style.display === 'none';
        }
      });

      // Clean up the cloned element
      document.body.removeChild(clonedInput);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add metadata
      pdf.setProperties({
        title: `WiFi Dashboard Report - ${getProvinceDisplayName(selectedProvince)}`,
        subject: 'WiFi Infrastructure Report',
        author: 'Dashboard System',
        creator: 'WiFi Dashboard'
      });

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
      alert(`Failed to generate report: ${error.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [selectedProvince]);

  // Fetch all data when province changes
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchWifiStats(selectedProvince),
        fetchExpiringContracts(),
        fetchYearlyActivations(),
        fetchTopLGUs(),
        fetchSiteTypes(),
        fetchLocationDistribution(),
        fetchRecentSites()
      ]);
    };

    fetchAllData();
  }, [selectedProvince, fetchWifiStats, fetchExpiringContracts, fetchYearlyActivations, 
      fetchTopLGUs, fetchSiteTypes, fetchLocationDistribution, fetchRecentSites]);

  return (
    <div 
      className="flex-1 overflow-y-auto"
      style={{ 
        ...rgbColors.transparentBg,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      }}
    >
      <Header
        region="Region IV – A Calabarzon"
        onProvinceSelect={handleProvinceSelect}
        selectedProvince={selectedProvince}
        onGenerateReport={handleGenerateReport}
      />

      {/* Global Error Message */}
      {globalError && (
        <div 
          className="mx-6 mt-4 p-4 rounded-lg border"
          style={{
            ...rgbColors.bgRed50,
            borderColor: 'rgb(252, 165, 165)',
            color: 'rgb(153, 27, 27)'
          }}
        >
          <div className="flex justify-between items-center">
            <span>{globalError}</span>
            <button
              onClick={clearError}
              className="ml-4 text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div 
        id="dashboard-content" 
        className="px-6 pb-6 pt-6"
        style={rgbColors.transparentBg}
        role="main"
        aria-label={`Dashboard for ${getProvinceDisplayName(selectedProvince)}`}
      >
        {/* Province Header for PDF Report */}
        <div 
          className="mb-6 print-only-header"
          style={{
            ...rgbColors.cardStyle,
            padding: '16px 24px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold"
                style={rgbColors.textGray900}
              >
                WiFi Dashboard Report
              </h1>
              <p 
                className="text-lg mt-1"
                style={rgbColors.textBlue600}
              >
                {getProvinceDisplayName(selectedProvince)}
              </p>
            </div>
            <div className="text-right">
              <p 
                className="text-sm font-medium"
                style={rgbColors.textGray700}
              >
                Generated on: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
              <p 
                className="text-sm"
                style={rgbColors.textGray600}
              >
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary Row */}
        <div className="mb-6">
          <RecentActivitySummaryCard
            recentlyAdded={recentlyAddedSites}
            recentlyTerminated={recentlyTerminatedSites}
            loading={loadingStates.recentSites}
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
            
            <LocationTypeGrid
              title={
                selectedProvince === 'all'
                  ? 'Free WiFi Sites location per location types in Calabarzon'
                  : `Free WiFi Sites location per location types in ${getProvinceDisplayName(selectedProvince)}`
              }
              subtitle={selectedProvince === 'all' ? null : ''}
              data={siteTypeData}
            />
            
            <RecentlyAddedSitesCard
              data={recentlyAddedSites}
              loading={loadingStates.recentSites}
            />

            <RecentlyTerminatedSitesCard
              data={recentlyTerminatedSites}
              loading={loadingStates.recentSites}
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
              style={rgbColors.cardStyle}
            >
              <ExpiringContractsTable contracts={expiringContracts} />
            </div>

            <div 
              className="rounded-lg shadow p-4"
              style={rgbColors.cardStyle}
            >
              <YearlyActivationChart
                title="No. of WiFi Activated per Year of Activation"
                data={yearlyActivationData}
                highlightYear="2023"
                noDateCount={noDateCount}
              />
              <div 
                className="mt-4 text-left text-sm"
                style={rgbColors.textGray700}
              >
                <strong>WiFi activated without date:</strong> {noDateCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Generation Loading Overlay */}
      {isGeneratingPdf && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={rgbColors.overlayStyle}
          role="dialog"
          aria-label="Generating PDF report"
        >
          <div 
            className="p-6 rounded-lg shadow-xl flex items-center space-x-3"
            style={rgbColors.bgWhite}
          >
            <svg 
              className="animate-spin h-5 w-5" 
              style={rgbColors.textBlue600}
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
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
              style={rgbColors.textGray800}
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