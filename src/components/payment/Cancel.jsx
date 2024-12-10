import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-semibold text-red-500">
          Payment Canceled
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          It looks like your payment didn't go through. If this was an error,
          please try again.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/appointments"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
