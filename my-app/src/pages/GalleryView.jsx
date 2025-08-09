import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GalleryView() {
  const [media, setMedia] = useState([]);

  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = () => {
    axios
      .get('http://localhost:5000/api/gallery/media')
      .then((res) => {
     
     if (Array.isArray(res.data.media)) {
        setMedia(res.data.media);
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

    try {
      await axios.delete(`http://localhost:5000/api/gallery/${id}`);
      setMedia((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete media item.');
    }
  };

  const filteredMedia = media.filter((item) => {
    const name = item.title?.toLowerCase() || '';
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesType = filter === 'all' || filter === item.mediaType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🎞️ Media Gallery</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        {['all', 'photo', 'video'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </button>
        ))}
      </div>

      {filteredMedia.length === 0 ? (
        <p className="text-gray-500">No media found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => {
            const url = `http://localhost:5000${item.path}`;
            const isImage = item.mediaType === 'photo';
            const isVideo = item.mediaType === 'video';

            return (
              <div key={item._id} className="border rounded p-2 shadow relative">
                {isImage ? (
                  <img
                    src={url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found')}
                  />
                ) : isVideo ? (
                  <video controls className="w-full h-48 object-cover rounded">
                    <source src={url} type={item.mimetype} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-sm text-gray-600">Unsupported file: {item.filename}</p>
                )}

                <p className="text-center mt-2 text-sm font-medium">
                  {item.title || 'Untitled'}
                </p>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
