import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    image: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
      setFilteredEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = events.filter(
      (e) =>
        e.title.toLowerCase().includes(lowerSearch) ||
        (e.venue && e.venue.toLowerCase().includes(lowerSearch))
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

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
      venue: event.venue || "",
      description: event.description,
      image: null,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingEventId(null);
    setFormData({ title: "", date: "", venue: "", description: "", image: null });
  };

  // Submit edited event
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("venue", formData.venue);
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
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Enhanced Heading */}
      <h2 className="relative mb-10 text-center text-5xl font-extrabold text-gray-900 tracking-wide select-none">
        <span className="relative z-10 inline-block px-6 py-2 bg-yellow-400 bg-opacity-70 rounded-lg shadow-lg">
          EVENTS LIST
        </span>
        {/* Underline / Decorative line */}
        <span className="absolute left-1/2 top-12 w-40 h-1 bg-yellow-400 rounded transform -translate-x-1/2 shadow-lg"></span>
      </h2>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by title or venue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {editingEventId === event._id ? (
                <form onSubmit={handleUpdate} className="p-6 flex flex-col space-y-4">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Title"
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="Venue"
                    className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description"
                    className="block w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows={4}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="block"
                  />
                  <div className="flex space-x-3 justify-end">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
                    >
                      Update
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={`http://localhost:5000/uploads/${event.image}`}
                    alt={event.title}
                    className="w-full h-48 rounded-t-xl object-cover"
                  />
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                    <p className="text-yellow-600 mt-1 font-semibold">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.venue && (
                      <p className="text-gray-700 mt-1 italic text-sm tracking-wide">
                        📍 Venue: {event.venue}
                      </p>
                    )}
                    <p className="text-gray-700 mt-3 flex-grow">{event.description}</p>

                    <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
                      <button
                        onClick={() => startEdit(event)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewAppliedStudents(event._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md transition"
                      >
                        View Applied Students
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
