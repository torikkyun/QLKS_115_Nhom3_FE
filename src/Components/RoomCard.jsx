import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';

// Import ảnh cho từng loại giá (đảm bảo các file ảnh tồn tại trong thư mục assets)
import lowPriceImage from '../assets/Image/GiaThap.jpeg'; // Thay bằng đường dẫn thực tế
import mediumPriceImage from '../assets/Image/GiaTrungBinh.png'; // Thay bằng đường dẫn thực tế
import highPriceImage from '../assets/Image/GiaCao.jpg'; // Thay bằng đường dẫn thực tế

const RoomCard = ({ room, onBookRoom, index }) => {
    if (!room) return <div className="text-center text-gray-500">Không tìm thấy thông tin phòng.</div>;

    const navigate = useNavigate();

    // Kiểm tra trạng thái phòng và debug giá trị
    const isBooked = room.tenTinhTrang === "Đang sử dụng" ;
    console.log(`Room ${room.soPhong} - tenTinhTrang: ${room.tenTinhTrang}, isBooked: ${isBooked}`); // Debug

    const handleViewDetail = (maPhong) => {
        if (isBooked) {
            console.log(`Phòng ${maPhong} đã được đặt, không thể xem chi tiết.`);
            return; // Chặn hoàn toàn nếu phòng đã được đặt
        }
        console.log(`Xem chi tiết phòng ${maPhong}`);
        if (onBookRoom) {
            onBookRoom(maPhong);
        }
        navigate(`/user/detailroom/${maPhong}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjzZo5vrIhhAYMg10uFFk9aoDJ2Z3he7a5g&s';
    };

    // Hàm ánh xạ giá với ảnh
    const getPriceImage = (price) => {
        if (price <= 500000) {
            return lowPriceImage; // Giá thấp
        } else if (price >= 700000 && price < 1000000) {
            return mediumPriceImage; // Giá trung bình
        } else {
            return highPriceImage; // Giá cao
        }
    };

    // Lấy ảnh dựa trên giá, nếu không có giaPhong thì dùng ảnh mặc định
    const roomImage = room.giaPhong ? getPriceImage(room.giaPhong) : room.anh || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjzZo5vrIhhAYMg10uFFk9aoDJ2Z3he7a5g&s';

    return (
        <div
            className={`pb-15 ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={isBooked ? null : () => handleViewDetail(room.maPhong)} // Vô hiệu hóa onClick nếu đã được đặt
        >
            <div className={`relative w-full max-w-sm sm:max-w-xs md:max-w-sm group ${isBooked ? '' : 'cursor-pointer'} animate__animated animate__fadeInUp animate__delay-${(index % 4) + 1}s`}>
                <div className="bg-white border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                        <img
                            className="w-full h-40 object-cover"
                            src={roomImage}
                            alt={`Phòng ${room.soPhong}`}
                            loading="lazy"
                            onError={handleImageError}
                        />
                        {/* Thêm badge hiển thị trạng thái */}
                        <span
                            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                room.tenTinhTrang === "Trống"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {room.tenTinhTrang || "Không xác định"}
                        </span>
                    </div>
                    <div className="p-3 sm:p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 sm:text-xl">
                            Phòng {room.soPhong}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 sm:text-sm">
                            {room.ghiChu || 'Loại phòng không xác định'}
                        </p>
                        <p className="text-sm text-gray-600 mb-3 sm:text-base">
                            Số giường: {room.soGiuong}
                        </p>
                        <p className="text-sm text-gray-600 mb-3 sm:text-base">
                            Giá phòng: {room.giaPhong?.toLocaleString() || 'Liên hệ'} VND
                        </p>
                    </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 transform translate-y-0 ${isBooked ? '' : 'group-hover:translate-y-8'} transition-all duration-300 ${isBooked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'} pt-2`}>
                    <Button
                        className={`w-full font-semibold py-2 px-4 text-sm sm:text-base ${
                            isBooked
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                        }`}
                        onClick={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện click từ div cha
                            handleViewDetail(room.maPhong); // Gọi handleViewDetail (đã có kiểm tra isBooked)
                        }}
                        disabled={isBooked} // Vô hiệu hóa nút nếu đã được đặt
                    >
                        {isBooked ? 'Đã được đặt' : 'Xem chi tiết'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;