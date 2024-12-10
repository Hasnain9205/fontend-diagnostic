import { useEffect, useState } from "react";
import { getAccessToken } from "../../../../Utils";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Hook/useAxios";

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error("Unauthorized: Token missing");
        }

        const docId = localStorage.getItem("userId");
        console.log("docid.........", docId);
        if (!docId) {
          throw new Error("Doctor ID is missing in localStorage.");
        }

        const response = await axiosInstance.get("/doctor/dashboard", {
          params: { docId },
          headers: { Authorization: `Bearer ${token}` }, // Add token to headers
        });

        setDashboardData(response.data.dashData);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data:",
          error.response?.data || error.message
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-700">
          No data available
        </h2>
      </div>
    );
  }

  const { earnings, appointments, patients, latestAppointments } =
    dashboardData;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center  mb-6">
          Doctor Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-blue-600">${earnings}</h2>
            <p className="text-gray-600">Total Earnings</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-green-600">
              {appointments}
            </h2>
            <p className="text-gray-600">Total Appointments</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-purple-600">{patients}</h2>
            <p className="text-gray-600">Unique Patients</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Latest Appointments
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">Patient</th>
                  <th className="px-4 py-2 border border-gray-300">Email</th>
                  <th className="px-4 py-2 border border-gray-300">Date</th>
                  <th className="px-4 py-2 border border-gray-300">Time</th>
                  <th className="px-4 py-2 border border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestAppointments?.map((appointment, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 text-center"
                  >
                    <td className="px-4 py-2 border border-gray-300">
                      {appointment.userData?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {appointment.userData?.email || "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {new Date(appointment.slotDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {appointment.slotTime}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      <span
                        className={`px-2 py-1 rounded-full text-lg font-semibold ${
                          appointment.status === "completed"
                            ? "text-green-500"
                            : appointment.status === "pending"
                            ? "text-yellow-500"
                            : appointment.status === "booked"
                            ? "text-blue-500"
                            : "text-red-500"
                        }`}
                      >
                        {appointment.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
