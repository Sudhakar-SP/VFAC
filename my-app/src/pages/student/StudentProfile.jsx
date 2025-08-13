import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaEnvelope,
  FaIdBadge,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          withCredentials: true,
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-4 text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;

  const getInitials = (name) => {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
        
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg text-2xl font-bold text-indigo-600">
            {getInitials(profile.username)}
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-4">{profile.username || 'N/A'}</h2>
          <p className="text-indigo-100 text-sm">{profile.email || 'No email available'}</p>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-5 text-gray-700 text-lg">

          {/* Roll Number */}
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaIdBadge className="text-blue-600 text-xl" />
            </div>
            <span><strong>Roll Number:</strong> {profile.rollNumber || 'N/A'}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <FaEnvelope className="text-pink-600 text-xl" />
            </div>
            <span><strong>Email:</strong> {profile.email || 'N/A'}</span>
          </div>

          {/* Role */}
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaGraduationCap className="text-yellow-600 text-xl" />
            </div>
            <span><strong>Role:</strong> {profile.role || 'N/A'}</span>
          </div>

          {/* Membership */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${profile.isMember ? 'bg-green-100' : 'bg-red-100'}`}>
              {profile.isMember ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </div>
            <span>
              <strong>Membership:</strong>{' '}
              {profile.isMember ? '✅ Member' : '❌ Not a Member'}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
