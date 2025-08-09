// src/components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginOpen, setLoginOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNav = (id) => {
    setLoginOpen(false);
    setGalleryOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  const handleLoginRedirect = (role) => {
    navigate(`/login?role=${role}`);
    setLoginOpen(false);
  };

  const handleGalleryRedirect = (type) => {
    navigate(`/gallery?type=${type}`);
    setGalleryOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#203a43] text-white shadow-lg px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-4xl font-extrabold tracking-wider text-yellow-400">
        VFAC<span className="text-white">.COM</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-8 items-center text-lg font-medium relative">
        <button onClick={() => handleNav('home')} className="hover:text-yellow-400 transition">Home</button>
        <button onClick={() => handleNav('about')} className="hover:text-yellow-400 transition">About</button>
        <button onClick={() => handleNav('contact')} className="hover:text-yellow-400 transition">Contact</button>

        {/* Gallery Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setGalleryOpen(!galleryOpen);
              setLoginOpen(false);
            }}
            className="hover:text-yellow-400 flex items-center gap-1"
          >
            Gallery <span className="text-sm">▼</span>
          </button>
          {galleryOpen && (
            <div className="absolute top-12 right-0 bg-white bg-opacity-95 backdrop-blur-md text-black rounded-lg shadow-xl w-44">
              <div
                onClick={() => handleGalleryRedirect('photo')}
                className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
              >
                📸 Photo
              </div>
              <div
                onClick={() => handleGalleryRedirect('video')}
                className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
              >
                🎥 Video
              </div>
            </div>
          )}
        </div>

        {/* Login Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setLoginOpen(!loginOpen);
              setGalleryOpen(false);
            }}
            className="hover:text-yellow-400 flex items-center gap-1"
          >
            Login <span className="text-sm">▼</span>
          </button>
          {loginOpen && (
            <div className="absolute top-12 right-0 bg-white bg-opacity-95 backdrop-blur-md text-black rounded-lg shadow-xl w-64">
              <div
                onClick={() => handleLoginRedirect('admin')}
                className="px-6 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
              >
                🛡️ Admin
              </div>
              <div
                onClick={() => handleLoginRedirect('student')}
                className="px-6 py-3 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
              >
                🎓 Student
              </div>

              <div className="px-6 py-2 font-semibold bg-gray-50 border-t text-gray-700 text-base">Staff</div>
              <div
                onClick={() => handleLoginRedirect('internal-staff')}
                className="px-8 py-2 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
              >
                🏫 Internal Staff
              </div>
              <div
                onClick={() => handleLoginRedirect('external-staff')}
                className="px-8 py-2 hover:bg-gray-100 cursor-pointer text-base flex items-center gap-2"
              >
                🌐 External Staff
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
