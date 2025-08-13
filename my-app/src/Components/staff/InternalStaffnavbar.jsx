import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {ReactTyped} from "react-typed";

export default function InternalStaffNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Navigation links array
  const navLinks = [
    { path: "/internal-staff/events", label: "📅 Event List" },
    { path: "/internal-staff/music-students", label: "🎼 Music Student List" },
    { path: "/internal-staff/members", label: "👥 Member List" },
  ];

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/internal-staff/dashboard">
            <ReactTyped
              strings={["👨‍🏫 WELCOME TO VFAC.COM","👨‍🏫 STAFF PAGE"]}
              typeSpeed={60}
              backSpeed={40}
              loop
            />
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>

        {/* Nav Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.path} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Styles */}
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(90deg, #4b6cb7, #182848);
          padding: 15px 30px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-logo a {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
          white-space: nowrap;
        }

        .menu-toggle {
          display: none;
          font-size: 28px;
          color: white;
          cursor: pointer;
        }

        .navbar-links {
          list-style: none;
          display: flex;
          gap: 25px;
          margin: 0;
          padding: 0;
        }

        .navbar-links li {
          display: inline;
        }

        .navbar-links a, .logout-btn {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 6px;
          transition: background 0.3s, color 0.3s;
          background: none;
          border: none;
          cursor: pointer;
        }

        .navbar-links a:hover, .logout-btn:hover {
          background: #ffffff22;
          color: #ffd700;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .navbar-links {
            position: absolute;
            top: 60px;
            right: 0;
            flex-direction: column;
            background: linear-gradient(90deg, #4b6cb7, #182848);
            width: 220px;
            height: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            padding: 15px;
            border-radius: 0 0 0 12px;
          }

          .navbar-links.active {
            transform: translateX(0);
          }

          .navbar-links li {
            display: block;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </>
  );
}
