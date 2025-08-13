import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaInfoCircle, FaUserCheck, FaMicrophone } from "react-icons/fa";

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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-blue-800">
        <FaMicrophone className="text-blue-600" /> Event List (Internal Staff)
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-600 text-lg">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="relative group">
                <img
                  src={`http://localhost:5000/uploads/${event.image}`}
                  alt={event.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaMicrophone className="text-blue-500" /> {event.title}
                </h3>

                <p className="text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-red-500" />{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>

                <p className="text-sm mt-3 text-gray-700 flex items-center gap-2">
                  <FaInfoCircle className="text-yellow-500" /> {event.description}
                </p>

                <button
                  onClick={() => handleViewSelected(event._id)}
                  className="mt-5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors duration-300"
                >
                  <FaUserCheck /> View Selected Students
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffEventList;
