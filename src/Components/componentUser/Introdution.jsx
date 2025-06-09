import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Sparkles, Heart } from 'lucide-react';

const Introduction = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Simulate scroll observer
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleSections(new Set([0, 1, 2]));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (index) => {
    console.log(`Navigating to details for section ${index}`);
  };

  const sections = [
    {
      image: 'https://housedesign.vn/wp-content/uploads/2020/03/giuong-ngu-khach-san.jpg',
      title: 'KHÔNG GIAN NGHỈ NGƠI THÔNG MINH',
      description: 'Trải nghiệm công nghệ tiên tiến với phòng ngủ thông minh được trang bị đầy đủ tiện nghi hiện đại. Chỉ với vài thao tác đơn giản, bạn có thể điều khiển toàn bộ không gian để tạo nên môi trường nghỉ ngơi hoàn hảo.',
      highlight: 'LƯU TRÚ 24/7',
      subTitle: 'PHÒNG NGỦ THÔNG MINH & TIỆN NGHI',
      icon: <Sparkles className="w-6 h-6" />,
      imagePosition: 'left',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      image: 'https://www.samdihotel.vn/uploads/image/images/16a3e309b5a14bff12b0.jpg',
      title: 'THƯ GIÃN ĐẲNG CẤP TẠI SPA',
      description: 'Thư giãn tuyệt đối với không gian spa yên bình, được thiết kế để mang lại sự thoải mái tối đa. Trải nghiệm liệu trình chăm sóc đặc biệt giúp cơ thể và tâm hồn được tái tạo năng lượng hoàn toàn.',
      highlight: 'SPA 5 SAO',
      subTitle: 'TRẢI NGHIỆM THƯ GIÃN ĐỈNH CAO',
      icon: <Heart className="w-6 h-6" />,
      imagePosition: 'right',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      image: 'https://thietkethicong.org/images/Product/xay-dung-noi-that-khach-san-hote-chuan-sao-c-12.jpg',
      title: 'ẨM THỰC TINH TẾ & ĐẲNG CẤP',
      description: 'Nhà hàng mang đến trải nghiệm ẩm thực tinh tế với các món ăn được chế biến bởi đầu bếp hàng đầu. Tận hưởng không gian sang trọng cùng tầm nhìn tuyệt đẹp, mỗi món ăn là một tác phẩm nghệ thuật.',
      highlight: 'MICHELIN GUIDE',
      subTitle: 'TRẢI NGHIỆM ẨM THỰC ĐỈNH CAO',
      icon: <Star className="w-6 h-6" />,
      imagePosition: 'left',
      gradient: 'from-orange-500 to-red-600'
    },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white">
      {sections.map((section, index) => {
        const isVisible = visibleSections.has(index);
        const isReverse = section.imagePosition === 'right';
        
        return (
          <div
            key={index}
            className={`min-h-screen flex flex-col lg:flex-row gap-8 lg:gap-20 px-6 lg:px-20  lg:py-20 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'
            } ${isReverse ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Image Section */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="relative group">
                <div className={` ${section.gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-[400px] lg:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className={`w-full lg:w-1/2 flex flex-col justify-center transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="space-y-6">
                {/* Highlight Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${section.gradient} text-white rounded-full text-sm font-semibold shadow-lg`}>
                  {section.icon}
                  <span>{section.highlight}</span>
                </div>

                {/* Main Title */}
                <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  {section.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed">
                  {section.description}
                </p>

                {/* Subtitle */}
                <div className="pt-4">
                  <h3 className={`text-xl lg:text-2xl font-semibold bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent mb-6`}>
                    {section.subTitle}
                  </h3>
                  
                
                </div>

                {/* Decorative Elements */}
                <div className="flex items-center gap-4 pt-6 opacity-60">
                  <div className={`w-12 h-1 bg-gradient-to-r ${section.gradient} rounded-full`}></div>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 bg-gradient-to-r ${section.gradient} rounded-full `}
                        style={{ animationDelay: `${i * 200}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      
    </div>
  );
};

export default Introduction;