import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get("/users/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.appointments) {
          setAppointments(response.data.appointments);
        } else {
          setError("No appointments found.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const totalAmount = appointments.reduce(
    (total, appointment) =>
      appointment.status === "pending" ? total + appointment.amount : total,
    0
  );

  const handlePayTotal = () => {
    const unpaidAppointments = appointments.filter(
      (appointment) => appointment.status === "pending"
    );

    navigate("/payment", { state: { totalAmount, unpaidAppointments } });
  };

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.delete(
          `/users/appointments/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
        Swal.fire({
          icon: "success",
          title: "Appointment Cancelled",
          text: response.data.message,
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to cancel appointment."
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to cancel appointment.",
        });
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (appointments.length === 0)
    return (
      <p className="text-center text-gray-500">
        No appointments found. Book your first appointment!
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        My Doctor Appointments
      </h2>

      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-bold">Total Amount: ${totalAmount}</p>
        <button
          onClick={handlePayTotal}
          className={`px-6 py-2 rounded-lg ${
            totalAmount > 0
              ? "bg-blue-600 text-white hover:bg-blue-700 transition"
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
              <th className="py-3 px-6 text-left text-gray-600">Doctor</th>
              <th className="py-3 px-6 text-left text-gray-600">Specialty</th>
              <th className="py-3 px-6 text-left text-gray-600">Slot Date</th>
              <th className="py-3 px-6 text-left text-gray-600">Slot Time</th>
              <th className="py-3 px-6 text-left text-gray-600">Fees</th>
              <th className="py-3 px-6 text-left text-gray-600">
                Payment Status
              </th>
              <th className="py-3 px-6 text-center text-gray-600">
                Cancelled Appointment
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="border-t border-gray-200">
                <td className="py-4 px-6">{appointment.docData.name}</td>
                <td className="py-4 px-6">{appointment.docData.specialty}</td>
                <td className="py-4 px-6">{appointment.slotDate}</td>
                <td className="py-4 px-6">{appointment.slotTime}</td>
                <td className="py-4 px-6">${appointment.amount}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      appointment.paymentStatus === "Unpaid"
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  {appointment.status === "pending" ? (
                    <button
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      onClick={() => cancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Cancel
                    </button>
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

export default MyAppointments;
