// useBookingLogic.jsx
import { useCallback } from 'react';
import { message } from 'antd'; // Import message từ antd
import { bookRoom } from '../apis/apiroom';
import { createCustomer } from '../apis/apicustomer';
import { payInvoice } from '../apis/apiinvoice';
import dayjs from 'dayjs';

const useBookingLogic = ({
  isMultiBooking,
  bookings,
  selectedBooking,
  form,
  customerInfo,
  setCustomerInfo,
  navigate,
  t,
  onCancel,
}) => {
  const calculateBookingTotal = useCallback((booking) => {
    const serviceTotal = booking?.services?.reduce((total, item) => total + (item?.gia || 0), 0) || 0;
    let roomTotal = (booking?.room?.giaPhong || 0) * (booking?.numberOfNights || 1);
    const tenKieuKhuyenMai = booking?.promotion?.tenKieuKhuyenMai || 'Phần trăm';
    const giaTriKhuyenMai = booking?.promotion?.giaTriKhuyenMai || 0;

    if (tenKieuKhuyenMai === 'Phần trăm') {
      roomTotal *= (1 - giaTriKhuyenMai / 100);
    } else if (tenKieuKhuyenMai === 'Giảm giá trực tiếp') {
      roomTotal -= giaTriKhuyenMai || 0;
    }

    return Math.max(0, serviceTotal + roomTotal);
  }, []);

  const calculateCartTotal = useCallback(() => {
    return bookings?.length > 0 ? bookings.reduce((total, booking) => total + calculateBookingTotal(booking), 0) : 0;
  }, [bookings, calculateBookingTotal]);

  const renderPromotionInfo = useCallback((promotion) => {
    if (!promotion) {
      return t('no_promotion', { defaultValue: 'Không áp dụng khuyến mãi' });
    }
    const { tenKhuyenMai, maKhuyenMai, kieuKhuyenMai, giaTriKhuyenMai } = promotion;
    const discountText = kieuKhuyenMai === 'Phần trăm'
      ? `(-${giaTriKhuyenMai}%)`
      : `(-${giaTriKhuyenMai.toLocaleString()} VND)`;
    return `${tenKhuyenMai} (ID: ${maKhuyenMai}) ${discountText}`;
  }, [t]);

  const validateBooking = useCallback((data) => {
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
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        console.log('Submitting booking:', { isMultiBooking, selectedBooking, bookings, customerInfo });

        if (isMultiBooking && (!bookings || bookings.length === 0)) {
          message.error(t('no_rooms_selected', { defaultValue: 'Vui lòng chọn ít nhất một phòng!' }));
          return;
        }
        if (!isMultiBooking && (!selectedBooking?.room?.maPhong || !selectedBooking?.dates?.[0] || !selectedBooking?.dates?.[1])) {
          message.error(t('invalid_booking', { defaultValue: 'Thông tin đặt phòng không hợp lệ!' }));
          return;
        }

        const checkInDate = isMultiBooking ? bookings[0]?.dates[0] : selectedBooking?.dates[0];
        if (!checkInDate || !checkInDate.isValid() || checkInDate.isBefore(dayjs(), 'day')) {
          message.error(t('invalid_checkin_date', { defaultValue: 'Ngày nhận phòng không hợp lệ hoặc đã qua!' }));
          return;
        }

        let maKhachHang = customerInfo?.maKhachHang;
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

          maKhachHang = customerResponse?.maKhachHang || customerResponse?.data?.maKhachHang;
          if (!maKhachHang || maKhachHang === 0) {
            console.error('Failed to retrieve maKhachHang after creation:', customerResponse);
            message.error(t('customer_creation_failed', { defaultValue: 'Không thể lấy mã khách hàng sau khi tạo! Vui lòng thử lại.' }));
            return;
          }
          console.log('Customer created successfully with maKhachHang:', maKhachHang);
          setCustomerInfo({ ...customerInfo, maKhachHang, ...customerData });
        }

        const bookingData = {
          phongDichVus: isMultiBooking
            ? bookings.map((booking) => ({
                maPhong: parseInt(booking?.room?.maPhong) || 0,
                dichVuIds: booking?.services?.length > 0
                  ? booking.services.map((service) => parseInt(service?.maDichVu) || 0).filter((id) => id > 0)
                  : [],
                ngayNhanPhong: booking?.dates?.[0]?.format('YYYY-MM-DD') || '',
                ngayTraPhong: booking?.dates?.[1]?.format('YYYY-MM-DD') || '',
              }))
            : [
                {
                  maPhong: parseInt(selectedBooking?.room?.maPhong) || 0,
                  dichVuIds: selectedBooking?.services?.length > 0
                    ? selectedBooking.services.map((service) => parseInt(service?.maDichVu) || 0).filter((id) => id > 0)
                    : [],
                  ngayNhanPhong: selectedBooking?.dates?.[0]?.format('YYYY-MM-DD') || '',
                  ngayTraPhong: selectedBooking?.dates?.[1]?.format('YYYY-MM-DD') || '',
                },
              ],
          ghiChu: values.ghiChu?.trim() || '',
          maKhachHang: parseInt(maKhachHang) || 0,
        };

        if (!maKhachHang || maKhachHang === 0) {
          message.error(t('missing_customer_id', { defaultValue: 'Thiếu mã khách hàng! Vui lòng thử lại.' }));
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
        console.log('Extracted maDatPhong:', maDatPhong);
        if (!maDatPhong) {
          console.log('No booking ID returned, but request was successful');
          message.success(t('booking_success', { defaultValue: 'Đặt phòng thành công!' }));
          navigate('/user/home');
          return;
        }

        console.log('Calling payment API with maDatPhong:', maDatPhong);
        const hoaDon = await payInvoice(maDatPhong);
        console.log('Payment response:', hoaDon); 
        message.success(
          t('booking_and_payment_success', {
            defaultValue: `Đặt phòng và thanh toán thành công! Mã đặt phòng: ${maDatPhong}`,
            maDatPhong,
          })
        );
        console.log('Before resetting form and navigating...');
        form.resetFields();
        setCustomerInfo({ ho: '', ten: '', email: '', sdt: '', cccd: '', maKhachHang: 0 });
        onCancel();
        console.log('Navigating to invoice page with maDatPhong:', maDatPhong);
        navigate(`/user/invoice/${maDatPhong}`);
      } catch (error) {
        console.error('General error:', error);
        message.error(t('general_error', { defaultValue: 'Đã xảy ra lỗi: ' }) + error.message);
      }
    },
    [
      isMultiBooking,
      bookings,
      selectedBooking,
      customerInfo,
      setCustomerInfo,
      navigate,
      t,
      onCancel,
      form,
      validateBooking,
    ]
  );

  return { handleSubmit, calculateBookingTotal, calculateCartTotal, renderPromotionInfo };
};

export default useBookingLogic;