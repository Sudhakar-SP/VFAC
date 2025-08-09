import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentApplyStatus = () => {
  const [appliedEvents, setAppliedEvents] = useState([]);
  const studentId = localStorage.getItem("studentId");

  const fetchAppliedEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      const studentEvents = res.data
        .map((event) => {
          const applicant = event.applicants.find(
            (a) => a.user === studentId || a.user?._id === studentId
          );
          if (applicant) {
            return {
              title: event.title,
              status: applicant.status || "Pending",
            };
          }
          return null;
        })
        .filter(Boolean);
      setAppliedEvents(studentEvents);
    } catch (err) {
      console.error("Failed to load applied events", err);
    }
  };

  useEffect(() => {
    fetchAppliedEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      case "Pending":
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Applied Event Status</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Event</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appliedEvents.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center text-gray-500 p-4">
                No applications found.
              </td>
            </tr>
          ) : (
            appliedEvents.map((event, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{event.title}</td>
                <td className={`border px-4 py-2 ${getStatusColor(event.status)}`}>
                  {event.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentApplyStatus;
