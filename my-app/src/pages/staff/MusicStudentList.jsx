import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MusicStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/music-students') // ✅ Corrected endpoint
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching students:', err);
        setError('Failed to load music students.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.message}>Loading music students...</p>;
  if (error) return <p style={{ ...styles.message, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎵 Music Class - Student List</h2>
      {students.length === 0 ? (
        <p style={styles.message}>No music students found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>S.No</th>
              <th style={styles.th}>Roll Number</th>
              <th style={styles.th}>Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{student.rollNumber}</td>
                <td style={styles.td}>{student.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f9fc',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    margin: '30px',
  },
  title: {
    fontSize: '26px',
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#777',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    padding: '12px',
    backgroundColor: '#3f51b5',
    color: 'white',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    border: '1px solid #ddd',
    color: '#333',
  },
};
