import React from 'react';
import { Button } from 'antd';
import { FaTrash, FaBed, FaCalendarAlt, FaConciergeBell } from 'react-icons/fa';

const BookingItem = ({ booking, onRemove, onBook }) => {
  const calculateBookingTotal = () => {
    const serviceTotal = booking.services.reduce((total, item) => total + (item?.gia || 0), 0);
    return serviceTotal + (booking.room?.giaPhong || 0) * booking.numberOfNights;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-80 h-64 md:h-auto relative">
          <img
            src={booking.room.imageUrl || 'https://via.placeholder.com/400x250?text=Room+Image'}
            alt={`Phòng ${booking.room.soPhong}`}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Phòng {booking.room.soPhong}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Ngày nhận phòng</p>
                  <p className="font-semibold text-gray-800">{booking.dates[0]?.format('DD/MM/YYYY') || 'Chưa chọn'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaBed className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Số đêm</p>
                  <p className="font-semibold text-gray-800">{booking.numberOfNights} đêm</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Ngày trả phòng</p>
                  <p className="font-semibold text-gray-800">{booking.dates[1]?.format('DD/MM/YYYY') || 'Chưa chọn'}</p>
                </div>
              </div>
            </div>
          </div>
          {booking.services.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FaConciergeBell className="mr-2 text-blue-600" />
                Dịch vụ đã chọn
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
              <p className="text-3xl font-bold text-blue-600">{calculateBookingTotal().toLocaleString()} VND</p>
              <p className="text-sm text-gray-500">Đã bao gồm thuế và phí</p>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full px-8 h-12 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => onBook(booking)}
            >
              Đặt Phòng Này
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;