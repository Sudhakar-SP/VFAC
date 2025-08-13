// src/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "../pages/css/navbar.css";
import { ReactTyped } from "react-typed"; // ✅ Correct default import
import {
  FaHome, FaInfoCircle, FaPhoneAlt, FaImages, FaSignInAlt,
  FaUserShield, FaUserGraduate, FaSchool, FaGlobe, FaBars, FaTimes
} from "react-icons/fa";
import { MdPhotoCamera, MdVideoLibrary } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginOpen, setLoginOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleNav = (id) => {
    setLoginOpen(false);
    setGalleryOpen(false);
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  const handleLoginRedirect = (role) => {
    navigate(`/login?role=${role}`);
    setLoginOpen(false);
    setMenuOpen(false);
  };

  const handleGalleryRedirect = (type) => {
    navigate(`/gallery?type=${type}`);
    setGalleryOpen(false);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#203a43] text-white shadow-lg border-b border-yellow-400/20 backdrop-blur-md">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 max-w-[1300px] mx-auto">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => handleNav("home")}
        >
          <FaImages className="text-yellow-400 text-2xl sm:text-3xl" />
          <span className="sm:hidden font-bold text-lg text-yellow-400">VFAC</span>
          <div className="hidden sm:block text-xl md:text-2xl font-extrabold text-yellow-400">
            <ReactTyped
              strings={['VFAC.COM', 'ARTS CLUB', 'VFAC.COM']}
              typeSpeed={100}
              backSpeed={50}
              backDelay={1500}
              loop
              className="text-yellow-400 drop-shadow-lg hidden sm:inline"
            />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-base lg:text-lg font-medium">
          <button onClick={() => handleNav("home")} className="hover:text-yellow-400 flex items-center gap-2">
            <FaHome /> Home
          </button>
          <button onClick={() => handleNav("about")} className="hover:text-yellow-400 flex items-center gap-2">
            <FaInfoCircle /> About
          </button>
          <button onClick={() => handleNav("contact")} className="hover:text-yellow-400 flex items-center gap-2">
            <FaPhoneAlt /> Contact
          </button>

          {/* Gallery Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setGalleryOpen(!galleryOpen); setLoginOpen(false); }}
              className="hover:text-yellow-400 flex items-center gap-2"
            >
              <FaImages /> Gallery <span className="text-xs">▼</span>
            </button>
            {galleryOpen && (
              <div className="absolute top-full mt-2 bg-white text-black rounded-lg shadow-lg w-48">
                <div
                  onClick={() => handleGalleryRedirect("photo")}
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <MdPhotoCamera className="text-blue-500" /> Photo
                </div>
                <div
                  onClick={() => handleGalleryRedirect("video")}
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <MdVideoLibrary className="text-red-500" /> Video
                </div>
              </div>
            )}
          </div>

          {/* Login Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setLoginOpen(!loginOpen); setGalleryOpen(false); }}
              className="hover:text-yellow-400 flex items-center gap-2"
            >
              <FaSignInAlt /> Login <span className="text-xs">▼</span>
            </button>
            {loginOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-64">
                <div
                  onClick={() => handleLoginRedirect("admin")}
                  className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaUserShield className="text-purple-500" /> Admin
                </div>
                <div
                  onClick={() => handleLoginRedirect("student")}
                  className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaUserGraduate className="text-green-500" /> Student
                </div>
                <div className="px-6 py-2 font-semibold bg-gray-50 border-t">Staff</div>
                <div
                  onClick={() => handleLoginRedirect("internal-staff")}
                  className="px-8 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaSchool className="text-indigo-500" /> Internal Staff
                </div>
                <div
                  onClick={() => handleLoginRedirect("external-staff")}
                  className="px-8 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <FaGlobe className="text-orange-500" /> External Staff
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-yellow-400 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#203a43] text-white flex flex-col items-start px-6 py-4 gap-3 border-t border-yellow-400/20">
          <button onClick={() => handleNav("home")} className="flex items-center gap-2">
            <FaHome /> Home
          </button>
          <button onClick={() => handleNav("about")} className="flex items-center gap-2">
            <FaInfoCircle /> About
          </button>
          <button onClick={() => handleNav("contact")} className="flex items-center gap-2">
            <FaPhoneAlt /> Contact
          </button>

          {/* Gallery */}
          <button onClick={() => setGalleryOpen(!galleryOpen)} className="flex items-center gap-2">
            <FaImages /> Gallery
          </button>
          {galleryOpen && (
            <div className="flex flex-col gap-2 pl-6">
              <button onClick={() => handleGalleryRedirect("photo")} className="flex items-center gap-2">
                <MdPhotoCamera /> Photo
              </button>
              <button onClick={() => handleGalleryRedirect("video")} className="flex items-center gap-2">
                <MdVideoLibrary /> Video
              </button>
            </div>
          )}

          {/* Login */}
          <button onClick={() => setLoginOpen(!loginOpen)} className="flex items-center gap-2">
            <FaSignInAlt /> Login
          </button>
          {loginOpen && (
            <div className="flex flex-col gap-2 pl-6">
              <button onClick={() => handleLoginRedirect("admin")} className="flex items-center gap-2">
                <FaUserShield /> Admin
              </button>
              <button onClick={() => handleLoginRedirect("student")} className="flex items-center gap-2">
                <FaUserGraduate /> Student
              </button>
              <div className="pl-2 font-semibold">Staff</div>
              <button onClick={() => handleLoginRedirect("internal-staff")} className="flex items-center gap-2 pl-4">
                <FaSchool /> Internal Staff
              </button>
              <button onClick={() => handleLoginRedirect("external-staff")} className="flex items-center gap-2 pl-4">
                <FaGlobe /> External Staff
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
