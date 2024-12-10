import React, { useState } from "react";
import Swal from "sweetalert2";
import { createInvoice } from "../api";

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    userId: "",
    testIds: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInvoice({
        ...formData,
        testIds: formData.testIds.split(",").map((id) => id.trim()),
      });
      Swal.fire("Success", "Invoice created successfully!", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Create Invoice</h2>
      <input
        type="text"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        placeholder="User ID"
        className="w-full mb-4 p-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="testIds"
        value={formData.testIds}
        onChange={handleChange}
        placeholder="Comma-separated Test IDs"
        className="w-full mb-4 p-2 border rounded-md"
        required
      />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded-md"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
      >
        Create Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
