import React from 'react';
import { Outlet } from 'react-router-dom';

// Sidebar component
function Sidebar() {
  return (
    <aside style={{ width: 200, background: '#f4f4f4', height: '100vh', padding: 20 }}>
      <nav>
        <ul>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/timeline">Timeline</a></li>
        </ul>
      </nav>
    </aside>
  );
}

// Header component
function Header() {
  return (
    <header style={{ height: 60, background: '#222', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>Dashboard</h1>
    </header>
  );
}

const DashboardLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 24, background: '#fafafa' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 