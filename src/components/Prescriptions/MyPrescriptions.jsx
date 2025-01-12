import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrescriptions = async () => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.get(
        "/prescriptions/get-user-prescription",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.prescriptions) {
        setPrescriptions(response.data.prescriptions);
      } else {
        setError("No prescriptions found.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={fetchPrescriptions}
        >
          Retry
        </button>
      </div>
    );

  if (prescriptions.length === 0)
    return (
      <p className="text-center text-gray-500">
        No prescriptions found. Please check back later.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        My Prescriptions
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-gray-600">Image</th>
              <th className="py-3 px-6 text-left text-gray-600">Doctor</th>
              <th className="py-3 px-6 text-left text-gray-600">
                Prescription Date
              </th>
              <th className="py-3 px-6 text-left text-gray-600">Symptoms</th>
              <th className="py-3 px-6 text-left text-gray-600">
                View Prescription
              </th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription._id} className="border-t border-gray-200">
                <td className="py-4 px-6">
                  {prescription.docId?.profileImage ? (
                    <img
                      src={prescription.docId.profileImage}
                      alt={prescription.docId.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="py-4 px-6">{prescription.docId?.name}</td>
                <td className="py-4 px-6">
                  {format(new Date(prescription.date), "dd/MM/yyyy")}
                </td>
                <td className="py-4 px-6">
                  {prescription.symptoms?.join(", ")}
                </td>
                <td className="py-4 px-6">
                  <Link
                    to={`/prescriptionDetails/${prescription._id}`}
                    className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View Prescription
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPrescriptions;
