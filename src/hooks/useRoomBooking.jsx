import { useState } from 'react';
import { Form, message } from 'antd';
import dayjs from 'dayjs';
import { addBooking } from '../redux/CartSlice';
import { bookRoom } from '../apis/apiroom';

export const useRoomBooking = ({ room, services, promotions, navigate, dispatch }) => {
  const [dates, setDates] = useState([null, null]);
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    ho: '', ten: '', email: '', sdt: '', cccd: '',
  });
  const [form] = Form.useForm();

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDates(dates);
      const nights = dates[1].diff(dates[0], 'day');
      setNumberOfNights(nights > 0 ? nights : 1);
      setSelectedPromotion(null); // Reset selected promotion when dates change
    } else {
      setDates([null, null]);
      setNumberOfNights(1);
      setSelectedPromotion(null);
    }
  };

  const handleServiceToggle = (service, checked) => {
    if (checked) {
      if (!selectedServices.includes(service.maDichVu)) {
        setSelectedServices(prev => [...prev, service.maDichVu]);
      }
    } else {
      setSelectedServices(prev => prev.filter(id => id !== service.maDichVu));
    }
  };

  const handlePromotionChange = (maKhuyenMai) => {
    const promo = promotions.find(p => p.maKhuyenMai === maKhuyenMai) || null;
    setSelectedPromotion(promo);
  };

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

  const calculateBookingTotal = () => {
    const serviceTotal = services
      .filter(service => selectedServices.includes(service.maDichVu))
      .reduce((total, item) => total + (item?.gia || 0), 0);
    let roomTotal = (room?.giaPhong || 0) * numberOfNights;

    console.log('Calculate Booking Total - Initial:', {
      roomTotal,
      serviceTotal,
      selectedPromotion,
      isApplicable: selectedPromotion ? isPromotionApplicable(selectedPromotion) : false,
    });

    // Apply promotion discount
    if (selectedPromotion && isPromotionApplicable(selectedPromotion)) {
      if (selectedPromotion.kieuKhuyenMai === 'Phần trăm') {
        roomTotal *= (1 - selectedPromotion.giaTriKhuyenMai / 100);
      } else if (selectedPromotion.kieuKhuyenMai === 'Giảm giá trực tiếp') {
        roomTotal -= selectedPromotion.giaTriKhuyenMai;
      }
      console.log('After Promotion:', { roomTotal, discountType: selectedPromotion.kieuKhuyenMai, discountValue: selectedPromotion.giaTriKhuyenMai });
    }

    const total = Math.max(0, roomTotal + serviceTotal);
    console.log('Final Total:', total);
    return total;
  };

  const handleAddBooking = () => {
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
      promotion: selectedPromotion, // Include selected promotion
    };
    dispatch(addBooking(newBooking));
    message.success('Đã thêm đặt phòng vào giỏ hàng');
    navigate('/user/CartPage');
    resetBookingForm();
  };

  const handleBookRoom = async (values) => {
    try {
      if (!selectedBooking) {
        message.error('Vui lòng chọn một đặt phòng');
        return;
      }
      const bookingData = {
        maPhong: selectedBooking.room.maPhong,
        tenKhachHang: `${values.ho} ${values.ten}`,
        email: values.email,
        sdt: values.sdt,
        cccd: values.cccd,
        ghiChu: values.ghiChu,
        dichVu: selectedBooking.services.map(item => item.maDichVu),
        maKhuyenMai: selectedBooking.promotion?.maKhuyenMai || null, // Include promotion ID
        ngayDat: new Date().toISOString(),
        ngayNhan: selectedBooking.dates[0].toISOString(),
        ngayTra: selectedBooking.dates[1].toISOString(),
      };
      await bookRoom(bookingData);
      message.success('Đặt phòng thành công');
      setIsBookingModalVisible(false);
      form.resetFields();
      setCustomerInfo({ ho: '', ten: '', email: '', sdt: '', cccd: '' });
      setSelectedBooking(null);
      setSelectedPromotion(null);
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error.message);
      message.error('Lỗi khi đặt phòng: ' + error.message);
    }
  };

  const resetBookingForm = () => {
    setDates([null, null]);
    setNumberOfNights(1);
    setSelectedServices([]);
    setSelectedPromotion(null);
  };

  return {
    dates,
    numberOfNights,
    selectedServices,
    selectedPromotion,
    selectedBooking,
    isBookingModalVisible,
    customerInfo,
    form,
    handleDateChange,
    handleServiceToggle,
    handlePromotionChange,
    calculateBookingTotal,
    handleAddBooking,
    handleBookRoom,
    setSelectedBooking,
    setIsBookingModalVisible,
    setCustomerInfo,
    resetBookingForm,
    isPromotionApplicable
  };
};