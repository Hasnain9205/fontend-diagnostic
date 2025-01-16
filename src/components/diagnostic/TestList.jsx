import { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";
import { getAccessToken } from "../../../Utils";
import useAxios from "../../Hook/useAxios";

const TestList = () => {
  const { state: tests } = useLocation(); // Receive tests from the navigate state
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const centerId = useParams();
  console.log("centerId", centerId);

  if (!tests || tests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl font-semibold">
          No tests available for this diagnostic center.
        </p>
      </div>
    );
  }

  const bookTest = async (test) => {
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
        if (!date || !time) {
          Swal.showValidationMessage("Both date and time are required!");
          return null;
        }
        return { appointmentDate: date, appointmentTime: time };
      },
      showCancelButton: true,
      confirmButtonText: "Book Now",
    });

    if (!formValues) return;

    const { appointmentDate, appointmentTime } = formValues;

    try {
      const token = getAccessToken();
      const userId = user?._id;

      if (!userId) {
        Swal.fire({
          icon: "warning",
          title: "Not Logged In",
          text: "Please log in to book a test.",
        });
        return navigate("/login");
      }

      const response = await useAxios.post(
        "/tests/book-test",
        {
          testId: test._id,
          userId,
          centerId: centerId.centerId,
          appointmentDate,
          appointmentTime,
        },
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

  return (
    <div className="max-w-6xl mx-auto my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map((test) => (
        <div
          key={test._id}
          className="p-6 bg-white shadow-md rounded-lg text-center"
        >
          <img
            src={test.image}
            alt={test.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h1 className="text-xl font-semibold text-gray-800">{test.name}</h1>
          <p className="mt-2 text-gray-600">{test.description}</p>
          <p className="mt-2">
            <span className="font-semibold">Category:</span> {test.category}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Price:</span> ${test.price}
          </p>
          <button
            onClick={() => bookTest(test)}
            className="mt-4 bg-[#47ccc8] font-bold hover:text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-950 transition duration-300"
          >
            Book Test
          </button>
        </div>
      ))}
    </div>
  );
};

export default TestList;
