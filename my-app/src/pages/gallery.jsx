import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const [mediaType, setMediaType] = useState('photo');
  const [mediaList, setMediaList] = useState([]);

  console.log('mediaType:', mediaType);
  console.log('mediaList:', mediaList);

  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  // Detect ?type=photo|video in URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'video' || type === 'photo') {
      setMediaType(type);
    }
  }, [searchParams]);

  // Fetch gallery data
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/gallery/media')
      .then((res) => {
        if (Array.isArray(res.data.media)) {
          setMediaList(res.data.media);
        } else {
          setError('Invalid response from server');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch gallery:', err);
        setError('Unable to load media.');
      });
  }, []);

  // Filter media by type and search text
  const filteredMedia = mediaList
    .filter((media) => media.mediaType === mediaType)
    .filter((media) => {
      const text = searchText.toLowerCase();
      return (
        media.filename?.toLowerCase().includes(text) ||
        media.title?.toLowerCase().includes(text)
      );
    });

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        {mediaType === 'photo' ? 'Photo Gallery' : 'Video Gallery'}
      </h2>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by filename or title..."
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {filteredMedia.length === 0 ? (
        <p className="text-center text-gray-500">No matching {mediaType}s found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-lg shadow-lg bg-white"
            >
              {item.mediaType === 'photo' ? (
                <img
                  src={`http://localhost:5000${item.path}`}
                  alt={item.title || item.filename}
                  className="w-full h-48 object-cover transform hover:scale-105 transition duration-300"
                />
              ) : (
                <video
                  controls
                  className="w-full h-48 object-cover"
                  src={`http://localhost:5000${item.path}`}
                />
              )}
              <div className="p-2 text-center text-gray-800 font-medium">
                {item.title || item.filename || 'Untitled'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
