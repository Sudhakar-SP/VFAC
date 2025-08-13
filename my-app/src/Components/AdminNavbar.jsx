import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarPlus,
  FaList,
  FaUserPlus,
  FaUsers,
  FaSignOutAlt,
  FaUserCheck,
  FaUserEdit,
  FaUpload,
  FaPhotoVideo,
  FaMusic,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdEvent, MdGroup } from "react-icons/md";
import {ReactTyped} from "react-typed";

const AdminNavbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [events, setEvents] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle desktop dropdown menus
  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Close all dropdowns and mobile menu
  const closeAllMenus = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login?role=admin";
  };

  const dropdownItemStyle =
    "flex items-center gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 transition-all duration-200 rounded";

  // Fetch events for the applied students dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events", err));
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo with typing effect */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-yellow-400 font-extrabold text-xl sm:text-2xl flex items-center gap-2 select-none">
              <ReactTyped
                strings={["WELCOME TO ADMIN", "VFAC.COM", "ADMIN PAGE"]}
                typeSpeed={50}
                backSpeed={30}
                loop
              />
            </h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 font-semibold text-sm">

            {/* Events Dropdown */}
            <li className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "events"}
                onClick={() => toggleDropdown("events")}
                className="flex items-center gap-1 hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                <MdEvent size={20} />
                Events
                <MdKeyboardArrowDown size={20} />
              </button>

              {openDropdown === "events" && (
                <ul
                  className="absolute left-0 mt-2 w-72 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
                  role="menu"
                  aria-label="Events menu"
                >
                  <li role="none">
                    <Link
                      to="/admin/events/post"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaCalendarPlus /> Post Event
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/admin/events/list"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaList /> Event List
                    </Link>
                  </li>

                  <li className="px-4 py-2 text-yellow-400 font-semibold border-t border-gray-700" role="none">
                    Applied Students:
                  </li>

                  {events.length > 0 ? (
                    events.map((event) => (
                      <li key={event._id} role="none">
                        <button
                          onClick={() => {
                            closeAllMenus();
                            navigate(`/admin/events/applied/${event._id}`);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition"
                          role="menuitem"
                        >
                          📌 {event.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400" role="none">
                      No events found
                    </li>
                  )}
                </ul>
              )}
            </li>

            {/* Music Class Dropdown */}
            <li className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "music"}
                onClick={() => toggleDropdown("music")}
                className="flex items-center gap-1 hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                <FaMusic size={18} />
                Music Class
                <MdKeyboardArrowDown size={20} />
              </button>

              {openDropdown === "music" && (
                <ul
                  className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
                  role="menu"
                  aria-label="Music Class menu"
                >
                  <li role="none">
                    <Link
                      to="/admin/music-class/add"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaUserPlus /> Add Student
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/admin/music-class/list"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaUsers /> Student List
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/admin/music-class/attendance"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      📅 Mark Attendance
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/admin/music-class/view-attendance"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      📊 View Attendance
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Members Dropdown */}
            <li className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "members"}
                onClick={() => toggleDropdown("members")}
                className="flex items-center gap-1 hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                <MdGroup size={20} />
                Members
                <MdKeyboardArrowDown size={20} />
              </button>

              {openDropdown === "members" && (
                <ul
                  className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
                  role="menu"
                  aria-label="Members menu"
                >
                  <li role="none">
                    <Link
                      to="/admin/members/approve"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaUserCheck /> Approve Member
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/admin/members/list"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaUserEdit /> Member List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Gallery Dropdown */}
            <li className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "gallery"}
                onClick={() => toggleDropdown("gallery")}
                className="flex items-center gap-1 hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
              >
                🖼
                Gallery
                <MdKeyboardArrowDown size={20} />
              </button>

              {openDropdown === "gallery" && (
                <ul
                  className="absolute left-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
                  role="menu"
                  aria-label="Gallery menu"
                >
                  <li role="none">
                    <Link
                      to="/admin/gallery/upload"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaUpload /> Upload (Photo/Video)
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      to="/admin/gallery/view"
                      className={dropdownItemStyle}
                      onClick={closeAllMenus}
                      role="menuitem"
                    >
                      <FaPhotoVideo /> View Gallery
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* List Users */}
            <li>
              <Link
                to="/admin/users"
                className="flex items-center gap-1 hover:text-yellow-400 transition font-semibold"
                onClick={closeAllMenus}
              >
                👥 List Users
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-red-500 transition font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Logout"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </li>
          </ul>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setOpenDropdown(null);
              }}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700 shadow-inner">
          <ul className="flex flex-col px-4 py-3 space-y-2 font-semibold text-sm">
            {/* Events Accordion */}
            <li>
              <button
                onClick={() =>
                  setOpenDropdown((prev) => (prev === "events" ? null : "events"))
                }
                className="flex justify-between items-center w-full text-left hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-2"
                aria-expanded={openDropdown === "events"}
                aria-controls="mobile-events"
              >
                <span className="flex items-center gap-2">
                  <MdEvent size={20} /> Events
                </span>
                <MdKeyboardArrowDown
                  size={24}
                  className={`transform transition-transform ${
                    openDropdown === "events" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openDropdown === "events" && (
                <ul
                  id="mobile-events"
                  className="mt-2 pl-6 border-l border-yellow-400 space-y-1"
                >
                  <li>
                    <Link
                      to="/admin/events/post"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaCalendarPlus /> Post Event
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/events/list"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaList /> Event List
                    </Link>
                  </li>
                  <li className="pt-2 font-semibold text-yellow-400">Applied Students:</li>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <li key={event._id}>
                        <button
                          onClick={() => {
                            closeAllMenus();
                            navigate(`/admin/events/applied/${event._id}`);
                          }}
                          className="w-full text-left px-2 py-1 hover:text-yellow-400 rounded"
                        >
                          📌 {event.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 px-2 py-1">No events found</li>
                  )}
                  <li>
                    <Link
                      to="/admin/events/selected-students"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      ✅ Selected Students
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Music Class Accordion */}
            <li>
              <button
                onClick={() =>
                  setOpenDropdown((prev) => (prev === "music" ? null : "music"))
                }
                className="flex justify-between items-center w-full text-left hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-2"
                aria-expanded={openDropdown === "music"}
                aria-controls="mobile-music"
              >
                <span className="flex items-center gap-2">
                  <FaMusic size={18} /> Music Class
                </span>
                <MdKeyboardArrowDown
                  size={24}
                  className={`transform transition-transform ${
                    openDropdown === "music" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openDropdown === "music" && (
                <ul
                  id="mobile-music"
                  className="mt-2 pl-6 border-l border-yellow-400 space-y-1"
                >
                  <li>
                    <Link
                      to="/admin/music-class/add"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaUserPlus /> Add Student
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/music-class/list"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaUsers /> Student List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/music-class/attendance"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      📅 Mark Attendance
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/music-class/view-attendance"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      📊 View Attendance
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Members Accordion */}
            <li>
              <button
                onClick={() =>
                  setOpenDropdown((prev) => (prev === "members" ? null : "members"))
                }
                className="flex justify-between items-center w-full text-left hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-2"
                aria-expanded={openDropdown === "members"}
                aria-controls="mobile-members"
              >
                <span className="flex items-center gap-2">
                  <MdGroup size={20} /> Members
                </span>
                <MdKeyboardArrowDown
                  size={24}
                  className={`transform transition-transform ${
                    openDropdown === "members" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openDropdown === "members" && (
                <ul
                  id="mobile-members"
                  className="mt-2 pl-6 border-l border-yellow-400 space-y-1"
                >
                  <li>
                    <Link
                      to="/admin/members/approve"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaUserCheck /> Approve Member
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/members/list"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaUserEdit /> Member List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Gallery Accordion */}
            <li>
              <button
                onClick={() =>
                  setOpenDropdown((prev) => (prev === "gallery" ? null : "gallery"))
                }
                className="flex justify-between items-center w-full text-left hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-2 py-2"
                aria-expanded={openDropdown === "gallery"}
                aria-controls="mobile-gallery"
              >
                <span>🖼 Gallery</span>
                <MdKeyboardArrowDown
                  size={24}
                  className={`transform transition-transform ${
                    openDropdown === "gallery" ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openDropdown === "gallery" && (
                <ul
                  id="mobile-gallery"
                  className="mt-2 pl-6 border-l border-yellow-400 space-y-1"
                >
                  <li>
                    <Link
                      to="/admin/gallery/upload"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaUpload /> Upload (Photo/Video)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/gallery/view"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 px-2 py-1 hover:text-yellow-400 rounded"
                    >
                      <FaPhotoVideo /> View Gallery
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* List Users */}
            <li>
              <Link
                to="/admin/users"
                onClick={closeAllMenus}
                className="flex items-center gap-2 px-2 py-2 hover:text-yellow-400 rounded"
              >
                👥 List Users
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  closeAllMenus();
                }}
                className="flex items-center gap-2 px-2 py-2 hover:text-red-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Logout"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
