import { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import ClipLoader from "react-spinners/ClipLoader";

const AddDiagnostic = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      line1: "",
      line2: "",
    },
    district: "",
    upazila: "",
    profileImage: "",
    phone: "",
    services: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle availableTests as an array of objects
    if (name === "availableTests") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.split(","),
      }));
    }
    // Handle address fields as a nested object
    else if (name.startsWith("address.")) {
      const field = name.split(".")[1]; // This will get "line1" or "line2"
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
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
      Swal.fire("Error", "Failed to upload image", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password before submitting
    if (!validatePassword(formData.password)) {
      Swal.fire(
        "Error",
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character",
        "error"
      );
      return;
    }

    setLoading(true);

    console.log("Form Data before submission:", formData);

    try {
      const token = getAccessToken();
      const response = await useAxios.post("/admin/add-diagnostic", formData, {
        "Content-Type": "application/json",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        Swal.fire("Success", "Diagnostic added successfully", "success");
        setFormData({
          name: "",
          email: "",
          password: "",
          profileImage: "",
          address: { line1: "", line2: "" },
          district: "",
          upazila: "",
          phone: "",
          services: "",
          website: "",
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
        Add Diagnostic
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        <div className="flex gap-6">
          {/* Address Line 1 */}
          <div className="mb-4 flex-1">
            <label
              htmlFor="address.line1"
              className="block text-gray-700 dark:text-gray-300"
            >
              Address Line 1
            </label>
            <input
              type="text"
              id="address.line1"
              name="address.line1"
              value={formData.address.line1}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div className="mb-4 flex-1">
            <label
              htmlFor="address.line2"
              className="block text-gray-700 dark:text-gray-300"
            >
              Address Line 2
            </label>
            <input
              type="text"
              id="address.line2"
              name="address.line2"
              value={formData.address.line2}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* District */}
          <div className="mb-4 flex-1">
            <label
              htmlFor="district"
              className="block text-gray-700 dark:text-gray-300"
            >
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>

          {/* Upazila */}
          <div className="mb-4 flex-1">
            <label
              htmlFor="upazila"
              className="block text-gray-700 dark:text-gray-300"
            >
              Upazila
            </label>
            <input
              type="text"
              id="upazila"
              name="upazila"
              value={formData.upazila}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Phone */}
          <div className="mb-4 flex-1">
            <label
              htmlFor="phone"
              className="block text-gray-700 dark:text-gray-300"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>
          {/* Services */}
          <div className="mb-4 flex-1">
            <label
              htmlFor="services"
              className="block text-gray-700 dark:text-gray-300"
            >
              Services
            </label>
            <input
              type="text"
              id="services"
              name="services"
              value={formData.services}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-lg"
              required
            />
          </div>
        </div>

        {/* Profile Image */}
        <div className="mb-4">
          <label
            htmlFor="profileImage"
            className="block text-gray-700 dark:text-gray-300"
          >
            Profile Image
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
          className="btn btn-square w-full p-4 hover:text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center hover:bg-blue-950"
          disabled={loading}
        >
          {loading ? (
            <>
              <ClipLoader loading={loading} size={20} />
              <span className="ml-2 text-black">Adding...</span>
            </>
          ) : (
            "Add Diagnostic"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddDiagnostic;
