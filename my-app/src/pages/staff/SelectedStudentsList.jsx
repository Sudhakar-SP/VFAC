import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function InternalSelectedEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/applied/${id}`, { withCredentials: true });
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event data');
      }
    };

    fetchEventDetails();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!event) return <p>Loading event details...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Event: {event.title}</h2>
      <img src={`http://localhost:5000${event.image}`} alt={event.title} style={styles.image} />
      <p style={styles.date}>Date: {new Date(event.date).toLocaleDateString()}</p>

      <h3 style={styles.subheading}>Applied Students</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>S.No</th>
            <th style={styles.th}>Roll No</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {event.applicants?.map((applicant, index) => (
            <tr key={applicant._id}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{applicant.studentId?.rollNumber}</td>
              <td style={styles.td}>{applicant.studentId?.name}</td>
              <td style={styles.td}>
                <span style={{ 
                  ...styles.badge, 
                  backgroundColor: getStatusColor(applicant.status) 
                }}>
                  {applicant.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  heading: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '20px'
  },
  subheading: {
    marginTop: '30px',
    color: '#495057'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  date: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  th: {
    backgroundColor: '#343a40',
    color: '#fff',
    padding: '10px',
    textAlign: 'left'
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc'
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
      return '#28a745';
    case 'rejected':
      return '#dc3545';
    default:
      return '#ffc107';
  }
};
