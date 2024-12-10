import { FaChild } from "react-icons/fa6";
import { GiHeartOrgan, GiKneeCap, GiStomach } from "react-icons/gi";
import { GrUserFemale } from "react-icons/gr";
import { HiOutlineScissors } from "react-icons/hi2";
import { LiaAllergiesSolid } from "react-icons/lia";
import { PiBrainLight } from "react-icons/pi";

export const departmentsData = [
  {
    name: "Gastroenterology",
    icon: <GiStomach className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "gastrology",
  },
  {
    name: "Neurology",
    icon: <PiBrainLight className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "neurology",
  },
  {
    name: "Pediatrics",
    icon: <FaChild className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "pediatric",
  },
  {
    name: "Cardiology",
    icon: <GiHeartOrgan className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "cardiology",
  },
  {
    name: "Orthopedics",
    icon: <GiKneeCap className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "orthopedic",
  },
  {
    name: "Gynecology",
    icon: <GrUserFemale className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "gynecology",
  },
  {
    name: "Surgery",
    icon: <HiOutlineScissors className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "surgery",
  },
  {
    name: "Dermatology",
    icon: <LiaAllergiesSolid className="w-16 h-16 text-[#47ccc8]" />,
    speciality: "dermatology",
  },
];
