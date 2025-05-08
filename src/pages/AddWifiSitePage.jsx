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

  const provinceData = {
    'Cavite': {
      localities: ['Bacoor', 'Cavite City', 'Dasmariñas', 'General Trias', 'Imus', 'Tagaytay', 'Trece Martires'],
      congressionals: ['1st District', '2nd District', '3rd District', '4th District', '5th District', '6th District', '7th District', '8th District']
    },
    'Laguna': {
      localities: ['Biñan', 'Cabuyao', 'Calamba', 'Los Baños', 'San Pablo', 'San Pedro', 'Santa Rosa'],
      congressionals: ['1st District', '2nd District', '3rd District', '4th District', '5th District']
    },
    'Batangas': {
      localities: ['Batangas City', 'Lipa', 'Santo Tomas', 'Tanauan', 'Bauan', 'Nasugbu', 'San Juan'],
      congressionals: ['1st District', '2nd District', '3rd District', '4th District', '5th District', '6th District']
    },
    'Rizal': {
      localities: ['Antipolo', 'Cainta', 'Taytay', 'Rodriguez', 'San Mateo', 'Tanay', 'Teresa'],
      congressionals: ['1st District', '2nd District', '3rd District', '4th District']
    },
    'Quezon': {
      localities: ['Lucena', 'Tayabas', 'Candelaria', 'Sariaya', 'Lucban', 'Infanta', 'Pagbilao'],
      congressionals: ['1st District', '2nd District', '3rd District', '4th District']
    }
  };

  const [formData, setFormData] = useState({
    // Location data
    province: '',
    congressional: '',
    locality: '',
    locationName: '',
    site: '', // site_name in location table
    category: '',
    longitude: '',
    latitude: '',

    // AP Site data
    siteId: '', // site_name in apsites table
    siteName: '',
    contract: '',
    project: '',
    procurement: '',
    technology: '',
    linkProvider: '',
    bandwidth: '',
    ispProvider: '',
    activationDate: '',
    endOfContract: ''
  });

  const [localityOptions, setLocalityOptions] = useState([]);
  const [congressionalOptions, setCongressionalOptions] = useState([]);

  // Update locality and congressional options when province changes
  useEffect(() => {
    if (formData.province && provinceData[formData.province]) {
      setLocalityOptions(provinceData[formData.province].localities);
      setCongressionalOptions(provinceData[formData.province].congressionals);

      // Reset locality and congressional when province changes
      setFormData(prev => ({
        ...prev,
        locality: '',
        congressional: ''
      }));
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
      const response = await fetch(`http://localhost:5000/api/locations/search?query=${encodeURIComponent(query)}`);
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
    setFormData({
      ...formData,
      province: location.province || '',
      congressional: location.congressional || '',
      locality: location.locality || '',
      locationName: location.location_name || '',
      site: location.site_name || '',
      category: location.category || '',
      longitude: location.longitude ? location.longitude.toString() : '',
      latitude: location.latitude ? location.latitude.toString() : '',
      // Keep AP Site data unchanged
    });

    setShowSearchResults(false);
    setSearchQuery(location.location_name || '');
    setShowNewLocationForm(true); // Show the form with populated data
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
    if (!formData.locationName || !formData.siteId) {
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
          province: '',
          congressional: '',
          locality: '',
          locationName: '',
          site: '',
          category: '',
          longitude: '',
          latitude: '',
          siteId: '',
          siteName: '',
          contract: '',
          project: '',
          procurement: '',
          technology: '',
          linkProvider: '',
          bandwidth: '',
          ispProvider: '',
          activationDate: '',
          endOfContract: ''
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
        province: '',
        congressional: '',
        locality: '',
        locationName: '',
        site: '',
        category: '',
        longitude: '',
        latitude: '',
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

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Location ID</label>
                      <input
                        type="text"
                        name="lotId"
                        value={formData.lotId}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div>
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
                      <label className="block text-xs text-gray-600 mb-1">Congressional</label>
                      <select
                        name="congressional"
                        value={formData.congressional}
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
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                      <label className="block text-xs text-gray-600 mb-1">Location Name</label>
                      <input
                        type="text"
                        name="locationName"
                        value={formData.locationName}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Site Type</label>
                      <input
                        type="text"
                        name="site"
                        value={formData.site}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                      <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-8">
            <h2 className="text-sm font-medium mb-4">AP Site Information</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Site Code</label>
                <input
                  type="text"
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">AP Site Name</label>
                <input
                  type="text"
                  name="siteId"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Contract Status</label>
                <select
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                >
                  <option value="" disabled={formData.contract !== ""}>
                    Select status
                  </option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Project</label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Procurement</label>
                <input
                  type="text"
                  name="procurement"
                  value={formData.procurement}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Technology</label>
                <input
                  type="text"
                  name="technology"
                  value={formData.technology}
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
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
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
                <label className="block text-xs text-gray-600 mb-1">ISP Provider</label>
                <input
                  type="text"
                  name="ispProvider"
                  value={formData.ispProvider}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Activation Date</label>
                <input
                  type="date"
                  name="activationDate"
                  value={formData.activationDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End of Contract</label>
                <input
                  type="date"
                  name="endOfContract"
                  value={formData.endOfContract}
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