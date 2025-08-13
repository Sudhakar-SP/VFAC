import { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaFileImage, FaFileVideo, FaPen } from 'react-icons/fa';

const UploadGallery = () => {
  const [file, setFile] = useState(null);
  const [mediaName, setMediaName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!file || !mediaName) {
      setError("⚠️ Please provide both a file and a name.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', mediaName);

    setUploading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res?.data?.message || '✅ Upload successful!');
      setFile(null);
      setMediaName('');
      // Reset file input manually
      document.getElementById('fileInput').value = '';
    } catch (err) {
      console.error(err);
      setError('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg font-sans select-none">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 flex items-center gap-3">
        <FaUpload className="text-blue-500" /> Upload to Gallery
      </h2>

      <form onSubmit={handleUpload} className="space-y-6">
        <label className="block text-gray-700 font-semibold flex items-center gap-2">
          <FaPen className="text-gray-500" /> Media Name
          <input
            type="text"
            placeholder="Enter media name"
            value={mediaName}
            onChange={(e) => setMediaName(e.target.value)}
            className="ml-2 flex-grow border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Media name"
          />
        </label>

        <label
          htmlFor="fileInput"
          className="flex items-center gap-3 cursor-pointer border border-dashed border-gray-400 rounded p-4 justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
        >
          {file ? (
            <>
              {file.type.startsWith('image/') ? (
                <FaFileImage className="text-green-500 text-3xl" />
              ) : file.type.startsWith('video/') ? (
                <FaFileVideo className="text-purple-600 text-3xl" />
              ) : null}
              <span className="truncate max-w-xs">{file.name}</span>
            </>
          ) : (
            <span>Click to select image or video file</span>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            aria-label="Upload media file"
          />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <FaUpload />
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && (
        <p className="mt-6 text-green-600 font-semibold text-center select-text">{message}</p>
      )}
      {error && (
        <p className="mt-6 text-red-600 font-semibold text-center select-text">{error}</p>
      )}
    </div>
  );
};

export default UploadGallery;
