import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileSection = () => {
  const [student, setStudent] = useState(null);
  const studentId = 'PUT_STUDENT_ID_HERE';

  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${studentId}`)
      .then(res => setStudent(res.data))
      .catch(() => console.error('Profile fetch error'));
  }, []);

  if (!student) return <div>Loading profile...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Student Profile</h2>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Course:</strong> {student.course}</p>
      <p><strong>ID:</strong> {student._id}</p>
    </div>
  );
};

export default ProfileSection;
