import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

        const sorted = [...applicants].sort((a, b) => {
          const aMember = a.user?.isMember ? 1 : 0;
          const bMember = b.user?.isMember ? 1 : 0;
          return bMember - aMember;
        });

        setStudents(sorted);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch applied students');
      });
  }, [eventId]);

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/events/update-status/${eventId}/${studentId}`,
        { status: newStatus }
      );

      // Optionally, update user.isMember in DB (done from backend ideally)

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

        return [...updated].sort((a, b) => {
          const aMember = a.user?.isMember ? 1 : 0;
          const bMember = b.user?.isMember ? 1 : 0;
          return bMember - aMember;
        });
      });
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update student status.');
    }
  };

  const acceptedStudents = students.filter((s) => s.status === 'Accepted');

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📋 Applied Students</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        ✅ Accepted Students: {acceptedStudents.length}
      </div>

      {students.length === 0 ? (
        <p>No students have applied for this event yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>S.No</th>
              <th style={thStyle}>Roll No</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Applied At</th>
              <th style={thStyle}>Member</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const user = student.user;
              if (!user) return null;

              return (
                <tr key={student._id} style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>{user.rollNumber || 'N/A'}</td>
                  <td style={tdStyle}>{user.username || user.name || 'N/A'}</td>
                  <td style={tdStyle}>
                    <strong style={{ color: statusColor(student.status) }}>
                      {student.status || 'Pending'}
                    </strong>
                  </td>
                  <td style={tdStyle}>
                    {student.appliedAt
                      ? new Date(student.appliedAt).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td style={tdStyle}>{user.isMember ? 'Yes' : 'No'}</td>
                  <td style={tdStyle}>
                    <button
                      style={{ ...btnStyle, backgroundColor: 'green' }}
                      onClick={() => handleStatusChange(user._id, 'Accepted')}
                      disabled={student.status === 'Accepted'}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...btnStyle, backgroundColor: 'red' }}
                      onClick={() => handleStatusChange(user._id, 'Rejected')}
                      disabled={student.status === 'Rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {acceptedStudents.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3>🎉 Selected (Accepted) Students List</h3>
          <table style={tableStyle}>
            <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              <tr>
                <th style={thStyle}>S.No</th>
                <th style={thStyle}>Roll No</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Applied At</th>
              </tr>
            </thead>
            <tbody>
              {acceptedStudents.map((student, index) => {
                const user = student.user;
                if (!user) return null;

                return (
                  <tr key={student._id} style={index % 2 === 0 ? rowStyleEven : rowStyleOdd}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{user.rollNumber || 'N/A'}</td>
                    <td style={tdStyle}>{user.username || user.name || 'N/A'}</td>
                    <td style={tdStyle}>
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
      )}
    </div>
  );
}

// ✅ Helpers
const statusColor = (status) => {
  if (status === 'Accepted') return 'green';
  if (status === 'Rejected') return 'red';
  return '#555';
};

// ✅ Styles
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const theadStyle = {
  backgroundColor: '#333',
  color: '#fff',
};

const thStyle = {
  padding: '10px',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const rowStyleEven = {
  backgroundColor: '#f9f9f9',
};

const rowStyleOdd = {
  backgroundColor: '#ffffff',
};

const btnStyle = {
  marginRight: '8px',
  padding: '6px 12px',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
