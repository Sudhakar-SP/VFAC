// src/pages/PostEvent.jsx
import { useState } from "react";
import axios from "axios";
import { MdEventAvailable } from "react-icons/md";

const PostEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("venue", formData.venue);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:5000/api/events", data, {
        withCredentials: true,
      });

      alert("✅ Event posted successfully!");
      setFormData({
        title: "",
        date: "",
        venue: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err.message);
      alert("Failed to post event.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-lg text-white mt-10">
      <div className="flex items-center mb-6 space-x-3">
        <MdEventAvailable size={36} className="text-yellow-400" />
        <h2 className="text-3xl font-extrabold tracking-wide">Post New Event</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block mb-1 font-semibold text-yellow-400"
          >
            Event Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block mb-1 font-semibold text-yellow-400"
          >
            Event Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        {/* New Venue Field */}
        <div>
          <label
            htmlFor="venue"
            className="block mb-1 font-semibold text-yellow-400"
          >
            Venue
          </label>
          <input
            id="venue"
            type="text"
            name="venue"
            placeholder="Enter event venue"
            value={formData.venue}
            onChange={handleChange}
            required
            className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 font-semibold text-yellow-400"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Write event details..."
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full rounded-md bg-gray-700 border border-gray-600 px-4 py-2 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block mb-1 font-semibold text-yellow-400"
          >
            Event Image
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full text-gray-300 file:bg-yellow-400 file:text-gray-900 file:px-3 file:py-1 file:rounded-md file:border-0 file:cursor-pointer hover:file:bg-yellow-500 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md shadow-md transition"
        >
          Post Event
        </button>
      </form>
    </div>
  );
};

export default PostEvent;
