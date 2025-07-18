
import {
    ListChecks,
    CalendarRange,
    Bell,
    Users,
    Settings,
    LayoutDashboard,
    Shield,
  } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const sidebarLinks = [
    // { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/tasks', label: 'Tasks', icon: <ListChecks size={20} /> },
    { to: '/presence', label: 'Presence', icon: <Users size={20} /> },
    { to: '/timeline', label: 'Dependency & Timeline', icon: <CalendarRange size={20} /> },
    { to: '/role', label: 'Role', icon: <Shield size={20} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { to: '/users', label: 'Users', icon: <Users size={20} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  const Sidebar = () => (
    <aside className="bg-white border-r border-gray-200 w-72 flex flex-col py-6 px-2 sticky top-0 h-screen z-20">
      <div className="flex items-center gap-2 mb-8 px-4">
        <LayoutDashboard size={28} className="text-primary" />
        <span className="text-xl font-bold text-primary">Dashboard</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  border-l-4 ${isActive ? '' : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-primary'}`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: '#52b70056',
                        color: '#51B700',
                        // borderLeft: '4px solid #51B700',
                        // boxShadow: '0 1px 4px 0 #52b70022',
                      }
                    : undefined
                }
                end
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
  
  export default Sidebar; 