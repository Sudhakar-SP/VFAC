import React, { useEffect, useState } from "react";
import axios from "axios";

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

      // Send toggle request to backend
      const res = await axios.post(
        `http://localhost:5000/api/events/apply/${eventId}`,
        { studentId },
        { withCredentials: true }
      );

      alert(res.data.message); // Message like "Applied successfully" or "Application cancelled"

      // Refresh event data
      fetchEvents();
    } catch (err) {
      console.error("Apply toggle error:", err);
      alert("Failed to update application status.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Event List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => {
          // ✅ Correctly check if student already applied
          const isApplied = event.applicants?.some(
            (applicant) => applicant.user === studentId
          );

          return (
            <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={`http://localhost:5000/uploads/${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl mt-2 font-semibold">{event.title}</h3>
              <p className="text-gray-600">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm mt-1">{event.description}</p>
              <div className="mt-3">
                <button
                  onClick={() => handleApplyToggle(event._id)}
                  className={`${
                    isApplied
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded w-full`}
                >
                  {isApplied ? "Cancel" : "Apply"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentEvents;
