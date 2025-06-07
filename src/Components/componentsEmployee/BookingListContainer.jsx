import React, { useState, useEffect } from "react";
import EmployeeBookingCard from "./EmployeeBookingCard"; 
import { getBooking } from "../../apis/apibooking"; 

/**
 * Component container để tải và hiển thị danh sách các đặt phòng.
 * Component này quản lý trạng thái tải, lỗi và dữ liệu danh sách.
 */
const BookingListContainer = () => {
  const [bookingList, setBookingList] = useState([]); // Sử dụng mảng để lưu danh sách
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await getBooking(1, 10); // Gọi API lấy dữ liệu (trang 1, 10 bản ghi)

        // Đảm bảo phản hồi có thuộc tính 'data' và nó là một mảng
        if (!response || typeof response !== "object" || !Array.isArray(response.data)) {
          throw new Error("API không trả về dữ liệu hợp lệ hoặc không có thuộc tính 'data' là mảng.");
        }

        setBookingList(response.data); // Gán toàn bộ mảng dữ liệu vào state
      } catch (err) {
        console.error("Lỗi khi tải danh sách đặt phòng:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []); // [] đảm bảo useEffect chỉ chạy một lần sau khi component mount

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
      {/* Thay đổi chính ở đây: grid-cols-1 trên mobile, md:grid-cols-2 trên tablet/desktop, lg:grid-cols-1 trên màn hình lớn */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {bookingList.map((bookingItem) => (
          // Sử dụng maDatPhong làm key duy nhất để React tối ưu hóa render
          <EmployeeBookingCard key={bookingItem.maDatPhong} booking={bookingItem} />
        ))}
      </div>
    </div>
  );
};

export default BookingListContainer;