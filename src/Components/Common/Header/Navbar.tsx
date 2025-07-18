import { Bell, ChevronDown, UserCircle } from "lucide-react";
import { useState } from "react";



const Navbar = ({ title }: { title: string }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Project Switcher (optional) */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg text-primary">{title}</span>
      </div>
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <button className="relative">
          <Bell size={22} className="text-gray-500 hover:text-primary" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <UserCircle size={32} className="text-gray-500" />
            <ChevronDown size={18} className="text-gray-400" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-30">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Settings
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
