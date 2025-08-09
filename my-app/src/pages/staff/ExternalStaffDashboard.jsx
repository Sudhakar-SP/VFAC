import React from 'react';

export default function ExternalStaffDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">External Staff Dashboard</h1>
      <p>Welcome! This is the external staff dashboard.</p>

      {/* Example sections - customize as needed */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Manage External Tasks</h2>
        <ul className="list-disc list-inside">
          <li>Check upcoming events</li>
          <li>Upload activity summary</li>
          <li>Connect with internal coordinators</li>
        </ul>
      </div>
    </div>
  );
}
