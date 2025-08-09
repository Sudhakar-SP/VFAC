import '../pages/css/about.css';

// pages/About.jsx
export default function About() {
  return (
    <div id="about" className="about-section flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-12 bg-gray-100 min-h-screen text-center md:text-left max-w-[1200px] mx-auto">

      
      {/* Image Section */}
      <div className="w-full md:w-1/2">
        <img
          src="/images/vfac-about.jpg" // 🔁 Replace with your actual image
          alt="Viveka Fine Arts Club"
          className="w-full h-auto rounded-xl shadow-xl"
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl font-bold text-blue-700 mb-4">
          About Viveka Fine Arts Club
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          “Art is the desire of man to express himself, to record the reactions of his personality
          to the world he lives in”. Art gives us a chance to find our self according to our
          imagination and solitude. Art indulges our senses into building a connection with our
          creative mind and Mother Nature. Art makes us feel good! It was named as Viveka Fine Arts Club.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Viveka Fine Arts Club of our college provides an environment for the education, creation,
          performance and celebration of arts. It identifies the various hidden talents of our
          students and brings them out. It encourages and develops artistic capabilities in the fields
          of Music, Dance, Drama, Visual Arts and other cultural activities.
        </p>
      </div>
    </div>
  );
}
