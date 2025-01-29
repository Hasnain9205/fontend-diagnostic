import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../Utils";
import { AuthContext } from "../provider/AuthProvider";

export default function Appointments() {
  const { user } = useContext(AuthContext);
  const { docId } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const centerId =
    location.state?.centerId?._id ||
    location.state?.centerId ||
    (doctor && doctor.centerId) ||
    null;

  console.log("Extracted centerId:", centerId);

  console.log("Center ID from state:", location.state);
  console.log("Extracted centerId:", centerId);
  console.log("docId:", docId);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/doctor/doctor-details/${docId}`
        );
        if (response.data?.doctor) {
          setDoctor(response.data.doctor);

          const formattedSlots = response.data.doctor.slots_booked.map(
            (slot) => ({
              ...slot,
              slotDate: new Date(slot.slotDate).toLocaleDateString(),
            })
          );
          setAvailableSlots(formattedSlots);
        } else {
          setError("Doctor not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch doctor details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [docId]);
  console.log("Doctor data fetched:", doctor);
  console.log("Booking request data:", {
    userId: user._id,
    docId,
    centerId,
    slotDate: selectedDate,
    slotTime: selectedTime,
  });

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire(
        "Booking Failed",
        "Please select both a date and time.",
        "error"
      );
      return;
    }

    if (!centerId) {
      Swal.fire(
        "Booking Failed",
        "Center ID is missing. Please try again.",
        "error"
      );
      console.error("Error: Center ID is missing.");
      return;
    }

    console.log("Final Booking request data:", {
      userId: user._id,
      docId,
      centerId,
      slotDate: selectedDate,
      slotTime: selectedTime,
    });

    try {
      const token = getAccessToken();
      const response = await axiosInstance.post(
        `/users/book-appointment`,
        {
          userId: user._id,
          docId,
          centerId,
          slotDate: selectedDate,
          slotTime: selectedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        Swal.fire("Success", "Appointment booked successfully.", "success");
      } else {
        Swal.fire(
          "Booking Failed",
          response.data.message || "Unable to book the appointment.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Booking Failed",
        err.response?.data?.message || "An error occurred. Please try again.",
        "error"
      );
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading doctor details...</p>
    );

  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={doctor.profileImage || "/placeholder.jpg"}
            alt={`Dr. ${doctor.name}`}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-teal-600">{doctor.name}</h1>
          <p className="text-lg text-gray-700">{doctor.degree}</p>
          <p className="mt-2 text-gray-600">{doctor.about}</p>
          <p className="mt-2">
            <strong>Specialty:</strong> {doctor.speciality}
          </p>
          <p className="mt-2">
            <strong>Experience:</strong> {doctor.experience} years
          </p>
          <p className="mt-2">
            <strong>Fees:</strong> {doctor.fees} Taka
          </p>
          <p className="mt-2">
            <strong>Status:</strong>
            <span
              className={doctor.available ? "text-green-500" : "text-red-500"}
            >
              {doctor.available ? "Available" : "Unavailable"}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor="date" className="block text-lg font-semibold">
          Select Date:
        </label>
        <select
          id="date"
          value={selectedDate}
          min={today}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime("");
          }}
          className="w-full p-3 border rounded-md mt-2"
        >
          <option value="">-- Select Date --</option>
          {[
            ...new Set(
              availableSlots
                .filter((slot) => !slot.booked)
                .map((slot) => slot.slotDate)
            ),
          ].map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {selectedDate && (
        <div className="mt-4">
          <label htmlFor="time" className="block text-lg font-semibold">
            Select Time:
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-3 border rounded-md mt-2"
          >
            <option value="">-- Select Time --</option>
            {availableSlots
              .filter((slot) => slot.slotDate === selectedDate && !slot.booked)
              .map((slot) => (
                <option key={slot._id} value={slot.slotTime}>
                  {slot.slotTime}
                </option>
              ))}
          </select>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={!selectedDate || !selectedTime}
        className="mt-6 w-full bg-teal-600 text-white p-3 rounded-md disabled:bg-gray-400"
      >
        Book Appointment
      </button>
    </div>
  );
}
