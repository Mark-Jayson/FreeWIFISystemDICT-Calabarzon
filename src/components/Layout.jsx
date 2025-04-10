import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-16 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;

