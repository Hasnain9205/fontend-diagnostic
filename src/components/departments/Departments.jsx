import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { departmentsData } from "./import";

export default function Departments() {
  return (
    <div id="Speciality" className="mt-20 px-4 md:px-8 lg:px-16">
      <h1 className="text-2xl md:text-3xl font-bold text-center">
        Find by Speciality
      </h1>
      <p className="text-center mt-3 md:mt-4 text-sm md:text-base">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      <section className="mt-10 flex flex-col lg:flex-row items-center justify-center gap-10">
        {/* Left Section */}
        <div
          className="text-center bg-[#47ccc8] w-full lg:w-[500px] rounded-md py-10 px-6 md:px-12"
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-white text-start">
            World leader <br />
            <span className="text-blue-950">in diagnostics</span>
          </h2>
          <p className="mt-4 text-sm md:text-lg text-gray-200">
            Our cutting-edge technology and expert team ensure accurate and
            timely results for all your diagnostic needs.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Link
              onClick={() => scroll(0, 0)}
              to={`/diagnostic`}
              className="bg-blue-900 text-white hover:bg-white hover:text-black transition duration-200 text-sm md:text-xl font-bold px-5 md:px-6 py-3 md:py-4 rounded-full flex items-center justify-center gap-2"
            >
              Choose Diagnostic <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="bg-gray-200 p-6 md:p-8 rounded-md w-full"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <div className="flex flex-wrap justify-center">
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {departmentsData.map((department, index) => (
                <li
                  key={index}
                  className="p-4 md:p-6 bg-white rounded-md hover:bg-blue-950 hover:text-white transition duration-200"
                >
                  <Link
                    onClick={() => scrollTo(0, 0)}
                    to={`/doctors/${department.speciality}`}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                      {department.icon}
                    </span>
                    <h2 className="mt-2 text-sm md:text-lg">
                      {department.name}
                    </h2>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
