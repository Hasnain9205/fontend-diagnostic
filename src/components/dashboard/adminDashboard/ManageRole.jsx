import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import axiosInstance from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

const ManageRole = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAccessToken();
      try {
        const response = await axiosInstance.get("/users/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch users!",
        });
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, selectedRole) => {
    const token = getAccessToken();
    if (!selectedRole) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Role",
        text: "Please select a role before updating.",
      });
      return;
    }

    try {
      await axiosInstance.put(
        `/users/user-role/${userId}`,
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: "User role has been updated successfully!",
      });

      // Update the users list with the updated role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: selectedRole } : user
        )
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the role.",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Manage User Roles
      </h1>
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="spinner-border animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          <span className="text-gray-600">Loading users...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-[#47ccc8]">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Image
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Role
                </th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <img
                      src={user.profileImage}
                      alt={`${user.name}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <select
                      className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#47ccc8] transition-all"
                      value={user.selectedRole || user.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setUsers((prevUsers) =>
                          prevUsers.map((prevUser) =>
                            prevUser._id === user._id
                              ? { ...prevUser, selectedRole: newRole }
                              : prevUser
                          )
                        );
                      }}
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="diagnostic">Diagnostic</option>
                      <option value="doctor">Doctor</option>
                    </select>
                    <button
                      onClick={() =>
                        handleRoleChange(user._id, user.selectedRole)
                      }
                      className="ml-3 bg-[#47ccc8] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#37b0a7] transition-colors"
                    >
                      Update Role
                    </button>
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

export default ManageRole;
