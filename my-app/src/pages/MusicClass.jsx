import React, { useEffect, useState } from "react";
import axios from "axios";

const MusicClass = () => {
  const [students, setStudents] = useState([]);

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("/api/music-students");
        console.log("Fetched students:", res.data);

        // Make sure students is an array
        setStudents(Array.isArray(res.data) ? res.data : res.data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]); // fallback
      }
    };

    fetchStudents();
  }, []);

  // Delete student
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`/api/music-students/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Music Class Students</h2>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4 border-b">Roll Number</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td className="py-2 px-4 border-b">{student.rollNumber}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDeleteStudent(student._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-4 text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MusicClass;
