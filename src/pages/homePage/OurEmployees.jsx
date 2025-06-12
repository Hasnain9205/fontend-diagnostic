import { useEffect, useState } from "react";
import axiosInstance from "../../Hook/useAxios";

export default function OurEmployees() {
  const [employees, setEmployees] = useState([]);

  // Fetch Employees on Component Mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/employee/employees");
        setEmployees(response.data);
        console.log("Fetched employees:", response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div
      id="ourEmployees"
      className="flex flex-col justify-center items-center mt-20"
    >
      <h1 className="flex flex-col justify-center items-center rounded-md text-3xl font-bold">
        Our Dedicated Team
      </h1>
      <p className="text-center text-gray-700 mx-6 mb-8 mt-2">
        Meet our dedicated employees who ensure the best service for you.
      </p>

      <section className="mt-16 flex flex-wrap gap-6 justify-center">
        {employees?.slice(0, 6).map((employee) => (
          <div
            key={employee._id}
            className="card card-compact p-6 bg-base-100 lg:w-96 shadow-xl cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            data-aos="flip-right"
            data-aos-duration="1000"
          >
            <img
              className="w-full h-48 object-cover"
              src={employee.profileImage}
              alt={employee.name}
            />
            <h2 className="text-2xl font-bold mb-2 mt-4">{employee.name}</h2>
            <p className="text-gray-600 mb-2 ">{employee.position}</p>

            <p className="text-green-600 mb-2 font-bold">
              Department : {employee.department}
            </p>
            <p className="text-green-600 mb-2 font-bold">
              Job Location : {employee.centerId?.name}
            </p>

            <div className="flex items-center mb-2 px-2">
              <p
                className={`${
                  employee.status ? "bg-green-500" : "bg-red-500"
                } w-3 h-3 rounded-full mr-2`}
              ></p>
              <p>{employee.status ? "Active" : "Inactive"}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
