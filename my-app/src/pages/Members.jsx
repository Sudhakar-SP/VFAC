import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Members() {
  const [students, setStudents] = useState([]); // ✅ Should be array
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users/list');
      setStudents(res.data.users || []); // ✅ Ensure it's an array
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch members only
  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/users/members');
      setMembers(res.data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const approveMember = async (id) => {
    try {
      await axios.put(`/api/users/approve/${id}`);
      fetchUsers();
      fetchMembers();
    } catch (error) {
      console.error('Error approving member:', error);
    }
  };

  const removeMember = async (id) => {
    try {
      await axios.put(`/api/users/approve/${id}`, { remove: true });
      fetchUsers();
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMembers();
  }, []);

  // Filter only students and exclude already approved members
  const filteredStudents = students?.filter(
    (user) =>
      user.role === 'student' &&
      !members.some((m) => m._id === user._id) &&
      user.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents?.map((student) => (
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

      <h2 className="text-xl font-semibold mt-8 mb-4">Approved Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members?.map((member) => (
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
