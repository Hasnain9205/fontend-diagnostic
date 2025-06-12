import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import useAxios from "../../../Hook/useAxios";
import { AuthContext } from "../../provider/AuthProvider";

const EmployeeLeaves = () => {
  const user = useContext(AuthContext);
  console.log(user);
  const centerId = user?.user.centerId;
  console.log("Center ID:", centerId);

  const [loading, setLoading] = useState(true);

  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchAllLeaves = async () => {
      try {
        const res = await useAxios.get(`/leave/all-leave/${centerId}`);
        setLeaves(res.data?.data || []);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch leaves", err);
      } finally {
        setLoading(false);
      }
    };

    if (centerId) {
      fetchAllLeaves();
    }
  }, [centerId]);

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(leaves.filter((l) => l.status === statusFilter));
    }
  }, [statusFilter, leaves]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const updateStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You are going to ${status.toLowerCase()} this leave request.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "Approved" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status}`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await useAxios.patch(`/leave/update-leave/${id}`, {
          status,
        });
        if (res.data.success) {
          Swal.fire(
            "Success",
            `Leave ${status.toLowerCase()} successfully`,
            "success"
          );
          setLeaves((prev) =>
            prev.map((leave) =>
              leave._id === id ? { ...leave, status } : leave
            )
          );
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update status", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          🏢 All Employee Leaves
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr className="text-sm text-left text-gray-600">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Start</th>
              <th className="p-3 border">End</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="hover:bg-gray-50 text-sm transition"
                >
                  <td className="p-3 border">
                    {leave.employeeId?.name || "N/A"}
                  </td>
                  <td className="p-3 border">
                    {leave.employeeId?.email || "N/A"}
                  </td>
                  <td className="p-3 border">{leave.leaveType}</td>
                  <td className="p-3 border">
                    {moment(leave.startDate).format("LL")}
                  </td>
                  <td className="p-3 border">
                    {moment(leave.endDate).format("LL")}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full font-medium text-xs text-white ${
                        leave.status === "Approved"
                          ? "bg-green-500"
                          : leave.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {leave.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                          onClick={() => updateStatus(leave._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                          onClick={() => updateStatus(leave._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No Action</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-400">
                  No leave records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaves;
