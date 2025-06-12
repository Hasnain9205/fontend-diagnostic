import { useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDoctorsData = async () => {
    try {
      const response = await axiosInstance.get("/doctor/doctors-list");
      console.log("data..", response.data);
      setDoctors(response.data.doctors || []);
    } catch (error) {
      setError("Failed to load doctors.");
      Swal.fire("Error", "Failed to load doctors", "error"); // SweetAlert for error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto lg:p-4">
      <h1 className="lg:text-4xl text-xl font-bold  lg:text-center my-6">
        Doctor List
      </h1>
      <h1 className="text-blue-700 lg:font-bold lg:text-xl">
        Total Doctors: {doctors.length}
      </h1>
      <div className="mt-6">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-[#47ccc8]">
            <tr>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">
                Image
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                Doctor
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                Specialty
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">
                Experience
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">
                Available
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">
                Degree
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                Fees
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr
                key={doctor._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-blue-100`}
              >
                <td className="px-2 py-4 text-sm text-gray-800 hidden sm:table-cell">
                  {doctor?.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt="Patient"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-2 py-4 text-sm text-gray-800">
                  {doctor.name}
                </td>
                <td className="px-2 py-4 text-sm text-gray-800">
                  {doctor.speciality}
                </td>
                <td className="px-2 py-4 text-sm text-gray-800 hidden sm:table-cell">
                  {doctor.experience} years
                </td>
                <td className="px-2 py-4 text-sm text-gray-800 hidden sm:table-cell">
                  {doctor.available ? "Yes" : "No"}
                </td>
                <td className="px-2 py-4 text-sm text-gray-800 hidden sm:table-cell">
                  {doctor.degree}
                </td>
                <td className="px-2 py-4 text-sm flex space-x-2">
                  {doctor.fees}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorList;
