import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPromotions } from '../../apis/apipromotion';
import Header from '../../Components/componentUser/Header';
import Footer from '../../Common/Footer';
import { useTranslation } from 'react-i18next';

const PromotionScreen = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPromotion = async () => {
      setLoading(true);
      try {
        const data = await fetchPromotions(1, 20);
        // So sánh đúng id
        const foundPromotion = data.find((promo) => String(promo.maKhuyenMai) === String(id));
        if (!foundPromotion) {
          throw new Error(t('promotion_not_found', { defaultValue: 'Không tìm thấy khuyến mãi.' }));
        }
        setPromotion(foundPromotion);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPromotion();
  }, [id, t]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const formatDiscount = (value, type) => {
    if (type === 'Phan tram' || type === 'Phần trăm') {
      return `${value}%`;
    }
    return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="text-lg font-medium">{t('loading_promotion', { defaultValue: 'Đang tải...' })}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header className="sticky top-0 z-40 bg-white shadow transition-all duration-300 ease-in-out" />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate('/user/promotions')}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('back', { defaultValue: 'Quay lại' })}
        </button>

        {/* Thông tin khuyến mãi */}
        <div className="space-y-6">
          {/* Hình ảnh */}
          <img
            className="w-full h-64 object-cover rounded-md"
            src={promotion.hinhAnh || 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop'}
            alt={t('promotion_image_alt', { defaultValue: `Khuyến mãi ${promotion.tenKhuyenMai}` })}
          />
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{promotion.tenKhuyenMai}</h1>
          <div className="text-2xl font-semibold text-indigo-600">
            {t('discount', { defaultValue: 'Giảm giá:' })} {formatDiscount(promotion.giaTriKhuyenMai, promotion.kieuKhuyenMai)}
          </div>
          <div className="text-gray-700 text-base leading-relaxed">
            <span className="font-semibold">{t('description', { defaultValue: 'Mô tả:' })}</span> {promotion.moTaKhuyenMai}
          </div>
          <div className="text-gray-600 text-sm">
            <span className="font-semibold">{t('promotion_period', { defaultValue: 'Thời gian áp dụng:' })}</span>{' '}
            {formatDate(promotion.ngayBatDau)} - {formatDate(promotion.ngayKetThuc)}
          </div>
          <button
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-200"
            onClick={() => alert(t('promotion_applied', { defaultValue: 'Áp dụng khuyến mãi thành công!' }))}
          >
            {t('apply_now', { defaultValue: 'Áp dụng ngay' })}
          </button>
        </div>
      </main>
      <Footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8 transition-all duration-300 ease-in-out" />
    </div>
  );
};

export default PromotionScreen;