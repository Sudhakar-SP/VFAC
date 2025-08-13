import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {ReactTyped } from 'react-typed';
import {
  FaSignOutAlt,
  FaChevronDown,
  FaListAlt,
  FaCheckCircle,
  FaUserCircle,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaImages
} from 'react-icons/fa';

const Navbar = () => {
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-blue-700/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaImages className="text-yellow-400 text-3xl drop-shadow-lg" />
          <span className="sm:hidden font-extrabold text-lg text-yellow-400 tracking-wider">VFAC</span>
          <div className="hidden sm:block text-xl md:text-2xl font-extrabold text-yellow-400 tracking-wider">
            <ReactTyped
              strings={['WELCOME TO VFAC.COM', 'STUDENT PAGE', 'VFAC.COM']}
              typeSpeed={80}
              backSpeed={40}
              backDelay={1500}
              loop
              className="drop-shadow-lg"
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 relative">
          {/* Event Dropdown */}
          <div className="relative">
            <button
              onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              className="flex items-center gap-2 hover:text-yellow-300 transition-all duration-300 hover:scale-105"
            >
              <FaCalendarAlt />
              Event
              <FaChevronDown
                className={`transition-transform ${eventDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {eventDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-lg text-gray-800 rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                <NavLink
                  to="/student/events"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-blue-100 transition"
                  onClick={() => setEventDropdownOpen(false)}
                >
                  <FaListAlt className="text-blue-600" />
                  Event List & Apply
                </NavLink>
                <NavLink
                  to="/student/events/status"
                  className="flex items-center gap-2 px-4 py-3 hover:bg-blue-100 transition"
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
              `flex items-center gap-2 font-medium transition-all duration-300 hover:scale-105 ${
                isActive ? 'text-yellow-300' : 'hover:text-yellow-200'
              }`
            }
          >
            <FaUserCircle />
            Profile
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-500/50"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl hover:scale-110 transition-transform"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-md px-6 pb-4 animate-slideDown border-t border-blue-700/40 shadow-xl">
          {/* Event Dropdown */}
          <div className="border-b border-blue-700 py-3">
            <button
              onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              className="flex items-center justify-between w-full hover:text-yellow-300 font-medium transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FaCalendarAlt /> Event
              </span>
              <FaChevronDown
                className={`transition-transform ${eventDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {eventDropdownOpen && (
              <div className="mt-2 pl-4 space-y-2">
                <NavLink
                  to="/student/events"
                  className="flex items-center gap-2 hover:text-yellow-200 transition"
                  onClick={() => {
                    setEventDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <FaListAlt className="text-blue-300" /> Event List & Apply
                </NavLink>
                <NavLink
                  to="/student/events/status"
                  className="flex items-center gap-2 hover:text-yellow-200 transition"
                  onClick={() => {
                    setEventDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <FaCheckCircle className="text-green-300" /> Show Status
                </NavLink>
              </div>
            )}
          </div>

          {/* Profile Link */}
          <div className="border-b border-blue-700 py-3">
            <NavLink
              to="/student/profile"
              className="flex items-center gap-2 hover:text-yellow-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              <FaUserCircle /> Profile
            </NavLink>
          </div>

          {/* Logout */}
          <div className="py-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 w-full px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-500/50"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
