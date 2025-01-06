import { useEffect, useState } from "react";
import axios from "../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../Utils";
import { useNavigate } from "react-router-dom";

export default function AllDiagnostic() {
  const navigate = useNavigate();
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users/all-diagnostic");
      if (res.data.success) {
        setDiagnostics(res.data.diagnostic);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch diagnostics. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleDetails = (id) => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login", { state: { form: `/diagnostic/${id}` } });
    } else {
      navigate(`/diagnostic/${id}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        <p className="text-gray-600 text-lg ml-4">Loading diagnostics...</p>
      </div>
    );

  return (
    <div className="bg-gray-100 p-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Diagnostic Centers
        </h1>

        {diagnostics.length === 0 ? (
          <p className="text-center text-gray-500">
            No diagnostic centers found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagnostics.map((diag) => (
              <div
                key={diag._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={diag.profileImage || "default-image.jpg"}
                  alt={diag.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-bold text-blue-600">{diag.name}</h2>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">District:</span>{" "}
                  {diag.district}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Upazila:</span> {diag.upazila}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Services:</span>{" "}
                  {diag.services?.join(", ") || "Not specified"}
                </p>
                <button
                  onClick={() => handleDetails(diag._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
