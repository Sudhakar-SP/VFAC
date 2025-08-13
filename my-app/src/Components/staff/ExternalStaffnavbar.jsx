import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import {ReactTyped} from 'react-typed';

export default function ExternalStaffNavbar() {
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo with typing effect */}
        <div className="navbar-logo">
          <Link to="/external-staff/dashboard">
            <ReactTyped
              strings={[
                'WELCOME TO VFAC.COM',
                'STAFF PAGE',
                'VFAC.COM',
              ]}
              typeSpeed={60}
              backSpeed={40}
              loop
            />
          </Link>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <div
          className="mobile-menu-icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/external-staff/events"
              onClick={() => setMobileMenuOpen(false)}
            >
              📅 Event List
            </Link>
          </li>

          {/* Music Class Dropdown */}
          <li
            className="dropdown"
            onMouseEnter={() =>
              window.innerWidth > 768 && setMusicDropdownOpen(true)
            }
            onMouseLeave={() =>
              window.innerWidth > 768 && setMusicDropdownOpen(false)
            }
            onClick={() =>
              window.innerWidth <= 768 &&
              setMusicDropdownOpen(!musicDropdownOpen)
            }
          >
            <span className="dropdown-toggle">
              🎼 Music Class <FaChevronDown className="dropdown-arrow" />
            </span>
            {musicDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/external-staff/music-class/attendance"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📝 Attendance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/external-staff/music-class/view-attendance"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👁️ View Attendance
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Logout */}
          <li>
            <Link to="#" className="logout-link" onClick={handleLogout}>
              🚪 Logout
            </Link>
          </li>
        </ul>
      </nav>

      <style>{`
        /* ===== NAVBAR BASE ===== */
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

        /* ===== LOGO ===== */
        .navbar-logo a {
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
          white-space: nowrap;
        }
        .navbar-logo a:hover {
          color: #ffdd57;
        }

        /* ===== LINKS ===== */
        .navbar-links {
          list-style: none;
          display: flex;
          gap: 25px;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        .navbar-links li {
          position: relative;
        }
        .navbar-links a, .dropdown-toggle {
          color: #fff;
          font-size: 16px;
          text-decoration: none;
          cursor: pointer;
          padding: 10px 15px;
          border-radius: 8px;
          transition: background-color 0.3s, color 0.3s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .navbar-links a:hover, .dropdown-toggle:hover {
          background-color: rgba(255, 221, 87, 0.2);
          color: #ffdd57;
        }

        /* ===== DROPDOWN MENU ===== */
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
        }
        .dropdown-menu li a {
          padding: 10px 20px;
          color: #fff;
          font-weight: 500;
          display: block;
          border-radius: 6px;
        }
        .dropdown-menu li a:hover {
          background-color: #7a4dff;
        }
        .dropdown-arrow {
          transition: transform 0.3s;
        }

        /* ===== LOGOUT ===== */
        .logout-link {
          font-weight: 700;
          background: #e63946;
          padding: 8px 16px;
          border-radius: 10px;
          transition: background-color 0.3s;
        }
        .logout-link:hover {
          background: #a52835;
          color: #fff;
        }

        /* ===== MOBILE ===== */
        .mobile-menu-icon {
          display: none;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-menu-icon {
            display: block;
          }
          .navbar-links {
            position: absolute;
            top: 70px;
            left: -100%;
            flex-direction: column;
            background: #4a00e0;
            width: 100%;
            padding: 20px 0;
            transition: left 0.3s ease;
            gap: 15px;
          }
          .navbar-links.active {
            left: 0;
          }
          .dropdown-menu {
            position: static;
            box-shadow: none;
            background: transparent;
            padding: 0;
          }
          .dropdown-menu li a {
            padding-left: 20px;
            background: transparent;
            color: #fff;
          }
        }
      `}</style>
    </>
  );
}
