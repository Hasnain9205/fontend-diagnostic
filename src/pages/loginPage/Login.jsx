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
        userRole === "diagnostic"
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
    <div className="hero mt-32">
      <div className="hero-content flex border-2 shadow-2xl">
        <div>
          <img className="w-[700px]" src={loginImg} alt="Login" />
        </div>
        <div className="card bg-base-100 w-full max-w-xl shadow-2xl">
          <form onSubmit={handleLogin} className="card-body" disabled={loading}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                className="input input-bordered"
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
                placeholder="password"
                className="input input-bordered"
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
