import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../Hook/useAxios";
import Swal from "sweetalert2";

const Success = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const location = useLocation(); // Used to extract the query params
  const navigate = useNavigate();

  useEffect(() => {
    // Extract sessionId and appointmentIds from the URL query parameters
    const query = new URLSearchParams(location.search);
    const appointmentIds = query.get("appointmentIds");
    const sessionId = query.get("sessionId");

    const fetchPaymentDetails = async () => {
      try {
        // Sending sessionId and appointmentIds to backend for payment validation and appointment updates
        const response = await axiosInstance.post("/payment/success", {
          appointmentId: appointmentIds.split(","),
          sessionId,
        });
        console.log("Payment API Response:", response.data);
        if (response.data && response.data.result) {
          setPaymentDetails(response.data); // Setting the response to state
          setPaymentSuccess(true); // Update payment success state
        } else {
          throw new Error("Invalid response data");
        }
        if (!response.data || !response.data.result) {
          throw new Error("Missing expected data in response");
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while fetching payment details. Please try again.",
          icon: "error",
        });
      }
    };

    // Only fetch payment details if sessionId and appointmentIds are present
    if (appointmentIds && sessionId) {
      fetchPaymentDetails();
    }
  }, [location.search]); // Effect will run when the query params change

  // Navigate to "My Appointments" page
  const handleMyAppointments = () => {
    navigate("/myAppointments"); // Update this route based on your route setup
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-green-600 mb-6">
          Payment Success
        </h2>
        {paymentSuccess ? (
          <div>
            <h3 className="text-xl text-gray-700 mb-4">
              {paymentDetails.message}
            </h3>
            <ul className="space-y-4">
              {paymentDetails.result && paymentDetails.result.length > 0 ? (
                paymentDetails.result.map((appointment) => (
                  <li
                    key={appointment._id}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between text-lg text-gray-600">
                      <span className="font-semibold">
                        Dr. {appointment.docData?.name}
                      </span>
                      <span
                        className={`${
                          appointment.status === "booked"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        Status: {appointment.status}
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p>No appointments found</p>
              )}
            </ul>
            <div className="mt-6 text-center">
              <button
                onClick={handleMyAppointments}
                className="py-2 px-6 bg-[#47ccc8] hover:text-white rounded-lg hover:bg-blue-950"
              >
                My Appointments
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-500">Loading payment details...</p>
        )}
      </div>
    </div>
  );
};

export default Success;
