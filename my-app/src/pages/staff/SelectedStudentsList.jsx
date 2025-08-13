import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt,
  FaUserGraduate,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardList
} from "react-icons/fa";

export default function SelectedStudentsList() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setError("Invalid event ID");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events/applied/${eventId}`,
          { withCredentials: true }
        );

        console.log("API Response:", res.data);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) return <p style={styles.loading}>Loading event details...</p>;
  if (error) return <p style={styles.error}>{error}</p>;
  if (!event) return <p style={styles.error}>Event not found</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        <FaClipboardList style={styles.headingIcon} /> Event:{" "}
        {event.title || "Untitled Event"}
      </h2>

      {event.image && (
        <img
          src={`http://localhost:5000/uploads/${event.image}`}
          alt={event.title || "Event"}
          style={styles.image}
        />
      )}

      {event.date && (
        <p style={styles.date}>
          <FaCalendarAlt style={{ marginRight: "6px", color: "#007bff" }} />
          {new Date(event.date).toLocaleDateString()}
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
                <td style={styles.td}>
                  <FaUserGraduate style={{ marginRight: "6px", color: "#555" }} />
                  {applicant.user?.rollNumber || "N/A"}
                </td>
                <td style={styles.td}>
                  {applicant.user?.username || "Unknown"}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: getStatusColor(applicant.status)
                    }}
                  >
                    {getStatusIcon(applicant.status)} {applicant.status}
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
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(135deg, #f8f9fa, #eef2f7)",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  },
  heading: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "26px",
    marginBottom: "20px",
    fontWeight: "bold"
  },
  headingIcon: {
    marginRight: "8px",
    color: "#007bff"
  },
  subheading: {
    marginTop: "30px",
    marginBottom: "10px",
    color: "#34495e",
    fontSize: "20px",
    fontWeight: "600"
  },
  image: {
    maxWidth: "400px",       // smaller, fixed maximum width
    width: "100%",
    height: "auto",
    borderRadius: "12px",    // softer corners
    margin: "15px auto",     // center the image
    display: "block",        // ensures centering works
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)", // subtle shadow for depth
    objectFit: "cover"       // keeps aspect ratio without distortion
  },

  date: {
    textAlign: "center",
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden"
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    fontSize: "15px"
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px"
  },
  badge: {
    padding: "5px 10px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px"
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: "20px"
  },
  loading: {
    color: "#555",
    textAlign: "center",
    padding: "20px"
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return "#28a745";
    case "rejected":
      return "#dc3545";
    default:
      return "#ffc107";
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case "accepted":
      return <FaCheckCircle />;
    case "rejected":
      return <FaTimesCircle />;
    default:
      return <FaClock />;
  }
};
