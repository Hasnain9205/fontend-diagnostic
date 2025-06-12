import { PiBrainLight } from "react-icons/pi";
import { GiKneeCap } from "react-icons/gi";
import { GiLiver } from "react-icons/gi";
import mri from "../../../src/assets/mri.png";
import mriDoc from "../../../src/assets/mri-doctor.png";
import waves from "../../../src/assets/waves.png";
import breast from "../../../src/assets/breast1.webp";

const features = [
  {
    title: "Brain and vessels",
    description:
      "Pellentesque erat erat, dapibus non laoreet eu, tincidunt quis ante.",
    icon: <PiBrainLight className="w-16 h-16 text-[#47ccc8]" />,
  },
  {
    title: "Spine and joints",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    icon: <GiKneeCap className="w-16 h-16 text-[#47ccc8]" />,
  },
  {
    title: "Mammary gland",
    description: "Aliquam eget tortor eu mauris vestibulum faucibus.",
    icon: <img src={breast} className="w-12 h-12 text-[#47ccc8]" />,
  },
  {
    title: "Liver Function",
    description:
      "Ut semper massa id velit accumsan, non hendrerit quam bibendum.",
    icon: <GiLiver className="w-16 h-16 text-[#47ccc8]" />,
  },
];

export default function Mri() {
  return (
    <div
      className="mt-20 bg-cover bg-center bg-no-repeat p-6 md:p-12 lg:p-20 rounded-md flex flex-col lg:flex-row gap-10"
      style={{ backgroundImage: `url(${waves})` }}
    >
      {/* Left Section */}
      <div className="flex-1" data-aos="fade-right" data-aos-duration="1000">
        <h1 className="text-3xl md:text-4xl font-bold text-[#47ccc8]">
          The most modern <br />
          <span className="text-blue-950">MRI scanner testing</span>
        </h1>
        <p className="mt-4 text-sm md:text-base lg:w-[500px]">
          Technique used in radiology to form pictures of the anatomy and the
          physiological processes of the body in both health and disease.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              {feature.icon}
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  {feature.title}
                </h2>
                <p className="text-sm md:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section (MRI Images) */}
      <div
        className="flex-1 relative flex justify-center"
        data-aos="fade-left"
        data-aos-duration="1000"
      >
        <img className="w-72 md:w-96 lg:w-full" src={mri} alt="MRI Scanner" />
        <img
          className="absolute top-0 right-0 w-20 md:w-28 lg:w-32"
          src={mriDoc}
          alt="MRI Doctor"
        />
      </div>
    </div>
  );
}
