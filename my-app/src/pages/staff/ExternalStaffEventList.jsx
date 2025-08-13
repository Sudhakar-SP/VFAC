import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExternalStaffEventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        withCredentials: true,
      });
      setEvents(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching external staff events:", err);
      setError("Failed to load events. Please try again later.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewSelectedStudents = (eventId) => {
    navigate(`/external-staff/events/selected/${eventId}`);
  };

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (!events.length) {
    return <p className="text-center text-gray-600 mt-10">No events assigned yet.</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">
        🎤 Event List (External Staff)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            {event.image && (
              <img
                src={`http://localhost:5000/uploads/${event.image}`}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-indigo-800">{event.title}</h3>
              <p className="text-gray-500 mt-1">
                📅 {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-2 flex-grow">
                {event.description?.slice(0, 120)}
                {event.description?.length > 120 ? "..." : ""}
              </p>

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
