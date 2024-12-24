import { useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import Swal from "sweetalert2";

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUniquePatients = async () => {
    try {
      const token = getAccessToken();
      const docId = localStorage.getItem("userId");

      const response = await axiosInstance.get("/doctor/unique-patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { docId },
      });

      setPatients(response.data.uniquePatients || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Patients",
        text:
          error.response?.data?.message || "Unable to load patient details.",
      });
    } finally {
      setLoading(false);
    }
  };
  console.log("dd", patients);
  useEffect(() => {
    fetchUniquePatients();
  }, []);

  return (
    <div className="px-6">
      <h2 className="text-4xl font-bold text-center my-6">Total Patients</h2>
      <h1 className="text-blue-700 font-bold text-xl">
        Total Patients: {patients.length}
      </h1>
      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : patients.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No patients found for this doctor.
        </p>
      ) : (
        <div className="mt-6">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#47ccc8]">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Image
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Phone
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Gender
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Date of birth
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold">
                  Address
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr
                  key={patient._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-blue-100`}
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {patient?.profileImage ? (
                      <img
                        src={patient.profileImage}
                        alt="Patient"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {patient.name || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {patient.email || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {patient.phone || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {patient.gender || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {patient.dob || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {patient.address || "N/A"}
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

export default AllPatients;
