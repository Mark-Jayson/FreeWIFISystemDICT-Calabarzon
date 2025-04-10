import React, { useState } from 'react';

const MapToolbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [technology, setTechnology] = useState('');
  const [elcacActive, setElcacActive] = useState(false);
  const [gidaActive, setGidaActive] = useState(false);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [classification, setClassification] = useState('');
  
  const districtOptions = ['District 1', 'District 2', 'District 3'];
  const technologyOptions = ['WiFi', '5G', 'Fiber'];
  const statusOptions = ['Active', 'Inactive', 'Maintenance'];
  const typeOptions = ['Public', 'Private', 'Government'];
  const classificationOptions = ['Urban', 'Rural', 'Suburban'];

  return (
    <div className="flex items-center p-3 bg-white shadow-md">
      <div className="relative mr-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="mr-3">
        <span className="text-gray-600 font-medium">Filters</span>
      </div>
      

      <div className="relative inline-block mr-2">
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-full py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
        >
          <option value="">District</option>
          {districtOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <div className="relative inline-block mr-2">
        <select
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-full py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
        >
          <option value="">Technology</option>
          {technologyOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <button
        onClick={() => setElcacActive(!elcacActive)}
        className={`mr-2 px-3 py-1 rounded-full text-xs font-medium ${
          elcacActive 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 border border-gray-300'
        }`}
      >
        ELCAC
      </button>
      
      <button
        onClick={() => setGidaActive(!gidaActive)}
        className={`mr-2 px-3 py-1 rounded-full text-xs font-medium ${
          gidaActive 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-700 border border-gray-300'
        }`}
      >
        GIDA
      </button>
      
      <div className="relative inline-block mr-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-full py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
        >
          <option value="">Status</option>
          {statusOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <div className="relative inline-block mr-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-full py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
        >
          <option value="">Type</option>
          {typeOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <div className="relative inline-block mr-2">
        <select
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-full py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
        >
          <option value="">Classification</option>
          {classificationOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <button className="ml-auto p-1 rounded-md hover:bg-gray-100">
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
        </svg>
      </button>
    </div>
  );
};

export default MapToolbar;

