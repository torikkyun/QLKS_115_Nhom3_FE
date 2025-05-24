import React, { useState, useEffect } from 'react';
import { Button, Spin, Form, Checkbox, Divider, DatePicker, message, Badge } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRoom, bookRoom } from '../../apis/apiroom';
import { getServices } from '../../apis/apiservice';
import Header from '../../Components/componentUser/Header';
import { InfoCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import dayjs from 'dayjs';
import { addBooking } from '../../redux/CartSlice';
import BookingModal from '../../Components/componentUser/BookingModal';

const { RangePicker } = DatePicker;

const RoomDetail = () => {
  const { maPhong } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.cart.bookings);
  const [loading, setLoading] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [dates, setDates] = useState([null, null]);
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    ho: '', ten: '', email: '', sdt: '', cccd: '',
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();

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

      const hotelData = roomResponse.hotel || {
        ten: "The Luxury Hotel",
        diaChi: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        danhGia: 4.8,
      };
      setHotel(hotelData);

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
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message);
      message.error('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDates(dates);
      const nights = dates[1].diff(dates[0], 'day');
      setNumberOfNights(nights > 0 ? nights : 1);
    } else {
      setDates([null, null]);
      setNumberOfNights(1);
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
    };
    dispatch(addBooking(newBooking));
    message.success('Đã thêm đặt phòng vào giỏ hàng');
    navigate('/user/CartPage');
    setDates([null, null]);
    setNumberOfNights(1);
    setSelectedServices([]);
  };

  const handleBookRoom = async (values) => {
    setLoading(true);
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
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error.message);
      message.error('Lỗi khi đặt phòng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateBookingTotal = () => {
    const serviceTotal = services
      .filter(service => selectedServices.includes(service.maDichVu))
      .reduce((total, item) => total + (item?.gia || 0), 0);
    return serviceTotal + (room?.giaPhong || 0) * numberOfNights;
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
      <div className="max-w-6xl mx-auto px-4 pt-14">
        <div className="flex justify-between items-start mb-4 pt-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Phòng {room.soPhong}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white font-bold rounded-l px-3 py-1">
                {hotel.danhGia}
              </div>
              <div className="bg-blue-100 text-blue-800 rounded-r px-3 py-1 font-medium">
                Tuyệt vời
              </div>
              
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-8">
            <img
              src={images[0].src}
              alt={room.soPhong}
              className="w-full h-96 object-cover rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                setLightboxIndex(0);
                setLightboxOpen(true);
              }}
            />
          </div>
          <div className="col-span-4 flex flex-col space-y-4">
            <img
              src={images[1].src}
              alt="Phòng view 1"
              className="w-full h-44 object-cover rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                setLightboxIndex(1);
                setLightboxOpen(true);
              }}
            />
            <img
              src={images[2].src}
              alt="Phòng view 2"
              className="w-full h-44 object-cover rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                setLightboxIndex(2);
                setLightboxOpen(true);
              }}
            />
          </div>
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={images}
            index={lightboxIndex}
          />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 font-semibold">PREVIEW</h2>
              <div className="text-gray-700 space-y-3">
                {room.moTa.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                TỔNG QUAN
                <div className="ml-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  {room.tenTinhTrang}
                </div>
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-500">Loại phòng</p>
                  <p className="font-medium">{room.ghiChu}</p>
                </div>
                <div>
                  <p className="text-gray-500">Số giường</p>
                  <p className="font-medium">{room.soGiuong}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sức chứa</p>
                  <p className="font-medium">2 người lớn</p>
                </div>
                <div>
                  <p className="text-gray-500">Kích thước</p>
                  <p className="font-medium">35 m²</p>
                </div>
              </div>
              <Divider />
              <h3 className="font-semibold mb-2 text-xl">DỊCH VỤ</h3>
              <div className="grid grid-cols-2 gap-5">
                {services.map((service, index) => (
                  <div
                    key={service.maDichVu}
                    className={`flex justify-between p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:scale-105 animate__animated animate__fadeInUp animate__delay-${(index % 4) + 1}s`}
                  >
                    <Checkbox
                      checked={selectedServices.includes(service.maDichVu)}
                      onChange={(e) => handleServiceToggle(service, e.target.checked)}
                      className="mr-2"
                    />
                    <span>{service.tenDichVu || 'Tên không xác định'}</span>
                    <span className="ml-auto text-gray-500 text-sm">
                      {(service.gia || 0).toLocaleString()} VND
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Thông tin đặt phòng</h2>
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
              <div className="flex justify-between items-center mb-3 pb-3 border-b">
                <span className="text-gray-600">Giá phòng / đêm</span>
                <span className="font-semibold">{(room.giaPhong || 0).toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between items-center mb-3 pb-3 border-b">
                <span className="text-gray-600">Số đêm</span>
                <span className="font-semibold">{numberOfNights}</span>
              </div>
              {selectedServices.length > 0 &&
                services
                  .filter(service => selectedServices.includes(service.maDichVu))
                  .map(item => (
                    <div key={item.maDichVu} className="flex justify-between items-center mb-3 pb-3 border-b">
                      <span className="text-gray-600">{item.tenDichVu || 'Tên không xác định'}</span>
                      <span className="font-semibold">{(item.gia || 0).toLocaleString()} VND</span>
                    </div>
                  ))}
              <div className="flex justify-between items-center mb-6 pt-2 text-lg">
                <span className="font-medium">Tổng cộng</span>
                <span className="font-bold text-blue-600">{calculateBookingTotal().toLocaleString()} VND</span>
              </div>
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
                onClick={() => {
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
                  };
                  setSelectedBooking(newBooking);
                  setIsBookingModalVisible(true);
                }}
                disabled={!dates[0] || !dates[1]}
              >
                Đặt phòng ngay
              </Button>
              <div className="mt-4 text-center text-sm text-gray-500">
                <InfoCircleOutlined className="mr-1" /> Không mất phí khi đặt phòng
              </div>
            </div>
          </div>
        </div>
      </div>
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