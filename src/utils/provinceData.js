// utils/provinceData.js

// Province-specific data
export const provinceData = {
    // Default data for the entire region
    all: {
      locationCount: "220",
      trendValue: "23 new loc vs last month",
      provincesData: [
        { name: 'Cavite', value: 20, color: '#4ade80' },
        { name: 'Laguna', value: 20, color: '#facc15' },
        { name: 'Rizal', value: 20, color: '#f87171' },
        { name: 'Quezon', value: 20, color: '#3b82f6' },
        { name: 'Batangas', value: 20, color: '#a855f7' }
      ],
      wifiTechData: [
        { name: 'LTO', value: 40, color: '#fb923c', icon: '⚡', count: 10 },
        { name: 'Fiber', value: 60, color: '#c084fc', icon: '〰️', count: 16 }
      ],
      locationTypes: [
        { name: 'Terminals', value: 20, icon: '🚌' },
        { name: 'Hospitals', value: 12, icon: '🏥' },
        { name: 'Fire Stations', value: 3, icon: '🚒' },
        { name: 'Public Market', value: 3, icon: '🏪' },
        { name: 'Schools', value: 3, icon: '📚' },
        { name: 'Plaza', value: 3, icon: '🏞️' }
      ],
      // Free WiFi Stats
      freeWifiStats: {
        totalCount: 220,
        trendValue: "23 new sites vs last month",
        totalSites: 1470,
        activeCount: 1235,
        terminatedCount: 235,
        activePercentage: 80
      },
      // GIDA and ELCAC
      gidaCount: 220,
      elcacCount: 220,
      // Digitization
      digitization: {
        percentage: 67,
        totalCount: 21464,
        activeCount: 3125,
        description: "(No. of Brgys with WiFi Location / Total no. of Brgys)"
      },
      // LGUs
      lguData: [
        { id: 1, name: 'Calamba City', subtext: 'Laguna', value: 30 },
        { id: 2, name: 'Sta. Cruz', subtext: 'Batangas', value: 30 },
        { id: 3, name: 'Batangas City', subtext: 'Batangas', value: 30 },
        { id: 4, name: 'Antipolo City', subtext: 'Rizal', value: 30 },
        { id: 5, name: 'Lipa City', subtext: 'Batangas', value: 30 },
        { id: 6, name: 'Nasugbu', subtext: 'Batangas', value: 30 },
        { id: 7, name: 'Dasmariñas City', subtext: 'Cavite', value: 30 },
        { id: 8, name: 'Angono City', subtext: 'Rizal', value: 30 }
      ]
    },
    
    // Cavite data
    cavite: {
      locationCount: "52",
      trendValue: "5 new loc vs last month",
      provincesData: [
        { name: 'Cavite', value: 52, color: '#4ade80' }
      ],
      wifiTechData: [
        { name: 'LTO', value: 35, color: '#fb923c', icon: '⚡', count: 18 },
        { name: 'Fiber', value: 65, color: '#c084fc', icon: '〰️', count: 34 }
      ],
      locationTypes: [
        { name: 'Terminals', value: 15, icon: '🚌' },
        { name: 'Hospitals', value: 10, icon: '🏥' },
        { name: 'Fire Stations', value: 6, icon: '🚒' },
        { name: 'Public Market', value: 5, icon: '🏪' },
        { name: 'Schools', value: 8, icon: '📚' },
        { name: 'Plaza', value: 8, icon: '🏞️' }
      ],
      // Free WiFi Stats
      freeWifiStats: {
        totalCount: 52,
        trendValue: "5 new sites vs last month",
        totalSites: 320,
        activeCount: 256,
        terminatedCount: 64,
        activePercentage: 80
      },
      // GIDA and ELCAC
      gidaCount: 48,
      elcacCount: 52,
      // Digitization
      digitization: {
        percentage: 72,
        totalCount: 4600,
        activeCount: 3312,
        description: "(No. of Brgys with WiFi Location / Total no. of Brgys in Cavite)"
      },
      // LGUs
      lguData: [
        { id: 1, name: 'Dasmariñas City', subtext: 'Cavite', value: 12 },
        { id: 2, name: 'Bacoor City', subtext: 'Cavite', value: 10 },
        { id: 3, name: 'Imus City', subtext: 'Cavite', value: 8 },
        { id: 4, name: 'Tanza', subtext: 'Cavite', value: 7 },
        { id: 5, name: 'General Trias', subtext: 'Cavite', value: 6 },
        { id: 6, name: 'Trece Martires', subtext: 'Cavite', value: 5 },
        { id: 7, name: 'Tagaytay City', subtext: 'Cavite', value: 4 }
      ]
    },
  
    // Laguna data
    laguna: {
      locationCount: "45",
      trendValue: "4 new loc vs last month",
      provincesData: [
        { name: 'Laguna', value: 45, color: '#facc15' }
      ],
      wifiTechData: [
        { name: 'LTO', value: 42, color: '#fb923c', icon: '⚡', count: 19 },
        { name: 'Fiber', value: 58, color: '#c084fc', icon: '〰️', count: 26 }
      ],
      locationTypes: [
        { name: 'Terminals', value: 12, icon: '🚌' },
        { name: 'Hospitals', value: 8, icon: '🏥' },
        { name: 'Fire Stations', value: 5, icon: '🚒' },
        { name: 'Public Market', value: 6, icon: '🏪' },
        { name: 'Schools', value: 10, icon: '📚' },
        { name: 'Plaza', value: 4, icon: '🏞️' }
      ],
      // Free WiFi Stats
      freeWifiStats: {
        totalCount: 45,
        trendValue: "4 new sites vs last month",
        totalSites: 300,
        activeCount: 252,
        terminatedCount: 48,
        activePercentage: 84
      },
      // GIDA and ELCAC
      gidaCount: 40,
      elcacCount: 45,
      // Digitization
      digitization: {
        percentage: 70,
        totalCount: 4200,
        activeCount: 2940,
        description: "(No. of Brgys with WiFi Location / Total no. of Brgys in Laguna)"
      },
      // LGUs
      lguData: [
        { id: 1, name: 'Calamba City', subtext: 'Laguna', value: 11 },
        { id: 2, name: 'Sta. Cruz', subtext: 'Laguna', value: 8 },
        { id: 3, name: 'San Pablo City', subtext: 'Laguna', value: 7 },
        { id: 4, name: 'Biñan City', subtext: 'Laguna', value: 6 },
        { id: 5, name: 'Cabuyao City', subtext: 'Laguna', value: 5 },
        { id: 6, name: 'Santa Rosa City', subtext: 'Laguna', value: 4 },
        { id: 7, name: 'Los Baños', subtext: 'Laguna', value: 4 }
      ]
    },
  
    // Batangas data
    batangas: {
      locationCount: "48",
      trendValue: "6 new loc vs last month",
      provincesData: [
        { name: 'Batangas', value: 48, color: '#a855f7' }
      ],
      wifiTechData: [
        { name: 'LTO', value: 45, color: '#fb923c', icon: '⚡', count: 22 },
        { name: 'Fiber', value: 55, color: '#c084fc', icon: '〰️', count: 26 }
      ],
      locationTypes: [
        { name: 'Terminals', value: 14, icon: '🚌' },
        { name: 'Hospitals', value: 9, icon: '🏥' },
        { name: 'Fire Stations', value: 4, icon: '🚒' },
        { name: 'Public Market', value: 7, icon: '🏪' },
        { name: 'Schools', value: 11, icon: '📚' },
        { name: 'Plaza', value: 3, icon: '🏞️' }
      ],
      // Free WiFi Stats
      freeWifiStats: {
        totalCount: 48,
        trendValue: "6 new sites vs last month",
        totalSites: 310,
        activeCount: 241,
        terminatedCount: 69,
        activePercentage: 78
      },
      // GIDA and ELCAC
      gidaCount: 46,
      elcacCount: 48,
      // Digitization
      digitization: {
        percentage: 65,
        totalCount: 4300,
        activeCount: 2795,
        description: "(No. of Brgys with WiFi Location / Total no. of Brgys in Batangas)"
      },
      // LGUs
      lguData: [
        { id: 1, name: 'Batangas City', subtext: 'Batangas', value: 12 },
        { id: 2, name: 'Lipa City', subtext: 'Batangas', value: 10 },
        { id: 3, name: 'Nasugbu', subtext: 'Batangas', value: 8 },
        { id: 4, name: 'Tanauan City', subtext: 'Batangas', value: 6 },
        { id: 5, name: 'Sto. Tomas', subtext: 'Batangas', value: 5 },
        { id: 6, name: 'Rosario', subtext: 'Batangas', value: 4 },
        { id: 7, name: 'Bauan', subtext: 'Batangas', value: 3 }
      ]
    },
  
    // Rizal data
    rizal: {
      locationCount: "42",
      trendValue: "5 new loc vs last month",
      provincesData: [
        { name: 'Rizal', value: 42, color: '#f87171' }
      ],
      wifiTechData: [
        { name: 'LTO', value: 38, color: '#fb923c', icon: '⚡', count: 16 },
        { name: 'Fiber', value: 62, color: '#c084fc', icon: '〰️', count: 26 }
      ],
      locationTypes: [
        { name: 'Terminals', value: 10, icon: '🚌' },
        { name: 'Hospitals', value: 8, icon: '🏥' },
        { name: 'Fire Stations', value: 6, icon: '🚒' },
        { name: 'Public Market', value: 5, icon: '🏪' },
        { name: 'Schools', value: 9, icon: '📚' },
        { name: 'Plaza', value: 4, icon: '🏞️' }
      ],
      // Free WiFi Stats
      freeWifiStats: {
        totalCount: 42,
        trendValue: "5 new sites vs last month",
        totalSites: 290,
        activeCount: 237,
        terminatedCount: 53,
        activePercentage: 82
      },
      // GIDA and ELCAC
      gidaCount: 42,
      elcacCount: 42,
      // Digitization
      digitization: {
        percentage: 68,
        totalCount: 4000,
        activeCount: 2720,
        description: "(No. of Brgys with WiFi Location / Total no. of Brgys in Rizal)"
      },
      // LGUs
      lguData: [
        { id: 1, name: 'Antipolo City', subtext: 'Rizal', value: 14 },
        { id: 2, name: 'Cainta', subtext: 'Rizal', value: 8 },
        { id: 3, name: 'Taytay', subtext: 'Rizal', value: 7 },
        { id: 4, name: 'Rodriguez', subtext: 'Rizal', value: 5 },
        { id: 5, name: 'Angono City', subtext: 'Rizal', value: 4 },
        { id: 6, name: 'San Mateo', subtext: 'Rizal', value: 2 },
        { id: 7, name: 'Morong', subtext: 'Rizal', value: 2 }
      ]
    },
  
    // Quezon data
    quezon: {
      locationCount: "33",
      trendValue: "3 new loc vs last month",
      provincesData: [
        { name: 'Quezon', value: 33, color: '#3b82f6' }
      ],
      wifiTechData: [
        { name: 'LTO', value: 50, color: '#fb923c', icon: '⚡', count: 16 },
        { name: 'Fiber', value: 50, color: '#c084fc', icon: '〰️', count: 17 }
      ],
      locationTypes: [
        { name: 'Terminals', value: 8, icon: '🚌' },
        { name: 'Hospitals', value: 7, icon: '🏥' },
        { name: 'Fire Stations', value: 4, icon: '🚒' },
        { name: 'Public Market', value: 5, icon: '🏪' },
        { name: 'Schools', value: 6, icon: '📚' },
        { name: 'Plaza', value: 3, icon: '🏞️' }
      ],
      // Free WiFi Stats
      freeWifiStats: {
        totalCount: 33,
        trendValue: "3 new sites vs last month",
        totalSites: 250,
        activeCount: 190,
        terminatedCount: 60,
        activePercentage: 76
      },
      // GIDA and ELCAC
      gidaCount: 33,
      elcacCount: 33,
      // Digitization
      digitization: {
        percentage: 58,
        totalCount: 4364,
        activeCount: 2531,
        description: "(No. of Brgys with WiFi Location / Total no. of Brgys in Quezon)"
      },
      // LGUs
      lguData: [
        { id: 1, name: 'Lucena City', subtext: 'Quezon', value: 9 },
        { id: 2, name: 'Tayabas City', subtext: 'Quezon', value: 6 },
        { id: 3, name: 'Candelaria', subtext: 'Quezon', value: 5 },
        { id: 4, name: 'Sariaya', subtext: 'Quezon', value: 4 },
        { id: 5, name: 'Lucban', subtext: 'Quezon', value: 3 },
        { id: 6, name: 'Pagbilao', subtext: 'Quezon', value: 3 },
        { id: 7, name: 'Tiaong', subtext: 'Quezon', value: 3 }
      ]
    }
  };
  
  // Data that remains the same across all provinces
  export const staticData = {
    // Expiring contracts data
    expiringContracts: [
      { site: 'BSU Main Building 2', date: 'October 5, 2025' },
      { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' },
      { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' },
      { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' },
      { site: 'Batangas Capitol Hall Admin Building', date: 'October 23, 2025' }
    ],
    
    // Yearly activation data
    activationData: [
      { year: '2020', value: 345 },
      { year: '2021', value: 345 },
      { year: '2022', value: 345 },
      { year: '2023', value: 365 },
      { year: '2024', value: 345 },
      { year: '2025', value: 345 }
    ]
  };