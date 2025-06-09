import React from "react";

const EmployeeBookingCard = ({ booking, onCheckout, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có dữ liệu";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Function to handle the checkout button click
  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout(booking.maDatPhong);
    } else {
      console.warn("Hàm onCheckout chưa được cung cấp cho card này.");
    }
  };

  // Function to handle the edit button click
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(booking);
    } else {
      console.warn("Hàm onEdit chưa được cung cấp cho card này.");
    }
  };

  // Display a message if no booking data is provided
  if (!booking) {
    return <p className="text-gray-500 p-4">Không có dữ liệu đặt phòng để hiển thị.</p>;
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-transform hover:scale-105 duration-300 ease-in-out">
      {/* Action Buttons Container */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          aria-label="Sửa đặt phòng"
        >
          Sửa
        </button>
        {/* Checkout button */}
        <button
          onClick={handleCheckoutClick}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          aria-label="Trả phòng"
        >
          Trả Phòng
        </button>
      </div>

      {/* Booking header section */}
      <div className="border-b pb-4 mb-4 pt-12"> {/* Add padding-top to account for buttons */}
        <h3 className="text-2xl font-bold text-blue-700">
          Thông tin đặt phòng #{booking.maDatPhong}
        </h3>
        <span className="text-sm text-gray-500">
          Ngày đặt: {formatDate(booking.ngayDatPhong)}
        </span>
      </div>

      {/* Booking details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-600 mb-2">Chi tiết đặt phòng</h4>
          <div className="flex justify-between items-center py-1">
            <span className="font-medium text-gray-700">Số phòng đặt:</span>
            <span className="text-blue-800 font-semibold">{booking.soPhongDat}</span>
          </div>
          {booking.ghiChu && (
            <div className="flex justify-between items-center py-1">
              <span className="font-medium text-gray-700">Ghi chú:</span>
              <span className="text-gray-600 italic">{booking.ghiChu}</span>
            </div>
          )}
        </div>

        {/* Customer and Staff information sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer info */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-green-700 mb-2">Thông tin khách hàng</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Mã KH:</span> <span className="text-green-800">{booking.khachHang?.maKhachHang || "N/A"}</span></p>
              <p><span className="font-medium">Họ tên:</span> <span className="text-green-800">{booking.khachHang?.ho} {booking.khachHang?.ten}</span></p>
              <p><span className="font-medium">Email:</span> <span className="text-green-800">{booking.khachHang?.email || "N/A"}</span></p>
              <p><span className="font-medium">SĐT:</span> <span className="text-green-800">{booking.khachHang?.sdt || "N/A"}</span></p>
              <p><span className="font-medium">CCCD:</span> <span className="text-green-800">{booking.khachHang?.cccd || "N/A"}</span></p>
            </div>
          </div>

          {/* Staff info */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-700 mb-2">Nhân viên phụ trách</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Mã NV:</span> <span className="text-purple-800">{booking.nhanVien?.maNhanVien || "N/A"}</span></p>
              <p><span className="font-medium">Họ tên:</span> <span className="text-purple-800">{booking.nhanVien?.ho} {booking.nhanVien?.ten}</span></p>
              <p><span className="font-medium">Email:</span> <span className="text-purple-800">{booking.nhanVien?.email || "N/A"}</span></p>
              <p><span className="font-medium">SĐT:</span> <span className="text-purple-800">{booking.nhanVien?.sdt || "N/A"}</span></p>
              <p><span className="font-medium">Vai trò:</span> <span className="text-purple-800">{booking.nhanVien?.vaiTro === 1 ? "Quản lý" : "Nhân viên"}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingCard;
