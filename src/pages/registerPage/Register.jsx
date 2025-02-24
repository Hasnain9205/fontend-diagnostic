import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../../src/assets/r.png";
import axiosInstance from "../../Hook/useAxios";
import Swal from "sweetalert2";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const age = form.age.value;
    const address = form.address.value;
    const gender = form.gender.value;
    const district = form.district.value;
    const upazila = form.upazila.value;
    const phone = form.phone.value;
    const profileImage = form.profileImage.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("age", age);
    formData.append("address", address);
    formData.append("gender", gender);
    formData.append("district", district);
    formData.append("upazila", upazila);
    formData.append("phone", phone);
    if (profileImage) formData.append("profileImage", profileImage);

    setLoading(true);

    try {
      const { status } = await axiosInstance.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registration successful",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error(
        "Error occurred during registration:",
        error.response?.data
      );
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Registration failed",
        text:
          error.response?.data?.msg || "An error occurred. Please try again.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  return (
    <div className="hero mt-10">
      <div className="hero-content flex flex-col lg:flex-row border-2 shrink-0 shadow-2xl bg-white p-4 rounded-lg">
        <div className="w-full lg:w-1/2">
          <img src={loginImg} alt="register" className="w-full" />
        </div>
        <div className="w-full lg:w-1/2 p-6">
          <h2 className="text-4xl font-semibold text-center text-[#47ccc8] mb-6">
            Create Your Account
          </h2>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your address"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">District</label>
                <input
                  type="text"
                  name="district"
                  placeholder="Enter your district"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Upazila</label>
                <input
                  type="text"
                  name="upazila"
                  placeholder="Enter your upazila"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Gender</label>
                <select
                  name="gender"
                  className="select select-bordered  rounded-lg w-full shadow-md"
                  defaultValue="Not Selected"
                  required
                >
                  <option value="Not Selected">Not Selected</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  className="file-input file-input-bordered w-full mb-2"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {profileImagePreview && (
                  <div className="w-32 h-32 bg-gray-200 p-2 rounded-full overflow-hidden">
                    <img
                      src={profileImagePreview}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
              <div className="form-control mb-4 flex-1">
                <label className="label-text font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  className="input input-bordered p-4 rounded-lg w-full shadow-md"
                  required
                />
              </div>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-square w-full p-4 hover:text-white bg-[#47ccc8] rounded-lg shadow-lg flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ClipLoader loading={loading} size={20} />
                    <span className="ml-2 text-black">Registering...</span>
                  </>
                ) : (
                  "Register"
                )}
              </button>
              <h1 className="text-center mt-4">
                Have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
