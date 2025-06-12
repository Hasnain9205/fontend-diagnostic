import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../../Utils";
import { MdDelete, MdSystemUpdateAlt } from "react-icons/md";
import useAxios from "../../../Hook/useAxios";
import { AuthContext } from "../../provider/AuthProvider";

export default function GetDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const centerId = user.centerId;
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log("ceid", centerId);

  // Fetch tests function
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const response = await useAxios.get(
        `/diagnostic/getDoctorByCenter/${centerId}/doctors`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDoctors(response.data.doctors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch tests!",
      });
    }
  };

  console.log("d", doctors);
  // Delete doctor
  const handleDelete = async (doctorId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getAccessToken();
          await axiosInstance.delete(`/admin/delete-doctor/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctors((prevDoctors) =>
            prevDoctors.filter((doctor) => doctor._id !== doctorId)
          );
          Swal.fire("Deleted!", "The doctor has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting doctor:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete the doctor.",
          });
        }
      }
    });
  };

  // Enable edit mode
  const handleEdit = (doctor) => {
    setCurrentDoctor({ ...doctor, slotDate: "", slotTime: "" });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const {
        name,
        email,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
        slotDate,
        slotTime,
      } = currentDoctor;

      const existingDoctor = doctors.find(
        (doc) => doc._id === currentDoctor._id
      );
      const updatedSlots = [
        ...(existingDoctor.bookedSlots || []),
        { slotDate, slotTime },
      ];

      const updatedDoctor = {
        name,
        email,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
        bookedSlots: updatedSlots,
      };

      const token = getAccessToken();
      const response = await axiosInstance.put(
        `/admin/update-doctor/${currentDoctor._id}`,
        updatedDoctor,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === currentDoctor._id ? response.data.doctor : doctor
        )
      );

      Swal.fire("Updated!", "The doctor has been updated.", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating doctor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the doctor.",
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!Array.isArray(doctors) || doctors.length === 0) {
    return (
      <div className="text-center text-gray-500">No doctors available.</div>
    );
  }

  return (
    <div>
      <div className="container mx-auto mt-4">
        <h2 className="lg:text-2xl text-xl font-bold text-center mb-4">
          All Doctors
        </h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2  hidden sm:table-cell">#</th>
              <th className="border px-2 py-2 hidden sm:table-cell">Image</th>
              <th className="border px-2 py-2">Name</th>
              <th className="border px-2 py-2 ">Speciality</th>
              <th className="border px-2 py-2  hidden sm:table-cell">Email</th>
              <th className="border px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="border px-2 py-2 text-center hidden sm:table-cell">
                  {index + 1}
                </td>
                <td className="border px-2 py-2 hidden sm:table-cell">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt="Doctor"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td className="border px-2 py-2">{doctor.name}</td>
                <td className="border px-2 py-2">{doctor.speciality}</td>
                <td className="border px-2 py-2 hidden sm:table-cell">
                  {doctor.email}
                </td>
                <td className="border text-center">
                  <button
                    className="text-red-500 text-2xl p-2 hover:text-black"
                    onClick={() => handleDelete(doctor._id)}
                  >
                    <MdDelete />
                  </button>

                  <button
                    className="hover:text-green-500 p-2 text-2xl"
                    onClick={() => handleEdit(doctor)}
                  >
                    <MdSystemUpdateAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Update Doctor</h3>
              <form onSubmit={handleUpdate}>
                {[
                  "name",
                  "speciality",
                  "email",
                  "degree",
                  "experience",
                  "about",
                  "fees",
                  "address",
                  "slotDate",
                  "slotTime",
                ].map((field, index) => (
                  <div className="mb-4" key={index}>
                    <label className="block text-sm font-medium">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={
                        field.includes("Date")
                          ? "date"
                          : field.includes("Time")
                          ? "time"
                          : "text"
                      }
                      value={currentDoctor[field] || ""}
                      onChange={(e) =>
                        setCurrentDoctor({
                          ...currentDoctor,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn px-12 py-2 mr-2 text-white bg-[#47ccc8] rounded-lg shadow-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
