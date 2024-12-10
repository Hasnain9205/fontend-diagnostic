import { useContext } from "react";
import { AuthContext } from "../../components/provider/AuthProvider";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { LiaAddressCardSolid } from "react-icons/lia";
import { BsGenderTrans } from "react-icons/bs";
import { BsCalendar2Date } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  console.log(user);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <figure className=" pt-10">
        <img
          src={user.profileImage || user.image || "default-profile.png"}
          alt={user.name || "Default Profile"}
          className="object-cover w-full h-64"
        />
      </figure>
      <div className="text-center mt-4">
        <p className="text-2xl font-semibold">{user.name}</p>
      </div>

      <section className=" px-6">
        <h2 className="underline text-lg mb-1">CONTACT INFORMATION</h2>
        <div className="card-body items-center text-center">
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2">
              <MdOutlineEmail />
              <h1>Email:</h1>
            </div>

            <p className="text-center text-gray-600">{user.email}</p>
          </div>
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2">
              <FiPhone />
              <h1>Phone:</h1>
            </div>

            <p className="text-center text-gray-600">{user.phone || "N/A"}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <LiaAddressCardSolid />
              <h1>Address:</h1>
            </div>

            <p className="text-center text-gray-600">{user.address || "N/A"}</p>
          </div>
        </div>
      </section>

      <section className="px-6">
        <h5 className="underline text-lg mb-2">BASIC INFORMATION</h5>
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <BsGenderTrans />
            <h1>Gender:</h1>
          </div>

          <p className="text-center text-gray-600">{user.gender || "N/A"}</p>
        </div>
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center gap-2">
            <BsCalendar2Date />
            <h1>Birthday:</h1>
          </div>

          <p className="text-center text-gray-600">{user.dob || "N/A"}</p>
        </div>
      </section>

      <div className="card-actions mt-6 text-center">
        <Link
          to="/update"
          className="btn w-full hover:bg-blue-950 hover:text-white bg-[#47ccc8] font-bold"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
