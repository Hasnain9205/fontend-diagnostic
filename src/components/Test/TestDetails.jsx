import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";

const TestDetails = () => {
  const { testId } = useParams(); // Fetch testId from URL params
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const token = getAccessToken();
        const response = await axiosInstance.get(
          `/tests/test-by-id/${testId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTest(response.data.test);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch test details. Redirecting to home...",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [testId, navigate]);

  const bookTest = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Book Test Appointment",
      html: `
        <input id="date" type="date" class="swal2-input" placeholder="Appointment Date" />
        <input id="time" type="time" class="swal2-input" placeholder="Appointment Time" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        return { appointmentDate: date, appointmentTime: time };
      },
      showCancelButton: true,
      confirmButtonText: "Book Now",
    });

    if (!formValues) return;

    const { appointmentDate, appointmentTime } = formValues;

    try {
      const token = getAccessToken();
      const userId = localStorage.getItem("userId");
      if (!userId) {
        Swal.fire({
          icon: "warning",
          title: "Not Logged In",
          text: "Please log in to book a test.",
        });
        return navigate("/login");
      }

      const response = await axiosInstance.post(
        "/tests/book-test",
        { testId, userId, appointmentDate, appointmentTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });

      navigate("/testAppointment");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading test details...</p>
      </div>
    );

  if (!test)
    return <p className="text-center text-gray-600">Test not found.</p>;

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      <div className="text-center">
        <img
          src={test.image}
          alt={test.name}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h1 className="text-2xl font-semibold text-gray-800">{test.name}</h1>
        <p className="mt-2 text-gray-600">{test.description}</p>
        <p className="mt-2">
          <span className="font-semibold">Category:</span> {test.category}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Price:</span> ${test.price}
        </p>
      </div>
      <button
        onClick={bookTest}
        className="mt-6 w-full bg-[#47ccc8] font-bold hover:text-white py-2 rounded-md shadow-md hover:bg-blue-950 transition duration-300"
      >
        Book Test
      </button>
    </div>
  );
};

export default TestDetails;
