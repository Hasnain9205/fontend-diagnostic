import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axiosInstance from "../../Hook/useAxios"; // Custom hook for Axios
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51QMhwQ2NL7DWMnAVCxYlUXf3YrRy2J4hE7o8sKGXpoNE1Yd0a9Rn3CzpKkXZNIhX3kQcjQaiv9vNrlWcEKuaMPWA005dxMLfCl"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const { unpaidAppointments } = location.state || {};

  const calculateTotalAmount = (appointments) => {
    return appointments.reduce((sum, appointment) => {
      const price = appointment.testId?.price;
      if (isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for appointment ${appointment._id}`);
      }
      return sum + price;
    }, 0);
  };

  const totalAmount = unpaidAppointments
    ? calculateTotalAmount(unpaidAppointments)
    : 0;

  useEffect(() => {
    if (!unpaidAppointments) return;

    // Request the payment intent from your backend
    setIsLoading(true);
    axiosInstance
      .post(
        "/tests/create-payment-intent",
        { unpaidAppointments },
        {
          headers: {
            "Content-Type": "application/json", // Set content type as JSON
          },
        }
      )
      .then((response) => {
        setClientSecret(response.data.clientSecret);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Payment Initialization Error",
          text: "Error creating payment session. Please try again later.",
        });
      })
      .finally(() => setIsLoading(false));
  }, [unpaidAppointments]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: error.message,
        });
      } else if (paymentIntent.status === "succeeded") {
        await handlePaymentSuccess(paymentIntent);
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your payment was completed successfully!",
        }).then(() => navigate("/paymentSuccess")); // Redirect to a success page or appointment page
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "An error occurred while processing the payment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await axiosInstance.post("/tests/payment-success", {
        appointmentIds: unpaidAppointments.map((appt) => appt._id),
        sessionId: paymentIntent.id,
      });
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Partial Success",
        text: "Payment succeeded, but failed to update appointment status.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">
        Total: ${totalAmount}
      </h2>
      <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded-lg">
        <CardElement />
      </div>
      <button
        type="submit"
        className="w-full py-3 mt-4 bg-[#47ccc8] hover:bg-blue-950 hover:text-white font-semibold rounded-lg text-black disabled:bg-gray-400"
        disabled={!stripe || !clientSecret || isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const TestPayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default TestPayment;
