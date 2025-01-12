import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

export default function NotFound() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      {user.role === "user" ? (
        <Link to="/" className="mt-8 px-4 py-2 bg-blue-500 text-white rounded">
          Go Back to Home
        </Link>
      ) : (
        <Link
          to="/dashboard"
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back to Home
        </Link>
      )}
    </div>
  );
}
