import { Link, useLocation, useNavigate } from "react-router-dom";
import loginImg from "../../../src/assets/r.png";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../components/provider/AuthProvider";
import { ClipLoader } from "react-spinners";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const userRole = await login(email, password);

      Swal.fire({
        position: "center",
        icon: "success",
        title: `${
          userRole.charAt(0).toUpperCase() + userRole.slice(1)
        } login successfully`,
        showConfirmButton: false,
        timer: 2000,
      });

      const redirectPath =
        userRole === "admin" ||
        userRole === "doctor" ||
        userRole === "diagnostic" ||
        userRole === "employee"
          ? "/dashboard"
          : from;

      navigate(redirectPath, { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.message.includes("Network Error") &&
          "Network Error. Please check your connection.") ||
        "An unexpected error occurred. Please try again.";

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login failed",
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="flex justify-center lg:p-4 mt-10">
      <div className="flex flex-col md:flex-row border-2 shadow-2xl rounded-lg p-6 max-w-4xl w-full">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            className="w-full max-w-[350px] md:max-w-[400px] lg:max-w-[500px]"
            src={loginImg}
            alt="Login"
          />
        </div>

        {/* Login Form */}
        <div className="card bg-base-100 w-full md:w-1/2 max-w-sm lg:max-w-xl shadow-2xl p-3 lg:p-6">
          <form onSubmit={handleLogin} className="">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                required
                disabled={loading}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
                disabled={loading}
              />
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
                    <span className="ml-2 text-black">Logging...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
              <h1 className="text-center mt-2">
                Don't have an account?
                <Link to="/register">
                  <span className="text-blue-600"> Register</span>
                </Link>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
