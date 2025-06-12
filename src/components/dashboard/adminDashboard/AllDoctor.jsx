import { useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../../Utils";
import { MdDelete, MdSystemUpdateAlt } from "react-icons/md";

export default function AllDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.get("/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data.doctors || []);
    } catch (error) {
      Swal.fire("Error", "Failed to load doctor data.", "error");
    } finally {
      setLoading(false);
    }
  };

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
          Swal.fire("Error", "Failed to delete the doctor.", "error");
        }
      }
    });
  };

  const handleEdit = (doctor) => {
    setCurrentDoctor({ ...doctor, slotDate: "", slotTime: "" });
    setIsEditing(true);
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 px-2">
      <h2 className="text-2xl font-bold text-center mb-4">All Doctors</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2 hidden sm:table-cell">
                Speciality
              </th>
              <th className="border px-3 py-2 hidden sm:table-cell">Email</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor._id} className="hover:bg-gray-50 text-center">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt="Doctor"
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border px-3 py-2">{doctor.name}</td>
                <td className="border px-3 py-2 hidden sm:table-cell">
                  {doctor.speciality}
                </td>
                <td className="border px-3 py-2 hidden sm:table-cell">
                  {doctor.email}
                </td>
                <td className="border px-3 py-2">
                  <button
                    className="text-red-500 hover:text-red-700 text-xl mx-1"
                    onClick={() => handleDelete(doctor._id)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700 text-xl mx-1"
                    onClick={() => handleEdit(doctor)}
                  >
                    <MdSystemUpdateAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <h3 className="text-xl font-bold mb-4">Update Doctor</h3>
            <form>
              {["name", "speciality", "email", "degree", "experience"].map(
                (field) => (
                  <div className="mb-3" key={field}>
                    <label className="block text-sm font-medium">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={currentDoctor[field] || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      onChange={(e) =>
                        setCurrentDoctor({
                          ...currentDoctor,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                )
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                  onClick={() => setIsEditing(false)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
