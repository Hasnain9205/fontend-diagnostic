import Slider from "../../components/Slider/Slider";
import AllTest from "../../components/Test/AllTest";
import Departments from "../../components/departments/Departments";
import AllDiagnostic from "../../components/diagnostic/AllDiagnostic";

import Mri from "../../components/mri/Mri";
import TopDoctors from "../../components/topDoctors/TopDoctors";
import Faq from "../FAQ/Faq";
import Skills from "../Skills/Skills";

export default function Home() {
  return (
    <div>
      <Slider />
      <AllDiagnostic />
      <Departments />
      <AllTest />
      <Skills />
      <TopDoctors />
      <Mri />
      <Faq />
    </div>
  );
}
