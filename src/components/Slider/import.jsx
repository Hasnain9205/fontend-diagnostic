import doctor from "../../../src/assets/doctor3.jpg";
import diagnostic from "../../../src/assets/diagnostic.jpg";
import employees from "../../../src/assets/employees.jpg";
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
    image: diagnostic,
    title: "Advanced & Reliable Diagnostic Solutions",
    description:
      "Our advanced diagnostic services ensure accurate and reliable health assessments for better treatment.",
    buttonLabel: "24/7 Diagnostic  Services",
    buttonLink: "#diagnosticServices",
  },
  {
    id: "item3",
    image: employees,
    title: "Meet Our Dedicated Team",
    description:
      "Our highly skilled and professional team is committed to providing top-quality healthcare services with compassion and expertise.",
    buttonLabel: "Our Team",
    buttonLink: "#ourEmployees",
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
