import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { FaUserDoctor } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data.dashData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Unable to fetch dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!dashboardData) {
    return <div className="text-center">No data available.</div>;
  }

  const barData = {
    labels: ["Doctors", "Patients", "Appointments", "Test Appointments"],
    datasets: [
      {
        label: "Count",
        data: [
          dashboardData.doctors || 0,
          dashboardData.patients || 0,
          dashboardData.appointments || 0,
          dashboardData.testAppointments || 0,
        ],
        backgroundColor: ["#47ccc8", "#6c63ff", "#ff6c63", "#63ff6c"],
      },
    ],
  };
  console.log("..", dashboardData);
  // Preprocess data for charts
  const statusCounts = dashboardData.doctorAppointments.reduce(
    (acc, { status }) => {
      if (status) {
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    },
    { completed: 0, booked: 0, pending: 0, cancelled: 0 } // Default counts
  );

  console.log("Status Counts: ", statusCounts); // Check the status count object

  const doughnutData = {
    labels: [
      "Completed Appointments",
      "Booked Appointments",
      "Pending Appointments",
      "Cancelled Appointments",
    ],
    datasets: [
      {
        data: [
          statusCounts["completed"],
          statusCounts["booked"],
          statusCounts["pending"],
          statusCounts["cancelled"],
        ],
        backgroundColor: ["#47ccc8", "green", "blue", "#ff6c63"],
      },
    ],
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">Admin Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaUserDoctor />}
          label="Doctors"
          count={dashboardData.doctors || 0}
        />
        <StatCard
          icon={<FaBook />}
          label="Patients"
          count={dashboardData.patients || 0}
        />
        <StatCard
          icon={<GrUserManager />}
          label="Appointments"
          count={dashboardData.appointments || 0}
        />
        <StatCard
          icon={<GrUserManager />}
          label="Test Appointments"
          count={dashboardData.testAppointments || 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Appointments Summary</h3>
          <Doughnut data={doughnutData} />
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Overview</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Latest Appointments */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Latest Appointments
        </h3>
        {dashboardData.latestAppointments.length > 0 ? (
          <div className="space-y-6">
            {dashboardData.latestAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent appointments</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, count }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg flex items-center gap-4">
      <div className="text-[#47ccc8] text-4xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition">
      <div className="flex items-center space-x-4">
        <img
          src={appointment.docId?.profileImage || "/placeholder.png"}
          alt={appointment.docId?.name || "Doctor"}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            {appointment.docId?.name || "Unknown Doctor"}
          </h4>
          <p className="text-sm text-gray-600">
            {appointment.docId?.specialty || "N/A"}
          </p>
          <p className="text-sm text-gray-600 font-medium">
            {appointment.docId?.fees || "N/A"} Taka
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{appointment.slotDate || "N/A"}</p>
        <p className="text-sm text-gray-600">{appointment.slotTime || "N/A"}</p>
      </div>
    </div>
  );
}
