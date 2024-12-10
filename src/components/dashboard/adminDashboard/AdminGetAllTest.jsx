import { useEffect, useState } from "react";
import axiosInstance from "../../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../../Utils";
import { ClipLoader } from "react-spinners";

export default function AdminGetAllTest() {
  const [tests, setTests] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  // Fetch tests from the API
  const fetchTests = async () => {
    try {
      const response = await axiosInstance.get("/tests/get-all-test");
      console.log("API Response:", response.data);
      setTests(response.data.tests || []); // Adjust according to API response structure
    } catch (error) {
      console.error("Error fetching tests:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load test data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a test
  const handleDelete = async (testId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = getAccessToken();
          await axiosInstance.delete(`/tests/delete-test/${testId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTests((prevTests) =>
            prevTests.filter((test) => test._id !== testId)
          ); // Avoid direct state modification
          Swal.fire("Deleted!", "The test has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting test:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete the test.",
          });
        }
      }
    });
  };

  // Handle editing a test (populate the form with current data)
  const handleEdit = (test) => {
    setCurrentTest(test);
    setIsEditing(true); // Show the update form
  };

  // Handle updating a test
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { name, category, price, description } = currentTest;
      const updatedTest = { name, category, price, description };

      const token = getAccessToken();
      const response = await axiosInstance.put(
        `/tests/update-test/${currentTest._id}`,
        updatedTest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === currentTest._id ? response.data.test : test
        )
      );

      Swal.fire("Updated!", "The test has been updated.", "success");
      setIsEditing(false); // Close the update form
    } catch (error) {
      console.error("Error updating test:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the test.",
      });
    }
  };

  // Load tests on component mount
  useEffect(() => {
    fetchTests();
  }, []);

  // Render loading or error messages if data isn't available
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!Array.isArray(tests) || tests.length === 0) {
    return <div className="text-center text-gray-500">No tests available.</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">All Tests</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Delete</th>
            <th className="border px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, index) => (
            <tr key={test._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2">{test.name}</td>
              <td className="border px-4 py-2">{test.category}</td>
              <td className="border px-4 py-2">${test.price}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                  onClick={() => handleDelete(test._id)}
                >
                  Delete
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  type="submit"
                  className="btn btn-square px-10   hover:text-white bg-[#47ccc8] hover:bg-blue-950 "
                  onClick={() => handleEdit(test)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ClipLoader loading={loading} size={20} />
                      <span className="ml-2 text-black">Updating...</span>
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Test Form (Modal or Inline Form) */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Update Test</h3>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={currentTest.name}
                  onChange={(e) =>
                    setCurrentTest({ ...currentTest, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  value={currentTest.category}
                  onChange={(e) =>
                    setCurrentTest({ ...currentTest, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  value={currentTest.price}
                  onChange={(e) =>
                    setCurrentTest({ ...currentTest, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={currentTest.description}
                  onChange={(e) =>
                    setCurrentTest({
                      ...currentTest,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="btn btn-square px-10   hover:text-white bg-[#47ccc8] hover:bg-blue-950"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ClipLoader loading={loading} size={20} />
                      <span className="ml-2 text-black">Saving...</span>
                    </>
                  ) : (
                    "Save"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
