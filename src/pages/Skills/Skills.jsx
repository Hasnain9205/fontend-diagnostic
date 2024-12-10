import { FaArrowCircleRight } from "react-icons/fa";
import drImg from "../../../src/assets/drg.png";

export default function Skills() {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-around gap-10 md:gap-20 mt-20">
        <div className="text-left">
          <h5 className="text-xl font-medium text-[#47ccc8]">About clinic</h5>
          <h1 className="text-4xl font-extrabold mt-2">
            Why patients choose our center
          </h1>
          <p className="mt-4 w-full max-w-[700px]">
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
        <div className="text-left">
          <h5 className="text-xl font-medium text-[#47ccc8]">Clinic skills</h5>
          <h1 className="text-4xl font-extrabold mt-2">Our specialisations</h1>
          <div className="flex gap-10 mt-8">
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

      <div className="flex justify-center items-center ">
        <img src={drImg} alt="Doctor" className="max-w-full h-auto" />
      </div>
      <div className=" flex border-gray-100 rounded-md">
        <div className="p-12 border-r-2 border-dashed">
          <h1 className="text-4xl text-[#47ccc8] font-extrabold text-center mb-2">
            86
          </h1>
          <p className="">Qualified doctors</p>
        </div>
        <div className="p-12 border-r-2 border-dashed">
          <h1 className="text-4xl text-center text-[#47ccc8] font-extrabold mb-2">
            19
          </h1>
          <p>Diagnostic departments</p>
        </div>
        <div className="p-12 border-r-2 border-dashed">
          <h1 className="text-4xl text-center text-[#47ccc8] font-extrabold mb-2">
            27
          </h1>
          <p>Years of experience</p>
        </div>
        <div className="p-12 border-r-2 border-dashed">
          <h1 className="text-4xl text-center text-[#47ccc8] font-extrabold mb-2">
            50+
          </h1>
          <p>Patients every day</p>
        </div>
        <div className="p-12 border-r-2 border-dashed">
          <h1 className="text-4xl text-center mb-2 text-[#47ccc8] font-extrabold">
            99%
          </h1>
          <p>Diagnosis accuracy</p>
        </div>
        <div className="p-12">
          <h1 className="text-4xl text-center mb-2 text-[#47ccc8] font-extrabold">
            6
          </h1>
          <p>Branches in the country</p>
        </div>
      </div>
    </div>
  );
}
