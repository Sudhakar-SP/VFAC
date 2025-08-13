import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function SelectedStudentsList() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventId) {
      setError('Invalid event ID');
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events/applied/${eventId}`,
          { withCredentials: true }
        );
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event data');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (error) return <p>{error}</p>;
  if (!event) return <p>Loading event details...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Event: {event.title || 'Untitled Event'}</h2>
      {event.image && (
        <img
          src={`http://localhost:5000${event.image}`}
          alt={event.title || 'Event'}
          style={styles.image}
        />
      )}
      {event.date && (
        <p style={styles.date}>
          Date: {new Date(event.date).toLocaleDateString()}
        </p>
      )}

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
          {event.applicants?.length > 0 ? (
            event.applicants.map((applicant, index) => (
              <tr key={applicant._id || index}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{applicant.user?.rollNumber}</td>
                <td style={styles.td}>{applicant.user?.username}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getStatusColor(applicant.status),
                    }}
                  >
                    {applicant.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.td}>
                No applicants found
              </td>
            </tr>
          )}
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
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '20px',
  },
  subheading: {
    marginTop: '30px',
    color: '#495057',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '15px',
  },
  date: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#343a40',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
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
