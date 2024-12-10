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
      className="mt-20 lg:flex gap-20 bg-cover bg-center bg-no-repeat lg:p-20 rounded-md"
      style={{ backgroundImage: `url(${waves})` }}
    >
      <div>
        <h1 className="text-4xl font-bold text-[#47ccc8]">
          The most modern <br />
          <span className="text-blue-950">MRI scanner testing</span>
        </h1>
        <p className="w-[800px] mt-4">
          Technique used in radiology to form pictures of the anatomy and the
          physiological processes of the body in both health and disease.
        </p>
        <div className="grid lg:grid-cols-2 mt-8 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              {feature.icon}
              <div>
                <h2 className="text-3xl font-bold">{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <img className="w-full" src={mri} alt="MRI Scanner" />
        <img
          className="absolute top-0 right-0 w-32"
          src={mriDoc}
          alt="MRI Doctor"
        />
      </div>
    </div>
  );
}
