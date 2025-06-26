import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ 
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div 
        className="flex-1 overflow-y-auto"
        style={{ 
          backgroundColor: 'rgba(239, 246, 255, 1)', /* Blue-50 equivalent */
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
        }}
      >
        <Outlet /> {/* This will render the matched child route */}
      </div>
    </div>
  );
};

export default Layout;