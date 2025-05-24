import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { FaBed, FaCalendarAlt, FaUser } from 'react-icons/fa';

const BookingModal = ({ visible, isMultiBooking, bookings, selectedBooking, onCancel, onSubmit, loading, form, customerInfo, setCustomerInfo }) => {
  const calculateBookingTotal = (booking) => {
    const serviceTotal = booking.services.reduce((total, item) => total + (item?.gia || 0), 0);
    return serviceTotal + (booking.room?.giaPhong || 0) * booking.numberOfNights;
  };

  const calculateCartTotal = () => {
    return bookings.reduce((total, booking) => total + calculateBookingTotal(booking), 0);
  };

  return (
    <Modal
      title={
        <div className="text-center pb-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {isMultiBooking ? 'Xác Nhận Đặt Tất Cả Phòng' : 'Xác Nhận Đặt Phòng'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">Vui lòng điền đầy đủ thông tin để hoàn tất đặt phòng</p>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={isMultiBooking ? 1200 : 1000}
      style={{ 
        maxHeight: '95vh',
        top: '2.5vh'
      }}
      className="rounded-2xl"
      centered={false}
      bodyStyle={{ 
        padding: '16px',
        maxHeight: 'calc(95vh - 120px)',
        overflow: 'hidden'
      }}
    >
      <div className="flex gap-4 h-full">
        {/* Left Column - Booking Details */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
          <h3 className="font-bold text-base text-gray-800 mb-3 text-center">Chi Tiết Đặt Phòng</h3>
          {isMultiBooking ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <FaBed className="text-blue-600 text-lg mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Phòng</p>
                      <p className="font-bold text-sm">{booking.room.soPhong}</p>
                    </div>
                    <div>
                      <FaCalendarAlt className="text-green-600 text-lg mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Số đêm</p>
                      <p className="font-bold text-sm">{booking.numberOfNights} đêm</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Nhận phòng</p>
                      <p className="font-semibold text-xs">{booking.dates[0]?.format('DD/MM/YYYY') || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Trả phòng</p>
                      <p className="font-semibold text-xs">{booking.dates[1]?.format('DD/MM/YYYY') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-center mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600">Tổng tiền</p>
                    <p className="font-bold text-blue-600 text-sm">{calculateBookingTotal(booking).toLocaleString()} VND</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <FaBed className="text-blue-600 text-lg mx-auto mb-1" />
                <p className="text-xs text-gray-600">Phòng</p>
                <p className="font-bold text-sm">{selectedBooking?.room.soPhong || 'N/A'}</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <FaCalendarAlt className="text-green-600 text-lg mx-auto mb-1" />
                <p className="text-xs text-gray-600">Số đêm</p>
                <p className="font-bold text-sm">{selectedBooking?.numberOfNights || 0} đêm</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600">Nhận phòng</p>
                <p className="font-semibold text-xs">{selectedBooking?.dates[0]?.format('DD/MM/YYYY') || 'N/A'}</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600">Trả phòng</p>
                <p className="font-semibold text-xs">{selectedBooking?.dates[1]?.format('DD/MM/YYYY') || 'N/A'}</p>
              </div>
            </div>
          )}
          
          {/* Total Amount */}
          <div className="text-center mt-4 p-3 bg-white rounded-lg shadow-sm">
            <p className="text-xs text-gray-600 mb-1">Tổng tiền thanh toán</p>
            <p className="text-xl font-bold text-blue-600">
              {isMultiBooking 
                ? calculateCartTotal().toLocaleString() 
                : (selectedBooking ? calculateBookingTotal(selectedBooking).toLocaleString() : '0')
              } VND
            </p>
          </div>
        </div>

        {/* Right Column - Customer Information Form */}
        <div className="flex-1">
          <Form
            layout="vertical"
            onFinish={onSubmit}
            form={form}
            initialValues={customerInfo}
            size="small"
          >
            <h3 className="font-bold text-base text-gray-800 flex items-center mb-3">
              <FaUser className="mr-2 text-blue-600" />
              Thông Tin Khách Hàng
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="ho"
                label={<span className="text-xs font-medium">Họ và tên đệm</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                className="mb-3"
              >
                <Input
                  value={customerInfo.ho}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, ho: e.target.value })}
                  className="rounded-lg h-8"
                  placeholder="Nguyễn Văn"
                />
              </Form.Item>
              <Form.Item
                name="ten"
                label={<span className="text-xs font-medium">Tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                className="mb-3"
              >
                <Input
                  value={customerInfo.ten}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, ten: e.target.value })}
                  className="rounded-lg h-8"
                  placeholder="An"
                />
              </Form.Item>
            </div>
            
            <Form.Item
              name="email"
              label={<span className="text-xs font-medium">Địa chỉ Email</span>}
              rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
              className="mb-3"
            >
              <Input
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="rounded-lg h-8"
                placeholder="example@email.com"
              />
            </Form.Item>
            
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="sdt"
                label={<span className="text-xs font-medium">Số điện thoại</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải là 10-11 chữ số' }]}
                className="mb-3"
              >
                <Input
                  value={customerInfo.sdt}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, sdt: e.target.value })}
                  className="rounded-lg h-8"
                  placeholder="0901234567"
                />
              </Form.Item>
              <Form.Item
                name="cccd"
                label={<span className="text-xs font-medium">Số CMND/CCCD</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD' }, { pattern: /^[0-9]{9}$|^[0-9]{12}$/, message: 'Số CMND/CCCD phải là 9 hoặc 12 chữ số' }]}
                className="mb-3"
              >
                <Input
                  value={customerInfo.cccd}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, cccd: e.target.value })}
                  className="rounded-lg h-8"
                  placeholder="123456789 hoặc 123456789012"
                />
              </Form.Item>
            </div>
            
            <Form.Item 
              name="ghiChu" 
              label={<span className="text-xs font-medium">Ghi chú (tùy chọn)</span>}
              className="mb-4"
            >
              <Input.TextArea
                rows={2}
                className="rounded-lg"
                placeholder="Yêu cầu đặc biệt hoặc ghi chú thêm..."
              />
            </Form.Item>
            
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-xl h-56 text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {isMultiBooking ? 'Xác Nhận Đặt Tất Cả' : 'Xác Nhận Đặt Phòng'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;