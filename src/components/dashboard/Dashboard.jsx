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
import { FaBars, FaNoteSticky } from "react-icons/fa6";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { ImUsers } from "react-icons/im";
import { LuGitPullRequestCreate } from "react-icons/lu";
import { IoMdDoneAll } from "react-icons/io";

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
import CreateEmployee from "./diagnosticDashboard/CreateEmployee";
import EmployeeDashboard from "./employeeDashboard/EmployeeDashboard";
import AllEmployee from "./diagnosticDashboard/AllEmployee";
import { GrUserWorker } from "react-icons/gr";
import SalarySheet from "./diagnosticDashboard/SalarySheet";
import AddLeave from "./employeeDashboard/AddLeave";
import LeaveList from "./employeeDashboard/LeaveList";
import EmployeeLeaves from "./diagnosticDashboard/EmployeeLeaves";

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
    addDiagnostic: {
      component: <AddDiagnostic />,
      icon: <LuGitPullRequestCreate />,
      label: "Add Diagnostic",
    },
    allDiagnosticsAdmin: {
      component: <AllDiagnosticsAdmin />,
      icon: <IoMdDoneAll />,
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
    employee: {
      component: <CreateEmployee />,
      icon: <BsFileEarmarkTextFill />,
      label: "Add Employee",
    },

    AllEmployee: {
      component: <AllEmployee />,
      icon: <GrUserWorker />,
      label: "All Employee",
    },
    employeeLeaves: {
      component: <EmployeeLeaves />,
      icon: <GrUserWorker />,
      label: "Employees leave",
    },
    SalarySheet: {
      component: <SalarySheet />,
      icon: <GrUserWorker />,
      label: "Salary Sheet",
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
  employee: {
    employeeDashboard: {
      component: <EmployeeDashboard />,
      icon: <FaHome />,
      label: "Employee Dashboard",
    },
    addLeave: {
      component: <AddLeave />,
      icon: <FaHome />,
      label: "Add Leave",
    },
    leaveList: {
      component: <LeaveList />,
      icon: <FaHome />,
      label: "Leave List",
    },
  },
};

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        setCurrentPage("adminDashboard");
      } else if (user.role === "doctor") {
        setCurrentPage("doctorDashboard");
      } else if (user.role === "diagnostic") {
        setCurrentPage("diagnosticDashboard");
      } else if (user.role === "employee") {
        setCurrentPage("employeeDashboard");
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
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-700 hover:bg-gray-200 w-full flex justify-center"
        >
          <FaBars size={20} />
        </button>
        <nav className="mt-10">
          {Object.entries(rolePages[user.role] || {}).map(
            ([key, { icon, label }]) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 w-full ${
                  currentPage === key ? "bg-teal-500 text-white" : ""
                }`}
              >
                <span className="text-lg">{icon}</span>
                {isSidebarOpen && <span className="ml-4">{label}</span>}
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
