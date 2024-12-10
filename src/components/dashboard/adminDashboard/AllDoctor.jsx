import { useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../../Utils";
import { ClipLoader } from "react-spinners";

export default function AllDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const token = getAccessToken();
      const response = await axiosInstance.get("/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load doctor data.",
      });
    } finally {
      setLoading(false);
    }
  };

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
    setCurrentDoctor({
      ...doctor,
      slotDate: "",
      slotTime: "",
    });
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

      // Fetch existing slots and append the new one
      const existingDoctor = doctors.find(
        (doc) => doc._id === currentDoctor._id
      );

      // Ensure existingDoctor.bookedSlots is an array (not null or undefined)
      const updatedSlots = [
        ...(existingDoctor.bookedSlots || []), // Defaults to an empty array if bookedSlots is not defined
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
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">All Doctors</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Speciality</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Delete</th>
            <th className="border px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={doctor._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2">{doctor.name}</td>
              <td className="border px-4 py-2">{doctor.speciality}</td>
              <td className="border px-4 py-2">{doctor.email}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                  onClick={() => handleDelete(doctor._id)}
                >
                  Delete
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  type="submit"
                  className="btn btn-square px-8 py-1 hover:bg-blue-950  hover:text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center"
                  onClick={() => handleEdit(doctor)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ClipLoader loading={loading} size={20} />
                      <span className="ml-2 text-black">Updating...</span>
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Update Doctor</h3>
            <form onSubmit={handleUpdate}>
              {/* Form Fields */}
              {[
                { label: "Name", field: "name", type: "text" },
                { label: "Speciality", field: "speciality", type: "text" },
                { label: "Email", field: "email", type: "email" },
                { label: "Degree", field: "degree", type: "text" },
                { label: "Experience", field: "experience", type: "text" },
                { label: "About", field: "about", type: "text" },
                { label: "Fees", field: "fees", type: "number" },
                { label: "Address", field: "address", type: "text" },
                { label: "Slot Date", field: "slotDate", type: "date" },
                { label: "Slot Time", field: "slotTime", type: "time" },
              ].map(({ label, field, type }) => (
                <div className="mb-4" key={field}>
                  <label className="block text-sm font-medium">{label}</label>
                  <input
                    type={type}
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
                  className="btn btn-square px-12 py-2 mr-2  text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ClipLoader loading={loading} size={20} />
                      <span className="ml-2 text-black">Saving...</span>
                    </>
                  ) : (
                    "Save"
                  )}
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
  );
}
