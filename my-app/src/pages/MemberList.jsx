import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaUserAlt, FaTrashAlt } from 'react-icons/fa';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/users/members');
      setMembers(res.data || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please try again.');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    setRemovingId(id);
    try {
      await axios.put(`http://localhost:5000/api/users/remove/${id}`, { remove: true });
      await fetchMembers();
    } catch (err) {
      console.error('Error removing membership:', err);
      alert('Failed to remove member. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members by rollNumber or username (case-insensitive)
  const filteredMembers = members.filter((member) =>
    (member.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     member.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg font-sans select-none">
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 flex items-center gap-3">
        <FaUserAlt className="text-indigo-500" /> Member List
      </h2>

      <div className="relative max-w-md mb-8">
        <input
          type="text"
          placeholder="Search by Roll Number or Username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          aria-label="Search members"
        />
        <FaSearch className="absolute left-3 top-3.5 text-indigo-400 pointer-events-none" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-center text-gray-500 font-medium">No members found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredMembers.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="text-indigo-900 font-semibold tracking-wide">
                  {member.rollNumber || 'N/A'}
                </p>
                <p className="text-indigo-700">{member.username || 'Unnamed'}</p>
              </div>
              <button
                onClick={() => handleRemove(member._id)}
                disabled={removingId === member._id}
                className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Remove member ${member.username}`}
              >
                <FaTrashAlt />
                {removingId === member._id ? 'Removing...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
