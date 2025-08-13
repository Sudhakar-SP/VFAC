import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApproveMembers() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students only from API and filter unapproved ones
  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/list');
      const studentData = res.data.students || [];

      const unapprovedStudents = studentData.filter(
        (student) => student.role === 'student' && !student.isMember
      );

      setStudents(unapprovedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/approve/${id}`);
      alert('Membership approved');
      fetchStudents();
    } catch (error) {
      console.error('Error approving membership:', error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-wide relative select-none">
        <span className="relative z-10 px-6 py-2 bg-yellow-400 bg-opacity-80 rounded-lg shadow-md inline-block">
          Approve Members
        </span>
        <span className="absolute left-1/2 top-12 w-40 h-1 bg-yellow-400 rounded transform -translate-x-1/2 shadow-lg"></span>
      </h2>

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by Roll Number"
          className="w-full max-w-md p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">No students found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredStudents.map((student) => (
            <li
              key={student._id}
              className="flex justify-between items-center border border-gray-200 p-5 rounded-xl shadow hover:shadow-xl transition"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900">{student.username}</p>
                <p className="text-sm text-gray-600 tracking-wide">Roll No: <span className="font-mono">{student.rollNumber}</span></p>
              </div>
              <button
                onClick={() => handleApprove(student._id)}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
                aria-label="Approve Member"
              >
                {/* Checkmark Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Approve Member</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ApproveMembers;
