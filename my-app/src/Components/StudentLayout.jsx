import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/studentNavbar'; // Adjust path if needed

const StudentLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
