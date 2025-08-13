import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// API base URL (can be moved to config file for scalability)
const API_BASE_URL = "http://localhost:5000/api";

const ExternalStaffEventList = () => {
  // ======== STATE MANAGEMENT ========
  const [events, setEvents] = useState([]); // Stores list of events
  const [error, setError] = useState(""); // Stores API error message
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // ======== API CALL: FETCH EVENTS ========
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/events`, {
        withCredentials: true, // Ensures cookies/session tokens are sent
      });
      setEvents(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching external staff events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ======== LIFECYCLE: COMPONENT DID MOUNT ========
  useEffect(() => {
    fetchEvents();
  }, []);

  // ======== HANDLER: NAVIGATE TO SELECTED STUDENTS PAGE ========
  const handleViewSelectedStudents = (eventId) => {
    navigate(`/external-staff/events/selected/${eventId}`);
  };

  // ======== CONDITIONAL RENDERING ========
  if (loading) {
    return <p className="text-center text-blue-600 mt-10">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (!events.length) {
    return <p className="text-center text-gray-600 mt-10">No events assigned yet.</p>;
  }

  // ======== UI RENDERING ========
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">
        🎤 Event List (External Staff)
      </h2>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition transform hover:scale-[1.02]"
          >
            {/* Event Image */}
            {event.image && (
              <img
                src={`${API_BASE_URL.replace("/api", "")}/uploads/${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Event Details */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-indigo-800">
                {event.title}
              </h3>
              <p className="text-gray-500 mt-1">
                📅 {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-2 flex-grow">
                {event.description?.slice(0, 120)}
                {event.description?.length > 120 ? "..." : ""}
              </p>

              {/* View Selected Students Button */}
              <button
                onClick={() => handleViewSelectedStudents(event._id)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
              >
                View Selected Students
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExternalStaffEventList;
