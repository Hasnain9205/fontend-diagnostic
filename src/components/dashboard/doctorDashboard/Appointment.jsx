import { useEffect, useState } from "react";
import { MdCancel, MdCheckCircle } from "react-icons/md"; // Import icons
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import Swal from "sweetalert2";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointmentData = async () => {
    try {
      const token = getAccessToken();
      const docId = localStorage.getItem("userId");

      const response = await axiosInstance.get("/doctor/appointment-doctor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { docId },
      });
      console.log(response.data.appointment);
      setAppointments(response.data.appointment || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error fetching appointments",
        text: error.response?.data?.message || "Unable to load appointments.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const docId = localStorage.getItem("userId");

      console.log("Doctor ID from localStorage: ", docId);

      const response = await axiosInstance.patch(
        "/doctor/cancel-appointment",
        { appointmentId, docId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Appointment Cancelled",
        text: response.data.msg,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      console.log("Error during appointment confirmation:", error);
      Swal.fire({
        icon: "error",
        title: "Error Canceling Appointment",
        text: error.response?.data?.msg || "Something went wrong!",
      });
    }
  };

  //confirmed appointment
  const confirmedAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const docId = localStorage.getItem("userId");

      console.log("Doctor ID from localStorage: ", docId);

      const response = await axiosInstance.patch(
        "/doctor/complete-appointment",
        { appointmentId, docId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Appointment Confirmed",
        text: response.data.msg,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      console.log("Error during appointment confirmation:", error);
      Swal.fire({
        icon: "error",
        title: "Error Confirming Appointment",
        text: error.response?.data?.msg || "Something went wrong!",
      });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold  text-center">
        Doctors Appointment
      </h2>
      <h1 className="text-blue-700 font-bold text-xl">
        Total Patients: {appointments.length}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#47ccc8]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Slot Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Slot Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr
                  key={appointment._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.userData?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.docData?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {appointment.slotTime || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-base">
                    <span
                      className={`px-2 py-1 rounded-full text-base font-semibold ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {appointment.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex space-x-2">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="flex items-center px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700"
                      >
                        <MdCancel className="mr-2" /> Cancel
                      </button>
                    )}
                    {appointment.status === "booked" && (
                      <button
                        onClick={() => confirmedAppointment(appointment._id)}
                        className="flex items-center px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-700"
                      >
                        <MdCheckCircle className="mr-2" /> Confirm
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

export default Appointment;
