import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = getAccessToken(); // Get the token from the utility function
      const response = await axiosInstance.get("/tests/invoices", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }); // Your API endpoint to fetch invoices
      console.log("data ....", response.data.invoices);
      setInvoices(response.data.invoices);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to fetch invoices.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Download a specific invoice
  const downloadInvoice = async (appointmentId) => {
    setLoading(true);
    try {
      const token = getAccessToken(); // Get the token for downloading invoice
      const response = await axiosInstance.get(
        `/tests/download-invoice/${appointmentId}`,
        {
          responseType: "blob", // Ensuring we receive the file as a blob
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers for downloading
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up link after download

      Swal.fire({
        icon: "success",
        title: "Downloaded",
        text: "Invoice downloaded successfully!",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to download invoice.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch invoices when the component mounts
  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Invoices List</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : invoices.length > 0 ? (
          <div>
            <ul className="list-disc list-inside space-y-2">
              {invoices.map((invoice) => (
                <li key={invoice.appointmentId} className="text-gray-700">
                  <div className="flex justify-between items-center">
                    <span>
                      <strong>Appointment ID:</strong> {invoice.appointmentId}
                    </span>
                    <button
                      onClick={() => downloadInvoice(invoice.appointmentId)}
                      className="bg-[#47ccc8] hover:text-white px-4 py-2 rounded-md hover:bg-blue-900 font-bold"
                    >
                      Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">No invoices available.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
