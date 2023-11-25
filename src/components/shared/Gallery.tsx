import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { Swiper as SwiperClass } from "swiper/types";
import OptimizedImage from "@/components/shared/OptimizedImage";
import ChevronIcon from "@/components/icons/ChevronIcon";

interface IProps {
  images: string[];
}

const Gallery: React.FC<IProps> = ({ images }) => {
  const thumbs = useRef<SwiperClass>();
  const gallery = useRef<SwiperClass>();
  const nextButton = useRef<HTMLButtonElement>(null);
  const prevButton = useRef<HTMLButtonElement>(null);

  function changeSlide(swiper: SwiperClass) {
    if (!swiper || !swiper.slides) return;
    const slide = swiper.slides[swiper.activeIndex];
    const height = slide.getBoundingClientRect().height;
    if (height === 0) setTimeout(() => changeSlide(swiper), 100);
    else swiper.el.style.height = `${height}px`;
  }

  useEffect(() => {
    if (!gallery.current) return;
    function resize() {
      changeSlide(gallery.current!);
    }

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [gallery]);

  return (
    <div className="flex flex-col gap-8 border border-dark-gray border-opacity-20 p-4">
      <Swiper
        onSwiper={(s) => (gallery.current = s)}
        onAfterInit={changeSlide}
        className="!w-full transition-[height]"
        spaceBetween={20}
        navigation={{
          prevEl: prevButton.current,
          nextEl: nextButton.current,
          disabledClass: "opacity-50 pointer-events-none",
        }}
        thumbs={{ swiper: thumbs.current }}
        modules={[FreeMode, Navigation, Thumbs]}
        onSlideChange={changeSlide}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i} className="!flex !h-fit justify-center">
            <OptimizedImage src={img} className="h-auto w-full max-w-2xl" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center gap-4">
        <button ref={prevButton}>
          <ChevronIcon className="rotate-180" />
        </button>
        <Swiper
          onSwiper={(s) => (thumbs.current = s)}
          spaceBetween={20}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {images.map((img, i) => (
            <SwiperSlide
              key={i}
              className="!flex !w-fit flex-col gap-1 opacity-50 [&.swiper-slide-thumb-active>.indicator]:block [&.swiper-slide-thumb-active]:opacity-100"
            >
              <OptimizedImage src={img} className="h-20 w-auto" />
              <div className="indicator hidden h-0.5 w-full bg-dark-gray"></div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button ref={nextButton}>
          <ChevronIcon />
        </button>
      </div>
    </div>
  );
};

export default Gallery;
