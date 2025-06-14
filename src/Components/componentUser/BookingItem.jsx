import React from 'react';
import { Button } from 'antd';
import { FaTrash, FaBed, FaCalendarAlt, FaConciergeBell } from 'react-icons/fa';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const BookingItem = ({ booking, onRemove, onBook }) => {
  const { t } = useTranslation();

  // Hàm kiểm tra điều kiện áp dụng khuyến mãi (tương tự RoomDetail.js)
  const isPromotionApplicable = (promo, dates) => {
    if (!dates[0] || !dates[1]) return false;
    const checkInDate = dayjs(dates[0]);
    const checkOutDate = dayjs(dates[1]);
    const startDate = dayjs(promo.ngayBatDau);
    const endDate = dayjs(promo.ngayKetThuc);

    const isWithinPeriod = !checkInDate.isBefore(startDate) && !checkInDate.isAfter(endDate);
    return isWithinPeriod;
  };

  const calculateBookingTotal = () => {
    const serviceTotal = booking.services.reduce((total, item) => total + (item?.gia || 0), 0);
    let roomTotal = (booking.room?.giaPhong || 0) * booking.numberOfNights;

    // Áp dụng khuyến mãi từ booking.promotion
    const promotion = booking.promotion;
    if (promotion && isPromotionApplicable(promotion, booking.dates)) {
      const tenKieuKhuyenMai = promotion.tenKieuKhuyenMai || 'Phần trăm';
      let giaTriKhuyenMai = promotion.giaTriKhuyenMai || 0;

      // Nếu mô tả khuyến mãi có chứa "20%", sử dụng 20% thay vì giá trị không nhất quán
      if (promotion.moTaKhuyenMai?.includes('20%')) {
        giaTriKhuyenMai = 20;
      }

      if (tenKieuKhuyenMai === 'Phần trăm') {
        roomTotal *= (1 - giaTriKhuyenMai / 100);
      } else if (tenKieuKhuyenMai === 'Giảm giá trực tiếp') {
        roomTotal -= giaTriKhuyenMai;
      }
    }

    return Math.max(0, serviceTotal + roomTotal); // Đảm bảo tổng không âm
  };

  // Hàm hiển thị thông tin khuyến mãi
  const renderPromotionInfo = (promotion) => {
    if (!promotion) return t('no_promotion', { defaultValue: 'Không áp dụng khuyến mãi' });
    const { tenKhuyenMai, tenKieuKhuyenMai, giaTriKhuyenMai } = promotion;
    const discountText = tenKieuKhuyenMai === 'Phần trăm'
      ? `(-${giaTriKhuyenMai}%)`
      : `(-${giaTriKhuyenMai.toLocaleString()} VND)`;
    return `${tenKhuyenMai}  ${discountText}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-80 h-64 md:h-auto relative">
          <img
            src={booking.room.imageUrl || 'https://ezcloud.vn/wp-content/uploads/2024/04/khach-san-o-hai-phong.webp'}
            alt={t('room', { defaultValue: 'Phòng' }) + ` ${booking.room.soPhong}`}
            className="w-full h-full object-cover"
          />
          <Button
            type="text"
            icon={<FaTrash className="text-white text-lg" />}
            onClick={() => onRemove(booking.id)}
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('room', { defaultValue: 'Phòng' })} {booking.room.soPhong}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">{t('check_in', { defaultValue: 'Ngày nhận phòng' })}</p>
                  <p className="font-semibold text-gray-800">{booking.dates[0]?.format('DD/MM/YYYY') || t('not_selected', { defaultValue: 'Chưa chọn' })}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaBed className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">{t('nights', { defaultValue: 'Số đêm' })}</p>
                  <p className="font-semibold text-gray-800">{booking.numberOfNights} {t('night', { defaultValue: 'đêm' })}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">{t('check_out', { defaultValue: 'Ngày trả phòng' })}</p>
                  <p className="font-semibold text-gray-800">{booking.dates[1]?.format('DD/MM/YYYY') || t('not_selected', { defaultValue: 'Chưa chọn' })}</p>
                </div>
              </div>
            </div>
          </div>
          {booking.services.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FaConciergeBell className="mr-2 text-blue-600" />
                {t('selected_services', { defaultValue: 'Dịch vụ đã chọn' })}
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.services.map(service => (
                  <span
                    key={service.maDichVu}
                    className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full"
                  >
                    {service.tenDichVu}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="pt-6 border-t border-gray-200">
            {/* Hiển thị thông tin khuyến mãi */}
            {booking.promotion && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">{t('promotion', { defaultValue: 'Khuyến mãi' })}</h4>
                <p className="text-sm text-green-600">{renderPromotionInfo(booking.promotion)}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-500 mb-1">{t('total', { defaultValue: 'Tổng tiền' })}</p>
                <p className="text-3xl font-bold text-blue-600">{calculateBookingTotal().toLocaleString()} VND</p>
                <p className="text-sm text-gray-500">{t('tax_fee_included', { defaultValue: 'Đã bao gồm thuế và phí' })}</p>
              </div>
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full px-8 h-12 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => onBook(booking)}
              >
                {t('book_this_room', { defaultValue: 'Đặt Phòng Này' })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;