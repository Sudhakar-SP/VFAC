import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [presentIds, setPresentIds] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/music-students');

        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else if (Array.isArray(res.data.students)) {
          setStudents(res.data.students);
        } else {
          console.error('❌ Unexpected response:', res.data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, []);

  const toggleAttendance = (id) => {
    setPresentIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    try {
      // Check if attendance already exists
      const checkResponse = await axios.get(
        'http://localhost:5000/api/music-attendance/by-date',
        {
          params: { date: selectedDate },
          withCredentials: true,
        }
      );

      if (checkResponse.data && checkResponse.data.length > 0) {
        alert('❌ Attendance already marked for this date');
        return;
      }

      // ✅ Include studentId for backend validation
      const attendance = students.map((student) => ({
        studentId: student._id,
        rollNumber: student.rollNumber,
        status: presentIds.includes(student._id) ? 'present' : 'absent',
      }));

      const data = {
        date: selectedDate,
        attendance,
      };

      console.log('Sending attendance data:', data);

      const postResponse = await axios.post(
        'http://localhost:5000/api/music-attendance',
        data,
        { withCredentials: true }
      );

      if (postResponse.data.message) {
        alert('✅ ' + postResponse.data.message);
        setPresentIds([]);
        setSelectedDate('');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📝 Mark Attendance</h2>

      <div className="mb-4">
        <label className="block mb-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
          required
        />
      </div>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="space-y-2">
          {students.map((s) => (
            <li key={s._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={presentIds.includes(s._id)}
                onChange={() => toggleAttendance(s._id)}
              />
              {s.rollNumber} - {s.name}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Attendance
      </button>
    </div>
  );
}
