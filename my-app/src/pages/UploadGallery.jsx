import { useState } from 'react';
import axios from 'axios';

const UploadGallery = () => {
  const [file, setFile] = useState(null);
  const [mediaName, setMediaName] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !mediaName) return setMessage("Please provide a file and a name");

    const formData = new FormData();
    console.log('Uploading file:', file);
    console.log('Media name:', mediaName);

    formData.append('file', file);
    formData.append('name', mediaName); // ✅ Send name
    console.log('Form data:', formData);
    try {
      const res = await axios.post('http://localhost:5000/api/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res?.data?.message || 'Upload successful!');
      setFile(null);
      setMediaName('');
    } catch (err) {
      console.error(err);
      setMessage('Upload failed!');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload to Gallery</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Enter media name"
          value={mediaName}
          onChange={(e) => setMediaName(e.target.value)}
          className="block w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*,video/*"
          className="block"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default UploadGallery;
