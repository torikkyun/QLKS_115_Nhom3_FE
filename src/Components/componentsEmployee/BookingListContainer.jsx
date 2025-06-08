import React, { useState, useEffect } from "react";
import EmployeeBookingCard from "./EmployeeBookingCard";
import { getBooking, updateBooking } from "../../apis/apibooking"; 


const BookingListContainer = () => {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    fetchBookings();
  }, []);

  // Hàm để tải dữ liệu đặt phòng
  async function fetchBookings() {
    setLoading(true);
    setError(null);
    setMessage(''); // Xóa thông báo cũ
    try {
      const response = await getBooking(1, 10);
      if (!response || typeof response !== "object" || !Array.isArray(response.data)) {
        throw new Error("API không trả về dữ liệu hợp lệ hoặc không có thuộc tính 'data' là mảng.");
      }
      setBookingList(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đặt phòng:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Hàm xử lý việc trả phòng khi nút được nhấn
  const handleCheckout = async (maDatPhongOrMaKhachHang) => {
    const confirmCheckout = window.confirm(
      `Bạn có chắc chắn muốn trả phòng cho mã đặt phòng/khách hàng #${maDatPhongOrMaKhachHang} không?`
    );

    if (!confirmCheckout) {
      return; // Người dùng hủy bỏ
    }

    try {
      const bookingToCheckout = bookingList.find(b => b.maDatPhong === maDatPhongOrMaKhachHang);

      if (!bookingToCheckout || !bookingToCheckout.khachHang?.maKhachHang) {
        throw new Error("Không tìm thấy thông tin khách hàng cho đặt phòng này.");
      }

      const maKhachHang = bookingToCheckout.khachHang.maKhachHang;
      const updateData = {
        maPhong: 0, 
        maKhachHang: maKhachHang
      };

      await updateBooking(maKhachHang, updateData);
      setMessage(`Đã trả phòng thành công cho mã đặt phòng #${maDatPhongOrMaKhachHang}!`);
      // Sau khi trả phòng thành công, tải lại danh sách để cập nhật trạng thái
      fetchBookings();
    } catch (err) {
      console.error("Lỗi khi trả phòng:", err);
      setError(`Lỗi khi trả phòng: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-blue-600 font-semibold">Đang tải dữ liệu đặt phòng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <p className="text-xl text-red-700 font-semibold">Lỗi: {error}</p>
      </div>
    );
  }

  if (bookingList.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-100">
        <p className="text-xl text-yellow-700 font-semibold">Không có dữ liệu đặt phòng nào.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Thành công!</strong>
          <span className="block sm:inline"> {message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage('')}>
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {bookingList.map((bookingItem) => (
          <EmployeeBookingCard
            key={bookingItem.maDatPhong}
            booking={bookingItem}
            onCheckout={handleCheckout} // Truyền hàm xử lý xuống card
          />
        ))}
      </div>
    </div>
  );
};

export default BookingListContainer;
