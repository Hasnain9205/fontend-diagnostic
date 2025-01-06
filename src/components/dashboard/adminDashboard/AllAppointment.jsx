import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { AuthContext } from "../../provider/AuthProvider";
import Swal from "sweetalert2";

const AllAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const centerId = user.centerId;

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const token = getAccessToken();
      try {
        const response = await axiosInstance.get(
          `/admin/all-appointment/${centerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch appointments. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [centerId]);

  const cancelAppointment = async (appointmentId) => {
    const token = getAccessToken();
    try {
      await axiosInstance.post(
        "/admin/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Cancelled!", "The appointment has been cancelled.", "success");
      setAppointments((prev) =>
        prev.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      console.error("Error cancelling appointment", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to cancel appointment. Please try again.",
      });
    }
  };

  const getStatusClass = (status) => {
    if (status === "completed") return "bg-green-100 text-green-500";
    if (status === "pending") return "bg-yellow-100 text-yellow-500";
    return "bg-red-100 text-red-500";
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
      ) : appointments?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-[#47ccc8] text-black">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Phone
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
              {appointments?.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <img
                      src={appointment?.userId.profileImage || "/default.jpg"}
                      alt="Patient"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.userId.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.userId.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.docData.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(appointment.slotDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotTime}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        appointment.status
                      )}`}
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
