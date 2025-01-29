import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2 for alerts
import { getAccessToken } from "../../../Utils";
import { format } from "date-fns"; // For formatting dates

export const MyTestAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch appointments on component load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get(
          "/tests/get-test-appointment",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.testAppointments) {
          setAppointments(response.data.testAppointments);
        } else {
          setError("No test appointments found.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(
          err.response?.data?.message || "Failed to fetch appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  console.log("ap...", appointments);

  // Calculate total amount for unpaid appointments
  const totalAmount = appointments.reduce(
    (sum, appointment) =>
      appointment.paymentStatus === "unpaid"
        ? sum + appointment.testId?.price
        : sum,
    0
  );

  // Handle payment for unpaid appointments
  const handlePayTotal = async () => {
    try {
      const unpaidAppointments = appointments.filter(
        (appointment) => appointment.paymentStatus === "unpaid"
      );

      // If no unpaid appointments, show a message
      if (unpaidAppointments.length === 0) {
        Swal.fire(
          "No Unpaid Appointments",
          "You have no unpaid appointments to pay for.",
          "info"
        );
        return;
      }

      // Proceed to payment page if there are unpaid appointments
      navigate("/testPayment", { state: { unpaidAppointments } });
    } catch (error) {
      console.error("Error during payment navigation:", error);
      Swal.fire(
        "Error",
        "An error occurred while processing your payment. Please try again later.",
        "error"
      );
    }
  };

  // Handle appointment cancellation
  const cancelAppointment = async (appointmentId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.post(
          `/tests/cancel/${appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          Swal.fire(
            "Cancelled!",
            "Your appointment has been cancelled.",
            "success"
          );
          setAppointments((prevAppointments) =>
            prevAppointments.filter(
              (appointment) => appointment._id !== appointmentId
            )
          );
        }
      } catch (err) {
        Swal.fire("Error", "Failed to cancel the appointment.", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (appointments.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No appointments found. Book your first test appointment!
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        My Test Appointments
      </h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-bold">Total Amount: ${totalAmount}</p>
        <button
          onClick={handlePayTotal}
          className={`px-6 py-2 rounded-lg ${
            totalAmount > 0
              ? "bg-[#47ccc8] font-bold hover:bg-blue-900 hover:text-white transition"
              : "bg-gray-400 text-gray-800 cursor-not-allowed"
          }`}
          disabled={totalAmount === 0}
        >
          Pay Total
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left text-gray-600">Test</th>
              <th className="py-3 px-6 text-left text-gray-600">Category</th>
              <th className="py-3 px-6 text-left text-gray-600">Date</th>
              <th className="py-3 px-6 text-left text-gray-600">Time</th>
              <th className="py-3 px-6 text-left text-gray-600">Price</th>
              <th className="py-3 px-6 text-left text-gray-600">Payment</th>
              <th className="py-3 px-6 text-center text-gray-600">Cancel</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment) => (
              <tr key={appointment._id} className="border-t border-gray-200">
                <td className="py-4 px-6">{appointment.testId?.name}</td>
                <td className="py-4 px-6">{appointment.testId?.category}</td>
                <td className="py-4 px-6">
                  {format(
                    new Date(appointment.appointmentDate),
                    "MMM dd, yyyy"
                  )}
                </td>
                <td className="py-4 px-6">{appointment?.appointmentTime}</td>
                <td className="py-4 px-6">${appointment.testId?.price}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      appointment.paymentStatus === "unpaid"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  {appointment.paymentStatus === "unpaid" ? (
                    <button
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                        disabled
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
