// pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingMembers, setPendingMembers] = useState(0);
  const [approvedMembers, setApprovedMembers] = useState(0);

  useEffect(() => {
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
        console.warn('Error fetching admin stats, using sample data:', err);
        // Fallback sample data
        setTotalUsers(125);
        setPendingMembers(8);
        setApprovedMembers(117);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          padding: 40px;
          background: linear-gradient(135deg, #1f2937, #111827);
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
        }
        .admin-dashboard h1 {
          font-size: 40px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: linear-gradient(to right, #facc15, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 40px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          width: 100%;
          max-width: 1000px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 30px 20px;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s ease, background 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .stat-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.1);
        }
        .stat-title {
          font-size: 18px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .stat-value {
          font-size: 48px;
          margin-top: 10px;
          font-weight: bold;
          color: #facc15;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .btn-blue {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
        }
        .btn-blue:hover {
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          transform: scale(1.05);
        }
        .btn-green {
          background: linear-gradient(90deg, #22c55e, #16a34a);
          color: white;
        }
        .btn-green:hover {
          background: linear-gradient(90deg, #16a34a, #15803d);
          transform: scale(1.05);
        }
      `}</style>

      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Pending Members</div>
          <div className="stat-value">{pendingMembers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Approved Members</div>
          <div className="stat-value">{approvedMembers}</div>
        </div>
      </div>

      <div className="actions">
        <Link to="/admin/users" className="btn btn-green">
          View All Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
