import { useContext } from "react";
import { AuthContext } from "../../components/provider/AuthProvider";

export default function Contact() {
  const { user } = useContext(AuthContext);
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Contact Us
        </h1>

        <p className="text-gray-700 mb-4 text-center">
          We'd love to hear from you! If you have any questions, feedback, or
          need assistance, feel free to get in touch with us.
        </p>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Our Contact Details
            </h2>
            <ul className="text-gray-700">
              <li>📞 Phone: {user.phone}</li>
              <li>📧 Email: {user.email}</li>
              <li>📍 Address: {user.address}</li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  className="w-full p-2 border rounded-md"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
