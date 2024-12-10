import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import AddDoctor from "./adminDashboard/AddDoctor";
import AllDoctor from "./adminDashboard/AllDoctor";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import AdminGetAllTest from "./adminDashboard/AdminGetAllTest";
import { AddTest } from "./adminDashboard/AddTest";
import AllAppointment from "./adminDashboard/AllAppointment";
import ManageRole from "./adminDashboard/ManageRole";
import TestAppointment from "./adminDashboard/TestAppointment";
import DoctorDashboard from "./doctorDashboard/DoctorDashboard";
import Appointment from "./doctorDashboard/Appointment";
import DoctorList from "./doctorDashboard/DoctorList";
import AllPatients from "./doctorDashboard/AllPatients";

const rolePages = {
  admin: {
    addDoctor: <AddDoctor />,
    allDoctors: <AllDoctor />,
    adminDashboard: <AdminDashboard />,
    addTest: <AddTest />,
    adminGetAllTest: <AdminGetAllTest />,
    testAppointment: <TestAppointment />,
    "all-appointment": <AllAppointment />,
    "update-role": <ManageRole />,
  },
  doctor: {
    doctorDashboard: <DoctorDashboard />,
    appointment: <Appointment />,
    doctorList: <DoctorList />,
    allPatient: <AllPatients />,
  },
};

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");

  // Check user authentication and role
  useEffect(() => {
    console.log("user----->", loading, user);
    if (!loading && user) {
      if (user?.role === "admin") {
        setCurrentPage("adminDashboard"); // Set default page for admin
      } else if (user?.role === "doctor") {
        setCurrentPage("doctorDashboard"); // Set default page for doctor
      } else {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  // Content rendering based on user role and current page
  const renderContent = () => {
    if (user && user.role && rolePages[user.role]) {
      return rolePages[user.role][currentPage];
    }
    return <div>Invalid role or no page selected</div>;
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (!user) {
    return null;
  }
  return (
    <div className="flex">
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src={
              user?.profileImage || user?.image || "path/to/default/image.png"
            }
            alt="Profile"
          />
          <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
            {user?.name}
          </h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-col justify-between flex-1 mt-6">
          <nav>
            {user.role === "admin" ? (
              <>
                {[
                  "adminDashboard",
                  "addDoctor",
                  "allDoctors",
                  "addTest",
                  "adminGetAllTest",
                  "testAppointment",
                  "all-appointment",
                  "update-role",
                ].map((page) => (
                  <Link
                    to="#"
                    onClick={() => setCurrentPage(page)}
                    key={page}
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                  >
                    <span className="mx-4 font-medium">
                      {page.replace(/([A-z])/g, " $1").toUpperCase()}
                    </span>
                  </Link>
                ))}
              </>
            ) : (
              <>
                {[
                  "doctorDashboard",
                  "appointment",
                  "doctorList",
                  "allPatient",
                ].map((page) => (
                  <Link
                    to="#"
                    onClick={() => setCurrentPage(page)}
                    key={page}
                    className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                  >
                    <span className="mx-4 font-medium">
                      {page.replace(/([A-z])/g, " $1").toUpperCase()}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}
