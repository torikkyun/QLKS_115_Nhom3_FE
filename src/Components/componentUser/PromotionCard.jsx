import React, { useState, useEffect } from 'react';
import { fetchPromotions } from '../../apis/apipromotion';
import { useNavigate } from 'react-router-dom';

const PromotionBanner = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2, 3]); 
  const [currentStep, setCurrentStep] = useState(0); 
  const navigate = useNavigate();

  // Danh sách icon placeholder cho các loại khuyến mãi
  const getPromotionIcon = (index) => {
    const icons = [
      'https://img.icons8.com/ios-filled/50/000000/movie-projector.png',
      'https://img.icons8.com/ios-filled/50/000000/cocktail.png', 
      'https://img.icons8.com/ios-filled/50/000000/gift.png', 
      'https://img.icons8.com/ios-filled/50/000000/discount.png', 
    ];
    return icons[index % icons.length];
  };

  useEffect(() => {
    const loadPromotions = async () => {
      setLoading(true);
      try {
        const data = await fetchPromotions(1, 10);
        setPromotions(data);
      } catch (error) {
        console.error('Error loading promotions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPromotions();
  }, []);

  const handleViewDetails = (promotionId) => {
    navigate(`/user/promotion/${promotionId}`);
  };

  useEffect(() => {
    if (promotions.length <= 4) return; 

    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        const nextStep = (prevStep + 1) % 4; 

        const zigzagOrder = [0, 1, 3, 2];
        const positionToUpdate = zigzagOrder[nextStep];

        setCurrentIndices((prevIndices) => {
          const newIndices = [...prevIndices];
          const currentIndex = newIndices[positionToUpdate];
          newIndices[positionToUpdate] = (currentIndex + 4) % promotions.length;
          return newIndices;
        });

        return nextStep;
      });
    }, 2000); 

    return () => clearInterval(interval);
  }, [promotions]);

  const goToPrev = () => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((index) => (index - 4 + promotions.length) % promotions.length)
    );
    setCurrentStep(0);
  };

  const goToNext = () => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((index) => (index + 4) % promotions.length)
    );
    setCurrentStep(0); 
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Đang tải khuyến mãi...</span>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p>Không có khuyến mãi nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 pl-20 pr-20 pt-30 pb-20 flex flex-col md:flex-row gap-6 md:gap-20 italic">
      <div className="mb-6 md:mb-8 max-w-full md:max-w-2xl">
        <h2 className="text-2xl md:text-4xl semibold italic text-red-600 mb-2">TẬN HƯỞNG ƯU ĐÃI HẤP DẪN</h2>
        <p className="text-sm md:text-base text-gray-700 italic">
          Tận hưởng kỳ nghỉ trọn vẹn với ưu đãi mùa thu hấp dẫn chưa từng có tại Ville De Mont.
          <br />
          Nghỉ dưỡng riêng tư trong những căn biệt thự boutique cao cấp, ẩn mình trong rừng thông. Mỗi căn phòng đều sở hữu tầm view kỳ vĩ với những khoảnh khắc đắt giá của thiên: bình minh, hoàng hôn, biển mây… diễn ra ngay bên ngoài khung cửa.
          Thưởng thức ẩm thực bản địa tinh tế được chuẩn bị bởi đội ngũ đầu bếp đầy say mê, bàn tiệc ngoài trời lãng mạn sẽ mang đến cho bạn cảm xúc mới mẻ chưa từng có.
          Thư giãn với bể sục bốn mùa ngắm thung lũng, hay xoa dịu cơ thể với bồn tắm lá thuốc Dao đỏ ngay tại villa của bạn.
          Thoát khỏi những điều bình thường và đắm mình trong những trải nghiệm chưa từng có tại Ville De Mont.
        </p>
        <a href="#" className="text-sm md:text-base text-red-500 mt-2 inline-block hover:underline">Đọc thêm</a>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {currentIndices.map((promoIndex, gridIndex) => {
            const promotion = promotions[promoIndex];
            return (
              <div
                key={`${promoIndex}-${gridIndex}`}
                className="bg-white p-2 md:p-4 rounded-lg shadow transition-opacity duration-500 ease-in-out flex items-center justify-center h-28 sm:h-36 md:h-40 cursor-pointer hover:bg-blue-100 hover:scale-105"
                onClick={() => handleViewDetails(promotion.maKhuyenMai)}
              >
                <div className="text-center">
                  <img src={getPromotionIcon(promoIndex)} alt="Icon" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 md:mb-2" />
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1">
                    {promotion.tenKhuyenMai}
                  </h3>
                  <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-red-600 mb-1">
                    {promotion.kieuKhuyenMai === 'Phan tram'
                      ? `Ưu đãi ${promotion.giaTriKhuyenMai}%`
                      : `Ưu đãi ${new Intl.NumberFormat('vi-VN').format(promotion.giaTriKhuyenMai)} VND`}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-sm text-gray-600">{promotion.moTaKhuyenMai}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Nút điều khiển và dot */}
        <div className="mt-4 flex flex-col items-center">
        
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(promotions.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndices([
                    index * 4,
                    index * 4 + 1,
                    index * 4 + 2,
                    index * 4 + 3,
                  ].map((i) => i % promotions.length));
                  setCurrentStep(0); // Reset bước zigzag
                }}
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: Math.floor(currentIndices[0] / 4) === index ? '#ef4444' : '#d1d5db',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.target.style.backgroundColor = Math.floor(currentIndices[0] / 4) === index ? '#dc2626' : '#a1a9b3'}
                onMouseLeave={e => e.target.style.backgroundColor = Math.floor(currentIndices[0] / 4) === index ? '#ef4444' : '#d1d5db'}
                aria-label={`Chuyển đến nhóm khuyến mãi ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;