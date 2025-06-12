import { useContext, useEffect, useState } from "react";
import { MdCancel, MdCheckCircle, MdLocalHospital } from "react-icons/md";
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";
import PrescriptionModel from "../../../components/dashboard/doctorDashboard/PrescriptionModal";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get("/doctor/appointment-doctor", {
          headers: { Authorization: `Bearer ${token}` },
          params: { docId: user._id },
        });
        console.log(response.data); // Add this to check the response
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

    fetchAppointments();
  }, [user._id]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.patch(
        "/doctor/cancel-appointment",
        { appointmentId, docId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", response.data.msg, "success");
      setAppointments((prev) =>
        prev.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Unable to cancel appointment.",
        "error"
      );
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.patch(
        "/doctor/complete-appointment",
        { appointmentId, docId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", response.data.msg, "success");
      setAppointments((prev) =>
        prev.filter((app) => app._id !== appointmentId)
      );
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Unable to confirm appointment.",
        "error"
      );
    }
  };

  const handleCreatePrescription = async (appointmentId, formData) => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        "/prescriptions/create",
        {
          ...formData,
          appointmentId,
          docId: user._id,
          centerId: selectedAppointment?.centerId,
          patientId: selectedAppointment?.patientId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", response.data.msg, "success");
      closeModal();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Unable to create prescription.",
        "error"
      );
    }
  };

  const handleOpenModal = (appointmentId, patientId, centerId) => {
    console.log("Opening modal for:", appointmentId, patientId, centerId); // Debugging log
    setSelectedAppointment({ appointmentId, patientId, centerId });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div>
      <h2 className="lg:text-3xl font-semibold lg:text-center">
        Doctors Appointment
      </h2>
      <h1 className="text-blue-700 mt-1 lg:font-bold lg:text-xl">
        Total Appointments: {appointments.length}
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border hidden sm:table-cell">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border hidden sm:table-cell">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border hidden sm:table-cell">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border ">
                  Slot Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border hidden sm:table-cell">
                  Slot Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border hidden sm:table-cell">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-600 border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app, idx) => (
                <tr
                  key={app._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-blue-100`}
                >
                  <td className="px-4 py-2 border hidden sm:table-cell">
                    {app.userId?.profileImage ? (
                      <img
                        src={app.userId.profileImage}
                        alt="Patient"
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2 border hidden sm:table-cell">
                    {app.userId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 border hidden sm:table-cell">
                    {app.docData?.name || "N/A"}
                  </td>
                  <td className="px-2 py-2 border">
                    {new Date(app.slotDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border hidden sm:table-cell">
                    {app.slotTime || "N/A"}
                  </td>
                  <td className="px-4 py-2 border hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-base font-semibold ${
                        app.status === "completed"
                          ? "bg-green-100 text-green-500"
                          : app.status === "booked"
                          ? "bg-yellow-800 text-yellow-300"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {app.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-2 py-2 border">
                    {app.status === "completed" && (
                      <button
                        onClick={() =>
                          handleOpenModal(
                            app._id,
                            app.userId._id,
                            app.centerId?._id
                          )
                        }
                        className="flex items-center px-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                      >
                        <MdLocalHospital className="mr-2" />
                        Prescription
                      </button>
                    )}
                    {app.status === "booked" && (
                      <button
                        onClick={() => handleConfirmAppointment(app._id)}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                      >
                        <MdCheckCircle className="mr-2" />
                        Confirm
                      </button>
                    )}
                    {app.status === "pending" && (
                      <button
                        onClick={() => handleCancelAppointment(app._id)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                      >
                        <MdCancel className="mr-2" />
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
      <PrescriptionModel
        showModal={showModal}
        closeModal={closeModal}
        handleCreatePrescription={handleCreatePrescription}
        appointmentId={selectedAppointment?.appointmentId}
        patientId={selectedAppointment?.patientId}
        centerId={selectedAppointment?.centerId}
      />
    </div>
  );
};

export default Appointment;
