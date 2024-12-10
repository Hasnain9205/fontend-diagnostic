import { FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { departmentsData } from "./import";

export default function Departments() {
  return (
    <div id="Speciality" className="mt-20">
      <h1 className="text-3xl font-bold text-center">Find by Speciality</h1>
      <p className="text-center mt-4">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <section className="mt-10 lg:flex items-center justify-center gap-10">
        <div className="text-center bg-[#47ccc8] w-[500px] h-[430px] rounded-md py-10">
          <h2 className="text-4xl font-extrabold text-white px-[120px] mt-10 text-start">
            World leader <span className="text-blue-950">in diagnostics</span>
          </h2>
          <p className="mt-4 text-lg px-20 text-gray-600">
            Our cutting-edge technology and expert team ensure accurate and
            timely results for all your diagnostic needs.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <button className="bg-blue-900 text-white hover:bg-white hover:text-black transition duration-200 text-xl font-bold px-6 py-4 rounded-full flex items-center justify-center gap-2">
              Choose Diagnostic <FaArrowRight />
            </button>
          </div>
        </div>
        <div className="bg-gray-200 p-8 rounded-md">
          <div className="flex flex-wrap justify-center gap-6">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departmentsData.map((department, index) => (
                <li
                  key={index}
                  className="p-6 bg-white rounded-md hover:bg-blue-950 hover:text-white"
                >
                  <Link
                    onClick={() => scrollTo(0, 0)}
                    to={`/doctors/${department.speciality}`}
                  >
                    <span className="w-full h-24 rounded-md flex items-center justify-center">
                      {department.icon}
                    </span>
                    <h2 className="mt-2 text-center">{department.name}</h2>
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
