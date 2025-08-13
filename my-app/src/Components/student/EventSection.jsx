import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [studentId] = useState('PUT_STUDENT_ID_HERE');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/events')
      .then((res) => {
        const myEvents = res.data.map((event) => ({
          ...event,
          applied: event.participants?.includes(studentId),
        }));
        setEvents(myEvents);
      })
      .catch(() => console.error('Event fetch failed'));
  }, [studentId]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8 flex items-center gap-3">
        <FaCalendarAlt className="text-blue-600" /> Upcoming Events
      </h2>

      {events.length === 0 ? (
        <div className="text-center py-20">
          <FaInfoCircle className="text-gray-400 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No events available at the moment.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center text-gray-500 mb-2">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  <span className="text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  {event.applied ? (
                    <span className="flex items-center text-green-600 font-semibold">
                      <FaCheckCircle className="mr-2" /> Applied
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500 font-semibold">
                      <FaTimesCircle className="mr-2" /> Not Applied
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventSection;
