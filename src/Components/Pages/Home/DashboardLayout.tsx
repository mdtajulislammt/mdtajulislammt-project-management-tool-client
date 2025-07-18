import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import Navbar from '../../Common/Header/Navbar';
import Sidebar from '../../Common/Sideber/Sidebar';




const DashboardLayout: React.FC = () => {
  // Responsive sidebar toggle for mobile (optional, not implemented here)
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar title='' />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 