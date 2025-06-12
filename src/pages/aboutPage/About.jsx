export default function About() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          About Us
        </h1>

        <p className="text-gray-700 mb-4">
          Welcome to{" "}
          <span className="font-semibold">Medicare management system</span>! We
          are dedicated to providing high-quality diagnostic and healthcare
          services with professionalism and care. Our mission is to make
          healthcare accessible, accurate, and patient-friendly through
          innovative solutions.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h2>
        <p className="text-gray-700 mb-4">
          To be a leading diagnostic service provider, bridging the gap between
          patients and quality healthcare through advanced technology and
          dedicated professionals.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          What We Offer
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Comprehensive diagnostic services for reliable results.</li>
          <li>24/7 CT scan facilities for critical needs.</li>
          <li>
            Consultations with experienced doctors across multiple specialties.
          </li>
          <li>Personalized care tailored to your health needs.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>State-of-the-art facilities with advanced diagnostic tools.</li>
          <li>Expert healthcare professionals and specialists.</li>
          <li>Convenient online booking and secure data handling.</li>
          <li>Patient-centric approach for a seamless experience.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Get in Touch
        </h2>
        <p className="text-gray-700 mb-4">
          We’re here to assist you. Contact us to learn more or book an
          appointment:
        </p>
        <ul className="text-gray-700">
          <li>📞 Phone: +103994894</li>
          <li>📧 Email: Medicare@gamil.com</li>
          <li>📍 Address: Dhaka,Bangladesh</li>
        </ul>
      </div>
    </div>
  );
}
