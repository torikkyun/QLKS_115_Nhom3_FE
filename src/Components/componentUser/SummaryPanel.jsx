import React from 'react';
import { Button, Divider } from 'antd';

const SummaryPanel = ({ bookings, onBookAll, onClearAll }) => {
  const calculateCartTotal = () => {
    return bookings.reduce((total, booking) => {
      const serviceTotal = booking.services.reduce((sum, item) => sum + (item?.gia || 0), 0);
      return total + serviceTotal + (booking.room?.giaPhong || 0) * booking.numberOfNights;
    }, 0);
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