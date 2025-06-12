import { FaArrowCircleRight } from "react-icons/fa";
import drImg from "../../../src/assets/drg.png";

export default function Skills() {
  return (
    <div>
      {/* About Clinic Section */}
      <div className="flex flex-col lg:flex-row items-center justify-around gap-10 lg:gap-20 mt-20 px-4">
        <div
          className="text-left"
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <h5 className="text-xl font-medium text-[#47ccc8]">About clinic</h5>
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-2">
            Why patients choose our center
          </h1>
          <p className="mt-4 w-full max-w-[700px] text-base lg:text-lg">
            At our clinic, we are dedicated to providing top-quality medical
            care with a focus on patient comfort and satisfaction. Equipped with
            the latest diagnostic technology and a team of experienced
            specialists, we ensure accurate, compassionate, and timely
            healthcare for every individual. Your health is our priority.
          </p>
          <button className="flex items-center bg-[#47ccc8] hover:text-white hover:bg-blue-950 transition duration-200 px-8 py-4 font-bold mt-4 rounded-full">
            Read more
            <FaArrowCircleRight className="ml-2" />
          </button>
        </div>

        {/* Clinic Skills Section */}
        <div
          className="text-left  lg:mt-0"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <h5 className="text-xl font-medium text-[#47ccc8]">Clinic skills</h5>
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-2">
            Our specialisations
          </h1>
          <div className="flex flex-wrap justify-center lg:justify-start gap-10 mt-8">
            <div className="text-center">
              <div
                className="radial-progress text-[#47ccc8]"
                style={{ "--value": 85 }}
                role="progressbar"
                aria-label="85% in Cardiology"
              >
                85%
              </div>
              <h1 className="mt-2 font-medium">Cardiology</h1>
            </div>
            <div className="text-center">
              <div
                className="radial-progress text-[#47ccc8]"
                style={{ "--value": 68 }}
                role="progressbar"
                aria-label="68% in Neurology"
              >
                68%
              </div>
              <h1 className="mt-2 font-medium">Neurology</h1>
            </div>
            <div className="text-center">
              <div
                className="radial-progress text-[#47ccc8]"
                style={{ "--value": 79 }}
                role="progressbar"
                aria-label="79% in Orthopedics"
              >
                79%
              </div>
              <h1 className="mt-2 font-medium">Orthopedics</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Image Section */}
      <div
        className="flex justify-center items-center mt-4"
        data-aos="zoom-in"
        data-aos-duration="1000"
      >
        <img src={drImg} alt="Doctor" className="max-w-full h-auto" />
      </div>

      {/* Statistics Section */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4"
        data-aos="fade-right"
        data-aos-duration="1000"
      >
        <div className="p-8 border-r-2 border-dashed text-center">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold mb-2">86</h1>
          <p>Qualified doctors</p>
        </div>
        <div className="p-8 border-r-2 border-dashed text-center">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold mb-2">19</h1>
          <p>Diagnostic departments</p>
        </div>
        <div className="p-8 border-r-2 border-dashed text-center">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold mb-2">27</h1>
          <p>Years of experience</p>
        </div>
        <div className="p-8 border-r-2 border-dashed text-center">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold mb-2">50+</h1>
          <p>Patients every day</p>
        </div>
        <div className="p-8 border-r-2 border-dashed text-center">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold mb-2">99%</h1>
          <p>Diagnosis accuracy</p>
        </div>
        <div className="p-8 text-center">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold mb-2">6</h1>
          <p>Branches in the country</p>
        </div>
      </div>
    </div>
  );
}
