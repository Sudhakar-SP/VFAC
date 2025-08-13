import React from 'react';
import 'tailwindcss/tailwind.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import ForgotPassword from './pages/ForgotPassword';

// Admin pages
import Dashboard from './pages/AdminDashboard';
import Events from './pages/Events';
import PostEvent from './pages/PostEvent';
import AdminAppliedStudents from './pages/AdminAppliedStudents';
import EventList from './pages/EventList';
import MusicClass from './pages/MusicClass';
import ListUsers from './pages/ListUsers';
import AddMusicStudent from './pages/musicclass/AddOrEditStudent';
import ListMusicStudents from './pages/musicclass/MusicStudentList';
import MarkAttendance from './pages/musicclass/MarkAttendance';
import ViewAttendance from './pages/musicclass/AttendanceList';
import ApproveMembers from './pages/ApproveMembers';
import MemberList from './pages/MemberList';
import UploadGallery from './pages/UploadGallery';
import GalleryView from './pages/GalleryView';

// Student pages
import StudentDashboard from './pages/StudentDashboard';
import StudentEvents from './pages/student/StudentEvents';
import StudentApplyStatus from './pages/student/StudentApplyStatus';
import StudentSelectedList from './pages/student/StudentSelectedList';
import StudentProfile from './pages/student/StudentProfile';

// Staff pages
import InternalStaffDashboard from './pages/staff/InternalStaffDashboard';
import InternalStaffEventList from './pages/staff/InternalStaffEventList';
import SelectedStudentsList from './pages/staff/SelectedStudentsList';
import InternalStaffMusicStudents from './pages/staff/MusicStudentList';
import InternalStaffMembers from './pages/staff/MemberList';
import ExternalStaffDashboard from './pages/staff/ExternalStaffDashboard';
import ExternalStaffEventlist from './pages/staff/ExternalStaffEventList';

// Layouts
import PublicLayout from './Components/PublicLayout';
import AdminLayout from './Components/AdminLayout';
import StudentLayout from './Components/StudentLayout';
import StaffLayout from './Components/StaffLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/events/post" element={<PostEvent />} />
          <Route path="/admin/events/list" element={<EventList />} />
          <Route path="/admin/events/applied/:eventId" element={<AdminAppliedStudents />} />
          <Route path="/admin/music-class" element={<MusicClass />} />
          <Route path="/admin/music-class/add" element={<AddMusicStudent />} />
          <Route path="/admin/music-class/list" element={<ListMusicStudents />} />
          <Route path="/admin/music-class/attendance" element={<MarkAttendance />} />
          <Route path="/admin/music-class/view-attendance" element={<ViewAttendance />} />
          <Route path="/admin/gallery/upload" element={<UploadGallery />} />
          <Route path="/admin/gallery/view" element={<GalleryView />} />
          <Route path="/admin/users" element={<ListUsers />} />
          <Route path="/admin/members/approve" element={<ApproveMembers />} />
          <Route path="/admin/members/list" element={<MemberList />} />
        </Route>

        {/* Student Layout */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/events/status" element={<StudentApplyStatus />} />
          <Route path="/student/events/selected" element={<StudentSelectedList />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* Staff Layout */}
        <Route element={<StaffLayout />}>
          {/* Internal Staff */}
          <Route path="/internal-staff/dashboard" element={<InternalStaffDashboard />} />
          <Route path="/internal-staff/events" element={<InternalStaffEventList />} />
          <Route path="/internal-staff/events/selected/:eventId" element={<SelectedStudentsList />} />
          <Route path="/internal-staff/music-students" element={<InternalStaffMusicStudents />} />
          <Route path="/internal-staff/members" element={<InternalStaffMembers />} />

          {/* External Staff */}
          <Route path="/external-staff/dashboard" element={<ExternalStaffDashboard />} />
          <Route path="/external-staff/events" element={<ExternalStaffEventlist />} />
          <Route path="/external-staff/events/selected/:eventId" element={<SelectedStudentsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
