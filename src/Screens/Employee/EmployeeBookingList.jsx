import React, { useState, useEffect } from "react";
import { Button, Spin, Pagination as AntdPagination } from "antd";
import { ToastContainer, toast } from "react-toastify";
import BookingListContainer from "../../Components/componentsEmployee/BookingListContainer";
import EmployeeBookingFilter from "../../Components/componentsEmployee/EmployeeBookingFilter";
import EmployeeBookingForm from "../../Components/componentsEmployee/EmployeeBookingForm";
import { getBooking, addBooking, updateBooking } from "../../apis/apibooking";
import EmployeeSideBar from "../../Components/componentsEmployee/EmployeeSideBar";
import EmployeeHeader from "../../Components/componentsEmployee/EmployeeHeader";

const EmployeeBookingList = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({ search: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Effect to fetch booking data whenever page or pageSize changes
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

      const response = await getBooking(pagination.page, pagination.pageSize);
      
      if (
        !response ||
        typeof response !== "object" ||
        !Array.isArray(response.data)
      ) {
        throw new Error("Dữ liệu API không hợp lệ.");
      }

      setBookingData(response.data);
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
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };


  const handleAddBooking = () => {
    setEditingBooking(null); // Clear any previous editing data
    setIsFormVisible(true); // Show the form modal
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking); // Set the booking data to be edited
    setIsFormVisible(true); // Show the form modal
  };


  const handleSaveBooking = async (bookingArray) => { // --- Sửa lỗi 4: Nhận bookingArray ---
    try {
      const bookingToSave = bookingArray[0]; // Get the single booking object from the array

      if (editingBooking) {
        if (!bookingToSave.maKhachHang) {
            throw new Error("Mã khách hàng không tồn tại để cập nhật.");
        }
        // Call updateBooking API with maKhachHang for URL and bookingToSave as body
        await updateBooking(bookingToSave.maKhachHang, bookingToSave); 
        toast.success("Cập nhật thành công!");
      } else {
        await addBooking(bookingArray); 
        toast.success("Thêm đặt phòng thành công!");
      }
      fetchBooking(); // Re-fetch bookings to update the list
      setIsFormVisible(false); // Hide the form modal
    } catch (error) {
      console.error("Lỗi khi lưu đặt phòng:", error.message);
      toast.error("Lỗi khi lưu đặt phòng: " + error.message);
    }
  };


  const handleCheckoutBooking = async (maDatPhongToCheckout) => { 
    // Confirmation dialog (consider replacing with a custom modal in production)
    const confirmCheckout = window.confirm(
      `Bạn có chắc chắn muốn trả phòng cho mã đặt phòng #${maDatPhongToCheckout} không?`
    );

    if (!confirmCheckout) {
      return; 
    }

    try {
      const bookingToCheckout = bookingData.find(b => b.maDatPhong === maDatPhongToCheckout);

      if (!bookingToCheckout || !bookingToCheckout.khachHang?.maKhachHang) {
        throw new Error("Không tìm thấy thông tin khách hàng cho đặt phòng này.");
      }

      const maKhachHang = bookingToCheckout.khachHang.maKhachHang;
      const updateData = {
        maPhong: 0, 
        maKhachHang: maKhachHang
      };

      await updateBooking(maKhachHang, updateData);
      toast.success(`Đã trả phòng thành công cho mã đặt phòng #${maDatPhongToCheckout}!`);
      fetchBooking(); // Re-fetch data to update the list
    } catch (err) {
      console.error("Lỗi khi trả phòng:", err);
      toast.error(`Lỗi khi trả phòng: ${err.message}`);
    }
  };


  const filteredBooking = bookingData.filter((booking) => {
    const searchText = filters.search.toLowerCase();

    // If search text is empty, return all bookings
    if (!searchText) {
        return true;
    }

    // Check if the search text is included in maDatPhong
    const matchesMaDatPhong = (booking.maDatPhong || "").toString().toLowerCase().includes(searchText);

    // Check if the search text is included in maKhachHang
    const matchesMaKhachHang = (booking.khachHang?.maKhachHang || "").toString().toLowerCase().includes(searchText);

    // Check if the search text is included in customer's full name
    const customerFullName = `${booking.khachHang?.ho || ""} ${booking.khachHang?.ten || ""}`.toLowerCase();
    const matchesCustomerName = customerFullName.includes(searchText);

    // Check if the search text is included in staff's full name, email, or phone
    const staffFullName = `${booking.nhanVien?.ho || ""} ${booking.nhanVien?.ten || ""}`.toLowerCase();
    const matchesStaffName = staffFullName.includes(searchText);

    // Return true if any of the fields match the search text
    return (
      matchesMaDatPhong ||
      matchesMaKhachHang ||
      matchesCustomerName ||
      matchesStaffName
    );
  });

  return (
    <div className="flex h-screen">
      <EmployeeSideBar />
      <div className="flex flex-col flex-1">
        <EmployeeHeader />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Danh Sách Đặt Phòng</h1>

          {/* Add Booking Button */}
          <Button
            type="primary"
            onClick={handleAddBooking}
            className="mb-4 bg-blue-500 hover:bg-blue-600 border-none"
          >
            Đặt Phòng
          </Button>

          {/* Booking Filter Component */}
          <EmployeeBookingFilter onFilterChange={handleFilterChange} />

          {/* Conditional rendering for loading, error, or data */}
          {loading ? (
            <div className="flex justify-center my-10">
              <Spin size="large" />
            </div>
          ) : error ? (
            <p className="text-red-500">Lỗi: {error}</p>
          ) : (
            <BookingListContainer
              bookings={filteredBooking}
              onCheckout={handleCheckoutBooking}
              onEdit={handleEditBooking}
            />
          )}

          {/* Pagination Component */}
          <AntdPagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.totalRecords}
            onChange={(page, pageSize) =>
              setPagination({ ...pagination, page, pageSize })
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50", '70']}
            className="mt-4 flex justify-end"
          />

          {/* Booking Form Modal */}
          <EmployeeBookingForm
            visible={isFormVisible}
            onCancel={() => setIsFormVisible(false)}
            onSave={handleSaveBooking}
            record={editingBooking} // --- Sửa lỗi 2: Đổi prop từ customer sang record ---
          />

          {/* Toast notifications container */}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingList;




/*
import React, { useState, useEffect } from "react";
import { Button, Spin, Pagination as AntdPagination } from "antd";
import { ToastContainer, toast } from "react-toastify";
import BookingListContainer from "../../Components/componentsEmployee/BookingListContainer";
import EmployeeBookingFilter from "../../Components/componentsEmployee/EmployeeBookingFilter";
import EmployeeBookingForm from "../../Components/componentsEmployee/EmployeeBookingForm";
import { getBooking, addBooking, updateBooking } from "../../apis/apibooking";
import EmployeeSideBar from "../../Components/componentsEmployee/EmployeeSideBar";
import EmployeeHeader from "../../Components/componentsEmployee/EmployeeHeader";

const EmployeeBookingList = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({ search: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [pagination.page, pagination.pageSize]);

  const fetchBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBooking(1, 10);
      if (
        !response ||
        typeof response !== "object" ||
        !Array.isArray(response.data)
      ) {
        throw new Error(
          "API không trả về dữ liệu hợp lệ hoặc không có thuộc tính 'data' là mảng."
        );
      }

      setBookingData(response.data);
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
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleAddBooking = () => {
    setEditingBooking(null);
    setIsFormVisible(true);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsFormVisible(true);
  };

  const handleSaveBooking = async (values) => {
    try {
      if (editingBooking) {
        await updateBooking({ ...editingBooking, ...values });
        toast.success("Cập nhật thành công");
      } else {
        await addBooking(values);
        toast.success("Thêm thành công");
      }
      fetchBooking();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Lỗi khi lưu danh sách:", error.message);
      toast.error("Lỗi khi lưu danh sách: " + error.message);
    }
  };

  const filteredBooking = bookingData.filter((boo) => {
    const searchText = filters.search.toLowerCase();
    return (boo.maDatPhong || "").toString().toLowerCase().includes(searchText);
  });

  return (
    <div className="flex h-screen">
      <EmployeeSideBar />
      <div className="flex flex-col flex-1">
        <EmployeeHeader />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Danh Sách Đặt Phòng</h1>

          <Button
            type="primary"
            onClick={handleAddBooking}
            className="mb-4 bg-blue-500 hover:bg-blue-600 border-none"
          >
            Đặt Phòng
          </Button>

          <EmployeeBookingFilter onFilterChange={handleFilterChange} />

          {loading ? (
            <div className="flex justify-center my-10">
              <Spin size="large" />
            </div>
          ) : error ? (
            <p className="text-red-500">Lỗi: {error}</p>
          ) : (
            <BookingListContainer
              booking={filteredBooking}
              onEdit={handleEditBooking}
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
            pageSizeOptions={["10", "20", "50", '70']}
            className="mt-4 flex justify-end"
          />

          <EmployeeBookingForm
            visible={isFormVisible}
            onCancel={() => setIsFormVisible(false)}
            onSave={handleSaveBooking}
            customer={editingBooking}
          />

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingList;
*/