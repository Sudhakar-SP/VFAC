import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaMapMarkerAlt,
} from "react-icons/fa";

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const studentId = localStorage.getItem("studentId");

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApplyToggle = async (eventId) => {
    try {
      if (!studentId) {
        alert("Student not logged in");
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/events/apply/${eventId}`,
        { studentId },
        { withCredentials: true }
      );

      alert(res.data.message);
      fetchEvents();
    } catch (err) {
      console.error("Apply toggle error:", err);
      alert("Failed to update application status.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen mt-[4%]">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8 flex items-center gap-3">
        <FaClipboardList className="text-blue-600" /> Event List
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {events.map((event) => {
          const isApplied = event.applicants?.some(
            (applicant) => applicant.user === studentId
          );

          return (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={`http://localhost:5000/uploads/${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h3>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {event.venue || "Venue not specified"}
                </div>

                <p className="text-gray-600 text-sm flex-grow">
                  {event.description}
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => handleApplyToggle(event._id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full text-white transition-all duration-300 ${
                      isApplied
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <FaTimesCircle /> Cancel
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Apply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No events available.</p>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
