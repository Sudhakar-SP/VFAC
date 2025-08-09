// src/pages/MusicStudentList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MusicStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/music-students');
      console.log("Fetched data:", res.data); // ✅ Debug log
      setStudents(res.data || []);  // ✅ Fixed this line
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/music-students/delete/${id}`);
      fetchStudents(); // Refresh list after deletion
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading students...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎵 Music Class Students</h2>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Roll Number</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td className="p-2 border">{s.rollNumber}</td>
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
