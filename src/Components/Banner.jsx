// src/components/Banner.jsx
import React, { useState, useEffect } from 'react';
import bannerImage1 from '../assets/Image/Hotel.jpg';
import bannerImage2 from '../assets/Image/hotel2.jpg';
import bannerImage3 from '../assets/Image/hotel3.jpg';
import banner5 from '../assets/Image/banner5.jpg';
import banner6 from '../assets/Image/banner6.jpg';
import banner7 from '../assets/Image/banner7.jpg';
import banner8 from '../assets/Image/banner8.jpg';
import banner9 from '../assets/Image/banner9.jpg';


const banners = [
  {
    image: banner7,  
    title: 'Khách sạn 8 Bross luôn chào đón bạn',
    description: 'Khám phá dịch vụ và tiện nghi hàng đầu của chúng tôi.',
    subtitle: 'Luxury & Comfort'
  },
  {
    image: banner9,
    title: 'Đến 8Bross để trải nghiệm sự khác biệt',
    description: 'Khám phá dịch vụ và tiện nghi hàng đầu của chúng tôi.',
    subtitle: 'Luxury & Comfort'
  },
  
  {
    image: banner8,
    title: 'Những đêm nghỉ chân đầy trải nghiệm',
    description: 'Tận hưởng những chuyến du lịch tuyệt với.',
    subtitle: 'Trải nghiệm tuyệt vời'
  },
  
  {
    image: banner5,
    title: 'Khách sạn 8Bross - Nơi trải nghiệm tuyệt vời bắt đầu',
    description: 'Khám phá dịch vụ và tiện nghi hàng đầu của chúng tôi.',
    subtitle: 'Trải nghiệm tuyệt vời'
  },
  {
    image: banner6,
    title: 'Khám phá sự sang trọng',
    description: 'Nghỉ dưỡng đẳng cấp với dịch vụ 5 sao.',
    subtitle: 'Trải nghiệm tuyệt vời'
  },
  {
    image: bannerImage1,
    title: 'Chào mừng đến với Khách Sạn 8Bross',
    description: 'Trải nghiệm không gian nghỉ dưỡng thoải mái và hiện đại.',
    subtitle: 'Luxury & Comfort'
  },
  {
    image: bannerImage2,
    title: 'Khám phá sự sang trọng',
    description: 'Nghỉ dưỡng đẳng cấp với dịch vụ 5 sao.',
    subtitle: 'Premium Experience'
  },
  {
    image: bannerImage3,
    title: 'Thư giãn tuyệt đối',
    description: 'Hòa mình vào không gian yên bình và tiện nghi.',
    subtitle: 'Perfect Relaxation'
  },
  
  
  
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Tự động chuyển đổi sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((currentIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle slide transition with animation
  const handleSlideChange = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      setIsTransitioning(false);
    }, 700); // Thời gian trễ để hoàn thành hiệu ứng chuyển đổi
  };

  // Xử lý chuyển đổi thủ công
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    handleSlideChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % banners.length;
    handleSlideChange(newIndex);
  };

  const { image, title, description, subtitle } = banners[currentIndex];

  return (
    <div className="relative w-full h-[666px] overflow-hidden rounded-lg shadow-2xl mt-20">
      {/* Background Image with Parallax Effect */}
      <div
        className={`absolute inset-0 bg-cover bg-center transform transition-all duration-700 ease-in-out ${
          isTransitioning ? 'scale-110 opacity-80' : 'scale-100 opacity-100'
        }`}
        style={{ backgroundImage: `url(${image})` }}
      />
      
      {/* Gradient Overlays for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
        <div className={`transform transition-all duration-500 ${
          isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}>
          {/* Subtitle */}
          <div className="mb-2">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium tracking-wider uppercase border border-white/30">
              {subtitle}
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              {title}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed text-gray-100 drop-shadow-lg">
            {description}
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <button onClick={() =>handleSlideChange((currentIndex + 1) % banners.length)}
            className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full font-semibold text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20">
              <span className="flex items-center gap-2">
                Khám phá ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 group"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 group"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 mx-auto group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Enhanced Dots Navigation */}
      <div className="absolute bottom-6 flex gap-3 left-1/2 transform -translate-x-1/2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`relative transition-all duration-300 ${
              index === currentIndex 
                ? 'w-12 h-3 bg-white rounded-full shadow-lg' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentIndex && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-75 ease-linear"
          style={{ 
            width: `${((currentIndex + 1) / banners.length) * 10}%`,
            animation: 'progress 5s linear infinite'
          }}
        />
      </div>


      <div className="absolute top-8 right-8 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse transform rotate-45  " />
      <div className="absolute top-12 right-12 w-10 h-10 border-2 border-white/30 rounded-full animate-bounce" />
      <div className="absolute top-14 right-14 w-12 h-12 border-2 border-white/20 rounded-full animate-pulse" />
      <div className="absolute top-10 right-10 w-6 h-6 border-2 border-white/30 rounded-full animate-bounce" />
      <div className="absolute top-20 right-20 w-4 h-4 border-2 border-white/30 rounded-full animate-pulse" />
      
      <div className="absolute top-16 right-16 w-8 h-8 border-2 border-white/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: ${100 / banners.length}%; }
        }
      `}</style>
    </div>
  );
};

export default Banner;