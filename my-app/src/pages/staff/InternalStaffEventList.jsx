import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StaffEventList = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleViewSelected = (eventId) => {
    navigate(`/internal-staff/events/selected/${eventId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">🎤 Event List (Internal Staff)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={`http://localhost:5000/uploads/${event.image}`}
              alt={event.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-2">{event.title}</h3>
            <p className="text-gray-600">
              📅 {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-sm mt-1 text-gray-700">{event.description}</p>

            <div className="mt-4">
              <button
                onClick={() => handleViewSelected(event._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
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

export default StaffEventList;
