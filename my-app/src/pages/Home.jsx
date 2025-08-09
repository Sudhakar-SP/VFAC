import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Contact from '../Components/contact';
import About from '../Components/about';
import './css/home.css'; // 👈 Import your custom styles

const images = [
  '/assets/1.jpg',
  '/assets/2.jpg',
  '/assets/3.jpg',
  '/assets/4.jpg',
  '/assets/5.jpg',
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* Carousel Section with margin-top */}
      <div id="home" className="home-wrapper mb-16">
        <div className="carousel-container">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`carousel-image ${index === current ? 'active' : ''}`}
            />
          ))}

          <div className="carousel-indicators">
            {images.map((_, i) => (
              <span
                key={i}
                className={`carousel-dot ${i === current ? 'active' : ''}`}
              ></span>
            ))}
          </div>
        </div>
      </div>



      <section id="about" className="scroll-mt-20 py-8 px-6 bg-gray-50">
        <About />
      </section>
                     

      <section id="contact" className="section bg-gray-100">
        <Contact />
      </section>

    </>
  );
}
