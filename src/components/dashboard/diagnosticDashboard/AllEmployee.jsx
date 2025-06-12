import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { MdOutlineDelete, MdSystemUpdateAlt } from "react-icons/md";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51QMhwQ2NL7DWMnAVCxYlUXf3YrRy2J4hE7o8sKGXpoNE1Yd0a9Rn3CzpKkXZNIhX3kQcjQaiv9vNrlWcEKuaMPWA005dxMLfCl"
);

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    status: "",
    profileImage: "",
    department: "",
  });
  const [showEmployeeCard, setShowEmployeeCard] = useState(false);
  const [showUpdateCard, setShowUpdateCard] = useState(false);

  const [filter, setFilter] = useState({
    name: "",
    position: "",
  });
  useEffect(() => {
    fetchEmployees();
  }, [filter]);

  const fetchEmployees = async () => {
    try {
      const { name, position } = filter;
      const res = await useAxios.get("/employee/get-employee", {
        params: { name, position },
      });
      setEmployees(res.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await useAxios.delete(`/employee/delete-employee/${id}`);
        Swal.fire("Deleted!", "Employee has been deleted.", "success");
        fetchEmployees();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete employee.", "error");
      }
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      salary: employee.salary,
      status: employee.status,
      profileImage: employee.profileImage,
      department: employee.department,
    });
    setShowUpdateCard(true); // Open the update modal
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateEmployee = async () => {
    try {
      await useAxios.put(
        `/employee/update-employee/${selectedEmployee._id}`,
        formData
      );
      Swal.fire("Success!", "Employee updated successfully", "success");
      fetchEmployees();
      setShowUpdateCard(false); // Close the update modal
      setSelectedEmployee(null);
    } catch (error) {
      Swal.fire("Error!", "Failed to update employee.", "error");
    }
  };

  const handleSalary = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeCard(true); // Show the salary details modal
  };

  const handleCloseEmployeeCard = () => {
    setShowEmployeeCard(false); // Close the employee details modal
  };

  const handleCloseUpdateCard = () => {
    setShowUpdateCard(false); // Close the update employee modal
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const resetFilters = () => {
    setFilter({ name: "", position: "" });
  };
  return (
    <div className="p-6 max-w-5xl mx-auto overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Employee List</h1>
      {/* Filter Inputs */}
      <div className="mb-4 flex gap-4 justify-center">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filter.name}
          onChange={handleFilterChange}
          className="p-2 border"
        />
        <input
          type="text"
          name="position"
          placeholder="Filter by Position"
          value={filter.position}
          onChange={handleFilterChange}
          className="p-2 border"
        />
        <button
          onClick={resetFilters}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Profile</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2 hidden md:table-cell">Phone</th>
                <th className="border p-2 hidden md:table-cell">Position</th>
                <th className="border p-2 hidden md:table-cell">Actions</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border">
                  <td className="border p-2">
                    <img
                      src={emp.profileImage || "https://via.placeholder.com/50"}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border p-2">{emp.name}</td>
                  <td className="border p-2">{emp.email}</td>
                  <td className="border p-2 hidden md:table-cell">
                    {emp.phone}
                  </td>
                  <td className="border p-2 hidden md:table-cell">
                    {emp.position}
                  </td>
                  <td className="border p-2 hidden md:table-cell">
                    <button
                      className="bg-blue-500 text-white p-1 rounded hover:bg-blue-700"
                      onClick={() => handleSalary(emp)} // Trigger Salary Modal
                    >
                      Salary
                    </button>
                  </td>
                  <td className="p-2 flex gap-2 justify-center mt-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                      onClick={() => handleEdit(emp)} // Trigger Update Modal
                    >
                      <MdSystemUpdateAlt />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                      onClick={() => deleteEmployee(emp._id)}
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Employee Modal */}
      {showUpdateCard && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Employee</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 mb-2"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
              className="w-full border p-2 mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseUpdateCard}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={updateEmployee}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Modal (Salary) */}
      {showEmployeeCard && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Employee Details</h2>
            <div className="mb-4">
              <img
                src={
                  selectedEmployee.profileImage ||
                  "https://via.placeholder.com/150"
                }
                alt={selectedEmployee.name}
                className="w-32 h-32 rounded-full mx-auto"
              />
              <h3 className="text-center text-xl mt-2">
                {selectedEmployee.name}
              </h3>
              <p className="text-center text-gray-600">
                {selectedEmployee.position}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedEmployee.phone}
              </p>
              <p>
                <strong>Salary:</strong> ${selectedEmployee.salary}
              </p>
              <p>
                <strong>Department:</strong> {selectedEmployee.department}
              </p>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm
                employee={selectedEmployee}
                onClose={handleCloseEmployeeCard}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEmployee;
