import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./pages/Footer/Footer";
import PrivateRoute from "./components/privateRoute/PrivateRoute";

// Pages
import Home from "./pages/homePage/Home";
import About from "./pages/aboutPage/About";
import Contact from "./pages/contactPage/Contact";
import Login from "./pages/loginPage/Login";
import Register from "./pages/registerPage/Register";
import NotFound from "./components/notFound/NotFound";

// Profile and Appointments
import MyProfile from "./pages/myProfilePage/MyProfile";
import UpdateProfile from "./pages/myProfilePage/UpdateProfile";
import MyAppointments from "./pages/myProfilePage/MyAppointments";
import PaymentSuccess from "./pages/myProfilePage/PaymentSuccess";
import TestPayment from "./pages/myProfilePage/TestPayment";

// Doctors and Departments
import Doctors from "./components/departments/Doctors";
import Appointments from "./components/topDoctors/Appointments";

// Tests and Payment
import TestDetails from "./components/Test/TestDetails";
import Payment from "./components/payment/Payment";
import CheckOutForm from "./components/payment/CheckOutForm";
import PaymentHistory from "./components/payment/PaymentHistory";
import Cancel from "./components/payment/Cancel";
import Success from "./components/payment/Success";

// Admin Dashboard
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/adminDashboard/AdminDashboard";

import AllDoctor from "./components/dashboard/adminDashboard/AllDoctor";
import AdminGetAllTest from "./components/dashboard/adminDashboard/AdminGetAllTest";
import TestAppointment from "./components/dashboard/adminDashboard/TestAppointment";
import AllAppointment from "./components/dashboard/adminDashboard/AllAppointment";
import ManageRole from "./components/dashboard/adminDashboard/ManageRole";
import { MyTestAppointment } from "./pages/myProfilePage/MyTestAppointment";
import DoctorDashboard from "./components/dashboard/doctorDashboard/DoctorDashboard";
import Appointment from "./components/dashboard/doctorDashboard/Appointment";
import DoctorList from "./components/dashboard/doctorDashboard/DoctorList";
import AllPatients from "./components/dashboard/doctorDashboard/AllPatients";
import InvoiceList from "./components/Invoice/InvoiceList";
import AddDiagnostic from "./components/dashboard/adminDashboard/AddDiagnostic";
import { DiagnosticDashboard } from "./components/dashboard/diagnosticDashboard/DiagnosticDashboard";
import AllDiagnosticsAdmin from "./components/dashboard/adminDashboard/AllDiagnosticsAdmin";
import Diagnostics from "./components/diagnostic/Diagnostics";
import DiagnosticDetails from "./components/diagnostic/DiagnosticDetails";
import TestList from "./components/diagnostic/TestList";
import DoctorSpecificList from "./components/diagnostic/DoctorSpecificList";
import { AddTest } from "./components/dashboard/diagnosticDashboard/AddTest";
import GetTests from "./components/dashboard/diagnosticDashboard/GetTests";
import AddDoctor from "./components/dashboard/diagnosticDashboard/AddDoctor";
import GetDoctor from "./components/dashboard/diagnosticDashboard/GetDoctor";
import TestAppointmentForDiagnostic from "./components/dashboard/diagnosticDashboard/TestAppointmentForDiagnostic";
import MyPrescriptions from "./components/Prescriptions/MyPrescriptions";
import PrescriptionDetail from "./components/Prescriptions/PrescriptionDetail";

const App = () => {
  return (
    <div>
      <div className="mx-44">
        <Navbar />
      </div>
      <div className="mx-20 sm:mx-[10%]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />

          {/* Doctors and Specialties */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/appointments/:docId" element={<Appointments />} />

          {/* user Routes */}
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/update" element={<UpdateProfile />} />
          <Route path="/myAppointments" element={<MyAppointments />} />
          <Route path="/testDetails/:testId" element={<TestDetails />} />
          <Route path="/testAppointment" element={<MyTestAppointment />} />
          <Route path="/testPayment" element={<TestPayment />} />
          <Route path="/paymentSuccess" element={<PaymentSuccess />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirm" element={<CheckOutForm />} />
          <Route path="/history" element={<PaymentHistory />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/invoice" element={<InvoiceList />} />
          <Route path="/diagnostic" element={<Diagnostics />} />
          <Route path="/diagnostic/:id" element={<DiagnosticDetails />} />
          <Route
            path="/diagnostic/:centerId/doctors"
            element={<DoctorSpecificList />}
          />
          <Route path="/diagnostic/:centerId/tests" element={<TestList />} />
          <Route path="/getPrescription" element={<MyPrescriptions />} />
          <Route
            path="/prescriptionDetails/:id"
            element={<PrescriptionDetail />}
          />

          {/* Admin Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* Admin Routes */}
            <Route path="adminDashboard" element={<AdminDashboard />} />

            <Route path="allDoctor" element={<AllDoctor />} />

            <Route path="adminGetAllTest" element={<AdminGetAllTest />} />
            <Route path="testAppointment" element={<TestAppointment />} />
            <Route
              path="all-appointment/:centerId"
              element={<AllAppointment />}
            />
            <Route path="update-role/:userId" element={<ManageRole />} />

            <Route path="addDiagnostic" element={<AddDiagnostic />} />
            <Route
              path="allDiagnosticAdmin"
              element={<AllDiagnosticsAdmin />}
            />

            {/* Doctor Dashboard */}
            <Route path="doctorDashboard" element={<DoctorDashboard />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="doctorList" element={<DoctorList />} />
            <Route path="allPatient" element={<AllPatients />} />

            {/* Diagnostic Dashboard */}
            <Route
              path="diagnosticDashboard"
              element={<DiagnosticDashboard />}
            />

            <Route path="addTest/:centerId" element={<AddTest />} />
            <Route path="getTest/:centerId" element={<GetTests />} />

            <Route path="addDoctor" element={<AddDoctor />} />
            <Route path="getDoctor" element={<GetDoctor />} />
            <Route
              path="testAppointment/:centerId"
              element={<TestAppointmentForDiagnostic />}
            />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
