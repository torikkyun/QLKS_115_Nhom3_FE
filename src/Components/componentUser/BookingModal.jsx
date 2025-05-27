import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { bookRoom } from '../../apis/apiroom';
import { createCustomer } from '../../apis/apicustomer';
import dayjs from 'dayjs';

const BookingModal = ({
  visible,
  isMultiBooking,
  bookings,
  selectedBooking,
  onCancel,
  loading,
  form,
  customerInfo,
  setCustomerInfo,
}) => {
  const { t } = useTranslation();

  const calculateBookingTotal = (booking) => {
    const serviceTotal = booking?.services?.reduce((total, item) => total + (item?.gia || 0), 0) || 0;
    let roomTotal = (booking?.room?.giaPhong || 0) * (booking?.numberOfNights || 1);

    // Hardcode khuyenMaiId: 3 with fallback (assume 20% discount if promotion data is unavailable)
    const khuyenMaiId = 3;
    const tenKieuKhuyenMai = booking?.promotion?.tenKieuKhuyenMai || 'Phần trăm';
    const giaTriKhuyenMai = booking?.promotion?.giaTriKhuyenMai || 20; // Fallback to 20%

    if (khuyenMaiId === 3) {
      if (tenKieuKhuyenMai === 'Phần trăm') {
        roomTotal *= (1 - giaTriKhuyenMai / 100);
      } else if (tenKieuKhuyenMai === 'Giảm giá trực tiếp') {
        roomTotal -= giaTriKhuyenMai || 0;
      }
    }

    return Math.max(0, serviceTotal + roomTotal);
  };

  const calculateCartTotal = () => {
    return bookings?.length > 0 ? bookings.reduce((total, booking) => total + calculateBookingTotal(booking), 0) : 0;
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Submitting booking:', { isMultiBooking, selectedBooking, bookings, customerInfo });

      // Validate inputs
      if (isMultiBooking && (!bookings || bookings.length === 0)) {
        message.error(t('no_rooms_selected', { defaultValue: 'Vui lòng chọn ít nhất một phòng!' }));
        return;
      }
      if (!isMultiBooking && (!selectedBooking?.room?.maPhong || !selectedBooking?.dates?.[0] || !selectedBooking?.dates?.[1])) {
        message.error(t('invalid_booking', { defaultValue: 'Thông tin đặt phòng không hợp lệ!' }));
        return;
      }

      // Validate dates
      const checkInDate = isMultiBooking ? bookings[0]?.dates[0] : selectedBooking?.dates[0];
      if (!checkInDate || !checkInDate.isValid() || checkInDate.isBefore(dayjs(), 'day')) {
        message.error(t('invalid_checkin_date', { defaultValue: 'Ngày nhận phòng không hợp lệ hoặc đã qua!' }));
        return;
      }

      let maKhachHang = customerInfo?.maKhachHang;

      // Create customer if no maKhachHang
      if (!maKhachHang || maKhachHang === 0) {
        const customerData = {
          ho: values.ho?.trim() || '',
          ten: values.ten?.trim() || '',
          email: values.email?.trim() || '',
          sdt: values.sdt?.trim() || '',
          cccd: values.cccd?.trim() || '',
        };

        console.log('Creating customer with:', customerData);

        const customerResponse = await createCustomer(customerData);
        console.log('createCustomer response:', customerResponse);

        // Extract maKhachHang
        maKhachHang = customerResponse?.maKhachHang || customerResponse?.data?.maKhachHang;

        if (!maKhachHang || maKhachHang === 0) {
          // Nếu không lấy được maKhachHang, thử tìm khách hàng vừa tạo bằng email hoặc cccd
          console.warn('Không có maKhachHang trong phản hồi, có thể khách hàng đã được tạo');
          message.warning(t('customer_created_but_no_id', { defaultValue: 'Khách hàng có thể đã được tạo, nhưng không lấy được mã khách hàng!' }));
          return;
        }

        console.log('Customer created successfully with maKhachHang:', maKhachHang);
        setCustomerInfo({ ...customerInfo, maKhachHang, ...customerData });
      }

      // Prepare booking data with hardcoded khuyenMaiId: 3
      const bookingData = {
        phongDichVus: isMultiBooking
          ? bookings.map((booking) => ({
              maPhong: parseInt(booking?.room?.maPhong) || 0,
              dichVuIds: booking?.services?.length > 0
                ? booking.services
                    .map((service) => parseInt(service?.maDichVu) || 0)
                    .filter((id) => id > 0)
                : [],
              ngayNhanPhong: booking?.dates?.[0]?.format('YYYY-MM-DD') || '',
              ngayTraPhong: booking?.dates?.[1]?.format('YYYY-MM-DD') || '',
            }))
          : [
              {
                maPhong: parseInt(selectedBooking?.room?.maPhong) || 0,
                dichVuIds: selectedBooking?.services?.length > 0
                  ? selectedBooking.services
                      .map((service) => parseInt(service?.maDichVu) || 0)
                      .filter((id) => id > 0)
                  : [],
                ngayNhanPhong: selectedBooking?.dates?.[0]?.format('YYYY-MM-DD') || '',
                ngayTraPhong: selectedBooking?.dates?.[1]?.format('YYYY-MM-DD') || '',
              },
            ],
        khuyenMaiId: 3, // Hardcode khuyenMaiId: 3
        ghiChu: values.ghiChu?.trim() || '',
        maKhachHang: parseInt(maKhachHang) || 0,
      };

      // Validate booking data
      const validateBooking = (data) => {
        return data.phongDichVus.every((item) => {
          const isValidPhong = item.maPhong > 0;
          const isValidDichVuIds = Array.isArray(item.dichVuIds);
          const isValidDates =
            item.ngayNhanPhong &&
            item.ngayTraPhong &&
            dayjs(item.ngayNhanPhong).isValid() &&
            dayjs(item.ngayTraPhong).isValid();
          const isValidDateRange = dayjs(item.ngayTraPhong).isAfter(dayjs(item.ngayNhanPhong), 'day');

          console.log('Validation check:', {
            maPhong: item.maPhong,
            isValidPhong,
            isValidDichVuIds,
            isValidDates,
            isValidDateRange,
            ngayNhanPhong: item.ngayNhanPhong,
            ngayTraPhong: item.ngayTraPhong,
          });

          return isValidPhong && isValidDichVuIds && isValidDates && isValidDateRange;
        });
      };

      if (!maKhachHang || maKhachHang === 0) {
        message.error(t('missing_customer_id', { defaultValue: 'Thiếu mã khách hàng!' }));
        return;
      }

      if (!validateBooking(bookingData)) {
        message.error(t('invalid_booking_data', { defaultValue: 'Dữ liệu đặt phòng không hợp lệ (phòng, dịch vụ hoặc ngày)!' }));
        console.error('Invalid booking data:', bookingData);
        return;
      }

      console.log('Sending booking request:', JSON.stringify(bookingData, null, 2));

      const response = await bookRoom(bookingData);
      console.log('Booking response:', response);

      const maDatPhong = response?.maDatPhong || response?.data?.maDatPhong;

      if (!maDatPhong) {
        console.log('No booking ID returned, but request was successful');
        message.success(t('booking_success', { defaultValue: 'Đặt phòng thành công!' }));
      } else {
        message.success(
          t('booking_success_with_id', {
            defaultValue: `Đặt phòng thành công! Mã đặt phòng: ${maDatPhong}`,
            maDatPhong,
          })
        );
      }

      form.resetFields();
      setCustomerInfo({ ho: '', ten: '', email: '', sdt: '', cccd: '', maKhachHang: 0 });
      onCancel();
    } catch (error) {
      console.error('General error:', error);
      message.error(t('general_error', { defaultValue: 'Đã xảy ra lỗi: ' }) + error.message);
    }
  };

  return (
    <Modal
      title={
        <div className="text-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {t('confirm_booking', {
              defaultValue: isMultiBooking ? 'Xác Nhận Đặt Tất Cả Phòng' : 'Xác Nhận Đặt Phòng',
            })}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {t('complete_booking_info', { defaultValue: 'Vui lòng cung cấp đầy đủ thông tin để hoàn tất đặt phòng' })}
          </p>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={isMultiBooking ? 1200 : 1000}
      style={{ maxHeight: '95vh', top: '2.5vh' }}
      className="rounded-2xl"
      centered={true}
      bodyStyle={{ padding: '16px', maxHeight: 'calc(95vh - 120px)', overflow: 'auto' }}
    >
      <div className="flex gap-4 h-full">
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <h3 className="font-bold text-center text-gray-800 mb-3">
            {t('booking_details', { defaultValue: 'Chi tiết đặt phòng' })}
          </h3>
          {isMultiBooking ? (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {bookings?.map((booking) => (
                <div key={booking?.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <FontAwesomeIcon icon={faBed} className="text-blue-500 text-lg mb-1" />
                      <p className="text-xs text-gray-600">{t('room', { defaultValue: 'Phòng' })}</p>
                      <p className="font-semibold text-sm">{booking?.room?.soPhong || 'N/A'}</p>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 text-lg mb-1" />
                      <p className="text-xs text-gray-600">{t('nights', { defaultValue: 'Số đêm' })}</p>
                      <p className="font-semibold text-sm">
                        {booking?.numberOfNights || 0} {t('night', { defaultValue: 'đêm' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('check_in', { defaultValue: 'Nhận phòng' })}</p>
                      <p className="font-semibold text-xs">{booking?.dates?.[0]?.format('DD/MM/YYYY') || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{t('check_out', { defaultValue: 'Trả phòng' })}</p>
                      <p className="font-semibold text-xs">{booking?.dates?.[1]?.format('DD/MM/YYYY') || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-600">{t('promotion', { defaultValue: 'Khuyến mãi' })}</p>
                    <p className="font-semibold text-xs text-green-600">
                      {t('promotion_hardcoded', { defaultValue: 'Khuyến mãi đặc biệt (ID: 3)' })}
                      {' '}
                      (-20%) {/* Fallback display for khuyenMaiId: 3 */}
                    </p>
                  </div>
                  <div className="text-center mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600">{t('total', { defaultValue: 'Tổng tiền' })}</p>
                    <p className="font-bold text-blue-600 text-sm">{calculateBookingTotal(booking).toLocaleString()} VND</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <FontAwesomeIcon icon={faBed} className="text-blue-500 text-lg mb-1" />
                <p className="text-xs text-gray-600">{t('room', { defaultValue: 'Phòng' })}</p>
                <p className="font-semibold text-sm">{selectedBooking?.room?.soPhong || 'N/A'}</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 text-lg mb-1" />
                <p className="text-xs text-gray-600">{t('nights', { defaultValue: 'Số đêm' })}</p>
                <p className="font-semibold text-sm">
                  {selectedBooking?.numberOfNights || 0} {t('night', { defaultValue: 'đêm' })}
                </p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600">{t('check_in', { defaultValue: 'Nhận phòng' })}</p>
                <p className="font-semibold text-xs">{selectedBooking?.dates?.[0]?.format('DD/MM/YYYY') || 'N/A'}</p>
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600">{t('check_out', { defaultValue: 'Trả phòng' })}</p>
                <p className="font-semibold text-xs">{selectedBooking?.dates?.[1]?.format('DD/MM/YYYY') || 'N/A'}</p>
              </div>
              <div className="col-span-2 text-center bg-white rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600">{t('promotion', { defaultValue: 'Khuyến mãi' })}</p>
                <p className="font-semibold text-xs text-green-600">
                  {t('promotion_hardcoded', { defaultValue: 'Khuyến mãi đặc biệt (ID: 3)' })}
                  {' '}
                  (-20%) {/* Fallback display for khuyenMaiId: 3 */}
                </p>
              </div>
            </div>
          )}
          <div className="text-center mt-4 p-3 bg-white rounded-lg shadow-sm">
            <p className="text-xs text-gray-600 mb-1">{t('total_payment', { defaultValue: 'Tổng tiền thanh toán' })}</p>
            <p className="text-xl font-bold text-blue-600">
              {isMultiBooking ? calculateCartTotal().toLocaleString() : (selectedBooking ? calculateBookingTotal(selectedBooking).toLocaleString() : '0')} VND
            </p>
          </div>
        </div>
        <div className="flex-1">
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
            initialValues={customerInfo}
            size="middle"
          >
            <h3 className="font-bold text-lg text-gray-800 flex items-center mb-4">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
              {t('customer_info', { defaultValue: 'Thông tin khách hàng' })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="ho"
                label={<span className="text-sm text-gray-700">{t('last_name', { defaultValue: 'Họ và tên đệm' })}</span>}
                rules={[{ required: true, message: t('last_name_required', { defaultValue: 'Vui lòng nhập họ và tên đệm' }) }]}
                className="mb-4"
              >
                <Input
                  value={customerInfo?.ho}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, ho: e.target.value })}
                  className="rounded-lg h-10"
                  placeholder={t('last_name_placeholder', { defaultValue: 'Nhập họ và tên đệm' })}
                />
              </Form.Item>
              <Form.Item
                name="ten"
                label={<span className="text-sm text-gray-700">{t('first_name', { defaultValue: 'Tên' })}</span>}
                rules={[{ required: true, message: t('first_name_required', { defaultValue: 'Vui lòng nhập tên' }) }]}
                className="mb-4"
              >
                <Input
                  value={customerInfo?.ten}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, ten: e.target.value })}
                  className="rounded-lg h-10"
                  placeholder={t('first_name_placeholder', { defaultValue: 'Nhập tên' })}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="email"
              label={<span className="text-sm text-gray-700">{t('email_label', { defaultValue: 'Địa chỉ Email' })}</span>}
              rules={[
                { required: true, message: t('email_required', { defaultValue: 'Vui lòng nhập email' }) },
                { type: 'email', message: t('email_invalid', { defaultValue: 'Email không đúng định dạng' }) },
              ]}
              className="mb-4"
            >
              <Input
                value={customerInfo?.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="rounded-lg h-10"
                placeholder={t('email_placeholder', { defaultValue: 'Nhập email' })}
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="sdt"
                label={<span className="text-sm text-gray-700">{t('phone', { defaultValue: 'Số điện thoại' })}</span>}
                rules={[
                  { required: true, message: t('phone_required', { defaultValue: 'Vui lòng nhập số điện thoại' }) },
                  { pattern: /^[0-9]{10,11}$/, message: t('phone_invalid', { defaultValue: 'Số điện thoại phải là 10-11 số' }) },
                ]}
                className="mb-4"
              >
                <Input
                  value={customerInfo?.sdt}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, sdt: e.target.value })}
                  className="rounded-lg h-10"
                  placeholder={t('phone_placeholder', { defaultValue: 'Nhập số điện thoại' })}
                />
              </Form.Item>
              <Form.Item
                name="cccd"
                label={<span className="text-sm text-gray-700">{t('id_number', { defaultValue: 'Số CMND/CCCD' })}</span>}
                rules={[
                  { required: true, message: t('id_number_required', { defaultValue: 'Vui lòng nhập số CMND/CCCD' }) },
                  { pattern: /^[0-9]{9}$|^[0-9]{12}$/, message: t('id_number_invalid', { defaultValue: 'Số CMND/CCCD phải là 9 hoặc 12 số' }) },
                ]}
                className="mb-4"
              >
                <Input
                  value={customerInfo?.cccd}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, cccd: e.target.value })}
                  className="rounded-lg h-10"
                  placeholder={t('id_number_placeholder', { defaultValue: 'Nhập số CMND/CCCD' })}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="ghiChu"
              label={<span className="text-sm text-gray-700">{t('notes', { defaultValue: 'Ghi chú (tùy chọn)' })}</span>}
              className="mb-4"
            >
              <Input.TextArea
                rows={3}
                className="rounded-lg"
                placeholder={t('notes_placeholder', { defaultValue: 'Nhập ghi chú hoặc yêu cầu đặc biệt' })}
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700 border-0 rounded-xl h-12 text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {t('confirm_booking', {
                  defaultValue: isMultiBooking ? 'Xác nhận đặt tất cả' : 'Xác nhận đặt phòng',
                })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;