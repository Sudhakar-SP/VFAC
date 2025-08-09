import { Link } from 'react-router-dom';

export default function InternalStaffNavbar() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/internal-staff/dashboard">👨‍🏫 VFAC.COM - STAFF</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/internal-staff/events">📅 Event List</Link></li>
          <li><Link to="/internal-staff/music-students">🎼 Music Student List</Link></li>
          <li><Link to="/internal-staff/members">👥 Member List</Link></li>
          <li><Link to="/logout">🚪 Logout</Link></li>
        </ul>
      </nav>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(90deg, #4b6cb7, #182848);
          padding: 15px 30px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-logo a {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
          transition: color 0.3s;
        }

        .navbar-logo a:hover {
          color: #ffd700;
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

        .navbar-links a {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 6px;
          transition: background 0.3s, color 0.3s;
        }

        .navbar-links a:hover {
          background: #ffffff22;
          color: #ffd700;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }

          .navbar-links {
            flex-direction: column;
            width: 100%;
            gap: 10px;
            margin-top: 15px;
          }

          .navbar-links a {
            display: block;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
