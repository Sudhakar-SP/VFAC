import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaCameraRetro, FaVideo } from 'react-icons/fa';

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mediaType, setMediaType] = useState('photo');
  const [mediaList, setMediaList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Detect ?type=photo|video in URL and sync state
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'video' || type === 'photo') {
      setMediaType(type);
    } else {
      setMediaType('photo');
      setSearchParams({ type: 'photo' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Fetch gallery data
  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('http://localhost:5000/api/gallery/media')
      .then((res) => {
        if (Array.isArray(res.data.media)) {
          setMediaList(res.data.media);
        } else {
          setError('Invalid response from server');
          setMediaList([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch gallery:', err);
        setError('Unable to load media.');
        setMediaList([]);
      })
      .finally(() => setLoading(false));
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

  // Handle media type switch and update URL param
  const handleMediaTypeChange = (type) => {
    setMediaType(type);
    setSearchParams({ type });
    setSearchText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8 select-none">
        Gallery
      </h2>

      {/* Media Type Toggle */}
      <div className="flex justify-center gap-6 mb-8 select-none">
        <button
          onClick={() => handleMediaTypeChange('photo')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition
            ${
              mediaType === 'photo'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
          aria-pressed={mediaType === 'photo'}
          aria-label="Show Photos"
          type="button"
        >
          <FaCameraRetro />
          Photos
        </button>

        <button
          onClick={() => handleMediaTypeChange('video')}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition
            ${
              mediaType === 'video'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
          aria-pressed={mediaType === 'video'}
          aria-label="Show Videos"
          type="button"
        >
          <FaVideo />
          Videos
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-10 relative">
        <input
          type="text"
          placeholder={`Search ${mediaType}s by filename or title...`}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          aria-label="Search media"
        />
        <FaSearch className="absolute left-4 top-3.5 text-blue-400 pointer-events-none" />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-600 font-semibold mb-8">{error}</p>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center py-20" role="status" aria-live="polite">
          <svg
            className="animate-spin h-14 w-14 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : filteredMedia.length === 0 ? (
        <p className="text-center text-gray-500 font-medium text-lg select-none">
          No matching {mediaType}s found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredMedia.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-xl shadow-lg bg-white group cursor-pointer"
              tabIndex={0}
              aria-label={`${item.title || item.filename || 'Untitled'} ${mediaType}`}
            >
              {item.mediaType === 'photo' ? (
                <img
                  src={`http://localhost:5000${item.path}`}
                  alt={item.title || item.filename}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300 rounded-t-xl"
                  loading="lazy"
                />
              ) : (
                <video
                  controls
                  className="w-full h-56 object-cover rounded-t-xl"
                  src={`http://localhost:5000${item.path}`}
                />
              )}
              <div className="p-4 text-center font-semibold text-gray-800 truncate" title={item.title || item.filename}>
                {item.title || item.filename || 'Untitled'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
