import React, { useEffect, useState, useCallback, useContext } from "react";
import debounce from "lodash.debounce";
import { AuthContext } from "../../provider/AuthProvider";
import useAxios from "../../../Hook/useAxios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ default import

import Swal from "sweetalert2";

const SalarySheet = () => {
  const { user } = useContext(AuthContext);
  const centerId = user.centerId;
  const [salaries, setSalaries] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    position: "",
    month: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchSalaries = async (name = "", position = "", month = "") => {
    try {
      const res = await useAxios.get("/employee/salary-sheet", {
        params: {
          centerId,
          name,
          position,
          month,
          page,
          limit,
        },
      });
      setSalaries(res.data.sheet);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching salary sheet:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((name, position, month) => {
      fetchSalaries(name, position, month);
    }, 500),
    [page]
  );

  useEffect(() => {
    debouncedSearch(filters.name, filters.position, filters.month);
    return debouncedSearch.cancel;
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ name: "", position: "", month: "" });
    setPage(1);
  };

  // Generate individual PDF for each salary record
  const generateAllSalaryPDF = () => {
    if (salaries.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data Found",
        text: "There is no salary data to download.",
      });
      return;
    }

    const doc = new jsPDF();

    const tableColumn = [
      "Name",
      "Email",
      "Phone",
      "Position",
      "Amount",
      "Payment Date",
      "Month",
      "Status",
      "Method",
    ];

    const tableRows = salaries.map((salary) => [
      salary.name,
      salary.email,
      salary.phone,
      salary.position,
      salary.amount,
      new Date(salary.paymentDate).toLocaleDateString(),
      salary.month,
      salary.status,
      salary.method,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });

    const title =
      filters.month !== ""
        ? `${filters.month}-Salary-Sheet.pdf`
        : "All-Salary-Sheet.pdf";

    doc.save(title);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Salary Sheet</h2>

      {/* Search Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          className="border p-2 rounded w-44"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Search by position"
          className="border p-2 rounded w-44"
          value={filters.position}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="month"
          placeholder="Search by month"
          className="border p-2 rounded w-44"
          value={filters.month}
          onChange={handleFilterChange}
        />
        <button
          onClick={resetFilters}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>
        <button
          onClick={generateAllSalaryPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Download Salary PDF
        </button>
      </div>

      {/* Salary Table */}
      <table className="w-full border-collapse border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Position</th>
            <th className="border px-3 py-2">Amount</th>
            <th className="border px-3 py-2">Payment Date</th>
            <th className="border px-3 py-2">Month</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Method</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length > 0 ? (
            salaries.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.email}</td>
                <td className="border px-2 py-1">{item.phone}</td>
                <td className="border px-2 py-1">{item.position}</td>
                <td className="border px-2 py-1">{item.paidAmount}</td>
                <td className="border px-2 py-1">
                  {new Date(item.paymentDate).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">{item.month}</td>
                <td className="border px-2 py-1">{item.paymentStatus}</td>
                <td className="border px-2 py-1">{item.method}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-3">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SalarySheet;
