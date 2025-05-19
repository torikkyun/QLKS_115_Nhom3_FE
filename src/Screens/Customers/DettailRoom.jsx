import React, { useState, useEffect } from 'react';
import { Button, Spin, Modal, Form, Input, Select, message, Checkbox, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { getRoom, bookRoom } from '../../apis/apiroom';
import { getServices } from '../../apis/apiservice';
import Header from '../../Components/componentUser/Header';
import { InfoCircleOutlined } from '@ant-design/icons';


const RoomDetail = () => {
  const { maPhong } = useParams();
  const [loading, setLoading] = useState(false);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [hotel, setHotel] = useState(null);

  // State cho thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    ho: '',
    ten: '',
    email: '',
    sdt: '',
    cccd: '',
  });

  useEffect(() => {
    fetchData();
  }, [maPhong]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch room data
      const roomResponse = await getRoom(maPhong);
      console.log('API Response (getRoom):', roomResponse);
      let roomData = roomResponse && Object.keys(roomResponse).length > 0 ? roomResponse : {
        maPhong: maPhong,
        soPhong: `Phòng ${maPhong}`,
        giaPhong: 1500000,
        soGiuong: 1,
        tenTinhTrang: "Còn phòng",
        ghiChu: "Phòng sang trọng",
      };
      roomData.moTa = roomData.moTa || "🌟 Khám phá trải nghiệm nghỉ dưỡng lý tưởng tại Khách sạn của chúng tôi.\nTọa lạc ngay trung tâm thành phố, khách sạn của chúng tôi là điểm đến hoàn hảo cho những ai đang tìm kiếm sự thoải mái, tiện nghi và phong cách. Với thiết kế hiện đại pha lẫn nét sang trọng, từng chi tiết trong khách sạn đều được chăm chút tỉ mỉ để mang lại cho bạn cảm giác như đang ở chính ngôi nhà của mình.\nKhách sạn sở hữu nhiều loại phòng từ tiêu chuẩn đến cao cấp, đáp ứng mọi nhu cầu lưu trú – dù bạn đi công tác hay nghỉ dưỡng. Mỗi phòng đều được trang bị giường ngủ êm ái, TV thông minh, điều hòa không khí, minibar, và phòng tắm riêng với đầy đủ tiện nghi.\nBạn có thể bắt đầu ngày mới bằng bữa sáng buffet tại nhà hàng trong khách sạn với thực đơn đa dạng gồm món Á, Âu và đặc sản địa phương. Ngoài ra, chúng tôi còn cung cấp dịch vụ spa thư giãn, hồ bơi ngoài trời, phòng gym, và khu vực café với không gian mở cực kỳ thoáng đãng.\nKhách sạn còn hỗ trợ dịch vụ giặt ủi, lễ tân 24/7, đặt xe, và tổ chức tour du lịch địa phương. \nVới vị trí thuận lợi, bạn chỉ mất vài phút để di chuyển đến các điểm tham quan nổi bật, khu mua sắm và bãi biển. \nHãy đến và tận hưởng kỳ nghỉ đáng nhớ cùng đội ngũ nhân viên thân thiện, chuyên nghiệp của chúng tôi.\nKhách sạn của chúng tôi luôn sẵn sàng chào đón bạn!";
      roomData.giaPhong = roomData.giaPhong || 1500000;
      console.log('Processed room data:', roomData);
      setRoom(roomData);

      // Fetch services data
      const servicesResponse = await getServices(1, 100);
      console.log('API Response (getServices):', servicesResponse);
      const servicesData = servicesResponse.data || [
        { id: 1, tenLoai: "Dịch vụ phòng", giaDichVu: 100000 },
        { id: 2, tenLoai: "Dịch vụ ăn uống", giaDichVu: 200000 },
        { id: 3, tenLoai: "Dịch vụ giải trí", giaDichVu: 300000 },
        { id: 4, tenLoai: "Dịch vụ spa", giaDichVu: 400000 },
        { id: 5, tenLoai: "Dịch vụ giặt ủi", giaDichVu: 150000 },
        { id: 6, tenLoai: "Dịch vụ khác", giaDichVu: 50000 },
      ];
      const processedServices = servicesData.map(service => ({
        maDichVu: service.maDichVu,
        tenDichVu: service.tenDichVu,
        gia: service.giaDichVu || 0,
      }));
      console.log('Processed services:', processedServices);
      setServices(processedServices);

      // Fetch or mock hotel data
      const hotelData = roomResponse.hotel || {
        ten: "The Luxury Hotel",
        diaChi: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        danhGia: 4.8,
      };
      setHotel(hotelData);

    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message);
      message.error('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (value) => {
    const selectedService = services.find(service => service.maDichVu === value);
    if (selectedService && !selectedServices.includes(selectedService.maDichVu)) {
      setSelectedServices([...selectedServices, selectedService.maDichVu]);
      setCart([...cart, selectedService]);
    }
  };

  const handleRemoveService = (maDichVu) => {
    setSelectedServices(selectedServices.filter(id => id !== maDichVu));
    setCart(cart.filter(item => item.maDichVu !== maDichVu));
  };

  const handleServiceToggle = (service, checked) => {
    console.log('Toggling service:', service.maDichVu, 'checked:', checked);
    if (checked) {
      if (!selectedServices.includes(service.maDichVu)) {
        setSelectedServices(prev => [...prev, service.maDichVu]);
        setCart(prevCart => [...prevCart, service]);
      }
    } else {
      setSelectedServices(prev => prev.filter(id => id !== service.maDichVu));
      setCart(prevCart => prevCart.filter(item => item.maDichVu !== service.maDichVu));
    }
  };

  const handleBookRoom = async (values) => {
    try {
      const bookingData = {
        maPhong: room.maPhong,
        tenKhachHang: `${values.ho} ${values.ten}`, // Kết hợp họ và tên
        email: values.email,
        sdt: values.sdt,
        cccd: values.cccd, // Thêm CCCD vào booking data
        ghiChu: values.ghiChu,
        dichVu: cart.map(item => item.maDichVu),
        ngayDat: new Date().toISOString(),
      };
      await bookRoom(bookingData);
      message.success('Đặt phòng thành công');
      setIsBookingModalVisible(false);
      // Reset form sau khi đặt phòng thành công
      form.resetFields();
      setCustomerInfo({ ho: '', ten: '', email: '', sdt: '', cccd: '' });
    } catch (error) {
      console.error('Lỗi khi đặt phòng:', error.message);
      message.error('Lỗi khi đặt phòng: ' + error.message);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item?.gia || 0), 0) + (room?.giaPhong || 0);
  };

  const [form] = Form.useForm(); // Khởi tạo form instance

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
      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Room header */}
        <div className="flex justify-between items-start mb-4 pt-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Phòng {room.soPhong}</h1>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-600 text-white font-bold rounded-l px-3 py-1">
              {hotel.danhGia}
            </div>
            <div className="bg-blue-100 text-blue-800 rounded-r px-3 py-1 font-medium">
              Tuyệt vời
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-8">
            <img
              src="https://content.r9cdn.net/himg/fc/ab/4a/expedia_group-399971-324e7d-323887.jpg"
              alt={room.soPhong}
              className="w-full h-96 object-cover rounded-lg shadow-sm"
            />
          </div>
          <div className="col-span-4 flex flex-col space-y-4">
            <img
              src="https://www.vietnambooking.com/wp-content/uploads/2021/02/khach-san-ho-chi-minh-28.jpg"
              alt="Phòng view 1"
              className="w-full h-44 object-cover rounded-lg shadow-sm"
            />
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
              alt="Phòng view 2"
              className="w-full h-44 object-cover rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left side - Room details */}
          <div className="col-span-8">
            {/* Description section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 font-semibold">PREVIEW</h2>
              <div className="text-gray-700 space-y-3">
                {room.moTa ? (
                  room.moTa.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))
                ) : (
                  <p>Không có mô tả.</p>
                )}
              </div>
            </div>
            {/* Overview section */}
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

          {/* Right side - Booking panel */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Thông tin đặt phòng</h2>
              <div className="flex justify-between items-center mb-3 pb-3 border-b">
                <span className="text-gray-600">Giá phòng / đêm</span>
                <span className="font-semibold">{(room.giaPhong || 0).toLocaleString()} VND</span>
              </div>
              {cart.length > 0 && cart.map(item => (
                <div key={item.maDichVu} className="flex justify-between items-center mb-3 pb-3 border-b">
                  <span className="text-gray-600">{item.tenDichVu || 'Tên không xác định'}</span>
                  <span className="font-semibold">{(item.gia || 0).toLocaleString()} VND</span>
                </div>
              ))}
              <div className="flex justify-between items-center mb-6 pt-2 text-lg">
                <span className="font-medium">Tổng cộng</span>
                <span className="font-bold text-blue-600">{calculateTotal().toLocaleString()} VND</span>
              </div>
              <Button
                type="primary"
                color='green'
                variant='solid'
                block
                size="large"
                className="mb-5 bg-green-600 hover:bg-green-800  w-full rounded-lg  "
                onClick={() => setCart([])}
              >
                Add Booking
              </Button>
              <Button
                type="primary"
                block
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsBookingModalVisible(true)}
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

      {/* Booking Modal */}
      <Modal
        title="Xác nhận thông tin đặt phòng"
        open={isBookingModalVisible}
        onCancel={() => setIsBookingModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          layout="vertical"
          onFinish={handleBookRoom}
          form={form}
          initialValues={customerInfo} // Điền thông tin mặc định từ JSON
        >
          <div className="mb-4 pb-4 border-b">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Phòng:</span>
              <span className="font-medium">{room.soPhong}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền:</span>
              <span className="font-bold text-blue-600">{calculateTotal().toLocaleString()} VND</span>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <Form.Item
              name="ho"
              label="Họ"
              rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
              className='w-2/3'
            >
              <Input value={customerInfo.ho} onChange={(e) => setCustomerInfo({ ...customerInfo, ho: e.target.value })} />
            </Form.Item>
            <Form.Item
              name="ten"
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
              className='w-2/3'
            >
              <Input value={customerInfo.ten} onChange={(e) => setCustomerInfo({ ...customerInfo, ten: e.target.value })} />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
          </Form.Item>
          <Form.Item
            name="sdt"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                pattern: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải là 10-11 chữ số',
              }
            ]}
          >
            <Input value={customerInfo.sdt} onChange={(e) => setCustomerInfo({ ...customerInfo, sdt: e.target.value })} />
          </Form.Item>
          <Form.Item
            name="cccd"
            label="Số CMND/CCCD"
            rules={[
              { required: true, message: 'Vui lòng nhập số CMND/CCCD' },
              {
                pattern: /^[0-9]{9}$|^[0-9]{12}$/,
                message: 'Số CMND/CCCD phải là 9 hoặc 12 chữ số',
              }
            ]}
          >
            <Input value={customerInfo.cccd} onChange={(e) => setCustomerInfo({ ...customerInfo, cccd: e.target.value })} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xác nhận đặt phòng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomDetail;