'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import CSS Swiper
import 'swiper/css/navigation'; // Optional: Untuk tombol navigasi
import 'swiper/css/pagination'; // Optional: Untuk pagination
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

const NovelCarousel = () => {
  const [novels, setNovels] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/public/novels');
        if (!response.ok) {
          throw new Error('Failed to fetch novels');
        }
        const data = await response.json();
        setNovels(data.novels); // Access the "novels" array from the response
      } catch (error) {
        console.error('Error fetching novels:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Featured Novels
      </h2>

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1} // Default: 1 slide per view
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 6,
          },
        }}
        navigation // Enable navigation arrows
        pagination={{ clickable: true }} // Enable pagination dots
        autoplay={{ delay: 3000 }} // Autoplay with 3-second delay
        loop // Enable infinite loop
        className="rounded-lg overflow-hidden"
      >
        {novels.map((novel) => (
          <SwiperSlide key={novel.id}>
            <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>

              {/* Thumbnail */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={novel.thumbnail}
                  alt={novel.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <Link href={`/pages/novels/${novel.slug}`}>
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {novel.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-200 mt-2 line-clamp-3">
                  By {novel.contributor?.user.name || 'Unknown Contributor'}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NovelCarousel;