import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    image: null,
  });

  const navigate = useNavigate();

  // Fetch all events
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

  // Delete an event
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  // Start editing an event
  const startEdit = (event) => {
    setEditingEventId(event._id);
    setFormData({
      title: event.title,
      date: event.date.slice(0, 10),
      description: event.description,
      image: null,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingEventId(null);
    setFormData({ title: "", date: "", description: "", image: null });
  };

  // Submit edited event
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.put(`http://localhost:5000/api/events/${editingEventId}`, data);
      cancelEdit();
      fetchEvents();
    } catch (err) {
      alert("Failed to update event");
    }
  };

  // Navigate to applied students page
  const handleViewAppliedStudents = (eventId) => {
    navigate(`/admin/events/applied/${eventId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Event List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white p-4 rounded-lg shadow-md">
            {editingEventId === event._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Title"
                  className="block mb-2 w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="block mb-2 w-full p-2 border rounded"
                  required
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  className="block mb-2 w-full p-2 border rounded"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="block mb-2"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
                    Update
                  </button>
                  <button type="button" onClick={cancelEdit} className="bg-gray-400 px-4 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
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
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => startEdit(event)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewAppliedStudents(event._id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    View Applied Students
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
