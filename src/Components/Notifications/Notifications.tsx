import React from 'react';
import Sidebar from '../Common/Sideber/Sidebar';
import Navbar from '../Common/Header/Navbar';

const Notifications: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        <Navbar title='Notifications ' />
        <div className="flex-1 p-6">
          <h2>Notifications page</h2>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 