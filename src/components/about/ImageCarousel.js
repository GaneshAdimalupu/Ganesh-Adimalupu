// src/components/about/ImageCarousel.js

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const ImageCarousel = ({ images }) => {
  // This safety check is still good practice.
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="image-carousel-container">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={30}
        slidesPerView={1}
        // --- THIS IS THE FIX ---
        loop={false} // Changed from true to false
        // -----------------------
        effect={'fade'}
        autoplay={{
          delay: 3500, // Slightly increased delay
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="mySwiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Ganesh teaching session ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
