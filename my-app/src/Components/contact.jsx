// pages/Contact.jsx
export default function Contact() {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row items-start justify-center p-8 gap-12">

      {/* Left side – Contact Form */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Get in Touch</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              placeholder="Your message..."
              rows="5"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Right side – Contact Info */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Details</h2>
        <p className="mb-2">📍 Viveka Fine Arts Club,</p>
        <p className="mb-2">XYZ College Campus, Tamil Nadu</p>
        <p className="mb-2">📞 +91 98765 43210</p>
        <p className="mb-2">📧 vfac@example.com</p>
        <p className="mt-4 text-sm text-gray-500">We’ll get back to you within 24 hours.</p>
      </div>
    </div>
  );
}
