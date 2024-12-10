import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  // Navigate to "My Appointments" page
  const handleMyAppointments = () => {
    navigate("/testAppointment"); // Update this route based on your route setup
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl text-center font-bold text-green-600 mb-6">
          Payment Success
        </h2>

        <div className="mt-6 text-center">
          <button
            onClick={handleMyAppointments}
            className=" bg-[#47ccc8]  hover:bg-blue-950 hover:text-white transition duration-200 font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 mx-auto w-full"
          >
            My Test Appointments
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
