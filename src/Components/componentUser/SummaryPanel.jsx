import React from 'react';
import { Button, Divider } from 'antd';
import dayjs from 'dayjs';

const SummaryPanel = ({ bookings, onBookAll, onClearAll }) => {
  // Hàm kiểm tra điều kiện áp dụng khuyến mãi (tương tự RoomDetail.js)
  const isPromotionApplicable = (promo, dates) => {
    if (!dates[0] || !dates[1]) return false;
    const checkInDate = dayjs(dates[0]);
    const checkOutDate = dayjs(dates[1]);
    const startDate = dayjs(promo.ngayBatDau);
    const endDate = dayjs(promo.ngayKetThuc);

    const isWithinPeriod = !checkInDate.isBefore(startDate) && !checkInDate.isAfter(endDate);
    console.log('Promotion Check:', {
      checkInDate: checkInDate.format('DD/MM/YYYY'),
      startDate: startDate.format('DD/MM/YYYY'),
      endDate: endDate.format('DD/MM/YYYY'),
      isWithinPeriod,
      maKhuyenMai: promo.maKhuyenMai,
    });

    return isWithinPeriod;
  };

  const calculateCartTotal = () => {
    return bookings.reduce((total, booking) => {
      const serviceTotal = booking.services.reduce((sum, item) => sum + (item?.gia || 0), 0);
      let roomTotal = (booking.room?.giaPhong || 0) * booking.numberOfNights;

      const promotion = booking.promotion;
      console.log('Promotion for booking:', { bookingId: booking.id, promotion }); // Debug
      if (promotion && isPromotionApplicable(promotion, booking.dates)) {
        const kieuKhuyenMai = promotion.kieuKhuyenMai || 'Phần trăm';
        let giaTriKhuyenMai = promotion.giaTriKhuyenMai || 0;

        if (promotion.moTaKhuyenMai?.includes('20%')) {
          giaTriKhuyenMai = 20;
          console.log('Overriding giaTriKhuyenMai to 20% due to moTaKhuyenMai:', promotion.moTaKhuyenMai);
        }

        if (kieuKhuyenMai === 'Phần trăm') {
          roomTotal *= (1 - giaTriKhuyenMai / 100);
          console.log('Applied percentage discount:', { roomTotal, giaTriKhuyenMai });
        } else if (kieuKhuyenMai === 'Giảm giá trực tiếp') {
          roomTotal -= giaTriKhuyenMai;
          console.log('Applied direct discount:', { roomTotal, giaTriKhuyenMai });
        }
      } else {
        console.log('No promotion applied for booking:', booking.id);
      }

      return total + serviceTotal + Math.max(0, roomTotal);
    }, 0);
  };

  const renderPromotionInfo = (promotion) => {
    if (!promotion) return 'Không áp dụng khuyến mãi';
    const { tenKhuyenMai, maKhuyenMai, kieuKhuyenMai, giaTriKhuyenMai } = promotion;
    const discountText = kieuKhuyenMai === 'Phần trăm'
      ? `(-${giaTriKhuyenMai}%)`
      : `(-${giaTriKhuyenMai.toLocaleString()} VND)`;
    return `${tenKhuyenMai} ${discountText}`;
  };

  return (
    <div className="xl:col-span-1">
      <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tóm Tắt Đơn Hàng</h2>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Số lượng phòng</span>
              <span className="font-bold text-lg text-blue-600">{bookings.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tổng số đêm</span>
              <span className="font-bold text-lg text-blue-600">
                {bookings.reduce((total, booking) => total + booking.numberOfNights, 0)}
              </span>
            </div>
          </div>
          <Divider className="my-6" />
          {bookings.map((booking, index) => (
            <div key={index} className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Khuyến mãi (Phòng {booking.room?.soPhong})</p>
                <p className="text-sm font-semibold text-green-600">
                  {renderPromotionInfo(booking.promotion)}
                </p>
              </div>
            </div>
          ))}
          <Divider className="my-6" />
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Tổng thanh toán</p>
              <p className="text-3xl font-bold text-green-600 mb-1">{calculateCartTotal().toLocaleString()} VND</p>
              <p className="text-sm text-gray-500">Đã bao gồm thuế và phí</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button
              type="primary"
              block
              size="large"
              disabled={bookings.length === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full h-12 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              onClick={onBookAll}
            >
              Đặt Tất Cả Phòng
            </Button>
            <Button
              danger
              block
              size="large"
              className="h-12 rounded-full font-semibold border-2 hover:shadow-lg transition-all duration-300"
              onClick={onClearAll}
            >
              Xóa Tất Cả
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;