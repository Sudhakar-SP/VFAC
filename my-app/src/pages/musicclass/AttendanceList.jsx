import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaSearch,
  FaTimesCircle,
  FaUserCheck,
  FaClipboardList,
  FaSyncAlt,
} from 'react-icons/fa';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // track which record is updating

  const fetchAttendance = async (date = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'http://localhost:5000/api/music-attendance',
        {
          params: date ? { date } : {},
          withCredentials: true,
        }
      );

      const filteredRecords = response.data
        .filter(
          (record) =>
            Array.isArray(record.attendance) && record.attendance.length > 0
        )
        .map((record) => ({
          ...record,
          attendance: record.attendance,
        }));

      setAttendanceRecords(filteredRecords);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleDateSearch = () => {
    fetchAttendance(searchDate);
  };

  const handleClearSearch = () => {
    setSearchDate('');
    fetchAttendance();
  };

const toggleAttendance = async (recordId, idx) => {
  const recordIndex = attendanceRecords.findIndex((r) => r._id === recordId);
  if (recordIndex === -1) return;

  const currentStatus = attendanceRecords[recordIndex].attendance[idx].status;
  const newStatus = currentStatus === 'present' ? 'absent' : 'present';

  // Optimistic UI update
  const updatedRecords = [...attendanceRecords];
  updatedRecords[recordIndex].attendance[idx].status = newStatus;
  setAttendanceRecords(updatedRecords);

  setUpdatingId(`${recordId}-${idx}`);

  try {
    // Send attendance with student IDs, not full objects
    const fullAttendance = updatedRecords[recordIndex].attendance.map((att) => ({
      student: att.student?._id || null,
      status: att.status,
    }));

    await axios.put(
      `http://localhost:5000/api/music-attendance/${recordId}`,
      {
        date: updatedRecords[recordIndex].date,
        attendance: fullAttendance,
      },
      { withCredentials: true }
    );
  } catch (err) {
    console.error('Failed to update status:', err);
    alert('Failed to update. Reverting...');

    // Revert UI on failure
    updatedRecords[recordIndex].attendance[idx].status = currentStatus;
    setAttendanceRecords(updatedRecords);
  } finally {
    setUpdatingId(null);
  }
};


  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg font-sans select-none">
      <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 flex items-center gap-3 select-none">
        <FaClipboardList className="text-indigo-500" /> Attendance Records
      </h2>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <label
          htmlFor="search-date"
          className="flex items-center gap-2 font-semibold text-indigo-600 select-none"
        >
          <FaCalendarAlt /> Select Date:
        </label>
        <input
          id="search-date"
          type="date"
          value={searchDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
          className="border border-indigo-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleDateSearch}
          disabled={!searchDate}
          className={`flex items-center gap-2 px-5 py-2 rounded-md shadow-md font-semibold transition
            ${
              !searchDate
                ? 'bg-indigo-200 cursor-not-allowed text-indigo-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          title="Search attendance by date"
        >
          <FaSearch /> Search
        </button>

        {searchDate && (
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white shadow-md font-semibold transition"
            title="Clear search and show all"
          >
            <FaTimesCircle /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-indigo-600 text-center text-lg font-semibold">
          Loading attendance records...
        </p>
      ) : error ? (
        <p className="text-red-600 text-center text-lg font-semibold">{error}</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow-md">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="border p-3">Date</th>
                <th className="border p-3">Roll Number</th>
                <th className="border p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => {
                  const presentCount = record.attendance.filter(
                    (att) => att.status === 'present'
                  ).length;
                  const total = record.attendance.length;

                  return (
                    <React.Fragment key={record._id}>
                      {/* Summary Row */}
                      <tr className="bg-indigo-50 font-semibold text-indigo-800">
                        <td className="border p-3" colSpan={3}>
                          {new Date(record.date).toLocaleDateString()} — Present:{' '}
                          {presentCount}/{total}
                        </td>
                      </tr>

                      {/* Attendance Entries */}
                      {record.attendance.map((att, idx) => (
                        <tr
                          key={`${record._id}-${idx}`}
                          className="hover:bg-indigo-50 transition"
                        >
                          <td className="border p-3">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="border p-3 font-mono">
                            {att.rollNumber || 'N/A'}
                          </td>
                          <td className="border p-3 text-center">
                            <button
                              onClick={() => toggleAttendance(record._id, idx)}
                              disabled={updatingId === `${record._id}-${idx}`}
                              className={`inline-flex items-center gap-2 font-semibold px-3 py-1 rounded-full transition ${
                                att.status === 'present'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {updatingId === `${record._id}-${idx}` ? (
                                <FaSyncAlt className="animate-spin" />
                              ) : att.status === 'present' ? (
                                <FaUserCheck />
                              ) : (
                                <FaTimesCircle />
                              )}
                              {att.status || 'absent'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 font-semibold"
                  >
                    No attendance records found{' '}
                    {searchDate ? `for ${searchDate}` : ''}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
