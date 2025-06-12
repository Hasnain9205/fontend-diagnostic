import { useContext, useEffect, useState } from "react";
import { getAccessToken } from "../../../../Utils";
import axiosInstance from "../../../Hook/useAxios";
import { AuthContext } from "../../provider/AuthProvider";
import Swal from "sweetalert2"; // Import SweetAlert2

const TestAppointmentForDiagnostic = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const centerId = user.centerId; // Destructure centerId from URL params
  console.log("id", centerId);

  // Fetch appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get(
          `/diagnostic/test-appointments/${centerId}`, // Use centerId here
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("data", response.data.testAppointments);
        setAppointments(response.data.testAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching test appointments", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [centerId]); // Ensure to re-fetch if centerId changes

  const completedAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        `/tests/completed-test/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Use SweetAlert2 for success notification
      Swal.fire({
        icon: "success",
        title: "Appointment Marked as Completed",
        text: response.data.message,
      });
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, status: "completed" } : app
        )
      );
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Mark Appointment as Completed",
        text: "Something went wrong, please try again.",
      });
    }
  };

  // Cancel appointment function
  const cancelAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        `/tests/cancel/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "warning",
        title: "Appointment Cancelled",
        text: response.data.message,
      });
      // Refresh the appointments list
      setAppointments((prevAppointments) =>
        prevAppointments.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      console.error("Error cancelling appointment", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Cancel Appointment",
        text: "Something went wrong, please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-2 bg-white rounded-lg shadow-xl mt-6">
      <h2 className="lg:text-3xl text-xl font-semibold text-center text-gray-800 mb-8">
        Test Appointments
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-50 shadow-md rounded-lg">
          <table className="min-w-full bg-white border-separate border border-gray-200 rounded-lg">
            <thead className="bg-[#47ccc8] text-black">
              <tr>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black  hidden sm:table-cell">
                  Image
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black  hidden sm:table-cell">
                  Patient Name
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black  hidden sm:table-cell">
                  Phone
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black">
                  Test Name
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black  hidden sm:table-cell">
                  Test Category
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black">
                  Test Date
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black  hidden sm:table-cell">
                  Test Time
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black  hidden sm:table-cell">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-sm font-semibold text-black">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-4 text-sm text-gray-800  hidden sm:table-cell">
                    {appointment?.userId.profileImage ? (
                      <img
                        src={appointment?.userId.profileImage}
                        alt="Patient"
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-800  hidden sm:table-cell">
                    {appointment?.userId.name}
                  </td>

                  <td className="px-2 py-4 text-sm text-gray-800  hidden sm:table-cell">
                    {appointment?.userId.phone}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-800">
                    {appointment?.testId.name}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-800  hidden sm:table-cell">
                    {appointment.testId.category}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-800">
                    {appointment.appointmentDate}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-800  hidden sm:table-cell">
                    {appointment.appointmentTime}
                  </td>
                  <td className="px-2 py-4 text-sm  hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-sm">
                    {(appointment.status === "pending" && (
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    )) ||
                      (appointment.paymentStatus === "paid" &&
                        appointment.status !== "completed" && (
                          <button
                            onClick={() =>
                              completedAppointment(appointment._id)
                            }
                            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-700 transition-colors duration-300"
                            disabled={appointment.status === "completed"}
                          >
                            Completed
                          </button>
                        ))}
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

export default TestAppointmentForDiagnostic;
