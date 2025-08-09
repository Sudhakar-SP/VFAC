import { Link } from 'react-router-dom';

export default function ExternalStaffNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/external-staff/dashboard">VFAC.COM - External Staff</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/external-staff/dashboard">Dashboard</Link></li>
        <li><Link to="/external-staff/schedule">Schedules</Link></li>
        <li><Link to="/external-staff/messages">Messages</Link></li>
        <li><Link to="/external-staff/support">Support</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
}
