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

  // Smooth Scroll Function
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
          <SwiperSlide key={slide.id} className="relative">
            <img
              className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
              src={slide.image}
              alt={slide.title}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4"
              slot="container-end"
            >
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-center">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-center mt-2 md:mt-4 w-full md:w-[500px]">
                {slide.description}
              </p>
              <a
                href={slide.buttonLink}
                onClick={(e) => handleScroll(e, slide.buttonLink)}
              >
                <button className="mt-4 px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-[#47ccc8] hover:bg-blue-950 hover:text-white rounded-md transition">
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
