import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/admin/dashboard" className="hover:text-yellow-300">Dashboard</NavLink>
        <NavLink to="/admin/events" className="hover:text-yellow-300">Events</NavLink>
        <NavLink to="/admin/music-class" className="hover:text-yellow-300">Music Class</NavLink>
        <NavLink to="/admin/users" className="hover:text-yellow-300">List Users</NavLink>
        <NavLink to="/admin/members" className="hover:text-yellow-300">Members</NavLink>
      </nav>
    </aside>
  );
}
