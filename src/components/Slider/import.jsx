import doctor from "../../../src/assets/doctor3.jpg";
import ctScan from "../../../src/assets/ctScan.webp";
import xray from "../../../src/assets/xray.jpg";
import patho from "../../../src/assets/patho.jpg";

const slides = [
  {
    id: "item1",
    image: doctor,
    title: "Our Expert Doctors",
    description:
      "Our team of expert doctors specialize in heart, skin, bone, brain, and child health, providing top-tier medical care.",
    buttonLabel: "Book an Appointment",
    buttonLink: "#Speciality",
  },
  {
    id: "item2",
    image: ctScan,
    title: "Advanced CT Scan Services",
    description:
      "Our state-of-the-art CT scanning technology ensures accurate diagnostics for better treatment.",
    buttonLabel: "24/7 CT Scan Services",
    buttonLink: "#testServices",
  },
  {
    id: "item3",
    image: xray,
    title: "Comprehensive X-Ray Imaging",
    description:
      "We provide high-resolution X-ray imaging for detailed analysis and quicker diagnosis.",
    buttonLabel: "Get an X-Ray Now",
    buttonLink: "#testServices",
  },
  {
    id: "item4",
    image: patho,
    title: "Expert Pathology Services",
    description:
      "Our pathology team delivers precise lab results, essential for effective treatment planning.",
    buttonLabel: "Explore Pathology Services",
    buttonLink: "#testServices",
  },
];

export default slides;
