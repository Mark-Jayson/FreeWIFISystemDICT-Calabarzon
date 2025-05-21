import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AddWifiSitePage = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [showNewLocationForm, setShowNewLocationForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const searchResultsRef = useRef(null);

  // const provinceData = {
  //   'Cavite': {
  //     localities: ['Bacoor', 'Cavite City', 'Dasmariñas', 'General Trias', 'Imus', 'Tagaytay', 'Trece Martires'],
  //     congressionals: ['1st District', '2nd District', '3rd District', '4th District', '5th District', '6th District', '7th District', '8th District']
  //   },
  //   'Laguna': {
  //     localities: ['Biñan', 'Cabuyao', 'Calamba', 'Los Baños', 'San Pablo', 'San Pedro', 'Santa Rosa'],
  //     congressionals: ['1st District', '2nd District', '3rd District', '4th District', '5th District']
  //   },
  //   'Batangas': {
  //     localities: ['Batangas City', 'Lipa', 'Santo Tomas', 'Tanauan', 'Bauan', 'Nasugbu', 'San Juan'],
  //     congressionals: ['1st District', '2nd District', '3rd District', '4th District', '5th District', '6th District']
  //   },
  //   'Rizal': {
  //     localities: ['Antipolo', 'Cainta', 'Taytay', 'Rodriguez', 'San Mateo', 'Tanay', 'Teresa'],
  //     congressionals: ['1st District', '2nd District', '3rd District', '4th District']
  //   },
  //   'Quezon': {
  //     localities: ['Lucena', 'Tayabas', 'Candelaria', 'Sariaya', 'Lucban', 'Infanta', 'Pagbilao'],
  //     congressionals: ['1st District', '2nd District', '3rd District', '4th District']
  //   }
  // };

  const [formData, setFormData] = useState({
    // Location data
    locationID: '',
    locationName: '',
    province: '',
    locality: '',
    congDistrict: '',
    cluster: '',
    category: '',

    // AP Site data
    sideCode: '', // site_name in apsites table
    siteName: '',
    contractStatus: '',
    dateActivation: '',
    dateEndContract: '',
    contract: '',
    siteType: '',
    cmsProvider: '',
    linkProvider: '',
    bandwidth: '',
    latitude: '',
    longitude: '',
    termination: '',
    year: '',
    dateAccepted: '',
    dateDeclaration: ''
  });

  const [localityOptions, setLocalityOptions] = useState([]);
  const [congressionalOptions, setCongressionalOptions] = useState([]);

  // Update locality and congressional options when province changes
  useEffect(() => {
    if (formData.province && provinceData[formData.province]) {
      setLocalityOptions(provinceData[formData.province].localities);
      setCongressionalOptions(provinceData[formData.province].congressionals);

      // Only reset if locality or congDistrict don't match available values
      setFormData(prev => {
        const localityValid = provinceData[formData.province].localities.includes(prev.locality);
        const congValid = provinceData[formData.province].congressionals.includes(prev.congDistrict);
        return {
          ...prev,
          locality: localityValid ? prev.locality : '',
          congDistrict: congValid ? prev.congDistrict : ''
        };
      });
    } else {
      setLocalityOptions([]);
      setCongressionalOptions([]);
    }
  }, [formData.province]);


  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      searchLocations(query);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Search locations from API
  const searchLocations = async (query) => {
    if (!query) return;

    setIsSearching(true);

    try {
      const response = await fetch(`http://localhost:5000/api/location/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
        setError('');
      } else {
        setError(data.error || 'Error searching locations');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      setError('Failed to connect to server');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a location from search results
  const selectLocation = (location) => {
    // Set locality and congressional options before setting province so it won't be cleared
    if (provinceData[location.province]) {
      setLocalityOptions(provinceData[location.province].localities);
      setCongressionalOptions(provinceData[location.province].congressionals);
    }

    setFormData(prev => ({
      ...prev,
      locationID: location.location_id || '',
      locationName: location.location_name || '',
      province: location.province || '',
      locality: location.locality || '',
      congDistrict: location.congressional_district || '',
      cluster: location.cluster || '',
      category: location.category || ''
    }));

    setShowSearchResults(false);
    setSearchQuery(location.location_name || '');
    setShowNewLocationForm(true);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setShowConfirmModal(false);


    // Validate required fields
    if (!formData.locationName || !formData.sideCode) {
      alert('Location name and AP Site name are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        alert('WiFi site added successfully!');

        // Clear the form
        setFormData({
          locationID: '',
          locationName: '',
          province: '',
          locality: '',
          congDistrict: '',
          cluster: '',
          category: '',

          // AP Site data
          sideCode: '', // site_name in apsites table
          siteName: '',
          contractStatus: '',
          dateActivation: '',
          dateEndContract: '',
          contract: '',
          siteType: '',
          cmsProvider: '',
          linkProvider: '',
          bandwidth: '',
          latitude: '',
          longitude: '',
          termination: '',
          year: '',
          dateAccepted: '',
          dateDeclaration: ''
        });

        setSearchQuery('');
        setShowNewLocationForm(false);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const toggleNewLocationForm = () => {
    setShowNewLocationForm(!showNewLocationForm);

    // Clear location data if hiding the form
    if (showNewLocationForm) {
      setFormData({
        ...formData,
        locationID: '',
        locationName: '',
        province: '',
        locality: '',
        congDistrict: '',
        cluster: '',
        category: ''
      });
      setSearchQuery('');
    }
  };

  const openConfirmModal = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowConfirmModal(false);
    }
  };


  return (
    <div className="flex h-screen w-full">

      <div className="flex-1 bg-white overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-lg font-medium mb-0">Add Free Wifi Sites</h1>
          <p className="text-xs text-gray-600 mb-6">This adds new Free WiFi Site to the database</p>

          <div className="mb-6">
            <h2 className="font-medium text-sm mb-3">Choose location</h2>
            <div className="flex items-center">
              <div className="relative flex-grow mr-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
                  placeholder="Search"
                  value={(searchQuery)}
                  onChange={handleSearchChange}
                />
              </div>
              {showSearchResults && (
                <div
                  ref={searchResultsRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {isSearching ? (
                    <div className="p-3 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((location) => (
                        <li
                          key={location.location_id}
                          className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100"
                          onClick={() => selectLocation(location)}
                        >
                          <div className="font-medium">{location.location_name}</div>
                          <div className="text-xs text-gray-500">
                            {[location.province, location.locality, location.congressional]
                              .filter(Boolean)
                              .join(' • ')}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : error ? (
                    <div className="p-3 text-center text-red-500 text-sm">
                      {error}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                onClick={toggleNewLocationForm}
              >
                {showNewLocationForm ? "Hide location form" : "Add new location"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showNewLocationForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-8">
                  <h2 className="text-sm font-medium mb-4">
                    {searchQuery ? "Using selected location" : "Adding new location of AP sites"}
                  </h2>

                  <div className="container grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  space-y-9 space-x-4 mb-8">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Location ID</label>
                      <input
                        type="text"
                        name="locationID"
                        value={formData.locationID}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Location Name</label>
                      <input
                        type="text"
                        name="locationName"
                        value={formData.locationName}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div class="break-after-column">
                      <label className="block text-xs text-gray-600 mb-1">Province</label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                        required
                      >
                        <option value="" disabled selected className="text-gray-400">Select a Province</option>
                        <option value="Cavite">Cavite</option>
                        <option value="Laguna">Laguna</option>
                        <option value="Batangas">Batangas</option>
                        <option value="Rizal">Rizal</option>
                        <option value="Quezon">Quezon</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Locality</label>
                      <select
                        name="locality"
                        value={formData.locality}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                        disabled={!formData.province}
                      >
                        <option value="" disabled selected className="text-gray-400">
                          {formData.province ? "Select Locality" : "Locality"}
                        </option>
                        {localityOptions.map((locality, index) => (
                          <option key={index} value={locality}>
                            {locality}
                          </option>
                        ))}
                      </select>
                    </div>


                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Congressional District</label>
                      <select
                        name="congDistrict"
                        value={formData.congDistrict}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                        disabled={!formData.province}
                      >
                        <option value="" disabled selected className="text-gray-400">
                          {formData.province ? "Select Congressional District" : "Congressional District"}
                        </option>
                        {congressionalOptions.map((congressional, index) => (
                          <option key={index} value={congressional}>
                            {congressional}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Cluster</label>
                      <input
                        type="text"
                        name="cluster"
                        value={formData.cluster}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      >
                        <option value="" disabled={formData.category !== ""}>
                          Select category
                        </option>
                        <option value="Plaza and Open Areas">Plaza and Open Areas</option>
                        <option value="Government Hospitals and RHUs">Government Hospitals and RHUs</option>
                        <option value="National and Local Government Offices">National and Local Government Offices</option>
                        <option value="Integrated HS">Integrated HS</option>
                        <option value="High School">High School</option>
                        <option value="Elementary School">Elementary School</option>
                        <option value="Public Libraries">Public Spaces</option>
                        <option value="State Universities and Colleges">SUC</option>
                        <option value="Tourism Sites">Tourism Sites</option>
                        <option value="Transport Terminals">Transport Terminals</option>
                      </select>
                    </div>
                  </div>
                  <hr class="border-t-1 border-gray-400 my-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8">
            <h2 className="text-md font-medium mb-4">AP Site Information 
            </h2>

            <div className="container grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 space-y-9 space-x-4 mb-8">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Site Code</label>
                <input
                  type="text"
                  name="sideCode"
                  value={formData.sideCode}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">AP Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Contract Status</label>
                <select
                  name="contractStatus"
                  value={formData.contractStatus}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                >
                  <option value="" disabled={formData.contractStatus !== ""}>
                    Select status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>


              <div>
                <label className="block text-xs text-gray-600 mb-1">Activation Date</label>
                <input
                  type="date"
                  name="dateActivation"
                  value={formData.dateActivation}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div class="break-after-column">
                <label className="block text-xs text-gray-600 mb-1">End of Contract</label>
                <input
                  type="date"
                  name="dateEndContract"
                  value={formData.dateEndContract}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div >
                <label className="block text-xs text-gray-600 mb-1">Contract</label>
                <input
                  type="text"
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Site Type</label>
                <select
                  name="siteType"
                  value={formData.siteType}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                >
                  <option value="" disabled={formData.category !== ""}>
                    Select category
                  </option>
                  <option value="*PM">Public Market</option>
                  <option value="*PP">Parks and Playground</option>
                  <option value="BGY">Barangay</option>
                  <option value="CQF">Clinical Quality Framework</option>
                  <option value="DRRMO">Disaster Risk Reduction and Management Office</option>
                  <option value="FO">Field Office</option>
                  <option value="HEI-SUC">Higher Education Institutions - State Universities and Colleges</option>

                  <option value="HSP"> Health Service Provider </option>
                  <option value="LGU"> Local Government Unit </option>
                  <option value="LGU - BRGY"> Local Government Unit - Barangay </option>
                  <option value="LGU - HALL"> Local Government Unit - Municipal Hall / City Hall </option>
                  <option value="LGU - HEALTH"> Local Government Unit - Heath Services </option>
                  <option value="LGU - OTHERS"> Local Government Unit - Others </option>
                  <option value="LGU - POL"> Local Government Unit - Police </option>
                  <option value="LGU - TOUR"> Local Government Unit - Tourism </option>
                  <option value="LIB"> Library </option>
                  <option value="MKT"> Market </option>
                  <option value="NGA"> National Government Agency </option>
                  <option value="PES"> Public Elementary School </option>
                  <option value="PHS"> Public High School </option>
                  <option value="PLZ"> Plaza </option>
                  <option value="PP"> PP </option>
                  <option value="RHU"> Rural Health Unit </option>
                  <option value="SEA"> SEA </option>
                  <option value="SUC"> State Universities and Colleges </option>
                  <option value="TRM - LAND"> Tourism - Land </option>
                  <option value="TRM - SEA"> Tourism - Sea </option>

                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">CMS Provider</label>
                <input
                  type="text"
                  name="cmsProvider"
                  value={formData.cmsProvider}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>



              <div>
                <label className="block text-xs text-gray-600 mb-1">Link Provider</label>
                <input
                  type="text"
                  name="linkProvider"
                  value={formData.linkProvider}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div className="break-after-column">
                <label className="block text-xs text-gray-600 mb-1">Bandwidth</label>
                <input
                  type="text"
                  name="bandwidth"
                  value={formData.bandwidth}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Termination</label>
                <input
                  type="text"
                  name="termination"
                  value={formData.termination}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Year Accepted</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Date Accepted</label>
                <input
                  type="text"
                  name="dateAccepted"
                  value={formData.dateAccepted}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Date of Declaration</label>
                <input
                  type="text"
                  name="dateDeclaration"
                  value={formData.dateDeclaration}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                className="bg-blue-500 text-white px-8 py-2 rounded-md text-sm"
                onClick={openConfirmModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-4">Confirm Addition</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to add this WiFi location to the database?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium"
                  onClick={handleSubmit}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddWifiSitePage;