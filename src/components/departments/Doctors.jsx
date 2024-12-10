import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";
export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filterDoc, setFilterDoc] = useState([]);
  const { speciality } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get("/doctor/doctors-list");
        setDoctors(res.data.doctors);
        console.log(res.data.doctors);
      } catch (error) {
        console.log("Error fetching doctors", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [speciality, doctors]);

  const handleBookDoctor = (doctorId) => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
    } else {
      console.log("Navigating to appointments for doctor:", doctorId);
      navigate(`/appointments/${doctorId}`, { replace: true });
    }
  };

  return (
    <div className="mt-20">
      <h1 className="text-2xl font-bold text-center">
        Doctors specializing in {speciality}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {filterDoc.map((doctor) => (
          <div
            key={doctor._id}
            className="card bg-white shadow-lg rounded-md p-4"
          >
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              className="w-full h-48 object-cover"
            />
            <h2 className="text-lg font-semibold mt-2">{doctor.name}</h2>
            <p>{doctor.speciality}</p>
            <button
              onClick={() => handleBookDoctor(doctor._id)}
              className="btn bg-[#47ccc8] hover:text-white  mt-4 px-4 py-2 rounded-full hover:bg-blue-900"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
