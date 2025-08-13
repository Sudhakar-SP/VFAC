import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/members');
      console.log("Members data:", res.data); // Debug log
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Approved Member List</h2>
      {loading ? (
        <p>Loading...</p>
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
            {members.map((member, index) => (
              <tr key={member._id}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{member.rollNumber}</td>
                <td style={styles.td}>{member.username || "N/A"}</td>
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
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#f9f9f9',
  },
  th: {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
  },
};
