import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import InternalStaffNavbar from '../Components/staff/InternalStaffnavbar';
import ExternalStaffNavbar from '../Components/staff/ExternalStaffnavbar';

export default function StaffLayout() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Determine which navbar to show based on URL path
  const isInternal = path.includes('/internal');

  return (
    <div>
      {isInternal ? <InternalStaffNavbar /> : <ExternalStaffNavbar />}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}
