import React, { useState, useEffect } from "react";
import { Button, Spin, Pagination as AntdPagination, Modal} from "antd";
import { ToastContainer, toast } from "react-toastify";
import BookingListContainer from "../../Components/componentsEmployee/BookingListContainer";
import EmployeeBookingFilter from "../../Components/componentsEmployee/EmployeeBookingFilter";
import EmployeeCheckoutForm from "../../Components/componentsEmployee/EmployeeCheckoutForm";
import { getBooking, checkoutBooking } from "../../apis/apibooking";
import Sidebar from "../../Components/componentsAdmin/SideBar";
import Header from '../../Common/Header';

const AdminBookingList = () => {
  const [bookingData, setBookingData] = useState([]); // Dữ liệu đặt phòng hiển thị
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [pagination, setPagination] = useState({
    // Trạng thái phân trang
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({ search: "" }); // Trạng thái lọc
  const [isCheckoutFormVisible, setIsCheckoutFormVisible] = useState(false); // Trạng thái mới cho Form xác nhận Trả Phòng
  const [checkoutFormData, setCheckoutFormData] = useState(null); // Dữ liệu sẽ được truyền vào form xác nhận trả phòng ({ maPhong, maDatPhong })
  // Trạng thái cho Modal thông báo thành công
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    fetchBooking();
  }, [pagination.page, pagination.pageSize, filters.search]);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      // Gọi API getBooking với page và pageSize từ state pagination
      const response = await getBooking(pagination.page, pagination.pageSize);

      if (
        !response ||
        typeof response !== "object" ||
        !Array.isArray(response.data)
      ) {
        throw new Error("Dữ liệu API không hợp lệ.");
      }

      setBookingData(response.data);

      // Cập nhật thông tin phân trang từ phản hồi API
      setPagination({
        ...pagination,
        totalRecords: response.totalRecords || response.data.length || 0,
        totalPages:
          response.totalPages ||
          Math.ceil(
            (response.totalRecords || response.data.length) /
              pagination.pageSize
          ) ||
          1,
      });
    } catch (err) {
      console.error("Lỗi API:", err.message);
      setError(err.message);
      setBookingData([]); // Xóa dữ liệu nếu có lỗi
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Đặt lại về trang đầu tiên khi bộ lọc thay đổi
  };

  const handleInitiateCheckout = async (maDatPhongToCheckout) => {
    const bookingToCheckout = bookingData.find(
      (b) => b.maDatPhong === maDatPhongToCheckout
    );

    // Đảm bảo có thể lấy maPhong từ danhSachPhong cho form xác nhận trả phòng
    if (
      !bookingToCheckout ||
      typeof bookingToCheckout.danhSachPhong?.[0]?.maPhong === "undefined" ||
      bookingToCheckout.danhSachPhong?.[0]?.maPhong === null
    ) {
      toast.error("Không tìm thấy thông tin phòng hoặc mã phòng để trả phòng.");
      return;
    }

    // Đặt dữ liệu cho form xác nhận trả phòng và hiển thị nó
    setCheckoutFormData({
      maDatPhong: maDatPhongToCheckout,
      maPhong: bookingToCheckout.danhSachPhong[0].maPhong, // Lấy maPhong từ phần tử đầu tiên trong danhSachPhong của GET
    });
    setIsCheckoutFormVisible(true); // Hiển thị form xác nhận trả phòng mới
  };

  
  const handleConfirmCheckout = async (confirmedCheckoutData) => {
    try {
      await checkoutBooking(confirmedCheckoutData); // Gọi API checkoutBooking với dữ liệu đã xác nhận
      toast.success(`Đã trả phòng thành công cho mã đặt phòng #${confirmedCheckoutData.maDatPhong}!`);
      setIsCheckoutFormVisible(false); // Ẩn form xác nhận trả phòng
      
      // Hiển thị modal thông báo thành công
      setSuccessMessage(`Đã trả phòng thành công cho mã đặt phòng #${confirmedCheckoutData.maDatPhong}!`);
      setIsSuccessModalVisible(true);

      // setIsCheckoutFormVisible(false); // Ẩn form xác nhận trả phòng
      // fetchBooking(); // Tải lại dữ liệu để cập nhật danh sách
    } catch (err) {
      console.error("Lỗi khi trả phòng:", err);
      toast.error(`Lỗi khi trả phòng: ${err.message}`);
    }
  };

  const filteredBooking = bookingData.filter((booking) => {
    const searchText = filters.search.toLowerCase();

    if (!searchText) {
      return true; // Nếu văn bản tìm kiếm rỗng, trả về tất cả các đặt phòng
    }

    // Kiểm tra văn bản tìm kiếm trong các trường khác nhau
    const matchesMaDatPhong = (booking.maDatPhong || "")
      .toString()
      .toLowerCase()
      .includes(searchText);
    const matchesMaKhachHang = (booking.khachHang?.maKhachHang || "")
      .toString()
      .toLowerCase()
      .includes(searchText);

    const customerFullName = `${booking.khachHang?.ho || ""} ${
      booking.khachHang?.ten || ""
    }`.toLowerCase();
    const matchesCustomerName = customerFullName.includes(searchText);

    const staffFullName = `${booking.nhanVien?.ho || ""} ${
      booking.nhanVien?.ten || ""
    }`.toLowerCase();
    const matchesStaffName = staffFullName.includes(searchText);

    // Bao gồm tìm kiếm trong danhSachPhong (maPhong và soPhong)
    const matchesRoomDetails = booking.danhSachPhong?.some(
      (room) =>
        (room.maPhong || "").toString().toLowerCase().includes(searchText) ||
        (room.soPhong || "").toString().toLowerCase().includes(searchText)
    );

    // Trả về true nếu bất kỳ trường nào khớp với văn bản tìm kiếm
    return (
      matchesMaDatPhong ||
      matchesMaKhachHang ||
      matchesCustomerName ||
      matchesStaffName ||
      matchesRoomDetails
    );
  });

  return (
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex flex-col flex-1">
        <Header/>
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Danh Sách Đặt Phòng</h1>

          <EmployeeBookingFilter onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="flex justify-center my-10">
              <Spin size="large" />
            </div>
          ) : error ? (
            <p className="text-red-500">Lỗi: {error}</p>
          ) : (
            <BookingListContainer
              bookings={filteredBooking}
              onCheckout={handleInitiateCheckout} // Gọi hàm xử lý bắt đầu trả phòng (hiện form xác nhận)
            />
          )}

          <AntdPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.totalRecords}
            onChange={(page, pageSize) =>
              setPagination({ ...pagination, page, pageSize })
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "70"]}
            className="mt-4 flex justify-end"
          />

          {/* Form Modal xác nhận Trả Phòng */}
          <EmployeeCheckoutForm
            visible={isCheckoutFormVisible}
            onCancel={() => setIsCheckoutFormVisible(false)}
            onConfirmCheckout={handleConfirmCheckout}
            checkoutData={checkoutFormData}
          />

          {/* Modal thông báo thành công mới */}
          <Modal
            title="Thành công!"
            visible={isSuccessModalVisible}
            onOk={() => setIsSuccessModalVisible(false)}
            onCancel={() => setIsSuccessModalVisible(false)}
            footer={[
              <Button key="ok" type="primary" onClick={() => setIsSuccessModalVisible(false)}>
                Đóng
              </Button>
            ]}
            className="rounded-lg text-center"
          >
            <p className="text-lg font-semibold text-green-600">{successMessage}</p>
            <p className="text-gray-500 mt-2">Thông tin trả phòng đã được ghi lại.</p>
          </Modal>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AdminBookingList;
