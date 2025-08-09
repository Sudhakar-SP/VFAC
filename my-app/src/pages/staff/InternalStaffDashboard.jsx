import React from 'react';

export default function InternalStaffDashboard() {
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    subtitle: {
      fontSize: '22px',
      fontWeight: '600',
      marginTop: '30px',
      marginBottom: '10px',
      color: '#444',
    },
    paragraph: {
      fontSize: '16px',
      color: '#555',
    },
    list: {
      listStyleType: 'disc',
      paddingLeft: '20px',
      color: '#555',
    },
    listItem: {
      marginBottom: '8px',
      fontSize: '15px',
    },
    section: {
      marginTop: '25px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Internal Staff Dashboard</h1>
      <p style={styles.paragraph}>Welcome! This is the internal staff dashboard.</p>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Manage Internal Activities</h2>
        <ul style={styles.list}>
          <li style={styles.listItem}>View and monitor event list assigned to you</li>
          <li style={styles.listItem}>Access music class student list for attendance or notes</li>
          <li style={styles.listItem}>Review and update member participation list</li>
          <li style={styles.listItem}>Submit reports to Admin</li>
        </ul>
      </div>
    </div>
  );
}
