import { Link, useNavigate } from 'react-router-dom';

export default function InternalStaffNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens or any auth info from localStorage/sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // if you saved role or other info

    // Optionally, call your backend logout API here if needed
    // await axios.post('/api/logout');

    // Redirect to login page
    navigate('/login');
  };

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
          {/* Replace the Logout link with a button or clickable element */}
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: '6px',
                transition: 'background 0.3s, color 0.3s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#ffffff22';
                e.currentTarget.style.color = '#ffd700';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = 'white';
              }}
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Keep your styles here */}
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

          .navbar-links a, .navbar-links button {
            display: block;
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}
