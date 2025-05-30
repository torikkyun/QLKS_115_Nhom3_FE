import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRoom, bookRoom } from '../../apis/apiroom';
import { getServices } from '../../apis/apiservice';
import { fetchPromotions } from '../../apis/apipromotion';
import Header from '../../Components/componentUser/Header';
import { addBooking } from '../../redux/CartSlice';
import BookingModal from '../../Components/componentUser/BookingModal';
// import RoomHeader from './components/RoomHeader';
import RoomImageGallery from '../../Components/componentUser/RoomImage';
import RoomInfo from '../../Components/componentUser/RoomInfor';
import BookingDetail from '../../Components/componentUser/BookingDetail';
import { useRoomBooking } from '../../hooks/useRoomBooking';

const RoomDetail = () => {
  const { maPhong } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const {
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
    setCustomerInfo
  } = useRoomBooking({ room, services, promotions, navigate, dispatch });

  const images = [
    { src: 'https://content.r9cdn.net/himg/fc/ab/4a/expedia_group-399971-324e7d-323887.jpg' },
    { src: 'https://www.vietnambooking.com/wp-content/uploads/2021/02/khach-san-ho-chi-minh-28.jpg' },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
  ];

  useEffect(() => {
    fetchData();
  }, [maPhong]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch room data
      const roomResponse = await getRoom(maPhong);
      let roomData = roomResponse && Object.keys(roomResponse).length > 0 ? roomResponse : {
        maPhong: maPhong,
        soPhong: `Phòng ${maPhong}`,
        giaPhong: 1500000,
        soGiuong: 1,
        tenTinhTrang: "Còn phòng",
        ghiChu: "Phòng sang trọng",
      };
      roomData.moTa = roomData.moTa || "🌟 Khám phá trải nghiệm nghỉ dưỡng lý tưởng...";
      roomData.giaPhong = roomData.giaPhong || 1500000;
      setRoom(roomData);

      // Fetch hotel data
      const hotelData = roomResponse.hotel || {
        ten: "The Luxury Hotel",
        diaChi: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        danhGia: 4.8,
      };
      setHotel(hotelData);

      // Fetch services
      const servicesResponse = await getServices(1, 100);
      const servicesData = servicesResponse.data || [
        { id: 1, tenLoai: "Dịch vụ phòng", giaDichVu: 100000 },
        { id: 2, tenLoai: "Dịch vụ ăn uống", giaDichVu: 200000 },
      ];
      const processedServices = servicesData.map(service => ({
        maDichVu: service.maDichVu || service.id,
        tenDichVu: service.tenDichVu || service.tenLoai,
        gia: service.giaDichVu || 0,
      }));
      setServices(processedServices);

      // Fetch promotions
      const promotionsResponse = await fetchPromotions(1, 100);
      setPromotions(promotionsResponse || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message);
      message.error('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!room || !hotel) {
    return <div className="text-center text-gray-500">Phòng không tồn tại</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-14">
        {/* Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 pt-8 sm:pt-12 space-y-3 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Phòng {room.soPhong}
            </h1>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white font-bold rounded-l px-2 sm:px-3 py-1 text-sm sm:text-base">
                {hotel.danhGia}
              </div>
              <div className="bg-blue-100 text-blue-800 rounded-r px-2 sm:px-3 py-1 font-medium text-sm sm:text-base">
                Tuyệt vời
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <RoomImageGallery
          images={images}
          room={room}
          lightboxOpen={lightboxOpen}
          lightboxIndex={lightboxIndex}
          setLightboxOpen={setLightboxOpen}
          setLightboxIndex={setLightboxIndex}
        />

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mt-6">
          {/* Room Info Section */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <RoomInfo
              room={room}
              services={services}
              selectedServices={selectedServices}
              handleServiceToggle={handleServiceToggle}
            />
          </div>

          {/* Booking Detail Section */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-4">
              <BookingDetail
                room={room}
                services={services}
                promotions={promotions}
                dates={dates}
                numberOfNights={numberOfNights}
                selectedServices={selectedServices}
                selectedPromotion={selectedPromotion}
                handleDateChange={handleDateChange}
                handlePromotionChange={handlePromotionChange}
                calculateBookingTotal={calculateBookingTotal}
                handleAddBooking={handleAddBooking}
                onBookNow={(booking) => {
                  setSelectedBooking(booking);
                  setIsBookingModalVisible(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        visible={isBookingModalVisible}
        isMultiBooking={false}
        bookings={[selectedBooking].filter(Boolean)}
        selectedBooking={selectedBooking}
        onCancel={() => {
          setIsBookingModalVisible(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleBookRoom}
        loading={loading}
        form={form}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
      />
    </div>
  );
};

export default RoomDetail;