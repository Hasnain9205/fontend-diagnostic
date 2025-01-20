import { useEffect, useState } from "react";
import axios from "../../Hook/useAxios";
import { MdOutlineSearch } from "react-icons/md";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../Utils";
import { useNavigate } from "react-router-dom";

export default function Diagnostics() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("district"); // Can be district, upazila, or services
  const navigate = useNavigate();

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const res = await axios.get("/users/all-diagnostic", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setDiagnostics(res.data.diagnostic);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch diagnostics. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const filteredDiagnostics = diagnostics.filter((diagnostic) => {
    const value =
      filterType === "district"
        ? diagnostic.district
        : filterType === "upazila"
        ? diagnostic.upazila
        : diagnostic.services.join(", ");
    return value.toLowerCase().includes(search.toLowerCase());
  });

  const handleDetails = (id) => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login", { state: { form: `/diagnostic/${id}` } });
    } else {
      navigate(`/diagnostic/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center  mb-6">All Diagnostic</h1>
        {/* Search Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <MdOutlineSearch className="text-2xl text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow focus:outline-none text-gray-700 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="district"
                checked={filterType === "district"}
                onChange={() => setFilterType("district")}
              />
              <span className="ml-2">District</span>
            </label>
            <label>
              <input
                type="radio"
                value="upazila"
                checked={filterType === "upazila"}
                onChange={() => setFilterType("upazila")}
              />
              <span className="ml-2">Upazila</span>
            </label>
            <label>
              <input
                type="radio"
                value="services"
                checked={filterType === "services"}
                onChange={() => setFilterType("services")}
              />
              <span className="ml-2">Services</span>
            </label>
          </div>
        </div>

        {/* Diagnostics List */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filteredDiagnostics.length === 0 ? (
          <div className="text-center text-gray-500">
            No diagnostics found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiagnostics.map((diag) => (
              <div
                key={diag._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={diag.profileImage || "default-image.jpg"}
                  alt={diag.name}
                  className="w-full h-40  rounded-md mb-4"
                />

                <h2 className="text-lg font-bold text-blue-600">{diag.name}</h2>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">District:</span>{" "}
                  {diag.district}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Upazila:</span> {diag.upazila}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Services:</span>{" "}
                  {diag.services.join(", ")}
                </p>
                <button
                  onClick={() => handleDetails(diag._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
