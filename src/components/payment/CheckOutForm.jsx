import { useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import Swal from "sweetalert2";

const CheckOutForm = ({ totalAmount, unpaidAppointments }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/payment/payments", {
        totalAmount,
        unpaidAppointments,
      });

      if (data.url) {
        window.location.href = data.url;

        Swal.fire({
          icon: "success",
          title: "Payment Initiated",
          text: "You are being redirected to Stripe for payment.",
        });
      } else {
        throw new Error("Failed to obtain Stripe Checkout URL.");
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "Unable to initiate payment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Complete Your Payment</h2>
      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Total Price: <span className="font-bold">${totalAmount}</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md ${
            loading
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-[#47ccc8] hover:text-white hover:bg-blue-950s transition"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default CheckOutForm;
