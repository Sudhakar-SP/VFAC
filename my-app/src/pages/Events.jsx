// src/pages/Events.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: "", date: "", description: "" });

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/events", { withCredentials: true });
    setEvents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/events", formData, { withCredentials: true });
    setFormData({ title: "", date: "", description: "" });
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`http://localhost:5000/api/events/${id}`, { withCredentials: true });
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Event</button>
      </form>

      <ul>
        {events.map((event) => (
          <li key={event._id} className="border-b py-2 flex justify-between items-center">
            <div>
              <strong>{event.title}</strong> ({event.date})<br />
              <span>{event.description}</span>
            </div>
            <button
              onClick={() => deleteEvent(event._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
