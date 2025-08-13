import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMusic, FaUserGraduate, FaListOl, FaSearch } from "react-icons/fa";

export default function MusicStudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/music-students")
      .then((res) => {
        setStudents(res.data);
        setFilteredStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError("Failed to load music students.");
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter(
          (student) =>
            student.name.toLowerCase().includes(query) ||
            student.rollNumber.toString().includes(query)
        )
      );
    }
  };

  if (loading) return <p style={styles.message}>Loading music students...</p>;
  if (error) return <p style={{ ...styles.message, color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <FaMusic style={{ marginRight: "10px", color: "#3f51b5" }} />
        Music Class - Student List
      </h2>

      {/* Search Section */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button style={styles.searchButton} onClick={handleSearch}>
          <FaSearch style={{ marginRight: "6px" }} /> Search
        </button>
      </div>

      {filteredStudents.length === 0 ? (
        <p style={styles.message}>No music students found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                <span style={styles.thContent}>
                  <FaListOl style={styles.icon} /> S.No
                </span>
              </th>
              <th style={styles.th}>
                <span style={styles.thContent}>
                  <FaUserGraduate style={styles.icon} /> Roll Number
                </span>
              </th>
              <th style={styles.th}>
                <span style={styles.thContent}>
                  <FaUserGraduate style={styles.icon} /> Name
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr
                key={student._id}
                style={styles.row}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f1f4ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
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
    padding: "30px",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f5f7fb",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    margin: "30px auto",
    maxWidth: "900px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#2c3e50",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  message: {
    fontSize: "16px",
    color: "#777",
    textAlign: "center",
  },
  searchContainer: {
    display: "flex",
    marginBottom: "20px",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  searchButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#3f51b5",
    color: "white",
    padding: "10px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    padding: "14px",
    backgroundColor: "#3f51b5",
    color: "white",
    textAlign: "left",
    fontSize: "15px",
    borderBottom: "1px solid #ddd",
  },
  thContent: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  td: {
    padding: "14px",
    borderBottom: "1px solid #ddd",
    color: "#333",
    fontSize: "14px",
  },
  row: {
    transition: "background 0.2s ease",
  },
  icon: {
    verticalAlign: "middle",
  },
};
