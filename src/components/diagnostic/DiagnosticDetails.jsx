import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";

const DiagnosticDetails = () => {
  const { id } = useParams(); // Get the diagnostic ID from the route
  const navigate = useNavigate(); // Navigation for routing
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch diagnostic details from the backend
  const fetchDiagnostic = async () => {
    try {
      const token = getAccessToken(); // Retrieve token for authentication
      const res = await useAxios.get(`/admin/diagnostic-by-id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setDiagnostic(res.data.diagnostic); // Update state with diagnostic data
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.msg || "Failed to fetch diagnostic details",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "Something went wrong",
      });
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  // Call fetchDiagnostic on component mount
  useEffect(() => {
    fetchDiagnostic();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-blue-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!diagnostic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500 text-xl font-semibold">
          No diagnostic found
        </p>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-bold">{diagnostic.name}</h1>
      </div>
      <div className="max-w-3xl mx-auto  shadow-lg rounded-lg overflow-hidden mt-6">
        <img
          src={diagnostic.profileImage || "/default-profile.png"}
          alt={diagnostic.name}
          className="w-full h-72   mb-4"
        />

        <div className="p-6">
          <div className="flex justify-between px-16 ">
            <div>
              <p className="text-lg">
                <strong>Email:</strong> {diagnostic.email}
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> {diagnostic.phone}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <strong>District:</strong> {diagnostic.district}
              </p>
              <p className="text-lg">
                <strong>Upazila:</strong> {diagnostic.upazila}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() =>
                navigate(`/diagnostic/${id}/doctors`, {
                  state: diagnostic.doctors,
                })
              }
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              View Doctors
            </button>
            <button
              onClick={() =>
                navigate(`/diagnostic/${id}/tests`, {
                  state: diagnostic.tests,
                })
              }
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              View Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticDetails;
