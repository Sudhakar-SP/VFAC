import { useState } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaSignature, FaPlusCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
        { withCredentials: true }
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
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg font-sans">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 select-none flex items-center justify-center gap-3">
        <FaUserGraduate className="text-yellow-500 animate-pulse" /> Add Music Student
      </h2>

      {errorMsg && (
        <p className="mb-6 flex items-center gap-2 bg-red-100 text-red-700 px-4 py-3 rounded shadow">
          <FaTimesCircle className="text-xl" /> {errorMsg}
        </p>
      )}
      {successMsg && (
        <p className="mb-6 flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded shadow">
          <FaCheckCircle className="text-xl" /> {successMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label
            htmlFor="rollNumber"
            className="block text-sm font-semibold mb-2 text-gray-700"
          >
            Roll Number
          </label>
          <div className="relative">
            <FaSignature className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <input
              id="rollNumber"
              type="text"
              placeholder="e.g., UG21096"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              className="border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 rounded-md pl-10 pr-4 py-3 w-full transition duration-200 outline-none shadow-sm"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="name"
            className="block text-sm font-semibold mb-2 text-gray-700"
          >
            Student Name
          </label>
          <div className="relative">
            <FaUserGraduate className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
            <input
              id="name"
              type="text"
              placeholder="e.g., Priya Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 rounded-md pl-10 pr-4 py-3 w-full transition duration-200 outline-none shadow-sm"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 text-gray-900 font-semibold rounded-md py-3 shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <FaPlusCircle className="text-lg" /> Add Student
            </>
          )}
        </button>
      </form>
    </div>
  );
}
