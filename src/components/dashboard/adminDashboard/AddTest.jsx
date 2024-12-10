import { useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../../Utils";
import { ClipLoader } from "react-spinners";

export const AddTest = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
          image: data.secure_url, // Set the image URL in the form data
        }));
        console.log("Image URL:", data.secure_url); // <-- Log the image URL here
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

    // Log the formData before sending to check if all fields are filled
    console.log(formData); // <-- Add this line

    if (formData.price <= 0) {
      Swal.fire("Error", "Price must be a positive number", "error");
      return;
    }

    if (!formData.image) {
      Swal.fire("Error", "Image URL is missing", "error");
      return;
    }

    setLoading(true);

    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        "/tests/create-test",
        formData, // Sending the form data to the backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Test added successfully", "success");
        setFormData({
          name: "",
          category: "",
          description: "",
          price: "",
          image: "", // Clear the form after successful submission
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      const serverErrorMessage =
        error.response?.data?.message || "Something went wrong!";
      setErrorMessage(serverErrorMessage);
      Swal.fire("Error", serverErrorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Add Test
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="testName"
            className="block text-gray-700 dark:text-gray-300"
          >
            Test Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.testName}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 dark:text-gray-300"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 dark:text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="testImage"
            className="block text-gray-700 dark:text-gray-300"
          >
            Image
          </label>
          <input
            type="file"
            id="testImage"
            name="testImage"
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
            "Add Test"
          )}
        </button>
      </form>
    </div>
  );
};
