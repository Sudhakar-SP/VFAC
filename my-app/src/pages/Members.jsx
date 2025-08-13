import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Members() {
  const [students, setStudents] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Read token from localStorage
  const token = localStorage.getItem('token');
  console.log('Token:', token);

  // Axios config with token for every request
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true, // needed if backend also sets cookies
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users/list', axiosConfig);
      setStudents(res.data.students || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setStudents([]);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/users/members', axiosConfig);
      setMembers(res.data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    }
  };

  const approveMember = async (id) => {
    try {
      await axios.put(`/api/users/approve/${id}`, {}, axiosConfig);
      fetchUsers();
      fetchMembers();
    } catch (error) {
      console.error('Error approving member:', error);
    }
  };

  const removeMember = async (id) => {
    try {
      await axios.put(`/api/users/approve/${id}`, { remove: true }, axiosConfig);
      fetchUsers();
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      console.error('No token found in localStorage');
      setLoading(false);
      return;
    }
    Promise.all([fetchUsers(), fetchMembers()]).finally(() => setLoading(false));
  }, [token]);

  const filteredStudents = students.filter(
    (user) =>
      !members.some((m) => m._id === user._id) &&
      user.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) {
    return <p className="text-red-500 p-4">You must be logged in to view this page.</p>;
  }

  if (loading) {
    return <p className="p-4 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Students (Approve Members)</h1>

      <input
        type="text"
        placeholder="Search by Roll Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full md:w-1/2"
      />

      {/* Pending Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student._id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p><strong>Name:</strong> {student.username}</p>
              <p><strong>Roll:</strong> {student.rollNumber}</p>
            </div>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => approveMember(student._id)}
            >
              Approve
            </button>
          </div>
        ))}
      </div>

      {/* Approved Members */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Approved Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div
            key={member._id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <p><strong>Name:</strong> {member.username}</p>
              <p><strong>Roll:</strong> {member.rollNumber}</p>
            </div>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => removeMember(member._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
