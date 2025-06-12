import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { AuthContext } from "../../provider/AuthProvider";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const employeeId = user?.employeeId;
  const [employee, setEmployee] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);

  useEffect(() => {
    if (!employeeId) return;

    const fetchDashboard = async () => {
      try {
        const res = await useAxios.get(
          `/employee/employee-dashboard/${employeeId}`
        );
        setEmployee(res.data.employee);
        setSalaryHistory(res.data.salaryHistory);

        Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: `Hello, ${res.data.employee.name}!`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load dashboard",
        });
      }
    };

    fetchDashboard();
  }, [employeeId]);

  if (!employee) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <img
          src={
            employee.profileImage ||
            "https://i.ibb.co/ZGrqXkH/default-avatar.png"
          }
          alt="Employee Avatar"
          className="w-24 h-24 rounded-full border object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {employee.name}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{employee.position}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Phone:</strong> {employee.phone}
            </p>
            <p>
              <strong>Center Name:</strong> {employee.centerId?.name}
            </p>
            <p>
              <strong>Center Phone:</strong> {employee.centerId?.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Salary History Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Salary History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-100">
              <tr className="text-gray-700">
                <th className="px-4 py-2 border text-left">Month</th>
                <th className="px-4 py-2 border text-left">Year</th>
                <th className="px-4 py-2 border text-left">Amount</th>
                <th className="px-4 py-2 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {salaryHistory.length > 0 ? (
                salaryHistory.map((salary) => (
                  <tr
                    key={salary._id}
                    className="hover:bg-gray-50 text-gray-800"
                  >
                    <td className="px-4 py-2 border">{salary.month}</td>
                    <td className="px-4 py-2 border">{salary.year}</td>
                    <td className="px-4 py-2 border font-medium text-green-600">
                      ${salary.paidAmount}
                    </td>
                    <td className="px-4 py-2 border capitalize">
                      {salary.paymentStatus}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No salary records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
