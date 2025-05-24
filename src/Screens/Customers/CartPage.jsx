import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Modal, Form, message } from 'antd';
import { FaBed } from 'react-icons/fa';
import { removeBooking, clearBookings } from '../../redux/CartSlice';
import { bookRoom } from '../../apis/apiroom';
import Header from '../../Components/componentUser/Header';
import BookingItem from '../../Components/componentUser/BookingItem';
import SummaryPanel from '../../Components/componentUser/SummaryPanel';
import BookingModal from '../../Components/componentUser/BookingModal';
import { Button } from 'antd';

const CartPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.cart.bookings);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isMultiBooking, setIsMultiBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    ho: '', ten: '', email: '', sdt: '', cccd: '',
  });
  const [form] = Form.useForm();
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const handleRemoveFromCart = (bookingId) => {
    dispatch(removeBooking(bookingId));
    message.success('Đã xóa đặt phòng khỏi giỏ hàng');
  };

  const handleBookRoom = async (values, bookingsToBook) => {
    setIsBookingLoading(true);
    try {
      const bookingPromises = bookingsToBook.map(async (booking) => {
        const bookingData = {
          maPhong: booking.room.maPhong,
          tenKhachHang: `${values.ho} ${values.ten}`,
          email: values.email,
          sdt: values.sdt,
          cccd: values.cccd,
          ghiChu: values.ghiChu,
          dichVu: booking.services.map(item => item.maDichVu),
          ngayDat: new Date().toISOString(),
          ngayNhan: booking.dates[0].toISOString(),
          ngayTra: booking.dates[1].toISOString(),
        };
        await bookRoom(bookingData);
        return booking.id;
      });

      const bookedIds = await Promise.allSettled(bookingPromises).then(results => {
        const successfulIds = [];
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(bookingsToBook[index].id);
          } else {
            message.error(`Lỗi khi đặt phòng ${bookingsToBook[index].room.soPhong}: ${result.reason.message}`);
          }
        });
        return successfulIds;
      });

      if (bookedIds.length > 0) {
        bookedIds.forEach(id => dispatch(removeBooking(id)));
        message.success(`Đặt ${bookedIds.length} phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.`);
      }

      setIsBookingModalVisible(false);
      form.resetFields();
      setCustomerInfo({ ho: '', ten: '', email: '', sdt: '', cccd: '' });
      setSelectedBooking(null);
      setIsMultiBooking(false);
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error.message);
      message.error('Lỗi khi đặt phòng: ' + error.message);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleBookSingleRoom = (values) => {
    handleBookRoom(values, [selectedBooking]);
  };

  const handleBookAllRooms = (values) => {
    handleBookRoom(values, bookings);
  };

  if (!bookings) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      <Header />
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 pt-20 pb-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Danh sách đặt phòng</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Xem lại các phòng bạn đã chọn và hoàn tất đặt phòng</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="mb-8">
              <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Danh sách trống</h2>
              <p className="text-gray-500 text-lg">Hãy khám phá các phòng tuyệt vời của chúng tôi</p>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-full px-8 py-3 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/user/home'}
            >
              Khám Phá Phòng Ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              <div className="space-y-6">
                {bookings.map(booking => (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    onRemove={handleRemoveFromCart}
                    onBook={() => {
                      setSelectedBooking(booking);
                      setIsMultiBooking(false);
                      setIsBookingModalVisible(true);
                    }}
                  />
                ))}
              </div>
            </div>
            <SummaryPanel
              bookings={bookings}
              onBookAll={() => {
                setIsMultiBooking(true);
                setIsBookingModalVisible(true);
              }}
              onClearAll={() => {
                Modal.confirm({
                  title: 'Xác nhận xóa tất cả',
                  content: 'Bạn có chắc chắn muốn xóa tất cả đặt phòng trong giỏ hàng?',
                  okText: 'Xóa tất cả',
                  cancelText: 'Hủy',
                  okType: 'danger',
                  onOk: () => dispatch(clearBookings()),
                });
              }}
            />
          </div>
        )}
      </div>
      <BookingModal
        visible={isBookingModalVisible}
        isMultiBooking={isMultiBooking}
        bookings={bookings}
        selectedBooking={selectedBooking}
        onCancel={() => {
          setIsBookingModalVisible(false);
          setIsMultiBooking(false);
          setSelectedBooking(null);
        }}
        onSubmit={isMultiBooking ? handleBookAllRooms : handleBookSingleRoom}
        loading={isBookingLoading}
        form={form}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
      />
    </div>
  );
};

export default CartPage;