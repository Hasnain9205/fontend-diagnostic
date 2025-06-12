import { useContext, useState } from "react";
import useAxios from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";

const AddLeave = () => {
  const { user } = useContext(AuthContext);
  const employeeId = user?.employeeId;
  const centerId = user?.centerId;

  const [form, setForm] = useState({
    leaveType: "",
    reason: "",
    startDate: "",
    endDate: "",
    employeeId,
    centerId,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useAxios.post("/leave/add-Leave", {
        ...form,
        employeeId,
        centerId,
      });

      Swal.fire({
        icon: "success",
        title: "Leave Request Submitted",
        text: "Your leave has been successfully submitted!",
        confirmButtonColor: "#10B981",
      });

      // reset form
      setForm({
        leaveType: "",
        reason: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err?.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 mt-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Apply for Leave
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 transition"
          >
            <option value="">Select Leave Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            placeholder="Enter reason for leave"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-600 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-600 transition"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default AddLeave;
