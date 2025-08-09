import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      fetchUserList(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const renderUsers = (users, type) => (
    <>
      {users.map((user) => (
        <div key={user._id} className="flex justify-between items-start text-sm bg-white p-2 mb-2 rounded shadow">
          <div>
            <div><strong>ID:</strong> {user._id}</div>
            <div><strong>Name:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email || 'N/A'}</div>
            <div><strong>Role:</strong> {user.role}</div>
            {user.staffType && <div><strong>Staff Type:</strong> {user.staffType}</div>}
          </div>
          <button
            onClick={() => handleDelete(user._id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
          >
            Remove
          </button>
        </div>
      ))}
    </>
  );

  const toggleView = (type) => {
    setShowDetails(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Students */}
        <div className="bg-blue-100 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Students ({data.students.length})</h3>
            <button
              onClick={() => toggleView('students')}
              className="text-blue-700 underline text-sm"
            >
              {showDetails.students ? 'Hide' : 'View All'}
            </button>
          </div>
          {showDetails.students && renderUsers(data.students, 'students')}
        </div>

        {/* Internal Staff */}
        <div className="bg-green-100 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Internal Staff ({data.internalStaff.length})</h3>
            <button
              onClick={() => toggleView('internalStaff')}
              className="text-green-700 underline text-sm"
            >
              {showDetails.internalStaff ? 'Hide' : 'View All'}
            </button>
          </div>
          {showDetails.internalStaff && renderUsers(data.internalStaff, 'internalStaff')}
        </div>

        {/* External Staff */}
        <div className="bg-yellow-100 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">External Staff ({data.externalStaff.length})</h3>
            <button
              onClick={() => toggleView('externalStaff')}
              className="text-yellow-700 underline text-sm"
            >
              {showDetails.externalStaff ? 'Hide' : 'View All'}
            </button>
          </div>
          {showDetails.externalStaff && renderUsers(data.externalStaff, 'externalStaff')}
        </div>
      </div>
    </div>
  );
};

export default UserList;
