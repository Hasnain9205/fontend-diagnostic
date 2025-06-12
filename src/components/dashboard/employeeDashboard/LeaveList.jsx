import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import useAxios from "../../../Hook/useAxios";

const LeaveList = () => {
  const { user } = useContext(AuthContext);
  const employeeId = user?.employeeId;
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await useAxios.get(
          `/leave/employee-get-leaves/${employeeId}`
        );
        setLeaves(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to load leave requests", err);
      }
    };

    fetchLeaves();
  }, [employeeId]);

  return (
    <div className="max-w-7xl mx-auto mt-12 p-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        My Leave Requests
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-xl ring-1 ring-gray-300">
        <table className="min-w-full table-auto text-sm text-gray-800">
          <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <tr>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-left">Start</th>
              <th className="p-4 text-left">End</th>
              <th className="p-4 text-left">Days</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves?.length > 0 ? (
              leaves.map((leave, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">{leave.leaveType}</td>
                  <td className="p-4">{leave.reason}</td>
                  <td className="p-4">
                    {new Date(leave.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    {new Date(leave.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">{leave.days}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === "Approved"
                          ? "bg-green-500 text-white"
                          : leave.status === "Rejected"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-400">
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveList;
