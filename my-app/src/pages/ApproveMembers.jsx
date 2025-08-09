import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApproveMembers() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fetch students only from API and filter unapproved ones
  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/list');
      const studentData = res.data.students || []; // ✅ Use correct nested key

      // Filter students who are not yet approved as members
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
      fetchStudents(); // Refresh list after approval
    } catch (error) {
      console.error('Error approving membership:', error);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Approve Members</h2>

      <input
        type="text"
        placeholder="Search by Roll Number"
        className="border p-2 mb-4 w-full md:w-1/2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="space-y-2">
          {filteredStudents.map((student) => (
            <li
              key={student._id}
              className="flex justify-between items-center border p-3 rounded shadow-sm"
            >
              <div>
                <p><strong>Name:</strong> {student.username}</p>
                <p><strong>Roll No:</strong> {student.rollNumber}</p>
              </div>
              <button
                onClick={() => handleApprove(student._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve Member
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ApproveMembers;
