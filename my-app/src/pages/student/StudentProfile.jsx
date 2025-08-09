import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaIdBadge, FaGraduationCap, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          STUDENT PROFILE
        </h2>
        
        <div className="space-y-5 text-gray-700 text-lg">
          <div className="flex items-center gap-3">
            <FaUser className="text-blue-600" />
            <span><strong>Name:</strong> {profile.username || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaIdBadge className="text-green-600" />
            <span><strong>Roll Number:</strong> {profile.rollNumber || 'N/A'}</span>
          </div>

          {profile.email && (
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-pink-600" />
              <span><strong>Email:</strong> {profile.email}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaGraduationCap className="text-yellow-600" />
            <span><strong>Role:</strong> {profile.role}</span>
          </div>

          <div className="flex items-center gap-3">
            {profile.isMember ? (
              <>
                <FaCheckCircle className="text-green-500" />
                <span><strong>Membership:</strong> ✅ Member</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500" />
                <span><strong>Membership:</strong> ❌ Not a Member</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
