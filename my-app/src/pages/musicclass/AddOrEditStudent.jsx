import { useState } from 'react';
import axios from 'axios';

export default function AddOrEditStudent() {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/music-students/add',
        { rollNumber, name },
        {
          withCredentials: true, // Include this if backend uses cookies
        }
      );

      setSuccessMsg('✅ Student added successfully!');
      setRollNumber('');
      setName('');
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(`❌ ${error.response.data.message}`);
      } else {
        setErrorMsg('❌ Failed to add student.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🎵 Add Music Student</h2>

      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Roll Number</label>
          <input
            type="text"
            placeholder="e.g., UG21096"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Student Name</label>
          <input
            type="text"
            placeholder="e.g., Priya Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}
