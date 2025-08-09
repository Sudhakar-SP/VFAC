import React, { useState, useEffect } from 'react';
import Navbar from '../Components/studentNavbar.jsx';
import EventSection from '../Components/student/EventSection.jsx';
import ProfileSection from '../Components/student/ProfileSection.jsx';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('event');
  const navigate = useNavigate();

  useEffect(() => {
    const loginMessage = localStorage.getItem('loginMessage');
    if (loginMessage) {
      alert(loginMessage);
      localStorage.removeItem('loginMessage');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="p-4">
        {activeTab === 'event' && <EventSection />}
        {activeTab === 'profile' && <ProfileSection />}
      </div>
    </div>
  );
};

export default StudentDashboard;
