import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');

  const fetchAttendance = async (date = '') => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:5000/api/music-attendance',
        {
          params: date ? { date } : {},
          withCredentials: true,
        }
      );

      // Filter out empty attendance records
      const filteredRecords = response.data
        .filter(record => Array.isArray(record.attendance) && record.attendance.length > 0)
        .map(record => ({
          ...record,
          attendance: record.attendance,
        }));

      setAttendanceRecords(filteredRecords);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError(err.message);
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

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <div className="p-4">Loading attendance records...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🎓 Attendance Records</h2>

      <div className="mb-6 flex gap-4 items-center">
        <input
          type="date"
          value={searchDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
          max={new Date().toISOString().split('T')[0]}
        />
        <button
          onClick={handleDateSearch}
          disabled={!searchDate}
          className={`px-4 py-2 rounded ${
            !searchDate
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Search Date
        </button>
        {searchDate && (
          <button
            onClick={() => {
              setSearchDate('');
              fetchAttendance();
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Show All
          </button>
        )}
      </div>

      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Roll Number</th>
              <th className="border p-2">Status</th>
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
                    <tr className="bg-blue-50 font-semibold text-gray-800">
                      <td className="border p-2" colSpan={3}>
                        {new Date(record.date).toLocaleDateString()} —{' '}
                        Present: {presentCount}/{total}
                      </td>
                    </tr>

                    {/* Attendance Entries */}
                    {record.attendance.map((att, idx) => (
                      <tr key={`${record._id}-${idx}`} className="hover:bg-gray-50">
                        <td className="border p-2">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{att.rollNumber || 'N/A'}</td>
                        <td className="border p-2">
                          <span
                            className={`font-medium px-2 py-1 rounded ${
                              att.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {att.status || 'absent'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No attendance records found {searchDate ? `for ${searchDate}` : ''}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
