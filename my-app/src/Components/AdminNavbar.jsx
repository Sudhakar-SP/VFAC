import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
} from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';

const AdminNavbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login?role=admin';
  };

  const dropdownItemStyle = 'flex items-center gap-2 px-4 py-2 hover:bg-gray-600 transition-all';

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events", err));
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400">VFAC.COM//ADMIN</h1>

        <ul className="flex items-center gap-6 text-sm relative">
          {/* Events Dropdown */}
          <li className="relative">
            <button onClick={() => toggleDropdown('events')} className="flex items-center gap-1 hover:text-yellow-400 transition">
              Events <MdKeyboardArrowDown size={18} />
            </button>
            {openDropdown === 'events' && (
              <ul className="absolute bg-gray-800 mt-2 rounded shadow-md z-10 w-64 max-h-96 overflow-y-auto">
                <li>
                  <Link to="/admin/events/post" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaCalendarPlus /> Post Event
                  </Link>
                </li>
                <li>
                  <Link to="/admin/events/list" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaList /> Event List
                  </Link>
                </li>

                {/* Applied Students per Event */}
                <li className="px-4 py-2 text-yellow-400 font-semibold">Applied Students:</li>
                {events.length > 0 ? (
                  events.map((event) => (
                    <li key={event._id}>
                      <button
                        onClick={() => {
                          setOpenDropdown(null);
                          navigate(`/admin/events/applied/${event._id}`);
                        }}
                        className="px-4 py-2 text-left text-white hover:bg-gray-700 w-full"
                      >
                        📌 {event.title}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400">No events found</li>
                )}

                <li>
                  <Link to="/admin/events/selected-students" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    ✅ Selected Students
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Music Class Dropdown */}
          <li className="relative">
            <button onClick={() => toggleDropdown('music')} className="flex items-center gap-1 hover:text-yellow-400 transition">
              Music Class <MdKeyboardArrowDown size={18} />
            </button>
            {openDropdown === 'music' && (
              <ul className="absolute bg-gray-800 mt-2 rounded shadow-md z-10 w-56">
                <li>
                  <Link to="/admin/music-class/add" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaUserPlus /> Add Student
                  </Link>
                </li>
                <li>
                  <Link to="/admin/music-class/list" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaUsers /> Student List
                  </Link>
                </li>
                <li>
                  <Link to="/admin/music-class/attendance" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    📅 Mark Attendance
                  </Link>
                </li>
                <li>
                  <Link to="/admin/music-class/view-attendance" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    📊 View Attendance
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Members Dropdown */}
          <li className="relative">
            <button onClick={() => toggleDropdown('members')} className="flex items-center gap-1 hover:text-yellow-400 transition">
              Members <MdKeyboardArrowDown size={18} />
            </button>
            {openDropdown === 'members' && (
              <ul className="absolute bg-gray-800 mt-2 rounded shadow-md z-10 w-56">
                <li>
                  <Link to="/admin/members/approve" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaUserCheck /> Approve Member
                  </Link>
                </li>
                <li>
                  <Link to="/admin/members/list" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaUserEdit /> Member List
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Gallery Dropdown */}
          <li className="relative">
            <button onClick={() => toggleDropdown('gallery')} className="flex items-center gap-1 hover:text-yellow-400 transition">
              Gallery <MdKeyboardArrowDown size={18} />
            </button>
            {openDropdown === 'gallery' && (
              <ul className="absolute bg-gray-800 mt-2 rounded shadow-md z-10 w-56">
                <li>
                  <Link to="/admin/gallery/upload" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaUpload /> Upload (Photo/Video)
                  </Link>
                </li>
                <li>
                  <Link to="/admin/gallery/view" className={dropdownItemStyle} onClick={() => setOpenDropdown(null)}>
                    <FaPhotoVideo /> Gallery (Photo/Video)
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* List Users */}
          <li>
            <Link to="/admin/users" className="hover:text-yellow-400 transition">
              👥 List Users
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-400 transition">
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
