import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar'; 

const AddWifiSitePage = () => {
  const [activeTab, setActiveTab] = useState('add'); 
  const [showNewLocationForm, setShowNewLocationForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    lotId: '',
    province: '',
    congressional: '',
    locality: '',
    locationName: '',
    site: '',
    category: '',
    longitude: '',
    latitude: '',
    siteId: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);
    
    console.log('Form submitted:', formData);
  };

  const toggleNewLocationForm = () => {
    setShowNewLocationForm(!showNewLocationForm);
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
                />
              </div>
              <button 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                onClick={toggleNewLocationForm}
              >
                Add new location
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
                  <h2 className="text-sm font-medium mb-4">Adding new location of AP sites</h2>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Lot ID</label>
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
                      <input
                        type="text"
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Congressional</label>
                      <input
                        type="text"
                        name="congressional"
                        value={formData.congressional}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Locality</label>
                      <input
                        type="text"
                        name="locality"
                        value={formData.locality}
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
                <label className="block text-xs text-gray-600 mb-1">AP Site Name</label>
                <input
                  type="text"
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Contract Status</label>
                <input
                  type="text"
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
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
                  type="text"
                  name="activationDate"
                  value={formData.activationDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End of Contract</label>
                <input
                  type="text"
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