import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaSearch, FaListOl, FaIdBadge } from "react-icons/fa";

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    // live filter as user types
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredMembers(members);
      return;
    }
    setFilteredMembers(
      members.filter(
        (m) =>
          (m.rollNumber || "").toLowerCase().includes(term) ||
          (m.username || "").toLowerCase().includes(term)
      )
    );
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/members");
      setMembers(res.data || []);
      setFilteredMembers(res.data || []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header: icon + title on same line */}
        <div style={styles.header}>
          <div style={styles.iconBox}>
            <FaUsers style={styles.headerIcon} />
          </div>
          <div style={styles.headerTextWrap}>
            <h2 style={styles.headerTitle}>Approved Member List</h2>
            <p style={styles.headerSubtitle}>
              View and search approved student members
            </p>
          </div>
        </div>

        {/* Search row */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by roll number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            aria-label="Search members"
          />
          <button
            style={styles.searchBtn}
            onClick={() => {
              /* keep for accessibility — search is live already */
              // optionally do something on click
            }}
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p style={styles.message}>Loading members…</p>
        ) : filteredMembers.length === 0 ? (
          <p style={styles.message}>No members found.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <span style={styles.thContent}>
                      <FaListOl style={styles.thIcon} /> S.No
                    </span>
                  </th>
                  <th style={styles.th}>
                    <span style={styles.thContent}>
                      <FaIdBadge style={styles.thIcon} /> Roll Number
                    </span>
                  </th>
                  <th style={styles.th}>
                    <span style={styles.thContent}>
                      <FaUsers style={styles.thIcon} /> Name
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, idx) => (
                  <tr
                    key={member._id || idx}
                    style={styles.tr}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f6f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={styles.td}>{member.rollNumber || "N/A"}</td>
                    <td style={styles.td}>{member.username || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* Inline styles (all internal) */
const styles = {
  page: {
    padding: "30px 20px",
    fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
    background: "linear-gradient(180deg,#f7f9fc 0%, #ffffff 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 1000,
    background: "#ffffff",
    borderRadius: 14,
    padding: 22,
    boxShadow: "0 10px 30px rgba(18, 38, 63, 0.08)",
  },

  /* Header */
  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    whiteSpace: "nowrap", // keep icon + title on same line
    overflow: "hidden",
  },
  iconBox: {
    minWidth: 56,
    minHeight: 56,
    borderRadius: 12,
    background: "linear-gradient(180deg,#eef4ff,#e6efff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  headerIcon: {
    color: "#2c3e50",
    fontSize: 24,
  },
  headerTextWrap: {
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 22,
    margin: 0,
    color: "#21324a",
    fontWeight: 700,
    lineHeight: 1,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  headerSubtitle: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#6b7788",
  },

  /* Search */
  searchRow: {
    display: "flex",
    gap: 8,
    marginTop: 18,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "8px 6px 6px 8px",
    border: "1px solid #d7def5",
    fontSize: 14,
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  searchBtn: {
    width: 52,
    borderRadius: "6px",
    background: "#3f51b5",
    color: "#fff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 16,
  },

  /* Table */
  tableWrap: {
    overflowX: "auto",
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    background: "#fff",
  },
  th: {
    padding: "12px 16px",
    background: "#3f51b5",
    color: "#fff",
    textAlign: "left",
    fontSize: 14,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    verticalAlign: "middle",
  },
  thContent: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  thIcon: {
    color: "#fff",
    fontSize: 14,
  },
  tr: {
    transition: "background 0.15s ease",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #eef2fb",
    color: "#2b394a",
  },

  /* messages */
  message: {
    padding: "18px 0",
    textAlign: "center",
    color: "#667085",
  },
};
