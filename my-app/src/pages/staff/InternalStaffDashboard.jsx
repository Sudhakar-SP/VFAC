import React from "react";

export default function InternalStaffDashboard() {
  const styles = {
    container: {
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #eef2f7, #f8faff)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#2d3748",
      textAlign: "center",
    },
    paragraph: {
      fontSize: "16px",
      color: "#4a5568",
      marginBottom: "30px",
      textAlign: "center",
    },
    section: {
      marginTop: "20px",
      padding: "25px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      maxWidth: "600px",
      width: "100%",
      transition: "transform 0.3s ease, boxShadow 0.3s ease",
    },
    sectionHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    },
    subtitle: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#1a202c",
    },
    list: {
      listStyleType: "none",
      paddingLeft: "0",
      margin: "0",
    },
    listItem: {
      marginBottom: "12px",
      fontSize: "16px",
      color: "#4a5568",
      padding: "12px",
      backgroundColor: "#f7fafc",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      transition: "background 0.2s ease",
    },
    listItemHover: {
      backgroundColor: "#edf2f7",
      cursor: "pointer",
    },
    icon: {
      marginRight: "10px",
      fontSize: "18px",
    },
  };

  const activities = [
    { icon: "📅", text: "View and monitor event list assigned to you" },
    { icon: "🎵", text: "Access music class student list for attendance or notes" },
    { icon: "✅", text: "Review and update member participation list" },
    { icon: "📊", text: "Submit reports to Admin" },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Internal Staff Dashboard</h1>
      <p style={styles.paragraph}>
        Welcome! This is the internal staff dashboard.
      </p>

      <div
        style={styles.section}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, styles.sectionHover);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, styles.section);
        }}
      >
        <h2 style={styles.subtitle}>Manage Internal Activities</h2>
        <ul style={styles.list}>
          {activities.map((item, index) => (
            <li
              key={index}
              style={styles.listItem}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, {
                  ...styles.listItem,
                  ...styles.listItemHover,
                });
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, styles.listItem);
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
