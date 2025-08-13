import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

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
              venue: event.venue || "Not specified",
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

  const getStatusStyles = (status) => {
    switch (status) {
      case "Accepted":
        return {
          icon: <FaCheckCircle className="text-green-500 text-lg" />,
          color: "text-green-600 bg-green-50",
        };
      case "Rejected":
        return {
          icon: <FaTimesCircle className="text-red-500 text-lg" />,
          color: "text-red-600 bg-red-50",
        };
      case "Pending":
      default:
        return {
          icon: <FaHourglassHalf className="text-yellow-500 text-lg" />,
          color: "text-yellow-600 bg-yellow-50",
        };
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen mt-[4%]">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8">
          Applied Event Status
        </h2>

        <table className="w-full border-collapse overflow-hidden rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <th className="px-6 py-3 text-left">Event</th>
              <th className="px-6 py-3 text-left">Venue</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {appliedEvents.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              appliedEvents.map((event, index) => {
                const { icon, color } = getStatusStyles(event.status);
                return (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition duration-200 border-b"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {event.venue}
                    </td>
                    <td
                      className={`px-6 py-4 flex items-center gap-2 font-semibold rounded-full ${color}`}
                    >
                      {icon} {event.status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentApplyStatus;
