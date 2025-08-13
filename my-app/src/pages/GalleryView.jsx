import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaCameraRetro, FaVideo, FaTrashAlt } from 'react-icons/fa';

export default function GalleryView() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = () => {
    axios
      .get('http://localhost:5000/api/gallery/media')
      .then((res) => {
        if (Array.isArray(res.data.media)) {
          setMedia(res.data.media);
          setError('');
        } else {
          setError('Unexpected response format');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load media');
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;

    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/gallery/${id}`);
      setMedia((prev) => prev.filter((item) => item._id !== id));
      setError('');
    } catch (err) {
      console.error(err);
      alert('Failed to delete media item.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedia = media.filter((item) => {
    const name = item.title?.toLowerCase() || '';
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesType = filter === 'all' || filter === item.mediaType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans select-none">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-700 flex items-center gap-3 select-none">
        <FaCameraRetro /> Media Gallery
      </h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Search media by name"
          />
          <FaSearch className="absolute right-3 top-2.5 text-indigo-400 pointer-events-none" />
        </div>

        {['all', 'photo', 'video'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition
              ${
                filter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            aria-pressed={filter === type}
            title={`Show ${type.charAt(0).toUpperCase() + type.slice(1)}s`}
          >
            {type === 'photo' && <FaCameraRetro />}
            {type === 'video' && <FaVideo />}
            {type === 'all' && 'All'}
            {type !== 'all' && type.charAt(0).toUpperCase() + type.slice(1) + 's'}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
      )}

      {filteredMedia.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No media found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredMedia.map((item) => {
            const url = `http://localhost:5000${item.path}`;
            const isImage = item.mediaType === 'photo';
            const isVideo = item.mediaType === 'video';

            return (
              <div
                key={item._id}
                className="border rounded-lg p-2 shadow hover:shadow-lg transition relative bg-white"
              >
                {isImage ? (
                  <img
                    src={url}
                    alt={item.title || 'Image'}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src =
                        'https://via.placeholder.com/300x200?text=Image+Not+Found')
                    }
                  />
                ) : isVideo ? (
                  <video
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                    preload="metadata"
                    aria-label={item.title || 'Video'}
                  >
                    <source src={url} type={item.mimetype} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-sm text-gray-600 truncate">
                    Unsupported file: {item.filename}
                  </p>
                )}

                <p className="mt-2 text-center text-sm font-semibold text-indigo-700 truncate" title={item.title || item.filename}>
                  {item.title || 'Untitled'}
                </p>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Delete media item"
                  title="Delete"
                >
                  <FaTrashAlt />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
