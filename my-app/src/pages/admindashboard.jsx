// pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingMembers, setPendingMembers] = useState(0);
  const [approvedMembers, setApprovedMembers] = useState(0);

  useEffect(() => {
    // Fetch admin stats from backend
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          withCredentials: true,
        });

        const { totalUsers, pendingMembers, approvedMembers } = res.data;
        setTotalUsers(totalUsers);
        setPendingMembers(pendingMembers);
        setApprovedMembers(approvedMembers);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Pending Members</h2>
          <p className="text-3xl mt-2">{pendingMembers}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Approved Members</h2>
          <p className="text-3xl mt-2">{approvedMembers}</p>
        </div>
      </div>

      <div className="space-x-4">
        <Link
          to="/admin/requests"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Manage Member Requests
        </Link>
        <Link
          to="/admin/users"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View All Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
