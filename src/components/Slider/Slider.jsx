import slides from "./import";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function Slider() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty("--progress", 1 - progress);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  // Function to handle smooth scroll to the target section
  const handleScroll = (event, link) => {
    event.preventDefault();
    const targetId = link.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img className="w-full h-96" src={slide.image} alt={slide.title} />
            <div
              className="autoplay-progress absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white"
              slot="container-end"
            >
              <h1 className="font-bold text-3xl text-center">{slide.title}</h1>
              <p className="w-[480px] text-center mt-4">{slide.description}</p>
              <a
                href={slide.buttonLink}
                onClick={(e) => handleScroll(e, slide.buttonLink)}
              >
                <button className="btn bg-[#47ccc8] hover:bg-blue-950 hover:text-white mt-4">
                  {slide.buttonLabel}
                </button>
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
