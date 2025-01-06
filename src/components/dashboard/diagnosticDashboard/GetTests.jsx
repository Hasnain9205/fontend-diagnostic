import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../Hook/useAxios";
import { getAccessToken } from "../../../../Utils";
import { AuthContext } from "../../provider/AuthProvider";
import { MdDelete, MdSystemUpdateAlt } from "react-icons/md";

export default function GetTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const centerId = user.centerId;
  const [currentActionLoading, setCurrentActionLoading] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  console.log("ceid", centerId);

  // Fetch tests function
  const fetchTests = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const response = await useAxios.get(
        `/diagnostic/getTestByCenter/${centerId}/tests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTests(response.data.tests);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch tests!",
      });
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);
  console.log("d", tests);

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
          setCurrentActionLoading(testId);
          const token = getAccessToken();
          await useAxios.delete(`/tests/delete-test/${testId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTests((prevTests) =>
            prevTests.filter((test) => test._id !== testId)
          );
          Swal.fire("Deleted!", "The test has been deleted.", "success");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete the test.",
          });
        } finally {
          setCurrentActionLoading(null);
        }
      }
    });
  };

  const handleEdit = (test) => {
    setCurrentTest(test);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentTest.name || !currentTest.category || currentTest.price <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill out all fields with valid data.",
      });
      return;
    }

    try {
      setCurrentActionLoading(currentTest._id);
      const token = getAccessToken();
      const response = await useAxios.put(
        `/tests/update-test/${currentTest._id}`,
        currentTest,
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
      setIsEditing(false);
      setCurrentTest(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the test.",
      });
    } finally {
      setCurrentActionLoading(null);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!tests.length) {
    return <div className="text-center text-gray-500">No tests available.</div>;
  }
  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">All Tests</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Image</th>
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
              <td className="border px-4 py-2">
                {test.image ? (
                  <img
                    src={test.image}
                    alt="Doctor"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border px-4 py-2">{test.name}</td>
              <td className="border px-4 py-2">{test.category}</td>
              <td className="border px-4 py-2">${test.price}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="text-red-500  px-3 py-1 rounded hover:text-red-800"
                  onClick={() => handleDelete(test._id)}
                  disabled={currentActionLoading === test._id}
                >
                  {currentActionLoading === test._id ? (
                    "Deleting..."
                  ) : (
                    <MdDelete className="text-2xl" />
                  )}
                </button>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="text-blue-500  px-3 py-1 rounded hover:text-blue-800"
                  onClick={() => handleEdit(test)}
                >
                  <MdSystemUpdateAlt className="text-2xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                    setCurrentTest({
                      ...currentTest,
                      category: e.target.value,
                    })
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
                    setCurrentTest({
                      ...currentTest,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min={0.01}
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
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={currentActionLoading === currentTest._id}
                >
                  {currentActionLoading === currentTest._id
                    ? "Saving..."
                    : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentTest(null);
                  }}
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
