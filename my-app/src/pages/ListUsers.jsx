import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, GraduationCap, Briefcase, Eye, EyeOff, Trash2 } from 'lucide-react';

const UserList = () => {
  const [data, setData] = useState({ students: [], internalStaff: [], externalStaff: [] });
  const [showDetails, setShowDetails] = useState({
    students: false,
    internalStaff: false,
    externalStaff: false
  });

  const fetchUserList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/list', {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch user list', err);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        withCredentials: true,
      });
      fetchUserList();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const renderUsers = (users) => (
    <div className="mt-3 space-y-3 transition-all duration-300 ease-in-out">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-start bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="space-y-1 text-gray-700">
            <div className="font-semibold text-blue-900">🆔 {user._id}</div>
            <div><strong>Name:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email || 'N/A'}</div>
            <div><strong>Role:</strong> {user.role}</div>
            {user.staffType && <div><strong>Staff Type:</strong> {user.staffType}</div>}
          </div>
          <button
            onClick={() => handleDelete(user._id)}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
            title="Remove User"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  const toggleView = (type) => {
    setShowDetails(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const Card = ({ title, count, type, icon, bgColor, textColor }) => (
    <div className={`${bgColor} p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-lg">{title} <span className="text-sm text-gray-600">({count})</span></h3>
        </div>
        <button
          onClick={() => toggleView(type)}
          className={`${textColor} underline text-sm flex items-center gap-1 hover:opacity-80 transition`}
        >
          {showDetails[type] ? <EyeOff size={16} /> : <Eye size={16} />}
          {showDetails[type] ? 'Hide' : 'View All'}
        </button>
      </div>
      {showDetails[type] && renderUsers(data[type])}
    </div>
  );

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-800">
        <Users className="text-blue-700" /> User Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Students"
          count={data.students.length}
          type="students"
          icon={<GraduationCap className="text-blue-700 w-6 h-6" />}
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <Card
          title="Internal Staff"
          count={data.internalStaff.length}
          type="internalStaff"
          icon={<Briefcase className="text-green-700 w-6 h-6" />}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <Card
          title="External Staff"
          count={data.externalStaff.length}
          type="externalStaff"
          icon={<Briefcase className="text-yellow-700 w-6 h-6" />}
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
        />
      </div>
    </div>
  );
};

export default UserList;
