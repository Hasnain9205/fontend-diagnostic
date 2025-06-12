import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";

export default function CreateEmployee() {
  const { user } = useContext(AuthContext);
  const centerId = user.centerId;
  console.log("centerID", centerId);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    hireDate: "",
    status: "active",
    profileImage: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "First-times-using-cloudinary");
    imageData.append("cloud_name", "dbygmohwb");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbygmohwb/image/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: data.secure_url,
        }));
        Swal.fire("Success", "Image uploaded successfully", "success");
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to upload image", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    console.log("Final Form Data:", formData); // ✅ Debugging লাইন

    if (!formData.profileImage) {
      Swal.fire("Error", "Image URL is missing", "error");
      return;
    }

    setLoading(true);

    try {
      const token = getAccessToken();
      const response = await useAxios.post(
        "/employee/create-employee",
        { ...formData, centerId }, // ✅ এখানে employeeId আছে কিনা চেক করো
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server Response:", response.data); // ✅ Server Response চেক করা

      if (response.data.success) {
        Swal.fire("Success", "Employee added successfully", "success");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          position: "",
          department: "",
          salary: "",
          hireDate: "",
          status: "active",
          profileImage: "",
          employeeId: "", // ✅ Ensure it resets properly
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data);
      const serverErrorMessage =
        error.response?.data?.message || "Something went wrong!";
      setErrorMessage(serverErrorMessage);
      Swal.fire("Error", serverErrorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  max-w-4xl mx-auto mt-8 p-2 bg-white shadow-md rounded-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Create Employee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-lg"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="mb-4">
          <label
            htmlFor="testImage"
            className="block text-gray-700 dark:text-gray-300"
          >
            Image
          </label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 p-2 w-full border rounded-lg"
          />
          {loading && <p className="text-gray-500 mt-2">Uploading image...</p>}
        </div>
        <button
          type="submit"
          className="btn btn-square  hover:text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-950 w-full  "
        >
          Create Employee
        </button>
      </form>
    </div>
  );
}
