import React from 'react';

export default function ExternalStaffDashboard() {
  return (
    <div className="p-8 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 min-h-screen text-white font-sans">
      <div className="max-w-5xl mx-auto bg-white bg-opacity-10 rounded-xl shadow-lg p-8 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold mb-6 tracking-wide drop-shadow-md">
          External Staff Dashboard
        </h1>
        <p className="text-lg mb-10 text-gray-200">
          Welcome! This is the external staff dashboard where you can manage your tasks efficiently.
        </p>

        {/* Section Card */}
        <div className="bg-white bg-opacity-20 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
            Manage External Tasks
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-100 text-lg">
            <li>📅 Events Details</li>
            <li>🎼 Music Class</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
