import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";
import { ClipLoader } from "react-spinners";

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
    image: "", // Image URL
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data on component mount to populate the form
    const fetchData = async () => {
      const token = getAccessToken();
      try {
        const response = await axiosInstance.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data.user);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch user data", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      Swal.fire("Error", "Please select an image file", "error");
      return;
    }

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
          image: data.secure_url, // This sets the image URL in formData
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

    if (!formData.image) {
      Swal.fire("Error", "Image URL is required", "error");
      return; // Prevent submission if no image URL is present
    }

    setLoading(true);

    try {
      const token = getAccessToken();
      const response = await axiosInstance.put(
        "/users/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Profile updated successfully", "success");
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update profile",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to update profile. Please try again later.",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Update Profile
      </h2>
      <form onSubmit={handleSubmit}>
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

        <div className="mb-4">
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

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 dark:text-gray-300"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="dob"
            className="block text-gray-700 dark:text-gray-300"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-gray-700 dark:text-gray-300"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 dark:text-gray-300"
          >
            Profile Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 p-2 w-full border rounded-lg"
          />
          {loading && <p className="text-gray-500 mt-2">Uploading image...</p>}
        </div>

        <button
          type="submit"
          className="btn btn-square w-full p-4 text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <ClipLoader loading={loading} size={20} />
              <span className="ml-2 text-black">Loading...</span>
            </>
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </div>
  );
}
