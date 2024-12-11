import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";
import { getAccessToken } from "../../../Utils";
import { useNavigate } from "react-router-dom";

export default function TopDoctors() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get("/doctor/doctors-list");
        setDoctors(res.data.doctors);
        console.log(res.data.doctors);
      } catch (error) {
        console.log("get doctor error", error);
      }
    };
    fetchDoctors();
  }, []);
  const handleBookDoctor = (docId) => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login", { state: { from: `/appointments/${docId}` } });
    } else {
      navigate(`/appointments/${docId}`);
    }
  };

  return (
    <div className="mt-20">
      <div className="flex flex-col justify-center items-center">
        <p className="text-xl font-bold text-[#47ccc8]">Our Team</p>
        <h1 className="font-extrabold text-4xl mt-2">Visit Our Top Doctors</h1>
        <p className="w-[850px] mt-4 text-center">
          Our expert doctors provide specialized care in various fields,
          including cardiology, dermatology, neurology, and pediatrics. With
          years of experience and dedication, they ensure the best medical
          treatment tailored to your needs.
        </p>
      </div>
      <div className="mt-16 flex flex-wrap gap-6 justify-center">
        {doctors?.slice(0, 9).map((doctor, index) => (
          <div
            key={index}
            className="card card-compact bg-base-100 w-96 shadow-xl cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
          >
            <figure>
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="flex items-center mt-4 px-2">
              <p
                className={`${
                  doctor.available ? "bg-green-500" : "bg-red-500"
                } w-3 h-3 rounded-full mr-2`}
              ></p>
              <p>{doctor.available ? "Available" : "Unavailable"}</p>
            </div>
            <div className="card-body">
              <h2 className="card-title">{doctor.name}</h2>
              <p>{doctor.speciality}</p>

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleBookDoctor(doctor._id)}
                  className="btn bg-[#47ccc8] hover:bg-blue-950 hover:text-white w-full"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="btn btn-link text-[#47ccc8]"
        >
          More Doctors
        </button>
      </div>
    </div>
  );
}
