import React, { useState, useRef, useEffect } from 'react';

const AddForm = () => {
  const [formData, setFormData] = useState({
    locId: '',
    province: '',
    congressional: '',
    locality: '',
    locationName: '',
    site: '',
    category: '',
    longitude: '',
    latitude: '',
    apSiteName: '',
    contractStatus: '',
    project: '',
    procurement: '',
    technology: '',
    linkProvider: '',
    bandwidth: '',
    cmsProvider: '',
    activationDate: '',
    endOfContract: ''
  });

  const [showLocationSection, setShowLocationSection] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  
  const locationSectionRef = useRef(null);
  
  const [sectionHeight, setSectionHeight] = useState(0);
  
  useEffect(() => {
    if (showLocationSection) {
      setSectionHeight(locationSectionRef.current.scrollHeight);
    } else {
      setSectionHeight(0);
    }
  }, [showLocationSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = () => {
    console.log('Form submitted:', formData);
    setShowModal(false);
  };

  const cancelSubmit = () => {
    setShowModal(false);
  };


  return (
    <div className="px-50 py-6 overflow-y-auto"> 
      <h1 className="text-xl font-semibold mb-1">Add Free Wifi Sites</h1>
      <p className="text-sm text-gray-600 mb-4">This adds new Free Wifi Site to the database</p>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <h2 className="font-medium mr-2 mb-2 md:mb-0">Choose location</h2>
          <div className="relative flex-grow max-w-xs mb-2 md:mb-0">
            <input 
              type="text" 
              className="pl-8 pr-4 py-2 border rounded-md w-full" 
              placeholder="Search" 
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button 
            className="md:ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            onClick={() => setShowLocationSection(!showLocationSection)}
          >
            Add new location
          </button>
        </div>
        
        <div 
          className="overflow-hidden transition-all duration-500 ease-in-out" 
          style={{ maxHeight: `${sectionHeight}px` }}
        >
          <div ref={locationSectionRef}>
            <h3 className="font-medium mb-4">Adding new location of AP sites</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loc ID</label>
                <input 
                  type="text"
                  name="locId"
                  value={formData.locId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input 
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Congressional</label>
                <input 
                  type="text"
                  name="congressional"
                  value={formData.congressional}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
                <input 
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                <input 
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                <input 
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input 
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input 
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input 
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 className="font-medium mb-4 mt-8">AP Site Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AP Site Name</label>
              <input 
                type="text"
                name="apSiteName"
                value={formData.apSiteName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Status</label>
              <input 
                type="text"
                name="contractStatus"
                value={formData.contractStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <input 
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Procurement</label>
              <input 
                type="text"
                name="procurement"
                value={formData.procurement}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
              <input 
                type="text"
                name="technology"
                value={formData.technology}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Provider</label>
              <input 
                type="text"
                name="linkProvider"
                value={formData.linkProvider}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth</label>
              <input 
                type="text"
                name="bandwidth"
                value={formData.bandwidth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CMS Provider</label>
              <input 
                type="text"
                name="cmsProvider"
                value={formData.cmsProvider}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activation Date</label>
              <input 
                type="text"
                name="activationDate"
                value={formData.activationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End of Contract</label>
              <input 
                type="text"
                name="endOfContract"
                value={formData.endOfContract}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {showModal && (
  <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md animate-fade-in-down border border-gray-300 shadow-xl">
      <div className="text-center">
        <svg className="mx-auto mb-4 h-12 w-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-lg font-medium mb-2">Confirm Addition</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to add this new Free Wifi Site to the database?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={cancelSubmit}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={confirmSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddForm;