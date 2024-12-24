import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import AddDoctor from "./adminDashboard/AddDoctor";
import AllDoctor from "./adminDashboard/AllDoctor";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import AllTest from "./adminDashboard/AdminGetAllTest";
import { AddTest } from "./adminDashboard/AddTest";
import AllAppointment from "./adminDashboard/AllAppointment";
import ManageRole from "./adminDashboard/ManageRole";
import TestAppointment from "./adminDashboard/TestAppointment";
import DoctorDashboard from "./doctorDashboard/DoctorDashboard";
import Appointment from "./doctorDashboard/Appointment";
import DoctorList from "./doctorDashboard/DoctorList";
import AllPatients from "./doctorDashboard/AllPatients";
import { GiTestTubes } from "react-icons/gi";

import {
  FaHome,
  FaUserMd,
  FaClipboardList,
  FaCalendarCheck,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import { BiTestTube } from "react-icons/bi";

const rolePages = {
  admin: {
    adminDashboard: { component: <AdminDashboard />, icon: <FaHome /> },
    addDoctor: { component: <AddDoctor />, icon: <FaUserMd /> },
    allDoctors: { component: <AllDoctor />, icon: <FaUserMd /> },
    addTest: { component: <AddTest />, icon: <BiTestTube /> },
    AllTest: { component: <AllTest />, icon: <GiTestTubes /> },
    testAppointment: {
      component: <TestAppointment />,
      icon: <FaCalendarCheck />,
    },
    allAppointments: {
      component: <AllAppointment />,
      icon: <FaClipboardList />,
    },
    manageRoles: { component: <ManageRole />, icon: <FaUserShield /> },
  },
  doctor: {
    doctorDashboard: { component: <DoctorDashboard />, icon: <FaHome /> },
    appointment: { component: <Appointment />, icon: <FaCalendarCheck /> },
    doctorList: { component: <DoctorList />, icon: <FaUserMd /> },
    allPatients: { component: <AllPatients />, icon: <FaUsers /> },
  },
};

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        setCurrentPage("adminDashboard");
      } else if (user.role === "doctor") {
        setCurrentPage("doctorDashboard");
      } else {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  const renderContent = () => {
    if (user && user.role && rolePages[user.role]) {
      return rolePages[user.role][currentPage]?.component;
    }
    return <div>Invalid role or no page selected</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center p-6">
          <img
            className="w-24 h-24 rounded-full shadow-md"
            src={user?.profileImage || "path/to/default/image.png"}
            alt="Profile"
          />
          <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {user?.name}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <nav className="mt-6">
          {Object.entries(rolePages[user.role]).map(([page, { icon }]) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center px-4 py-2 mt-2 text-gray-700 transition-transform duration-200 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 ${
                currentPage === page
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-transparent"
              }`}
            >
              {icon}
              <span className="ml-4 font-medium">
                {page
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^\w/, (c) => c.toUpperCase())
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-2">
        <div className="mt-6">{renderContent()}</div>
      </main>
    </div>
  );
}
