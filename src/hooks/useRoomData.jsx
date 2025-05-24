
import  { useState, useEffect } from 'react';


import { getRoom, bookRoom } from '../../apis/apiroom';
import { getServices } from '../../apis/apiservice';


// Custom hook để fetch dữ liệu
const useRoomData = (maPhong) => {
  const [room, setRoom] = useState(null);
  const [services, setServices] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [maPhong]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const roomResponse = await getRoom(maPhong);
      console.log('API Response (getRoom):', roomResponse);
      let roomData = roomResponse && Object.keys(roomResponse).length > 0 ? roomResponse : {
        maPhong: maPhong,
        soPhong: `Phòng ${maPhong}`,
        giaPhong: 1500000,
        soGiuong: 1,
        tenTinhTrang: 'Còn phòng',
        ghiChu: 'Phòng sang trọng',
      };
      roomData.moTa = roomData.moTa || '🌟 Khám phá trải nghiệm nghỉ dưỡng lý tưởng tại Khách sạn của chúng tôi...\n[Tóm tắt nội dung mô tả như trên]';
      roomData.giaPhong = roomData.giaPhong || 1500000;
      console.log('Processed room data:', roomData);
      setRoom(roomData);

      const servicesResponse = await getServices(1, 100);
      console.log('API Response (getServices):', servicesResponse);
      const servicesData = servicesResponse.data || [
        { id: 1, tenLoai: 'Dịch vụ phòng', giaDichVu: 100000 },
        { id: 2, tenLoai: 'Dịch vụ ăn uống', giaDichVu: 200000 },
        { id: 3, tenLoai: 'Dịch vụ giải trí', giaDichVu: 300000 },
        { id: 4, tenLoai: 'Dịch vụ spa', giaDichVu: 400000 },
        { id: 5, tenLoai: 'Dịch vụ giặt ủi', giaDichVu: 150000 },
        { id: 6, tenLoai: 'Dịch vụ khác', giaDichVu: 50000 },
      ];
      const processedServices = servicesData.map(service => ({
        maDichVu: service.maDichVu,
        tenDichVu: service.tenLoai,
        gia: service.giaDichVu || 0,
      }));
      console.log('Processed services:', processedServices);
      setServices(processedServices);

      const hotelData = roomResponse.hotel || {
        ten: 'The Luxury Hotel',
        diaChi: '123 Nguyễn Huệ, Quận 1, TP.HCM',
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

  return { room, services, hotel, loading };
};