import React from 'react';
import { Button, DatePicker, Select, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const BookingPanel = ({
  room,
  services,
  promotions,
  dates,
  numberOfNights,
  selectedServices,
  selectedPromotion,
  handleDateChange,
  handlePromotionChange,
  calculateBookingTotal,
  handleAddBooking,
  onBookNow
}) => {
  const isPromotionApplicable = (promo) => {
    if (!dates[0] || !dates[1]) return false;
    const checkInDate = dayjs(dates[0]);
    const checkOutDate = dayjs(dates[1]);
    const startDate = dayjs(promo.ngayBatDau);
    const endDate = dayjs(promo.ngayKetThuc);

    // Check if check-in date is within promotion period
    if (checkInDate.isBefore(startDate) || checkInDate.isAfter(endDate)) return false;

    // Additional conditions based on promotion type
    if (promo.maKhuyenMai === 3) { // Early booking (30 days in advance)
      return checkInDate.diff(dayjs(), 'day') >= 30;
    }
    if (promo.maKhuyenMai === 4) { // Long-term booking (7+ nights)
      return numberOfNights >= 7;
    }
    if (promo.maKhuyenMai === 2) { // Weekend promotion
      const checkInDay = checkInDate.day();
      return checkInDay === 5 || checkInDay === 6 || checkInDay === 0; // Friday, Saturday, Sunday
    }
    return true;
  };

  const handleBookNowClick = () => {
    if (!dates[0] || !dates[1]) {
      message.error('Vui lòng chọn ngày nhận và ngày trả phòng');
      return;
    }
    const newBooking = {
      id: Date.now(),
      room: { maPhong: room.maPhong, soPhong: room.soPhong, giaPhong: room.giaPhong },
      dates: [dates[0], dates[1]],
      numberOfNights,
      services: services.filter(service => selectedServices.includes(service.maDichVu)),
      promotion: selectedPromotion,
    };
    onBookNow(newBooking);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Thông tin đặt phòng</h2>
      
      {/* Date Selection */}
      <div className="mb-4">
        <label className="text-gray-600">Chọn ngày</label>
        <RangePicker
          value={dates}
          onChange={handleDateChange}
          disabledDate={(current) => current && current < dayjs().startOf('day')}
          format="DD/MM/YYYY"
          className="w-full"
        />
      </div>

      {/* Promotion Selection */}
      <div className="mb-4">
        <label className="text-gray-600">Khuyến mãi</label>
        <Select
          value={selectedPromotion?.maKhuyenMai || null}
          onChange={handlePromotionChange}
          placeholder="Chọn khuyến mãi"
          className="w-full"
          disabled={!dates[0] || !dates[1]}
        >
          <Option value={null}>Không áp dụng khuyến mãi</Option>
          {promotions
            .filter(isPromotionApplicable)
            .map(promo => (
              <Option key={promo.maKhuyenMai} value={promo.maKhuyenMai}>
                {promo.tenKhuyenMai} ({promo.moTaKhuyenMai})
              </Option>
            ))}
        </Select>
      </div>

      {/* Price Breakdown */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b">
        <span className="text-gray-600">Giá phòng / đêm</span>
        <span className="font-semibold">{(room.giaPhong || 0).toLocaleString()} VND</span>
      </div>
      
      <div className="flex justify-between items-center mb-3 pb-3 border-b">
        <span className="text-gray-600">Số đêm</span>
        <span className="font-semibold">{numberOfNights}</span>
      </div>

      {/* Selected Services */}
      {selectedServices.length > 0 &&
        services
          .filter(service => selectedServices.includes(service.maDichVu))
          .map(item => (
            <div key={item.maDichVu} className="flex justify-between items-center mb-3 pb-3 border-b">
              <span className="text-gray-600">{item.tenDichVu || 'Tên không xác định'}</span>
              <span className="font-semibold">{(item.gia || 0).toLocaleString()} VND</span>
            </div>
          ))}

      {/* Promotion Discount */}
      {selectedPromotion && isPromotionApplicable(selectedPromotion) && (
        <div className="flex justify-between items-center mb-3 pb-3 border-b">
          <span className="text-gray-600">Khuyến mãi ({selectedPromotion.tenKhuyenMai})</span>
          <span className="font-semibold text-green-600">
            -{selectedPromotion.kieuKhuyenMai === 'Phần trăm'
              ? `${selectedPromotion.giaTriKhuyenMai}%`
              : selectedPromotion.giaTriKhuyenMai.toLocaleString() + ' VND'}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center mb-6 pt-2 text-lg">
        <span className="font-medium">Tổng cộng</span>
        <span className="font-bold text-blue-600">{calculateBookingTotal().toLocaleString()} VND</span>
      </div>

      {/* Action Buttons */}
      <Button
        type="default"
        block
        size="large"
        className="mb-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        onClick={handleAddBooking}
        disabled={!dates[0] || !dates[1]}
      >
        Thêm vào danh sách
      </Button>
      
      <Button
        type="primary"
        block
        size="large"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={handleBookNowClick}
        disabled={!dates[0] || !dates[1]}
      >
        Đặt phòng ngay
      </Button>

      <div className="mt-4 text-center text-sm text-gray-500">
        <InfoCircleOutlined className="mr-1" /> Không mất phí khi đặt phòng
      </div>
    </div>
  );
};

export default BookingPanel;