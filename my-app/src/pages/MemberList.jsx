import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/members');
      console.log('Fetched members:', res.data);
      setMembers(res.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/remove/${id}`, { remove: true });
      fetchMembers();
    } catch (err) {
      console.error('Error removing membership:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) =>
    member.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Member List</h2>

      <input
        type="text"
        placeholder="Search by Roll Number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 w-full max-w-md border border-gray-300 rounded"
      />

      {filteredMembers.length === 0 ? (
        <p className="text-gray-500">No members found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMembers.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded"
            >
              <span>
                <strong>{member.rollNumber}</strong> - {member.username}
              </span>
              <button
                onClick={() => handleRemove(member._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
