import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = getAccessToken();
        const { data } = await axiosInstance.get("/payment/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(data.payments);
      } catch (error) {
        console.error(
          "Error fetching payment history:",
          error.response.data.message
        );
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-center text-2xl">Payment History</h2>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th>No.</th>
            <th>Email</th>
            <th>Category</th>
            <th>Total Price</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{index + 1}</td>
              <td>{payment.userId.email}</td>
              <td>{payment.category}</td>
              <td>${payment.totalPrice.toFixed(2)}</td>
              <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
