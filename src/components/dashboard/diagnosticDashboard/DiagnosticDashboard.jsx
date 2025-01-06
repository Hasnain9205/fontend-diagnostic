import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export const DiagnosticDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setupCharts = (data) => {
    // Total Revenue Chart
    const ctxRevenue = document
      .getElementById("revenueChart")
      ?.getContext("2d");
    if (ctxRevenue) {
      new Chart(ctxRevenue, {
        type: "bar",
        data: {
          labels: ["Revenue"],
          datasets: [
            {
              label: "Total Revenue",
              data: [data.totalRevenue],
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
      });
    }

    // Appointments Chart
    const ctxAppointments = document
      .getElementById("appointmentsChart")
      ?.getContext("2d");
    if (ctxAppointments) {
      new Chart(ctxAppointments, {
        type: "doughnut",
        data: {
          labels: ["Test Appointments", "Doctor Appointments"],
          datasets: [
            {
              label: "Appointments",
              data: [data.totalTestAppointments, data.totalDoctorAppointments],
              backgroundColor: [
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
            },
          ],
        },
      });
    }

    // Counts Chart
    const ctxCounts = document.getElementById("countsChart")?.getContext("2d");
    if (ctxCounts) {
      new Chart(ctxCounts, {
        type: "pie",
        data: {
          labels: ["Doctors", "Tests"],
          datasets: [
            {
              label: "Counts",
              data: [data.doctorCount, data.testCount],
              backgroundColor: [
                "rgba(153, 102, 255, 0.6)",
                "rgba(255, 159, 64, 0.6)",
              ],
            },
          ],
        },
      });
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const centerId = user?.centerId;
        const token = getAccessToken();
        if (!token || !centerId) {
          Swal.fire({
            title: "Unauthorized!",
            text: "Please login to access the dashboard.",
            icon: "warning",
            confirmButtonText: "Go to Login",
          });
          navigate("/login");
          return;
        }
        const response = await useAxios.get(
          `/diagnostic/dashboard/${centerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message || "Failed to load dashboard data.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, user]);

  useEffect(() => {
    if (dashboardData) {
      setupCharts(dashboardData);
    }
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-blue-500 animate-bounce">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-500">No Data Found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Diagnostic Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-blue-100 text-blue-700 rounded-lg shadow">
            <p className="text-lg font-semibold">Total Test Revenue</p>
            <h2 className="text-2xl font-bold">
              ${dashboardData.totalRevenue}
            </h2>
          </div>
          <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow">
            <p className="text-lg font-semibold">Doctors Count</p>
            <h2 className="text-2xl font-bold">{dashboardData.doctorCount}</h2>
          </div>
          <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg shadow">
            <p className="text-lg font-semibold">Tests Count</p>
            <h2 className="text-2xl font-bold">{dashboardData.testCount}</h2>
          </div>
          <div className="p-4 bg-purple-100 text-purple-700 rounded-lg shadow">
            <p className="text-lg font-semibold">Test Appointments</p>
            <h2 className="text-2xl font-bold">
              {dashboardData.totalTestAppointments}
            </h2>
          </div>
          <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
            <p className="text-lg font-semibold">Doctor Appointments</p>
            <h2 className="text-2xl font-bold">
              {dashboardData.totalDoctorAppointments}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <canvas id="revenueChart"></canvas>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <canvas id="appointmentsChart"></canvas>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4">
            <canvas id="countsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};
