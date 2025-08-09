import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [studentId] = useState('PUT_STUDENT_ID_HERE');

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => {
        const myEvents = res.data.map(event => ({
          ...event,
          applied: event.participants?.includes(studentId),
        }));
        setEvents(myEvents);
      })
      .catch(() => console.error('Event fetch failed'));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Event List</h2>
      {events.map(event => (
        <div key={event._id} className="border p-4 mb-3 rounded shadow">
          <h3 className="text-lg font-bold">{event.title}</h3>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Status: {event.applied ? '✅ Applied' : '❌ Not Applied'}</p>
        </div>
      ))}
    </div>
  );
};

export default EventSection;
