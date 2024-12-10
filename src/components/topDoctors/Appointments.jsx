import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../Hook/useAxios";
import Swal from "sweetalert2";
import { getAccessToken } from "../../../Utils";

export default function Appointments() {
  const { docId } = useParams(); // Extract docId from URL
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctor details on mount
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/doctor/doctor-details/${docId}`
        );
        if (response.data?.doctor) {
          setDoctor(response.data.doctor);
          setAvailableSlots(response.data.doctor.slots_booked || []);
        } else {
          setError("Doctor not found");
        }
      } catch (err) {
        setError("Failed to fetch doctor details. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [docId]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(""); // Reset selected time when date changes
    console.log("Selected Date: ", e.target.value); // Debugging log
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    console.log("Selected Time: ", e.target.value); // Debugging log
  };

  // Handle the appointment booking
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Please select both a date and time.",
      });
      return;
    }

    // Confirm before booking
    const confirmBooking = await Swal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "Do you want to book this appointment?",
      showCancelButton: true,
      confirmButtonText: "Yes, book it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmBooking.isConfirmed) return;

    try {
      const token = getAccessToken();

      // Send booking request
      const response = await axiosInstance.post(
        `/users/book-appointment`,
        {
          userId: localStorage.getItem("userId"),
          docId,
          slotDate: selectedDate, // Send the formatted date
          slotTime: selectedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Appointment booked successfully.",
        });

        // Mark the slot as booked in the UI
        setAvailableSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.slotDate === selectedDate && slot.slotTime === selectedTime
              ? { ...slot, booked: true }
              : slot
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: response.data.message || "Unable to book the appointment.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text:
          err.response?.data?.message ||
          "There was an error booking the appointment. Please try again.",
      });
    }
  };

  // Display loading message while fetching doctor details
  if (loading) {
    return <p>Loading doctor details...</p>; // You could replace this with a skeleton loader for better UX
  }

  // Display error message if doctor details could not be fetched
  if (error) {
    return (
      <div className="text-center text-red-600">
        <h3>{error}</h3>
      </div>
    );
  }

  // Log the selectedDate and selectedTime to check if they are set properly
  console.log("Selected Date:", selectedDate);
  console.log("Selected Time:", selectedTime);

  // Render the appointment booking form and doctor details
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
            <strong>Status:</strong>{" "}
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
          onChange={handleDateChange}
          className="w-full p-3 border rounded-md mt-2"
        >
          <option value="">-- Select Date --</option>
          {availableSlots
            .filter((slot) => !slot.booked)
            .map((slot) => (
              <option key={slot._id} value={slot.slotDate}>
                {slot.slotDate}
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
            onChange={handleTimeChange}
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
        disabled={!selectedDate && !selectedTime}
        className="mt-6 w-full bg-teal-600 text-white p-3 rounded-md"
      >
        Book Appointment
      </button>
    </div>
  );
}
