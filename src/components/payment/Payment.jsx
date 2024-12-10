import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutForm from "./CheckOutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51QMhwQ2NL7DWMnAVCxYlUXf3YrRy2J4hE7o8sKGXpoNE1Yd0a9Rn3CzpKkXZNIhX3kQcjQaiv9vNrlWcEKuaMPWA005dxMLfCl"
); // Replace with your Stripe publishable key

const Payment = () => {
  const location = useLocation();
  const { unpaidAppointments } = location.state || {};

  console.log(unpaidAppointments);

  const calculateTotalAmount = (appointments) => {
    return appointments.reduce(
      (sum, appointment) => sum + appointment.amount,
      0
    );
  };

  const totalAmount = calculateTotalAmount(unpaidAppointments);
  console.log(totalAmount);

  // Check if this prints correct values

  if (!totalAmount || !unpaidAppointments) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckOutForm
          unpaidAppointments={unpaidAppointments}
          totalAmount={totalAmount}
        />
      </Elements>
    </div>
  );
};

export default Payment;
