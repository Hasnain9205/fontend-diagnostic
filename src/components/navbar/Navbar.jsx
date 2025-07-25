import { useContext, useEffect, useRef, useState } from "react";
import logo from "../../../src/assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import profile from "../../../src/assets/profile.jpg";
import { AuthContext } from "../provider/AuthProvider";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // নিচে স্ক্রল করলে Navbar হাইড হবে
        setIsVisible(false);
      } else {
        // উপরে স্ক্রল করলে Navbar দেখাবে
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navItems = () => {
    if (!user) {
      return (
        <>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/diagnostic"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Diagnostics
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Doctors
          </NavLink>
          <NavLink
            to="/tests"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Tests
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Employees
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Contact
          </NavLink>
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Contact
          </NavLink>
        </>
      );
    }

    if (user.role === "doctor") {
      return (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Contact
          </NavLink>
        </>
      );
    }

    if (user.role === "diagnostic") {
      return (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Contact
          </NavLink>
        </>
      );
    }
    if (user.role === "employee") {
      return (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Contact
          </NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/diagnostic"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          Diagnostics
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          Doctors
        </NavLink>
        <NavLink
          to="/tests"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          Tests
        </NavLink>
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          Employees
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          Contact
        </NavLink>
      </>
    );
  };

  return (
    <div
      className={`fixed z-50 top-0 w-full bg-white shadow-md  transition-transform  ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      data-aos="fade-down"
      data-aos-duration="1000"
    >
      <nav className="flex lg:px-40 items-center gap-20 lg:justify-center ">
        <div className="lg:navbar-start flex justify-between items-center ">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className=" btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
              {navItems()}
            </ul>
          </div>
          <img
            onClick={() => navigate("/")}
            className=" h-20  w-32 lg:w-44"
            src={logo}
            alt="Logo"
          />
        </div>
        <div className="navbar-center hidden lg:flex justify-between">
          <ul className="menu menu-horizontal px-1 gap-4 font-medium">
            {navItems()}
          </ul>
        </div>
        <div className="lg:navbar-end flex items-center">
          {user ? (
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-300 dark:focus:ring-blue-400 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none"
              >
                <img
                  src={user.profileImage || user.image || profile}
                  className="w-10 h-10 rounded-full"
                  alt="Profile"
                />
                <svg
                  className="w-5 h-5 mx-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800">
                  <div className="flex items-center p-3 -mt-2">
                    <img
                      className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                      src={user.profileImage || user.image || profile}
                      alt="Profile"
                    />
                    <div className="mx-1">
                      <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {user.name || "User"}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <Link
                    to="/myProfile"
                    className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    My Profile
                  </Link>
                  {user.role === "user" && (
                    <>
                      <Link
                        to="/myAppointments"
                        className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        My Appointments
                      </Link>
                      <Link
                        to="/testAppointment"
                        className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        My Test Appointments
                      </Link>

                      <Link
                        to={`/invoice`}
                        className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        All Invoices
                      </Link>

                      <Link
                        to={`/getPrescription`}
                        className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        My Prescription
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className="block px-2 py-2 text-sm rounded-md font-medium transition-colors duration-300 transform dark:text-gray-300 dark:hover:text-white  hover:bg-blue-950 hover:text-white bg-[#47ccc8] "
            >
              Create Account
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
