import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineVisibility,
} from "react-icons/md";

import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

export default function AllDiagnosticsAdmin() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const res = await useAxios.get("/users/all-diagnostic", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDiagnostics(res.data.diagnostic);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch diagnostics. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getAccessToken();
          const res = await useAxios.delete(`/admin/delete-diagnostic/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.msg) {
            Swal.fire("Deleted!", "Diagnostic has been deleted.", "success");
            fetchDiagnostics(); // Refresh diagnostics
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete diagnostic. Please try again.",
          });
        }
      }
    });
  };

  const handleUpdate = (diag) => {
    Swal.fire({
      title: "Edit Diagnostic",
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Name" value="${diag.name}" />
        <input type="text" id="district" class="swal2-input" placeholder="District" value="${diag.district}" />
        <input type="text" id="upazila" class="swal2-input" placeholder="Upazila" value="${diag.upazila}" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const district = document.getElementById("district").value;
        const upazila = document.getElementById("upazila").value;
        return { name, district, upazila };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getAccessToken();
          const res = await useAxios.put(
            `/admin/update-diagnostic/${diag._id}`,
            result.value,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) {
            Swal.fire("Updated!", "Diagnostic has been updated.", "success");
            fetchDiagnostics(); // Refresh diagnostics
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update diagnostic. Please try again.",
          });
        }
      }
    });
  };

  const handleViewDetails = (diag) => {
    Swal.fire({
      title: diag.name,
      html: `
        <p><b>District:</b> ${diag.district}</p>
        <p><b>Upazila:</b> ${diag.upazila}</p>
        <p><b>Address:</b> ${diag.address.line1}, ${diag.address.line2}</p>
        <p><b>Phone:</b> ${diag.phone}</p>
        <p><b>Services:</b> ${diag.services.join(", ")}</p>
      `,
      icon: "info",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Admin Manage Diagnostics
        </h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="table-auto w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="border px-3 py-2 hidden sm:table-cell">
                    Image
                  </th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">District</th>
                  <th className=" border px-3 py-2 hidden sm:table-cell ">
                    Upazila
                  </th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.map((diag) => (
                  <tr key={diag._id} className="border-b hover:bg-gray-50">
                    <td className="border px-3 py-2 hidden sm:table-cell">
                      <img
                        src={diag.profileImage || "path/to/default/image.png"}
                        alt={diag.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2">{diag.name}</td>
                    <td className="px-4 py-2">{diag.district}</td>
                    <td className="border px-3 py-2 hidden sm:table-cell">
                      {diag.upazila}
                    </td>
                    <td className=" flex justify-center items-center py-6 space-x-4">
                      <button
                        onClick={() => handleViewDetails(diag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MdOutlineVisibility size={24} />
                      </button>
                      <button
                        onClick={() => handleUpdate(diag)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <MdOutlineEdit size={24} />
                      </button>
                      <button
                        onClick={() => handleDelete(diag._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdOutlineDelete size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
