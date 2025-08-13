import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaUserCheck, FaClipboardList, FaCheckSquare } from 'react-icons/fa';

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [presentIds, setPresentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all students on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axios.get('http://localhost:5000/api/music-students', {
          withCredentials: true,
        });
        const studentsData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.students)
          ? res.data.students
          : [];
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Fetch attendance for selected date to show present students (optional)
  useEffect(() => {
    if (!selectedDate) {
      setPresentIds([]);
      return;
    }

    async function fetchAttendance() {
      try {
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        const res = await axios.get('http://localhost:5000/api/music-attendance', {
          params: { date: formattedDate },
          withCredentials: true,
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          const attendanceRecord = res.data[0];
          const presentStudentIds = attendanceRecord.attendance
            .filter((a) => a.status === 'present')
            .map((a) => {
              if (typeof a.student === 'object' && a.student !== null) {
                return a.student._id;
              }
              if (typeof a.student === 'string') {
                return a.student;
              }
              if (a.studentId) {
                return a.studentId;
              }
              return null;
            })
            .filter(Boolean);

          setPresentIds(presentStudentIds);
        } else {
          setPresentIds([]);
        }
      } catch (error) {
        console.error('Error fetching attendance for date:', error);
        setPresentIds([]);
      }
    }

    fetchAttendance();
  }, [selectedDate]);

  // Toggle present/absent for a student
  const toggleAttendance = (studentId) => {
    setPresentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Submit attendance (always POST new)
  const handleSubmit = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (students.length === 0) {
      alert('No students to mark attendance for.');
      return;
    }

    setSubmitting(true);

    try {
      const attendancePayload = students.map((s) => ({
        student: s._id,
        rollNumber: s.rollNumber || '',
        status: presentIds.includes(s._id) ? 'present' : 'absent',
      }));

      const payload = {
        date: new Date(selectedDate).toISOString(),
        attendance: attendancePayload,
      };

      // Always POST (create new attendance)
      await axios.post(
        'http://localhost:5000/api/music-attendance',
        payload,
        { withCredentials: true }
      );

      alert('Attendance submitted successfully');
      // Clear presentIds and selectedDate if you want:
      // setSelectedDate('');
      // setPresentIds([]);
    } catch (error) {
      console.error('Error submitting attendance:', error.response?.data || error.message);
      alert('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg font-sans select-none">
      <h2 className="text-3xl font-extrabold mb-8 text-yellow-600 flex items-center gap-3">
        <FaClipboardList className="text-yellow-500" /> Mark Attendance
      </h2>

      <div className="mb-8 max-w-sm">
        <label
          className="flex items-center gap-2 mb-2 text-gray-700 font-semibold"
          htmlFor="date"
        >
          <FaCalendarAlt /> Select Date:
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border border-yellow-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      {loading ? (
        <p className="text-yellow-600 text-center text-lg">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No students found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto border border-yellow-300 rounded-md p-4 shadow-inner">
          {students.map((s) => (
            <li
              key={s._id}
              className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition hover:bg-yellow-50"
              onClick={() => toggleAttendance(s._id)}
              title={`Mark ${s.rollNumber} - ${s.name} as ${
                presentIds.includes(s._id) ? 'Absent' : 'Present'
              }`}
            >
              <input
                type="checkbox"
                checked={presentIds.includes(s._id)}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleAttendance(s._id);
                }}
                className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-400"
              />
              <div>
                <p className="font-mono text-yellow-700 font-semibold">{s.rollNumber}</p>
                <p className="text-yellow-900 font-semibold">{s.name}</p>
              </div>
              {presentIds.includes(s._id) && (
                <FaUserCheck className="text-green-600 ml-auto" title="Present" />
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`mt-8 w-full max-w-xs mx-auto block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-md shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 select-none`}
      >
        <FaCheckSquare className="text-xl" />
        {submitting ? 'Submitting...' : 'Submit Attendance'}
      </button>
    </div>
  );
}
