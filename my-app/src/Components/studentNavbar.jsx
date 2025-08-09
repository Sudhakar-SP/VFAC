import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaChevronDown,
  FaListAlt,
  FaCheckCircle,
  FaUsers,
  FaUserCircle,
  FaCalendarAlt,
} from 'react-icons/fa';

const Navbar = () => {
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      {/* Left side: Logo / Title */}
      <div className="text-2xl font-bold tracking-wide">
        <span className="text-yellow-400">VFAC.COM</span> <span>// STUDENT</span>
      </div>

      {/* Right side navigation */}
      <div className="flex items-center gap-8 relative">
        {/* Event Dropdown */}
        <div className="relative">
          <button
            onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
            className="flex items-center gap-2 hover:text-yellow-300 font-medium"
          >
            <FaCalendarAlt />
            Event
            <FaChevronDown />
          </button>
          {eventDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white text-gray-800 rounded-md shadow-xl z-50 overflow-hidden">
              <NavLink
                to="/student/events"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                onClick={() => setEventDropdownOpen(false)}
              >
                <FaListAlt className="text-blue-600" />
                Event List & Apply
              </NavLink>
              <NavLink
                to="/student/events/status"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                onClick={() => setEventDropdownOpen(false)}
              >
                <FaCheckCircle className="text-green-600" />
                Show Status
              </NavLink>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium ${
              isActive ? 'text-yellow-300' : 'hover:text-yellow-200'
            }`
          }
        >
          <FaUserCircle />
          Profile
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
