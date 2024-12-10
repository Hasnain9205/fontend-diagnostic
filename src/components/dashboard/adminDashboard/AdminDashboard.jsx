import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { FaUserDoctor } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("object", response.data.dashData);
        setDashboardData(response.data.dashData);
        console.log(response.data.dashData.latestAppointments);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axiosInstance, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <FaUserDoctor className="w-10 h-10 text-[#47ccc8]" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardData.doctors}</p>
            <h3 className="text-lg font-semibold">Doctors</h3>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <FaBook className="w-10 h-10 text-[#47ccc8]" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardData.patients}</p>
            <h3 className="text-lg font-semibold">Patients</h3>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <GrUserManager className="w-10 h-10 text-[#47ccc8]" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardData.appointments}</p>
            <h3 className="text-lg font-semibold">Appointments</h3>
          </div>
        </div>
        <div className="p-4 bg-white shadow rounded-lg flex items-center justify-center gap-4">
          <div>
            <GrUserManager className="w-10 h-10 text-[#47ccc8]" />
          </div>
          <div>
            <p className="text-2xl font-bold">{dashboardData.appointments}</p>
            <h3 className="text-lg font-semibold">Test Appointment</h3>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white shadow-lg rounded-lg mt-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Latest Appointments
        </h3>
        {dashboardData.latestAppointments.length > 0 ? (
          <div className="space-y-6">
            {dashboardData.latestAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 shadow-md rounded-lg hover:shadow-xl transition duration-300 ease-in-out"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <img
                      src={appointment.docId?.profileImage}
                      alt={appointment.docId?.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      {appointment.docId?.name}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {appointment.docId?.specialty}
                    </p>
                    <p className="text-gray-600 font-medium">
                      {appointment.docId?.fees} Taka
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  <p className="text-sm text-gray-600">
                    {appointment.slotDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointment.slotTime}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      appointment.payment === "Paid"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {appointment.payment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent appointments</p>
        )}
      </div>
    </div>
  );
}
