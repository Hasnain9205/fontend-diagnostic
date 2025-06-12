import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import useAxios from "../../../Hook/useAxios";

const PaymentForm = ({ employee, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueAmount, setDueAmount] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // ✅ Fetch due amount
  useEffect(() => {
    const fetchDueAmount = async () => {
      try {
        const res = await useAxios.get(
          `/employee/check-due?employeeId=${employee._id}&year=${currentYear}&month=${currentMonth}`
        );
        setDueAmount(res.data.dueAmount);
      } catch (err) {
        console.error("Error fetching due amount:", err);
        Swal.fire("Error", "Unable to fetch due amount.", "error");
      }
    };

    if (employee?._id) {
      fetchDueAmount();
    }
  }, [employee?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return Swal.fire(
        "Invalid Amount",
        "Please enter a valid amount.",
        "warning"
      );
    }

    if (!stripe || !elements) return;

    if (Number(amount) > Number(dueAmount)) {
      return Swal.fire("Invalid Amount", "Amount exceeds due.", "warning");
    }

    setLoading(true);
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we process the payment.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const cardElement = elements.getElement(CardElement);
    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      Swal.close();
      Swal.fire("Payment Error", error.message, "error");
      setLoading(false);
      return;
    }

    try {
      const { data: paymentData } = await useAxios.post(
        "/employee/give-salary",
        {
          employeeId: employee._id,
          name: employee.name,
          amount: Number(amount),
          paymentMethod: "Card",
          centerId: employee.centerId?._id || employee.centerId,
          stripeToken: token.id,
          year: currentYear,
          month: currentMonth,
        }
      );

      Swal.close();

      if (paymentData?.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: `${employee.name}'s salary of $${amount} was successfully paid.`,
        });
        onClose();
      } else if (
        paymentData?.message === "Salary already fully paid for this month."
      ) {
        Swal.fire({
          icon: "warning",
          title: "Already Paid",
          text: paymentData.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text:
            paymentData?.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: err?.response?.data?.message || "Unable to process payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow p-6 rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
        Pay Salary to {employee.name}
      </h2>

      <div className="mb-2 text-sm text-gray-600">
        <p>
          <strong>Total Salary:</strong> ${employee.salary}
        </p>
        <p>
          <strong>Due This Month:</strong>{" "}
          {dueAmount !== null ? `$${dueAmount}` : "Loading..."}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Enter Amount ($)</label>
        <input
          type="number"
          className="w-full border px-3 py-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 5000"
          min={1}
          max={dueAmount || employee.salary}
        />
      </div>

      <div className="border p-3 rounded mb-4 bg-gray-50">
        <CardElement />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          disabled={loading || !stripe}
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
