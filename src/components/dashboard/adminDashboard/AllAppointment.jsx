import { useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all appointments
    const token = getAccessToken();
    axiosInstance
      .get("/admin/all-appointment", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAppointments(response.data.appointments);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments", error);
      });
  }, []);

  const cancelAppointment = async (appointmentId) => {
    const token = getAccessToken();
    await axiosInstance
      .post(
        "/admin/cancel-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        alert(response.data.message);
        // Refresh the appointments list
        setAppointments((prevAppointments) =>
          prevAppointments.filter((app) => app._id !== appointmentId)
        );
      })
      .catch((error) => {
        console.error("Error cancelling appointment", error);
      });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-semibold text-gray-800 text-center mb-8">
        Doctor Appointments
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-[#47ccc8] text-black">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Slot Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Slot Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.userData.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.docData.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotTime}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 transition-colors"
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
      )}
    </div>
  );
};

export default AllAppointment;
