import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import AllDoctor from "./adminDashboard/AllDoctor";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import AllTest from "./adminDashboard/AdminGetAllTest";
import AllAppointment from "./adminDashboard/AllAppointment";
import ManageRole from "./adminDashboard/ManageRole";
import TestAppointment from "./adminDashboard/TestAppointment";
import DoctorDashboard from "./doctorDashboard/DoctorDashboard";
import Appointment from "./doctorDashboard/Appointment";
import DoctorList from "./doctorDashboard/DoctorList";
import AllPatients from "./doctorDashboard/AllPatients";
import { GiTestTubes } from "react-icons/gi";
import { BiSolidDashboard } from "react-icons/bi";
import { LuTestTubes } from "react-icons/lu";
import { FaNoteSticky } from "react-icons/fa6";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { ImUsers } from "react-icons/im";

import {
  FaHome,
  FaUserMd,
  FaCalendarCheck,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import { BiTestTube } from "react-icons/bi";
import AddDiagnostic from "./adminDashboard/AddDiagnostic";
import { DiagnosticDashboard } from "./diagnosticDashboard/DiagnosticDashboard";
import AllDiagnosticsAdmin from "./adminDashboard/AllDiagnosticsAdmin";
import { AddTest } from "./diagnosticDashboard/AddTest";
import GetTests from "./diagnosticDashboard/GetTests";
import AddDoctor from "./diagnosticDashboard/AddDoctor";
import GetDoctor from "./diagnosticDashboard/GetDoctor";
import TestAppointmentForDiagnostic from "./diagnosticDashboard/TestAppointmentForDiagnostic";

const rolePages = {
  admin: {
    adminDashboard: {
      component: <AdminDashboard />,
      icon: <FaHome />,
      label: "Admin Dashboard",
    },

    allDoctors: {
      component: <AllDoctor />,
      icon: <FaUserMd />,
      label: "All Doctors",
    },
    AllTest: {
      component: <AllTest />,
      icon: <GiTestTubes />,
      label: "All Tests",
    },
    testAppointment: {
      component: <TestAppointment />,
      icon: <FaCalendarCheck />,
      label: "Test Appointments",
    },

    manageRoles: {
      component: <ManageRole />,
      icon: <FaUserShield />,
      label: "Manage Roles",
    },
    addDiagnostic: { component: <AddDiagnostic />, label: "Add Diagnostic" },
    allDiagnosticsAdmin: {
      component: <AllDiagnosticsAdmin />,
      label: "All Diagnostics",
    },
  },
  doctor: {
    doctorDashboard: {
      component: <DoctorDashboard />,
      icon: <FaHome />,
      label: "Doctor Dashboard",
    },
    appointment: {
      component: <Appointment />,
      icon: <FaCalendarCheck />,
      label: "Appointments",
    },
    doctorList: {
      component: <DoctorList />,
      icon: <FaUserMd />,
      label: "Doctor List",
    },
    allPatients: {
      component: <AllPatients />,
      icon: <FaUsers />,
      label: "All Patients",
    },
  },
  diagnostic: {
    diagnosticDashboard: {
      component: <DiagnosticDashboard />,
      icon: <BiSolidDashboard />,
      label: "Diagnostic Dashboard",
    },
    addTest: {
      component: <AddTest />,
      icon: <BiTestTube />,
      label: "Add Test",
    },
    getTests: {
      component: <GetTests />,
      icon: <LuTestTubes />,
      label: "All Tests",
    },
    testAppointment: {
      component: <TestAppointmentForDiagnostic />,
      icon: <FaNoteSticky />,
      label: "Test Appointment",
    },
    addDoctor: {
      component: <AddDoctor />,
      icon: <FaUserMd />,
      label: "Add Doctor",
    },
    getDoctor: {
      component: <GetDoctor />,
      icon: <ImUsers />,
      label: "All Doctor",
    },
    allAppointments: {
      component: <AllAppointment />,
      icon: <BsFileEarmarkTextFill />,
      label: "Doctor Appointments",
    },
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
      } else if (user.role === "diagnostic") {
        setCurrentPage("diagnosticDashboard");
      } else {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.title = currentPage
      ? `${currentPage.replace(/([A-Z])/g, " $1")} - Dashboard`
      : "Dashboard";
  }, [currentPage]);

  const renderContent = () => {
    if (!user || !user.role || !rolePages[user.role]) {
      return <div>Access denied. Please contact the administrator.</div>;
    }
    if (!rolePages[user.role][currentPage]) {
      return <div>Page not found for the current role.</div>;
    }
    return rolePages[user.role][currentPage]?.component;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading, please wait...</div>
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
            src={user?.profileImage || "/default-profile.png"}
            alt={user?.name || "User Profile"}
          />
          <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {user?.name}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
        <nav className="mt-6">
          {Object.entries(rolePages[user.role]).map(
            ([page, { icon, label }]) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center px-4 py-2 mt-2 text-gray-700 transition-transform duration-200 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-transparent"
                }`}
                aria-label={`Navigate to ${label}`}
              >
                {icon}
                <span className="ml-4 font-medium">{label}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      <main className="flex-1 p-2">
        <div className="mt-6">{renderContent()}</div>
      </main>
    </div>
  );
}
