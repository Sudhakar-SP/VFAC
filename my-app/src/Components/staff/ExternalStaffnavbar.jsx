import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ExternalStaffNavbar() {
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/external-staff/dashboard"> VFAC.COM - EXTERNAL-STAFF</Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/external-staff/events">📅 Event List</Link>
          </li>

          <li
            className="dropdown"
            onMouseEnter={() => setMusicDropdownOpen(true)}
            onMouseLeave={() => setMusicDropdownOpen(false)}
          >
            <span className="dropdown-toggle">
              🎼 Music Class ▾
            </span>
            {musicDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/external-staff/music-class/attendance">📝 Attendance</Link></li>
                <li><Link to="/external-staff/music-class/view-attendance">👁️ View Attendance</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/logout" className="logout-link">🚪 Logout</Link>
          </li>
        </ul>
      </nav>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(90deg, #8e2de2, #4a00e0);
          padding: 15px 30px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.2);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .navbar-logo a {
          color: #fff;
          font-size: 28px;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .navbar-logo a:hover {
          color: #ffdd57;
        }

        .navbar-links {
          list-style: none;
          display: flex;
          gap: 30px;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .navbar-links li {
          position: relative;
          font-weight: 600;
        }

        .navbar-links a, .dropdown-toggle {
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          cursor: pointer;
          padding: 10px 15px;
          border-radius: 8px;
          transition: background-color 0.3s, color 0.3s;
          user-select: none;
          display: inline-block;
        }

        .navbar-links a:hover,
        .dropdown-toggle:hover {
          background-color: rgba(255, 221, 87, 0.2);
          color: #ffdd57;
        }

        /* Dropdown menu styles */
        .dropdown-menu {
          position: absolute;
          top: 45px;
          left: 0;
          background: #4a00e0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          list-style: none;
          padding: 10px 0;
          min-width: 180px;
          z-index: 1001;
          user-select: none;
        }

        .dropdown-menu li {
          padding: 0;
        }

        .dropdown-menu li a {
          display: block;
          padding: 10px 20px;
          color: #fff;
          font-weight: 500;
          font-size: 15px;
          border-radius: 6px;
          transition: background-color 0.3s, color 0.3s;
        }

        .dropdown-menu li a:hover {
          background-color: #7a4dff;
          color: #fff;
        }

        /* Logout link special styling */
        .logout-link {
          font-weight: 700;
          background: #e63946;
          padding: 10px 18px;
          border-radius: 10px;
          transition: background-color 0.3s;
        }

        .logout-link:hover {
          background: #a52835;
          color: #fff;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }

          .navbar-links {
            flex-direction: column;
            width: 100%;
            gap: 15px;
            margin-top: 15px;
          }

          .navbar-links a, .dropdown-toggle {
            display: block;
            width: 100%;
            padding-left: 0;
          }

          .dropdown-menu {
            position: relative;
            top: 0;
            left: 0;
            box-shadow: none;
            background: transparent;
            padding: 0;
            min-width: auto;
          }

          .dropdown-menu li a {
            padding-left: 20px;
            background: transparent !important;
            color: #ddd !important;
          }

          .dropdown-menu li a:hover {
            background: transparent !important;
            color: #ffdd57 !important;
          }
        }
      `}</style>
    </>
  );
}
