import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserGraduate,
  FaCalendarAlt,
  FaUserCheck,
} from 'react-icons/fa';

export default function AdminAppliedStudents() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const { eventId } = useParams();

  useEffect(() => {
    if (!eventId) return;

    axios
      .get(`http://localhost:5000/api/events/applied/${eventId}`)
      .then((res) => {
        const applicants = res.data.applicants || [];

        // Sort so members appear first
        const sorted = [...applicants].sort((a, b) => {
          const aMember = a.user?.isMember ? 1 : 0;
          const bMember = b.user?.isMember ? 1 : 0;
          return bMember - aMember;
        });

        setStudents(sorted);
        setError('');
      })
      .catch((err) => {
        console.error('Error fetching applied students:', err);
        setError('Failed to fetch applied students');
      });
  }, [eventId]);

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/events/update-status/${eventId}/${studentId}`,
        { status: newStatus }
      );

      setStudents((prev) => {
        const updated = prev.map((student) => {
          const user = student.user || {};
          if (user._id === studentId) {
            return {
              ...student,
              status: newStatus,
              user: {
                ...user,
                isMember: newStatus === 'Accepted',
              },
            };
          }
          return student;
        });

        // Sort again after status change
        return [...updated].sort((a, b) => {
          const aMember = a.user?.isMember ? 1 : 0;
          const bMember = b.user?.isMember ? 1 : 0;
          return bMember - aMember;
        });
      });
      setError('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update student status.');
      alert('Failed to update student status.');
    }
  };

  const acceptedStudents = students.filter((s) => s.status === 'Accepted');

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-wide select-none relative">
        <span className="relative z-10 px-8 py-3 bg-yellow-400 bg-opacity-90 rounded-lg shadow-md inline-block">
          📋 Applied Students
        </span>
        <span className="absolute left-1/2 top-16 w-48 h-1 bg-yellow-400 rounded transform -translate-x-1/2 shadow-lg"></span>
      </h2>

      {error && (
        <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>
      )}

      <div className="mb-8 text-xl font-semibold text-green-700 flex items-center justify-center space-x-3">
        <FaUserCheck className="text-2xl" />
        <span>Accepted Students: {acceptedStudents.length}</span>
      </div>

      {students.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-16">
          No students have applied for this event yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">
                  S.No
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">
                  <span className="inline-flex items-center space-x-1">
                    <FaUserGraduate /> <span>Roll No</span>
                  </span>
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">Name</th>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">
                  <span className="inline-flex items-center space-x-1">
                    <FaClock /> <span>Status</span>
                  </span>
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">
                  <span className="inline-flex items-center space-x-1">
                    <FaCalendarAlt /> <span>Applied At</span>
                  </span>
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">
                  <span className="inline-flex items-center space-x-1">
                    <FaUserCheck /> <span>Member</span>
                  </span>
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-medium text-left">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => {
                const user = student.user;
                if (!user) return null;

                return (
                  <tr
                    key={student._id}
                    className={index % 2 === 0 ? 'bg-gray-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                      {user.rollNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {user.username || user.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.appliedAt
                        ? new Date(student.appliedAt).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {user.isMember ? (
                        <FaCheckCircle className="text-green-500 inline-block" title="Member" />
                      ) : (
                        <FaTimesCircle className="text-red-500 inline-block" title="Not a Member" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleStatusChange(user._id, 'Accepted')}
                        disabled={student.status === 'Accepted'}
                        className={`inline-flex items-center px-4 py-2 text-white rounded-md shadow-md transition ${
                          student.status === 'Accepted'
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                        title="Accept Student"
                      >
                        <FaCheckCircle className="mr-2" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(user._id, 'Rejected')}
                        disabled={student.status === 'Rejected'}
                        className={`inline-flex items-center px-4 py-2 text-white rounded-md shadow-md transition ${
                          student.status === 'Rejected'
                            ? 'bg-red-300 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                        title="Reject Student"
                      >
                        <FaTimesCircle className="mr-2" /> Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {acceptedStudents.length > 0 && (
        <section className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3 select-none">
            🎉 Selected (Accepted) Students List
          </h3>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium">S.No</th>
                  <th className="px-6 py-3 text-sm font-medium flex items-center gap-2">
                    <FaUserGraduate /> Roll No
                  </th>
                  <th className="px-6 py-3 text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-sm font-medium flex items-center gap-2">
                    <FaCalendarAlt /> Applied At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {acceptedStudents.map((student, index) => {
                  const user = student.user;
                  if (!user) return null;

                  return (
                    <tr
                      key={student._id}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {user.rollNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.username || user.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.appliedAt
                          ? new Date(student.appliedAt).toLocaleString()
                          : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  switch (status) {
    case 'Accepted':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-sm shadow">
          <FaCheckCircle className="mr-1" /> Accepted
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-sm shadow">
          <FaTimesCircle className="mr-1" /> Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm shadow">
          <FaClock className="mr-1" /> Pending
        </span>
      );
  }
}
