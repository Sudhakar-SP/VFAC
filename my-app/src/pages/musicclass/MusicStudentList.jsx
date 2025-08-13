// src/pages/MusicStudentList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaMusic, FaSpinner, FaUserGraduate } from 'react-icons/fa';

export default function MusicStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/music-students');
      setStudents(res.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this student?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/music-students/delete/${id}`);
      fetchStudents(); // Refresh list after deletion
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete the student. Please try again.');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center space-x-3 text-gray-600 text-lg select-none">
        <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
        <span>Loading students...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-xl shadow-lg font-sans">
      <h2 className="flex items-center gap-3 text-3xl font-bold text-yellow-600 mb-8 select-none">
        <FaMusic className="text-yellow-500" /> Music Class Students
      </h2>

      {students.length === 0 ? (
        <div className="text-center text-gray-500 mt-16 space-y-3 select-none">
          <FaUserGraduate className="mx-auto text-6xl opacity-30" />
          <p className="text-lg">No students found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full table-auto min-w-[600px] text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-900 font-semibold select-none">
              <tr>
                <th className="p-4 border-b border-yellow-300">Roll Number</th>
                <th className="p-4 border-b border-yellow-300">Name</th>
                <th className="p-4 border-b border-yellow-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr
                  key={s._id}
                  className={`transition-colors duration-200 cursor-default ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-yellow-50'
                  } hover:bg-yellow-100`}
                >
                  <td className="p-4 border-b border-yellow-200 font-mono text-yellow-700">
                    {s.rollNumber}
                  </td>
                  <td className="p-4 border-b border-yellow-200 text-yellow-900 font-semibold">
                    {s.name}
                  </td>
                  <td className="p-4 border-b border-yellow-200 text-center">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-md shadow-sm transition"
                      title="Delete Student"
                      aria-label={`Delete student ${s.name}`}
                    >
                      <FaTrashAlt />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
